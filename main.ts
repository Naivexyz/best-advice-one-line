// best-advice-one-line — entry for make.fun "The Best Advice I Ever Got".
//
// The program does exactly one thing: it writes a single sentence of advice,
// no longer than 200 characters, to entry.txt. The sentence is fixed in this
// file so every run produces byte-identical output.
//
// The line was chosen from five drafted candidates (see README.md). It won
// because it is the most earned and the most alive: a named person, a
// concrete circumstance that cost her something, and a closing turn that
// lands quietly instead of preaching.

import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The winning sentence. One sentence, one line, no trailing newline in the
// file itself. My grandmother raised six children on a nurse's wage; the
// advice carries that history in its first clause, then turns it into a
// warning with a sting in the tail.
const CHOSEN_LINE =
  "My grandmother, who raised six kids on a nurse's wage, told me: 'Never borrow money to look rich \u2014 the interest always finds you first.'";

// The competition's hard ceiling: a single sentence, at most 200 characters.
const CEILING = 200;

// Where the entry goes. The grader runs with /output; local runs can point
// elsewhere with MAKEFUN_OUTPUT_DIR so nothing is written outside a test
// directory by accident.
const TARGET_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const TARGET_FILE = join(TARGET_DIR, "entry.txt");

function countGlyphs(text: string): number {
  // Spread by code point, not UTF-16 unit, so an em dash or an accented
  // letter counts as the single character the reader sees.
  return [...text].length;
}

function guardLine(text: string): void {
  if (text.length === 0) {
    throw new Error("entry is empty");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be exactly one line");
  }
  // A single sentence ends with sentence-ending punctuation. If the line
  // were cut off or left open, the judge would read a fragment, not advice.
  if (!/[.!?]['"]?$/.test(text)) {
    throw new Error("entry must end with sentence-ending punctuation");
  }
  const size = countGlyphs(text);
  if (size > CEILING) {
    throw new Error(`entry is ${size} characters, over the ${CEILING} limit`);
  }
}

function main(): void {
  guardLine(CHOSEN_LINE);
  mkdirSync(TARGET_DIR, { recursive: true });
  writeFileSync(TARGET_FILE, CHOSEN_LINE, "utf8");
  chmodSync(TARGET_FILE, 0o644);
  console.log(
    `wrote ${TARGET_FILE} (${countGlyphs(CHOSEN_LINE)} characters, one line)`,
  );
}

main();
