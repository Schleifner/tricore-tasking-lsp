export type syntaxTestDatas = {
  name: string;
  pattern: string;
  testStrings: string[];
}[];

export const testDatas: syntaxTestDatas = [
  {
    "name": "comment.line.double-slash.tricore",
    "pattern": "(?://).*$",
    "testStrings": ["// This is a double-slash line comment"]
  },
  {
    "name": "comment.line.semicolon.tricore",
    "pattern": "(?:;).*$",
    "testStrings": ["; This is a semicolon line comment"]
  },
  {
    "name": "storage.register.general-purpose.tricore",
    "pattern": "(?i)(?:[ad](?:[0-9]|1[0-5])|e(?:[02468]|1[024])|sp)(?-i)\\b",
    "testStrings": [
      "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "a10", "a11", "a12", "a13", "a14", "a15",
      "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15",
      "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "d13", "d14", "d15",
      "D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "D14", "D15", 
      "e0", "e2", "e4", "e6", "e8", "e10", "e12", "e14", "E0", "E2", "E4", "E6", "E8", "E10", "E12", "E14"
    ]
  },
  {
    "name": "storage.register.core-special-function.tricore",
    "pattern": "(?i)(?:pc|psw|pcxi|isp|syscon|biv|btv|icr|fcx|lcx)(?-i)\\b",
    "testStrings": [
      "pc", "psw", "pcxi", "isp", "syscon", "biv", "btv", "icr", "fcx", "lcx",
      "PC", "PSW", "PCXI", "ISP", "SYSCON", "BIV", "BTV", "ICR", "FCX", "LCX"
    ]
  },
  {
    "name": "keyword.control.directive.control.tricore",
    "pattern": "\\.(?i)(?:comment|end|fail|include|message|warning)(?-i)\\b",
    "testStrings": [
      ".comment", ".end", ".fail", ".include", ".message", ".warning",
      ".COMMENT", ".END", ".FAIL", ".INCLUDE", ".MESSAGE", ".WARNING"
    ]
  },
  {
    "name": "keyword.control.directive.definition.symbol.tricore",
    "pattern": "\\.(?i)(?:alias|equ|extern|global|local)(?-i)\\b",
    "testStrings": [
      ".alias", ".equ", ".extern", ".global", ".local",
      ".ALIAS", ".EQU", ".EXTERN", ".GLOBAL", ".LOCAL"
    ]
  },
  {
    "name": "keyword.control.directive.section.tricore",
    "pattern": "\\.(?i)(?:org|sdecl|sect|set|size|type|weak)(?-i)\\b",
    "testStrings": [
      ".org", ".sdecl", ".sect", ".set", ".size", ".type", ".weak",
      ".ORG", ".SDECL", ".SECT", ".SET", ".SIZE", ".TYPE", ".WEAK"
    ]
  },
  {
    "name": "keyword.control.directive.definition.data.tricore",
    "pattern": "\\.(?i)(?:accum|align|asciiz?|byte|double|float|fract|half|sfract|space|word)(?-i)\\b",
    "testStrings": [
      ".accum", ".align", ".ascii", ".asciiz", ".byte", ".double", ".float", ".fract", ".half", ".sfract", ".space", ".word",
      ".ACCUM", ".ALIGN", ".ASCII", ".ASCIIZ", ".BYTE", ".DOUBLE", ".FLOAT", ".FRACT", ".HALF", ".SFRACT", ".SPACE", ".WORD"
    ]
  },
  {
    "name": "keyword.control.directive.macro.preprocessor.tricore",
    "pattern": "\\.(?i)(?:define|dup[acf]?|endm|if|elif|else|endif|exitm|p?macro|undef)(?-i)\\b",
    "testStrings": [
      ".define", ".dup", ".dupa", ".dupc", ".dupf", ".endm", ".if", ".elif", ".else", ".endif", ".exitm", ".macro", ".pmacro", ".undef",
      ".DEFINE", ".DUP", ".DUPA", ".DUPC", ".DUPF", ".ENDM", ".IF", ".ELIF", ".ELSE", ".ENDIF", ".EXITM", ".MACRO", ".PMACRO", ".UNDEF"
    ]
  },
  {
    "name": "keyword.control.directive.hll.tricore",
    "pattern": "\\.(?i)(?:calls|compiler_(?:invocation|name|version)|misrac)(?-i)\\b",
    "testStrings": [
      ".calls", ".compiler_invocation", ".compiler_name", ".compiler_version", ".misrac",
      ".CALLS", ".COMPILER_INVOCATION", ".COMPILER_NAME", ".COMPILER_VERSION", ".MISRAC"
    ]
  },
  {
    "name": "keyword.control.controls.listing.tricore",
    "pattern": "\\$(?i)(?:list|page|prctl|s?title)(?-i)\\b",
    "testStrings": [
      "$list", "$page", "$prctl", "$stitle", "$title",
      "$LIST", "$PAGE", "$PRCTL", "$STITLE", "$TITLE"
    ]
  },
  {
    "name": "keyword.control.controls.miscellaneous.tricore",
    "pattern": "\\$(?i)(?:case|cpu_tc\\d+|debug|hw_only|ident|mmu|no_fpu|object|tc(?:131|16[x2]?)|warning)(?-i)\\b",
    "testStrings": [
      "$case", "$cpu_tc018", "$debug", "$hw_only", "$ident", "$mmu", "$no_fpu", "$object", "$tc131", "$tc16", "$tc16x", "$tc162", "$warning",
      "$CASE", "$CPU_TC018", "$DEBUG", "$HW_ONLY", "$IDENT", "$MMU", "$NO_FPU", "$OBJECT", "$TC131", "$TC16", "$TC16X", "$TC162", "$WARNING"
    ]
  },
  {
    "name": "keyword.control.builtin.mathematical.tricore",
    "pattern": "@(?i)(?:a[bc]s|asn|at[2n]|cel|co[hs]|flr|l10|log|max|min|pow|rnd|s[gi]n|snh|sqt|tan|tnh|xpn)(?-i)\\b",
    "testStrings": [
      "@abs", "@acs", "@asn", "@at2", "@atn", "@cel", "@coh", "@cos", "@flr", "@l10", "@log", "@max", "@min", "@pow", "@rnd", "@sgn", "@sin", "@snh", "@sqt", "@tan", "@tnh", "@xpn",
      "@ABS", "@ACS", "@ASN", "@AT2", "@ATN", "@CEL", "@COH", "@COS", "@FLR", "@L10", "@LOG", "@MAX", "@MIN", "@POW", "@RND", "@SGN", "@SIN", "@SNH", "@SQT", "@TAN", "@TNH", "@XPN"
    ]
  },
  {
    "name": "keyword.control.builtin.conversion.tricore",
    "pattern": "@(?i)(?:cv[fi]|fld|s?fract|lng|lun|rvb|unf)(?-i)\\b",
    "testStrings": [
      "@cvf", "@cvi", "@fld", "@fract", "@sfract", "@lng", "@lun", "@rvb", "@unf",
      "@CVF", "@CVI", "@FLD", "@FRACT", "@SFRACT", "@LNG", "@LUN", "@RVB", "@UNF"
    ]
  },
  {
    "name": "keyword.control.builtin.string.tricore",
    "pattern": "@(?i)(?:cat|len|pos|scp|sub)(?-i)\\b",
    "testStrings": [
      "@cat", "@len", "@pos", "@scp", "@sub",
      "@CAT", "@LEN", "@POS", "@SCP", "@SUB"
    ]
  },
  {
    "name": "keyword.control.builtin.macro.tricore",
    "pattern": "@(?i)(?:arg|cnt|mac|mxp)(?-i)\\b",
    "testStrings": [
      "@arg", "@cnt", "@mac", "@mxp",
      "@ARG", "@CNT", "@MAC", "@MXP"
    ]
  },
  {
    "name": "keyword.control.builtin.address-calculation.tricore",
    "pattern": "@(?i)(?:his?|los?|[lm]sb)(?-i)\\b",
    "testStrings": [
      "@hi", "@his", "@lo", "@los", "@lsb", "@msb",
      "@HI", "@HIS", "@LO", "@LOS", "@LSB", "@MSB"
    ]
  },
  {
    "name": "keyword.control.builtin.assembler-mode.tricore",
    "pattern": "@(?i)(?:astc|def|exp|int|lst)(?-i)\\b",
    "testStrings": [
      "@astc", "@def", "@exp", "@int", "@lst",
      "@ASTC", "@DEF", "@EXP", "@INT", "@LST",
    ]
  },
  {
    "name": "constant.numeric.dec.tricore",
    "pattern": "#?\\b(?:(?:\\d+)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)\\b",
    "testStrings": [
      "6e10", "6E10", "12", "1245", "3.14", "2.7e10", "2.7E10",
      "#6e10", "#6E10", "#12", "#1245", "#3.14", "#2.7e10", "#2.7E10"
    ]
  },
  {
    "name": "constant.numeric.dec.tricore",
    "pattern": "#?(\\.\\d+(?![a-zA-Z._]))",
    "testStrings": [".6", "#.6"]
  },
  {
    "name": "constant.numeric.bin.tricore",
    "pattern": "#?\\b0[Bb][01]+\\b",
    "testStrings": ["0B1101", "0b11001010", "#0B1101", "#0b11001010"]
  },
  {
    "name": "constant.numeric.hex.tricore",
    "pattern": "#?\\b(?i)(?:(?:0x)?[0-9a-fA-F]+)(?-i)\\b",
    "testStrings": ["0X12FF", "0x45", "0xfa10", "0b", "#0X12FF", "#0x45", "#0xfa10", "0B"]
  },
  {
    "name": "variable.label.define.tricore",
    "pattern": "^[.a-zA-Z_][.0-9a-zA-Z_]*:?",
    "testStrings": [
      "LAB1", "main: ", "LAB_1:", ".1.str:"
    ]
  },
  {
    "name": "variable.label.define.tricore",
    "pattern": "^\\s+[.a-zA-Z_][.0-9a-zA-Z_]*:",
    "testStrings": [
      "  main: ", " main:", " LAB_1:", " .1.str:"
    ]
  },
  {
    "name": "variable.label.ref.tricore",
    "pattern": "[.a-zA-Z_][.0-9a-zA-Z_]*",
    "testStrings": ["main", "LAB_1", ".1.str"]
  },
  {
    "name": "variable.label.local.define.tricore",
    "pattern": "^(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b:?",
    "testStrings": ["1", "22:", "139", "254:"]
  },
  {
    "name": "variable.label.local.define.tricore",
    "pattern": "^\\s+(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\b:",
    "testStrings": [" 1:", " 22:", " 139:", " 254:"]
  },
  {
    "name": "variable.label.local.ref.tricore",
    "pattern": "\\b(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])[pn]\\b",
    "testStrings": ["1p", "22n", "139p", "254n"]
  },
  {
    "name": "support.function.mnemonic.general-purpose.data-transfer.mov.tricore",
    "pattern": "\\b(?i)(?:mov(?:\\.(?:aa?|d|u))?|movh(?:\\.a)?|cmovn?|l[eh]a)(?-i)\\b",
    "testStrings": [
      "mov", "mov.a", "mov.aa", "mov.d", "mov.u", "movh", "movh.a", "cmov", "cmovn", "lea", "lha",
      "MOV", "MOV.A", "MOV.AA", "MOV.D", "MOV.U", "MOVH", "MOVH.A", "CMOV", "CMOVN", "LEA", "LHA"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.add.tricore",
    "pattern": "\\b(?i)(?:add(?:\\.[abfh]|[cx]|i(?:h(?:\\.a)?)?|s(?:\\.(?:hu?|u))?|sc\\.at?)?)(?-i)\\b",
    "testStrings": [
      "add", "add.a", "add.b", "add.f", "add.h", "addc", "addi", "addih", "addih.a", "adds", "adds.h", "adds.hu", "adds.u", "addsc.a", "addsc.at", "addx",
      "ADD", "ADD.A", "ADD.B", "ADD.F", "ADD.H", "ADDC", "ADDI", "ADDIH", "ADDIH.A", "ADDS", "ADDS.H", "ADDS.HU", "ADDS.U", "ADDSC.A", "ADDSC.AT", "ADDX"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.sub.tricore",
    "pattern": "\\b(?i)(?:sub(?:\\.[abfh]|[cx]|s(?:\\.(?:hu?|u))?)?|rsub(?:s(?:\\.u)?)?)(?-i)\\b",
    "testStrings": [
      "sub", "sub.a", "sub.b", "sub.f", "sub.h", "subc", "subs", "subs.h", "subs.hu", "subs.u", "subx", "rsub", "rsubs", "rsubs.u",
      "SUB", "SUB.A", "SUB.B", "SUB.F", "SUB.H", "SUBC", "SUBS", "SUBS.H", "SUBS.HU", "SUBS.U", "SUBX", "RSUB", "RSUBS", "RSUBS.U"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.mul.tricore",
    "pattern": "\\b(?i)(?:mul(?:\\.[fhqu]|ms?\\.h|r\\.[hq]|s(?:\\.u)?)?)(?-i)\\b",
    "testStrings": [
      "mul", "mul.f", "mul.h", "mul.q", "mul.u", "mulm.h", "mulms.h", "mulr.h", "mulr.q", "muls", "muls.u",
      "MUL", "MUL.F", "MUL.H", "MUL.Q", "MUL.U", "MULM.H", "MULMS.H", "MULR.H", "MULR.Q", "MULS", "MULS.U"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.madd.tricore",
    "pattern": "\\b(?i)(?:madd(?:\\.[fhqu]|ms?\\.h|rs?\\.[hq]|s(?:\\.[hqu]|u(?:ms?|rs?|s)?\\.h)?)?)(?-i)\\b",
    "testStrings": [
      "madd", "madd.f", "madd.h", "madd.q", "madd.u", "maddm.h", "maddms.h", "maddr.h", "maddr.q", "maddrs.h", "maddrs.q",
      "madds", "madds.h", "madds.q", "madds.u", "maddsu.h", "maddsum.h", "maddsums.h", "maddsur.h", "maddsurs.h", "maddsus.h",
      "MADD", "MADD.F", "MADD.H", "MADD.Q", "MADD.U", "MADDM.H", "MADDMS.H", "MADDR.H", "MADDR.Q", "MADDRS.H", "MADDRS.Q",
      "MADDS", "MADDS.H", "MADDS.Q", "MADDS.U", "MADDSU.H", "MADDSUM.H", "MADDSUMS.H", "MADDSUR.H", "MADDSURS.H", "MADDSUS.H"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.msub.tricore",
    "pattern": "\\b(?i)(?:msub(?:\\.[fhqu]|ad(?:ms?|rs?|s)?\\.h|ms?\\.h|rs?\\.[hq]|s(?:\\.[hqu])?)?)(?-i)\\b",
    "testStrings": [
      "msub", "msub.f", "msub.h", "msub.q", "msub.u", "msubad.h", "msubadm.h", "msubadms.h", "msubadr.h", "msubadrs.h", "msubads.h",
      "msubm.h", "msubms.h", "msubr.h", "msubr.q", "msubrs.h", "msubrs.q", "msubs", "msubs.h", "msubs.q", "msubs.u",
      "MSUB", "MSUB.F", "MSUB.H", "MSUB.Q", "MSUB.U", "MSUBAD.H", "MSUBADM.H", "MSUBADMS.H", "MSUBADR.H", "MSUBADRS.H", "MSUBADS.H",
      "MSUBM.H", "MSUBMS.H", "MSUBR.H", "MSUBR.Q", "MSUBRS.H", "MSUBRS.Q", "MSUBS", "MSUBS.H", "MSUBS.Q", "MSUBS.U"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.div.tricore",
    "pattern": "\\b(?i)(?:div(\\.[fu])?|dv(?:adj|init(?:\\.(?:bu?|hu?|u))?|step(?:\\.u)?))(?-i)\\b",
    "testStrings": [
      "div", "div.f", "div.u", "dvadj", "dvinit", "dvinit.b", "dvinit.bu", "dvinit.h", "dvinit.hu", "dvinit.u", "dvstep", "dvstep.u",
      "DIV", "DIV,F", "DIV.U", "DVADJ", "DVINIT", "DVINIT.B", "DVINIT.BU", "DVINIT.H", "DVINIT.HU", "DVINIT.U", "DVSTEP", "DVSTEP.U"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.abs.tricore",
    "pattern": "\\b(?i)(?:abs(?:dif)?(?:\\.[bh]|s(?:\\.h)?)?)(?-i)\\b",
    "testStrings": [
      "abs", "abs.b", "abs.h", "absdif", "absdif.b", "absdif.h", "absdifs", "absdifs.h", "abss", "abss.h",
      "ABS", "ABS.B", "ABS.H", "ABSDIF", "ABSDIF.B", "ABSDIF.H", "ABSDIFS", "ABSDIFS.H", "ABSS", "ABSS.H"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.max-min-saturate,.tricore",
    "pattern": "\\b(?i)(?:m(?:ax|in)(?:\\.(?:bu?|hu?|u))?|ixm(?:ax|in)(?:\\.u)?|sat\\.[bh]u?)(?-i)\\b",
    "testStrings": [
      "ixmax", "ixmax.u", "ixmin", "ixmin.u", "max", "max.b", "max.bu", "max.h", "max.hu", "max.u",
      "min", "min.b", "min.bu", "min.h", "min.hu", "min.u", "sat.b", "sat.bu", "sat.h", "sat.hu",
      "IXMAX", "IXMAX.U", "IXMIN", "IXMIN.U", "MAX", "MAX.B", "MAX.BU", "MAX.H", "MAX.HU", "MAX.U",
      "MIN", "MIN.B", "MIN.BU", "MIN.H", "MIN.HU", "MIN.U", "SAT.B", "SAT.BU", "SAT.H", "SAT.HU"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.conditional.tricore",
    "pattern": "\\b(?i)(?:(?:cadd|csub|sel)n?)(?-i)\\b",
    "testStrings": [
      "cadd", "caddn", "csub", "csubn", "sel", "seln",
      "CADD", "CADDN", "CSUB", "CSUBN", "SEL", "SELN"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.logic.tricore",
    "pattern": "\\b(?i)(?:(?:and|or)(?:(?:\\.(?:andn?\\.t|eq|ge(?:\\.u)?|lt(?:\\.u)?|ne|n?or\\.t|t)?)?|n(?:\\.t)?))(?-i)\\b",
    "testStrings": [
      "and", "and.and.t", "and.andn.t", "and.eq", "and.ge", "and.ge.u", "and.lt", "and.lt.u", "and.ne", "and.nor.t", "and.or.t", "and.t", "andn", "andn.t",
      "or", "or.and.t", "or.andn.t", "or.eq", "or.ge", "or.ge.u", "or.lt", "or.lt.u", "or.ne", "or.nor.t", "or.or.t", "or.t", "orn", "orn.t",
      "AND", "AND.AND.T", "AND.ANDN.T", "AND.EQ", "AND.GE", "AND.GE.U", "AND.LT", "AND.LT.U", "AND.NE", "AND.NOR.T", "AND.OR.T", "AND.T", "ANDN", "ANDN.T",
      "OR", "OR.AND.T", "OR.ANDN.T", "OR.EQ", "OR.GE", "OR.GE.U", "OR.LT", "OR.LT.U", "OR.NE", "OR.NOR.T", "OR.OR.T", "OR.T", "ORN", "ORN.T"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.logic.tricore",
    "pattern": "\\b(?i)(?:n(?:and|or)(?:\\.t)?)(?-i)\\b",
    "testStrings": [
      "nand", "nand.t", "nor", "nor.t", "NAND", "NAND.T", "NOR", "NOR.T"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.logic.tricore",
    "pattern": "\\b(?i)(?:x(?:(nor(?:\\.t)?)|or(?:\\.(?:eq|ne|(?:ge|lt)(\\.u)?|t))?)|not)(?-i)\\b",
    "testStrings": [
      "xor", "xor.eq", "xor.ge", "xor.ge.u", "xor.lt", "xor.lt.u", "xor.ne", "xor.t", "xnor", "xnor.t", "not",
      "XOR", "XOR.EQ", "XOR.GE", "XOR.GE.U", "XOR.LT", "XOR.LT.U", "XOR.NE", "XOR.T", "XNOR", "XNOR.T", "NOT"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.count-leading.tricore",
    "pattern": "\\b(?i)(?:cl[osz](?:\\.h)?|crc(?:n|32(\\.b|[bl]\\.w))|popcnt.w)(?-i)\\b",
    "testStrings": [
      "clo", "clo.h", "cls", "cls.h", "clz", "clz.h", "crc32.b", "crc32b.w", "crc32l.w", "crcn", "popcnt.w",
      "CLO", "CLO.H", "CLS", "CLS.H", "CLZ", "CLZ.H", "CRC32.B", "CRC32B.W", "CRC32L.W", "CRCN", "POPCNT.W"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.shift.tricore",
    "pattern": "\\b(?i)(?:sh(?:\\.(?:andn?\\.t|eq|ge(?:\\.u)?|h|lt(?:\\.u)?|nand.t|n(?:e|or\\.t)|orn?\\.t|xn?or\\.t)|a(?:(?:\\.h)?|s)|uffle)?)(?-i)\\b",
    "testStrings": [
      "sh", "sh.and.t", "sh.andn.t", "sh.eq", "sh.ge", "sh.ge.u", "sh.h", "sh.lt", "sh.lt.u", "sh.nand.t",
      "sh.ne", "sh.nor.t", "sh.or.t", "sh.orn.t", "sh.xnor.t", "sh.xor.t", "sha", "sha.h", "shas", "shuffle",
      "SH", "SH.AND.T", "SH.ANDN.T", "SH.EQ", "SH.GE", "SH.GE.U", "SH.H", "SH.LT", "SH.LT.U", "SH.NAND.T",
      "SH.NE", "SH.NOR.T", "SH.OR.T", "SH.ORN.T", "SH.XNOR.T", "SH.XOR.T", "SHA", "SHA.H", "SHAS", "SHUFFLE"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.bit-field.tricore",
    "pattern": "\\b(?i)(?:dextr|extr(?:\\.u)?|ins(?:ert|n?\\.t)|imask|b(merge|split))(?-i)\\b",
    "testStrings": [
      "extr", "extr.u", "dextr", "ins.t", "insert", "insn.t", "imask", "bmerge", "bsplit",
      "EXTR", "EXTR.U", "DEXTR", "INS.T", "INSERT", "INSN.T", "IMASK", "BMERGE", "BSPLIT"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.psw.tricore",
    "pattern": "\\b(?i)(?:m[ft]cr|traps?v|rstv|updfl|parity)(?-i)\\b",
    "testStrings": [
      "mfcr", "mtcr", "trapv", "trapsv", "rstv", "updfl", "parity", "MFCR", "MTCR", "TRAPV", "TRAPSV", "RSTV", "UPDFL", "PARITY"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.eq.tricore",
    "pattern": "\\b(?i)(?:eq(?:\\.[abhw]|any\\.[bh]|z\\.a)?)(?-i)\\b",
    "testStrings": [
      "eq", "eq.a", "eq.b", "eq.h", "eq.w", "eqany.b", "eqany.h", "eqz.a",
      "EQ", "EQ.A", "EQ.B", "EQ.H", "EQ.W", "EQANY.B", "EQANY.H", "EQZ.A"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.ne.tricore",
    "pattern": "\\b(?i)(?:ne(?:z?\\.a)?)(?-i)\\b",
    "testStrings": [
      "ne", "ne.a", "nez.a", "NE", "NE.A", "NEZ.A"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.lt.tricore",
    "pattern": "\\b(?i)(?:lt(?:\\.(a|bu?|hu?|wu?|u))?)(?-i)\\b",
    "testStrings": [
      "lt", "lt.a", "lt.b", "lt.bu", "lt.h", "lt.hu", "lt.u", "lt.w", "lt.wu", "LT", "LT.A", "LT.B", "LT.BU", "LT.H", "LT.HU", "LT.U", "LT.W", "LT.WU"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.arithmetic.ge.tricore",
    "pattern": "\\b(?i)(?:ge(?:\\.[ab])?)(?-i)\\b",
    "testStrings": [
      "ge", "ge.a", "ge.b", "GE", "GE.A", "GE.B"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.branch.jmp.tricore",
    "pattern": "\\b(?i)(?:j(?:[ai]|eq(?:\\.a)?|ge(?:\\.u|z)?|gtz|l(?:[ai]|ez|t(?:\\.u|z)?)?|ne(?:\\.a|[di])?|nz(?:\\.[at])?|z(?:\\.[at])?)?)(?-i)\\b",
    "testStrings": [
      "j", "ja", "jeq", "jeq.a", "jge", "jge.u", "jgez", "jgtz", "ji", "jl", "jla", "jlez", "jli", "jlt",
      "jlt.u", "jltz", "jne", "jne.a", "jned", "jnei", "jnz", "jnz.a", "jnz.t", "jz", "jz.a", "jz.t",
      "J", "JA", "JEQ", "JEQ.A", "JGE", "JGE.U", "JGEZ", "JGTZ", "JI", "JL", "JLA", "JLEZ", "JLI", "JLT",
      "JLT.U", "JLTZ", "JNE", "JNE.A", "JNED", "JNEI", "JNZ", "JNZ.A", "JNZ.T", "JZ", "JZ.A", "JZ.T"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.branch.call-return.tricore",
    "pattern": "\\b(?i)(?:f?(?:call[ai]?|ret)|rf[em])(?-i)\\b",
    "testStrings": [
      "call", "calla", "calli", "ret", "rfe", "rfm", "fcall", "fcalla", "fcalli", "fret",
      "CALL", "CALLA", "CALLI", "RET", "RFE", "RFM", "FCALL", "FCALLA", "FCALLI", "FRET"
    ]
  },
  {
    "name": "support.function.mnemonic.general-purpose.branch.loop.tricore",
    "pattern": "\\b(?i)(?:loopu?)(?-i)\\b",
    "testStrings": [
      "loop", "loopu", "LOOP", "LOOPU"
    ]
  },
  {
    "name": "support.function.mnemonic.general-prupose.load.tricore",
    "pattern": "\\b(?i)(?:ld(?:\\.(?:[aqw]|bu?|da?|hu?)|[lu]cx|mst))(?-i)\\b",
    "testStrings": [
      "ld.a", "ld.b", "ld.bu", "ld.d", "ld.da", "ld.h", "ld.hu", "ld.q", "ld.w", "ldlcx", "ldmst", "lducx",
      "LD.A", "LD.B", "LD.BU", "LD.D", "LD.DA", "LD.H", "LD.HU", "LD.Q", "LD.W", "LDLCX", "LDMST", "LDUCX"
    ]
  },
  {
    "name": "support.function.mnemonic.general-prupose.store.tricore",
    "pattern": "\\b(?i)(?:st(?:\\.(?:[abhqtw]|da?)|[lu]cx)|swap(?:msk)?\\.w|cmpswap.w)(?-i)\\b",
    "testStrings": [
      "st.a", "st.b", "st.d", "st.da", "st.h", "st.q", "st.t", "st.w", "stlcx", "stucx", "swap.w", "cmpswap.w", "swapmsk.w", 
      "ST.A", "ST.B", "ST.D", "ST.DA", "ST.H", "ST.Q", "ST.T", "ST.W", "STLCX", "STUCX", "SWAP.W", "CMPSWAP.w", "SWAPMSK.W"
    ]
  },
  {
    "name": "support.function.mnemonic.general-prupose.context-related.tricore",
    "pattern": "\\b(?i)(?:(?:sv|rs)lcx|bisr)(?-i)\\b",
    "testStrings": [
      "svlcx", "rslcx", "bisr", "SVLCX", "RSLCX", "BISR"
    ]
  },
  {
    "name": "support.function.mnemonic.system.tricore",
    "pattern": "\\b(?i)(?:syscall|[di]sync|(?:en|dis)able|nop|debug|restore|wait)(?-i)\\b",
    "testStrings": [
      "syscall", "dsync", "isync", "enable", "disable", "nop", "debug", "restore", "wait",
      "SYSCALL", "DSYNC", "ISYNC", "ENABLE", "DISABLE", "NOP", "DEBUG", "RESTORE", "WAIT"
    ]
  },
  {
    "name": "support.function.mnemonic.cache.tricore",
    "pattern": "\\b(?i)(?:cache[ai]\\.(?:i|wi?))(?-i)\\b",
    "testStrings": [
      "cachea.i", "cachea.w", "cachea.wi", "cachei.i", "cachei.w", "cachei.wi",
      "CACHEA.I", "CACHEA.W", "CACHEA.WI", "CACHEI.I", "CACHEI.W", "CACHEI.WI"
    ]
  },
  {
    "name": "support.function.mnemonic.arithmetic.float.tricore",
    "pattern": "\\b(?i)(?:fto(?:(?:i|q31|u)z?|hp)|(?:[iu]|q31|hp)tof|(?:un)?pack|(?:cmp|qseed)\\.f)(?-i)\\b",
    "testStrings": [
      "cmp.f", "ftoi", "ftoiz", "ftoq31", "ftoq31z", "ftou", "ftouz", "itof", "q31tof", "qseed.f", "utof", "pack", "unpack", "ftohp", "hptof",
      "CMP.F", "FTOI", "FTOIZ", "FTOQ31", "FTOQ31Z", "FTOU", "FTOUZ", "ITOF", "Q31TOF", "QSEED.F", "UTOF", "PACK", "UNPACK", "FTOHP", "HPTOF"
    ]
  }
]