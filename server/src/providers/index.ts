import { Context } from "../context";
import {
	ClientCapabilities,
	Connection,
	ServerCapabilities
} from "vscode-languageserver";

import TextDocumentSyncProvider from "./textDocumentSyncProvider";

export interface Provider {
	register (
		connection: Connection,
		ClientCapabilities: ClientCapabilities
	): ServerCapabilities;
}

const providers = [
	TextDocumentSyncProvider,
];

export default function registerProviders(
	connection: Connection,
	ctx: Context,
	clientCapabilities: ClientCapabilities
): ServerCapabilities {
	return providers.reduce((acc, P) => {
		const p = new P(ctx);
		const c = p.register(connection, clientCapabilities);
		return Object.assign(acc, c);
	}, {});
}