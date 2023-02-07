import { Diagnostic, DiagnosticSeverity, Range } from "vscode-languageserver";
import * as Parser from "web-tree-sitter";
import { nodeAsRange } from "../utils";
import {
  MAX_OPS,
  TRICORE_INSN_T,
  operandMatrix,
  opcodeHash
} from "./instruction";

export interface asmSymbol {
  name: string;
  allowRedefine: boolean;
}

export default class Analyzer {
  private symbolTable = new Map<string, asmSymbol>();
  private undefinedSymbols: [Parser.Point, Parser.Point, string][] = [];
  private macros = new Set<string>;
  private diagnostics: Diagnostic[] = [];

  analyze(tree: Parser.Tree) {
    tree.rootNode.namedChildren.forEach(node => {
      if (node.hasError()) return;
      switch(node.type) {
        case "label": {
          this.analyze_label(node);
          break;
        }
        case "local_label": {
          this.analyze_local_label(node);
          break;
        }
        case "instruction": {
          this.analyze_instruction(node);
          break;
        }
        case "directive_equ": {
          this.analyze_directive_equ(node);
          break;
        }
        case "directive_set": {
          this.analyze_directive_set(node);
          break;
        }
        case "directive_alias": {
          this.analyze_directive_alias(node);
          break;
        }
        case "directive_import_symbol": {
          this.analyze_directive_import_symbol(node);
          break;
        }
        case "directive_macro": {
          this.analyze_directive_macro(node);
          break;
        }
        case "directive_pmacro": {
          this.analyze_directive_pmacro(node);
          break;
        }
        case "macro_call": {
          this.analyze_macro_call(node);
          break;
        }
        default: {
          break;
        }
      }
    });
    for (const [start, end, sym] of this.undefinedSymbols) {
      if (!this.symbolTable.has(sym)) {
        this.diagnostics.push({
          range: Range.create(start.row, start.column, end.row, end.column),
          message: `local symbol "${sym}" not defined in this module; made external`,
          severity: DiagnosticSeverity.Warning,
          source: "tricore.tasking"
        });
      }
    }
    return this.diagnostics;
  }

  private analyze_label(root: Parser.SyntaxNode) {
    const node = root.firstNamedChild;
    this.createSymbol(node, false);
  }
  
  private createSymbol(node: Parser.SyntaxNode, allowRedefine: boolean) {
    switch(node.type) {
      case "symbol": {
        if (this.symbolTable.has(node.text)) {
          if (this.symbolTable.get(node.text).allowRedefine === false) {
            this.pushDiagnostics(node, `symbol "${node.text}" already defined`);
          } else {
            this.symbolTable.get(node.text).allowRedefine = allowRedefine;
          }
        } else {
          this.symbolTable.set(node.text, { name: node.text, allowRedefine });
        }
        break;
      }
      case "interpolated": {
        this.pushDiagnostics(node, "macro operator is prohibited outside the macro statement");
        break;
      }
    }
  }

  private analyze_local_label(root: Parser.SyntaxNode) {
    this.symbolTable.set(root.text, { name: root.text, allowRedefine: true });
    return;
  }
  
  private analyze_directive_set(root: Parser.SyntaxNode) {
    const left = root.childForFieldName("left");
    this.createSymbol(left, true);
  }

  private analyze_directive_equ(root: Parser.SyntaxNode) {
    const left = root.childForFieldName("left");
    this.createSymbol(left, false);
  }

  private analyze_directive_alias(root: Parser.SyntaxNode) {
    const left = root.childForFieldName("left");
    const right = root.childForFieldName("right");
    this.createSymbol(left, false);
    if (right.type === "interpolated") {
      this.pushDiagnostics(right, "macro operator is prohibited outside the macro statement");
      return;
    }
    if (!this.symbolTable.has(right.text)) {
      this.undefinedSymbols.push([
        right.startPosition,
        right.endPosition,
        right.text
      ]);
    }
  }

