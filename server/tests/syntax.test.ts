import { join } from "path";
import { readFileSync } from "fs";
import { loadWASM, createOnigScanner } from "vscode-oniguruma";
import { testDatas } from "./tricoreAsmSyntax";

function regularTest(pattern: string, testStrings: string[]): boolean {
  const scanner = createOnigScanner([pattern]);
  // if (testStrings.length === 0) return false;
  for (const str of testStrings) {
    if (scanner.findNextMatchSync(str, 0) === null) {
      return false;
    };
  }
  return true;
}

beforeAll(async () => {
  return await loadWASM(readFileSync(join(__dirname, "../../node_modules/vscode-oniguruma/release/onig.wasm")));
});

describe.each(testDatas)("Tricore Syntax Highlight", (data) => {
  const { name, pattern, testStrings } = data
  test(name, () => {
    expect(regularTest(pattern, testStrings)).toEqual(true);
  });
});
