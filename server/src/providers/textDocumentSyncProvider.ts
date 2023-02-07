import * as lsp from "vscode-languageserver";
import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver";
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser = require("web-tree-sitter");

import { Provider } from '.';
import Analyzer from "../analyzer";
import { Context } from '../context';
import DocumentProcessor, { ProcessedDocument } from "../documentProcessor"; 
import { nodeAsRange, positionToPoint } from "../utils";

export default class TextDocumentSyncProvider implements Provider {
	private connection: lsp.Connection;
	private processor: DocumentProcessor;
	private language: Parser.Language;

	constructor(protected readonly ctx: Context) {
		this.connection = ctx.connection;
		this.processor = new DocumentProcessor(ctx);
		this.language = ctx.language;
	}

	onDidOpenTextDocument({
		textDocument: { uri, languageId, text, version },
	}: lsp.DidOpenTextDocumentParams) {
		const document = TextDocument.create(uri, languageId, version, text );
		const result = this.processor.process(document);
		this.handleDiagnostics(result, uri);
	}

	onDidChangeTextDocument({
		textDocument: { uri, version },
		contentChanges,
	}: lsp.DidChangeTextDocumentParams) {
		const existing = this.ctx.store.get(uri);
		if (!existing) {
			return;
		}
		const { document, tree } = existing;

		const allIncremental = contentChanges.every(
      lsp.TextDocumentContentChangeEvent.isIncremental
    );

    if (tree && allIncremental) {
      contentChanges
        .sort(
          (a, b) =>
            b.range.start.line - a.range.start.line ||
            b.range.start.character - a.range.start.character
        )
        .forEach((c) => tree.edit(this.changeToEdit(document, c)));
    }

		const updatedDoc = TextDocument.update(document, contentChanges, version);
		const result = this.processor.process(updatedDoc, tree);
		this.handleDiagnostics(result, uri);
	}

	onDidSaveTextDocument({
		textDocument: { uri },
	}: lsp.DidSaveTextDocumentParams) {
		const existing = this.ctx.store.get(uri);
		if (!existing) {
			return;
		}
		
		const result = this.processor.process(existing.document);
		this.handleDiagnostics(result, uri);
	}

  changeToEdit(
    document: TextDocument,
    change: lsp.TextDocumentContentChangeEvent
  ): Parser.Edit {
    if (!lsp.TextDocumentContentChangeEvent.isIncremental(change)) {
      throw new Error("Not incremental");
    }
    const rangeOffset = document.offsetAt(change.range.start);
    const rangeLength = document.offsetAt(change.range.end) - rangeOffset;
    return {
      startPosition: positionToPoint(change.range.start),
      oldEndPosition: positionToPoint(change.range.end),
      newEndPosition: positionToPoint(
        document.positionAt(rangeOffset + change.text.length)
      ),
      startIndex: rangeOffset,
      oldEndIndex: rangeOffset + rangeLength,
      newEndIndex: rangeOffset + change.text.length,
    };
  }

	handleDiagnostics(result: ProcessedDocument, uri: string) {
		const parseDiagnostics = this.parserDiagnostics(result.tree);
		const analyzer = new Analyzer();
		const analyzeDiagnostics = analyzer.analyze(result.tree);
		this.connection.sendDiagnostics({
			uri,
			diagnostics: [...parseDiagnostics, ...analyzeDiagnostics]
		});
	}

	parserDiagnostics(tree: Parser.Tree): Diagnostic[] {
		const errorQuery = this.language.query(`(ERROR) @error`);
		const diagnostics = errorQuery.captures(tree.rootNode).map(
			({ node }): Diagnostic => ({
				range: nodeAsRange(node),
        message: `parse error: "${node.text}" unexpected`,
        severity: DiagnosticSeverity.Error,
        source: "tricore.tasking",
			})
		);
		return diagnostics;
	}

	register(connection: lsp.Connection, capabilities: lsp.ClientCapabilities): lsp.ServerCapabilities<any> {
		connection.onDidOpenTextDocument(this.onDidOpenTextDocument.bind(this));
		connection.onDidChangeTextDocument(this.onDidChangeTextDocument.bind(this));
		connection.onDidSaveTextDocument(this.onDidSaveTextDocument.bind(this));
		return {
			textDocumentSync: lsp.TextDocumentSyncKind.Incremental,
		};
	}
}