  private analyze_directive_import_symbol(root: Parser.SyntaxNode) {
    const mnem = root.childForFieldName("mnemonic");
    if(root.descendantsOfType("interpolated").length > 0) {
      this.pushDiagnostics(root, "macro operator is prohibited outside the macro statement");
      return;
    }
    const symbols = root.descendantsOfType("symbol");
    if (mnem.text.toLowerCase() === ".weak") {
      for(const s of symbols) {
        if (!this.symbolTable.has(s.text)) {
          this.symbolTable.set(s.text, { name: s.text, allowRedefine: true });
        }
      }
      return;
    }
    symbols.forEach(s => this.createSymbol(s, false));
  }

  private analyze_directive_macro(root: Parser.SyntaxNode){
    const left = root.childForFieldName("left");
    if (left.type === "interpolated") {
      this.pushDiagnostics(left, "macro operator is prohibited outside the macro statement");
      return;
    }
    if (this.macros.has(left.text)) {
      this.pushDiagnostics(left, `redefinition of macro "${left.text}"`);
      return;
    }
    this.macros.add(left.text);
  }

  private analyze_directive_pmacro(root: Parser.SyntaxNode){
    if(root.descendantsOfType("interpolated").length > 0) {
      this.pushDiagnostics(root, "macro operator is prohibited outside the macro statement");
      return;
    }
    const pmacros = root.descendantsOfType("symbol");
    for(const pmacro of pmacros) {
      if (!this.macros.has(pmacro.text)) {
        this.pushDiagnostics(pmacro, `macro "${pmacro.text}" does not exist`);
        return;
      }
      this.macros.delete(pmacro.text);
    }
  }

  private analyze_macro_call(root: Parser.SyntaxNode){
    const macro = root.childForFieldName("macro");
    if (macro.type === "interpolated") {
      this.pushDiagnostics(macro, "macro operator is prohibited outside the macro statement");
      return;
    }
    if (!this.macros.has(macro.text)) {
      this.pushDiagnostics(macro, `unsupported directive or instruction "${macro.text}"`);
      return;
    }
  }

