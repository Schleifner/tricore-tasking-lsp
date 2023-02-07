import * as lsp from "vscode-languageserver";
import * as Parser from "web-tree-sitter";
import * as path from "path";

import { ProcessedDocumentStore } from './documentProcessor';

export interface Context {
	store: ProcessedDocumentStore;
	language: Parser.Language;
	logger: lsp.Logger;
	connection: lsp.Connection;
}

let language: Parser.Language;

export async function createContext(
	logger: lsp.Logger,
	connection: lsp.Connection,
): Promise<Context> {
	if (!language) {
		await Parser.init();
		language = await Parser.Language.load(
			path.join(__dirname, "..", "wasm", "tree-sitter-tricore.wasm")
		);
	}

	return {
		store: new Map(),
		language,
		logger,
		connection,
	};
}