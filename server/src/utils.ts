import * as lsp from "vscode-languageserver";
import * as Parser from "web-tree-sitter";

/**
 * Get language-server range of tree-sitter node
 */
export function nodeAsRange(node: Parser.SyntaxNode): lsp.Range {
  return lsp.Range.create(
    node.startPosition.row,
    node.startPosition.column,
    node.endPosition.row,
    node.endPosition.column
  );
}

export function positionToPoint(position: lsp.Position): Parser.Point {
  const { line: row, character: column } = position;
  return { row, column };
}