  private analyze_instruction(root: Parser.SyntaxNode){
    const the_insn: TRICORE_INSN_T = {
      name: "",
      nops: 0,
      ops: [],
      matches_v: [],
      matches_6: [],
      matches_k: [],
      is_odd: [],
      needs_prefix: 0
    };
    let numops = -1;
    the_insn.name = root.childForFieldName("mnemonic")!.text;
    const operands = root.childForFieldName("operands");
    if (operands) {
      for (const node of operands.namedChildren) {
        if (++numops === MAX_OPS) {
          this.pushDiagnostics(node, "too many operands");
          return;
        }
        switch(node.type) {
          case "data_register": {
            const suffix = node.text.match(/[lLuU]{1,2}/);
            if (suffix) {
              switch(suffix[0]) {
                case "l": 
                  the_insn.ops[numops] = 'g';
                  break;
                case "u": 
                  the_insn.ops[numops] = 'G';
                  break;
                case "ll": 
                  the_insn.ops[numops] = '-';
                  break;
                case "uu": 
                  the_insn.ops[numops] = '+';
                  break;
                case "lu": 
                  the_insn.ops[numops] = 'l';
                  break;
                case "ul": 
                  the_insn.ops[numops] = 'L';
                  break;
              }
            } else {
              the_insn.ops[numops] = node.text.toLowerCase() === "d15" ? "i" : "d";
            }
            break;
          }
          case "data_register_bit": {
            const data_register = node.firstNamedChild;
            if (data_register.text.match(/[lLuU]{1,2}/)) {
              this.pushDiagnostics(data_register, "expected data register");
              return;
            }
            the_insn.ops[numops++] = node.text.toLowerCase() === "d15" ? "i" : "d";
            const bit_position = parseInt(node.lastNamedChild.text, 10);
            the_insn.ops[numops] = this.classify_numeric(bit_position);
            break;
          }
          case "address_register": {
            if (node.text.toLowerCase() === "sp" || node.text.toLowerCase() === "a10") {
              the_insn.ops[numops] = "P";
            } else if (node.text.toLowerCase() === "a15") {
              the_insn.ops[numops] = "I";
            } else {
              the_insn.ops[numops] = "a";
            }
            break;
          }
          case "extended_data_register": {
            if (!node.text.toLowerCase().startsWith("e")) {
              const regpair = node.text.match(/\d+/g).map(no => parseInt(no));
              if (regpair[1] !== regpair[0] + 1) {
                this.pushDiagnostics(node, "expected data register pair");
                return;
              }
            }
            the_insn.ops[numops] = "D";
            break;
          }
          case "extended_address_register": {
            const regpair = node.text.match(/\d+/g).map(no => parseInt(no));
            if (regpair[1] !== regpair[0] + 1) {
              this.pushDiagnostics(node, "expected address register pair");
              return;
            }
            the_insn.ops[numops] = "A";
            break;
          }
          case "base_offset": {
            const reg = node.firstNamedChild;
            if (reg.type === "register_macro_argument") {
              this.pushDiagnostics(reg, "macro operator is prohibited outside the macro statement");
              return;
            }
            const regno = reg.text.toLowerCase();
            the_insn.ops[numops] = regno === "a10" || regno === "sp" ? "&" 
              : regno === "a15" ? "S" 
              : "@";
            numops ++;
            const offset = node.childForFieldName("offset");
            if (offset) {
              const opr = this.get_expression(offset, the_insn, numops);
              if (opr === undefined) return; 
              the_insn.ops[numops] = opr;
            } else {
              the_insn.ops[numops] = "1";
            }
            break;
          }
          case "pre_increment": {
            const reg = node.firstNamedChild;
            if (reg.type === "register_macro_argument") {
              this.pushDiagnostics(reg, "macro operator is prohibited outside the macro statement");
              return;
            }
            the_insn.ops[numops] = "<";
            numops ++;
            const offset = node.childForFieldName("offset");
            if (offset) {
              const opr = this.get_expression(offset, the_insn, numops);
              if (opr === undefined) return; 
              the_insn.ops[numops] = opr;
            } else {
              the_insn.ops[numops] = "1";
            }
            break;
          }
          case "post_increment": {
            const reg = node.firstNamedChild;
            if (reg.type === "register_macro_argument") {
              this.pushDiagnostics(reg, "macro operator is prohibited outside the macro statement");
              return;
            }
            the_insn.ops[numops] = ">";
            numops ++;
            const offset = node.childForFieldName("offset");
            if (offset) {
              const opr = this.get_expression(offset, the_insn, numops);
              if (opr === undefined) return; 
              the_insn.ops[numops] = opr;
            } else {
              the_insn.ops[numops] = "1";
            }
            break;
          }
          case "circular": {
            const reg = node.firstNamedChild;
            if (reg.type === "register_macro_argument") {
              this.pushDiagnostics(reg, "macro operator is prohibited outside the macro statement");
              return;
            }
            const regpair = reg.text.match(/\d+/g).map(no => parseInt(no));
            if (regpair[1] !== regpair[0] + 1) {
              this.pushDiagnostics(reg, "expected address register pair");
              return;
            }
            the_insn.ops[numops] = "*";
            numops ++;
            const offset = node.childForFieldName("offset");
            if (offset) {
              const opr = this.get_expression(offset, the_insn, numops);
              if (opr === undefined) return; 
              the_insn.ops[numops] = opr;
            } else {
              the_insn.ops[numops] = "1";
            }
            break;
          }
          case "bit_reverse": {
            const reg = node.firstNamedChild;
            if (reg.type === "register_macro_argument") {
              this.pushDiagnostics(reg, "macro operator is prohibited outside the macro statement");
              return;
            }
            const regpair = reg.text.match(/\d+/g).map(no => parseInt(no));
            if (regpair[1] !== regpair[0] + 1) {
              this.pushDiagnostics(reg, "expected address register pair");
              return;
            }
            the_insn.ops[numops] = "#";
            break;
          }
          default: {
            const opr = this.get_expression(node, the_insn, numops);
            if (opr === undefined) return; 
            the_insn.ops[numops] = opr;
            break;
          }
        }
      }
      the_insn.nops = ++numops;
    }

    const insn = this.find_opcode(the_insn);
    
    if (!insn) {
      this.pushDiagnostics(root, "opcode/operand mismatch");
      return;
    }

    for (let index = 0; index < insn.nr_operands; ++index) {
      if ("mxrRoO".indexOf(insn.args[index]) >= 0 && the_insn.is_odd[index]) {
        this.pushDiagnostics(root, "displacement is not even");
        return;
      }
    }

  }

