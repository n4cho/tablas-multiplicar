const test = require("node:test");
const assert = require("node:assert/strict");
const { parseSpokenNumber, parseChineseNumber, buildNumberWords } = require("../game-logic.js");

const NUMBER_WORDS = buildNumberWords();

test("parseChineseNumber() parses digits and units", () => {
  assert.equal(parseChineseNumber("二十二"), 22);
  assert.equal(parseChineseNumber("十"), 10);
  assert.equal(parseChineseNumber("五十六"), 56);
  assert.equal(parseChineseNumber("九"), 9);
  assert.equal(parseChineseNumber("abc"), null);
});

test("parseSpokenNumber() falls back to digit matches regardless of language", () => {
  assert.equal(parseSpokenNumber("42", "es", NUMBER_WORDS), 42);
  assert.equal(parseSpokenNumber("son 7 manzanas", "en", NUMBER_WORDS), 7);
});

const cases = [
  ["es", "veintidós", 22],
  ["es", "veintidos", 22],
  ["es", "treinta y dos", 32],
  ["es", "cuarenta y cinco", 45],
  ["en", "twenty-two", 22],
  ["en", "forty five", 45],
  ["en", "twenty one", 21],
  ["de", "zweiundzwanzig", 22],
  ["de", "einundzwanzig", 21],
  ["de", "zehn", 10],
  ["zh", "二十二", 22],
  ["zh", "十", 10],
  ["zh", "五十六", 56]
];

for (const [language, transcript, expected] of cases) {
  test(`parseSpokenNumber("${transcript}", "${language}") === ${expected}`, () => {
    assert.equal(parseSpokenNumber(transcript, language, NUMBER_WORDS), expected);
  });
}

test("parseSpokenNumber() returns null for unrecognized input", () => {
  assert.equal(parseSpokenNumber("blablabla", "es", NUMBER_WORDS), null);
  assert.equal(parseSpokenNumber("xyz", "de", NUMBER_WORDS), null);
});
