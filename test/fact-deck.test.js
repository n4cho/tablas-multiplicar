const test = require("node:test");
const assert = require("node:assert/strict");
const { createFactDeck, generateQuestion } = require("../game-logic.js");

function comboKey(a, b) {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return `${lo}-${hi}`;
}

function expectedCombos(min, max) {
  const combos = [];
  for (let x = min; x <= max; x++) {
    for (let y = x; y <= max; y++) {
      combos.push(`${x}-${y}`);
    }
  }
  return combos.sort();
}

test("draw() stays within [min, max] and never repeats a combo within one full cycle", () => {
  const min = 1;
  const max = 4;
  const deck = createFactDeck(min, max);
  const cycleLength = expectedCombos(min, max).length;

  for (let cycle = 0; cycle < 3; cycle++) {
    const seen = new Set();
    for (let i = 0; i < cycleLength; i++) {
      const [a, b] = deck.draw();
      assert.ok(a >= min && a <= max, `a=${a} out of range`);
      assert.ok(b >= min && b <= max, `b=${b} out of range`);
      const key = comboKey(a, b);
      assert.ok(!seen.has(key), `combo ${key} repeated within a single cycle`);
      seen.add(key);
    }
    assert.deepEqual([...seen].sort(), expectedCombos(min, max));
  }
});

test("generateQuestion() computes product = a * b", () => {
  const deck = createFactDeck(2, 10);
  for (let i = 0; i < 20; i++) {
    const q = generateQuestion(deck, null);
    assert.equal(q.product, q.a * q.b);
  }
});

test("generateQuestion() avoids an immediate repeat of the previous fact when possible", () => {
  const fakeDeck = {
    draws: [[1, 1], [2, 2]],
    draw() {
      return this.draws.shift();
    }
  };
  const previous = { a: 1, b: 1, product: 1 };

  const question = generateQuestion(fakeDeck, previous);

  assert.deepEqual(question, { a: 2, b: 2, product: 4 });
  assert.equal(fakeDeck.draws.length, 0, "should have drawn twice to skip the repeat");
});

test("generateQuestion() does not redraw when there is no previous fact", () => {
  const fakeDeck = {
    draws: [[3, 4]],
    draw() {
      return this.draws.shift();
    }
  };

  const question = generateQuestion(fakeDeck, null);

  assert.deepEqual(question, { a: 3, b: 4, product: 12 });
});
