import * as Parser from "web-tree-sitter";

import { TextDocument } from 'vscode-languageserver-textdocument';
import { Context } from "./context";

export interface ProcessedDocument {
	document: TextDocument;
	tree: Parser.Tree;
}

export type ProcessedDocumentStore = Map<string, ProcessedDocument>;

export default class DocumentProcessor {
	private parser: Parser;

	constructor(protected readonly ctx: Context) {
		this.parser = new Parser();
		this.parser.setLanguage(ctx.language);
	}

	process(
		document: TextDocument,
		oldTree?: Parser.Tree
	): ProcessedDocument {
		const tree = this.parser.parse(document.getText(), oldTree);

		if (oldTree) {
			oldTree.delete();
		}

		const processed: ProcessedDocument = {
			document,
			tree
		};

		this.ctx.store.set(document.uri, processed);
		
		return processed;
	}
}