  private classify_numeric(num: number): string {
    if (num < 0) {
      if (num >= -8) {
        return "4";
      }
      if (num >= -16) {
        return "F";
      }
      if ((num >= -32) && !(num & 1)) {
        return "r";
      }
      if (num >= -256) {
        return (num & 1) ? "9" : "R";
      }
      if (num >= -512) {
        return "0";
      }
      if (num >= -32768) {
        return (num & 1) ? "w" : "o";
      }
      if ((num >= -16777216) && !(num & 1)) {
        return 'O';
      }
    } else {
      if (num < 2) {
        return "1";
      }
      if (num < 4) {
        return "2";
      }
      if (num < 8) {
        return "3";
      }
      if (num < 16) {
        return "f";
      }
      if (num < 31) {
        return (num & 1) ? "5" : "v";
      }
      if (num < 32) {
        return "5";
      }
      if ((num < 61) && !(num & 3)) {
        return "6";
      }
      if ((num < 63) && !(num & 1)) {
        return 'x';
      }
      if (num < 256) {
        return "8";
      }
      if (num < 512) {
        return "n";
      }
      if ((num < 1024) && !(num & 3)) {
        return "k";
      }
      if (num < 1024) {
        return "h";
      }
      if (num < 32768) {
        return "q";
      }
      if (num < 65536) {
        return "W";
      }
      if ((num < 16777215) && !(num & 1)) {
        return "O";
      }
    }

    if (!(num & 0x0fffc000)) {
      return "t";
    } else if (!(num & 0x0fe00001)) {
      return "T";
    }
    if (!(num & 0x00003fff)) {
      return "V";
    }

    return "M";
  }

  private get_expression(root: Parser.SyntaxNode,the_insn: TRICORE_INSN_T, numops: number): string | undefined {
    let numeric: number;
    switch(root.type) {
      case "binary":
      case "hexadecimal":
      case "decimal_integer":
      case "decimal_float": {
        numeric = Number(root.text);
        break;
      }
      case "string_literal":
      case "string_concate":
      case "substring": {
        this.pushDiagnostics(root, "unexpected string literal");
        return;
      }
      case "unary_expression": {
        if(!this.checkExpressionDescendant(root, the_insn)) return;
        const opr = root.childForFieldName("operand");
        const operator = root.childForFieldName("operator");
        if (["binary", "hexadecimal", "decimal_integer", "decimal_float"].indexOf(opr.type) !== -1) {
          switch(operator.text) {
            case "+":
              numeric = Number(opr.text);
              break;
            case "-":
              numeric = -Number(opr.text);
              break;
            case "!":
              numeric = Number(opr.text) === 0 ? 1 : 0;
              break;
            case "~":
              if (Number.isInteger(Number(opr.text))) {
                numeric = ~Number(opr.text);
              } else {
                this.pushDiagnostics(opr, "~ only support Integer");
                return;
              }
              break;
          }
          break;
        }
        the_insn.matches_v[numops] = 1;
        the_insn.matches_6[numops] = 1;
        the_insn.matches_k[numops] = 1;
        return 'U';
      }
      case "binary_expression": {
        if(!this.checkExpressionDescendant(root, the_insn)) return;
        the_insn.matches_v[numops] = 1;
        the_insn.matches_6[numops] = 1;
        the_insn.matches_k[numops] = 1;
        return 'U';
      }
      case "parenthesized_expression": {
        if(!this.checkExpressionDescendant(root, the_insn)) return;
        if(["binary", "hexadecimal", "decimal_integer", "decimal_float"].indexOf(root.firstNamedChild.type) !== -1) {
          numeric = Number(root.firstNamedChild.text);
          break;
        }
        the_insn.matches_v[numops] = 1;
        the_insn.matches_6[numops] = 1;
        the_insn.matches_k[numops] = 1;
        return 'U';
      }
      case "symbol": {
        if (!this.symbolTable.has(root.text)) {
          this.undefinedSymbols.push([
            root.startPosition,
            root.endPosition,
            root.text
          ]);
        }
        the_insn.matches_v[numops] = 1;
        the_insn.matches_6[numops] = 1;
        the_insn.matches_k[numops] = 1;
        return 'U';
      }
      case "interpolated": {
        this.pushDiagnostics(root, "macro operator is prohibited outside the macro statement");
        return ;
      }
      case "function_call": {
        if(!this.checkExpressionDescendant(root, the_insn)) return;
        the_insn.matches_v[numops] = 1;
        the_insn.matches_6[numops] = 1;
        the_insn.matches_k[numops] = 1;
        the_insn.needs_prefix = 1;
        return 'U';
      }
    }
    if (!Number.isInteger(numeric)) {
      this.pushDiagnostics(root, "expected numeric constant");
      return;
    }
    let numericOpr = this.classify_numeric(numeric);
    the_insn.is_odd[numops] = (numeric & 1);
    if (the_insn.needs_prefix) {
      numericOpr = 'q';
    } else if (numericOpr === 'k') {
      the_insn.matches_k[numops] = 1;
    } else if (numericOpr === '6') {
      the_insn.matches_6[numops] = 1;
      the_insn.matches_k[numops] = 1;
    } else if ("123fmxv".indexOf(numericOpr) >= 0) {
      if (!(numeric & 1)) {
        the_insn.matches_v[numops] = 1;
      }
      if (!(numeric & 3)) {
        the_insn.matches_6[numops] = 1;
        the_insn.matches_k[numops] = 1;
      }
    } else if("58n".indexOf(numericOpr) >= 0) {
      if(!(numeric & 3)) {
        the_insn.matches_k[numops] = 1;
      }
    }
    return numericOpr;
  }

  checkExpressionDescendant(node: Parser.SyntaxNode, the_insn: TRICORE_INSN_T) {
    if (node.descendantsOfType("string_literal").length > 0) {
      this.pushDiagnostics(node, "unexpected string literal");
      return false;
    }
    if (node.descendantsOfType("interpolated").length > 0) {
      this.pushDiagnostics(node, "macro operator is prohibited outside the macro statement");
      return false;
    }
    for (const sym of node.descendantsOfType("symbol")) {
      if (!this.symbolTable.has(sym.text)) {
        this.undefinedSymbols.push([
          sym.startPosition,
          sym.endPosition,
          sym.text,
        ]);
      }
    }
    return true;
  }

  private find_opcode(the_insn: TRICORE_INSN_T) {
    const ops = opcodeHash.get(the_insn.name);
    for (const op of ops!) {
      if (op.nr_operands !== the_insn.nops || (!op.len32 && the_insn.needs_prefix)) continue;
      
      let index: number;
      for (index = 0; index < the_insn.nops; ++index) {
        if (operandMatrix.get(op.args.charAt(index))!.indexOf(the_insn.ops[index]) === -1
          || (op.args.charAt(index) === "v" && !the_insn.matches_v[index])
          || (op.args.charAt(index) === "6" && !the_insn.matches_6[index])
          || (op.args.charAt(index) === "k" && !the_insn.matches_k[index])
        ) break;
        if (!op.len32 && the_insn.ops[index] === "U" && "mxrRoO".indexOf(op.args.charAt(index)) === -1) break;
      }

      if (index === the_insn.nops) {
        return op;
      }
    }

    return undefined;
  }

  private pushDiagnostics(node: Parser.SyntaxNode, message: string, severity: DiagnosticSeverity = DiagnosticSeverity.Error) {
    this.diagnostics.push({
      range: nodeAsRange(node),
      message: "syntax error: " + message,
      severity,
      source: "tricore.tasking"
    });
  }
}