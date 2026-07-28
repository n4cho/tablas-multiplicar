// Lógica pura del juego (sin DOM ni APIs de navegador), compartida entre
// index.html (cargado como <script>) y los tests (cargado con require()).
(function (root) {
  "use strict";

  // ---------- Generación de preguntas ----------
  // Las combinaciones se reparten como una baraja (sin repetir) hasta agotarla y
  // volver a barajar; así no salen "8×7" y "7×8" seguidas dentro de la misma fase.
  function createFactDeck(min, max, rng) {
    rng = rng || Math.random;
    let queue = [];

    function reshuffle() {
      const facts = [];
      for (let x = min; x <= max; x++) {
        for (let y = x; y <= max; y++) {
          facts.push([x, y]);
        }
      }
      for (let i = facts.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [facts[i], facts[j]] = [facts[j], facts[i]];
      }
      queue = facts;
    }

    function draw() {
      if (queue.length === 0) reshuffle();
      const [x, y] = queue.pop();
      return rng() < 0.5 ? [x, y] : [y, x];
    }

    return { draw, reshuffle };
  }

  function generateQuestion(deck, previous) {
    let [a, b] = deck.draw();
    if (previous && a === previous.a && b === previous.b) {
      [a, b] = deck.draw();
    }
    return { a, b, product: a * b };
  }

  // ---------- Números hablados por idioma (respaldo cuando el motor de voz
  // transcribe palabras en vez de dígitos) ----------
  function buildNumberWords() {
    const NUMBER_WORDS = {
      es: {
        "cero": 0, "uno": 1, "una": 1, "un": 1, "dos": 2, "tres": 3, "cuatro": 4, "cinco": 5,
        "seis": 6, "siete": 7, "ocho": 8, "nueve": 9, "diez": 10, "once": 11, "doce": 12,
        "trece": 13, "catorce": 14, "quince": 15, "dieciseis": 16, "dieciséis": 16,
        "diecisiete": 17, "dieciocho": 18, "diecinueve": 19, "veinte": 20,
        "veintiuno": 21, "veintidos": 22, "veintidós": 22, "veintitres": 23, "veintitrés": 23,
        "veinticuatro": 24, "veinticinco": 25, "veintiseis": 26, "veintiséis": 26,
        "veintisiete": 27, "veintiocho": 28, "veintinueve": 29,
        "treinta": 30, "cuarenta": 40, "cincuenta": 50, "sesenta": 60,
        "setenta": 70, "ochenta": 80, "noventa": 90, "cien": 100
      },
      en: {
        "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7,
        "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12, "thirteen": 13,
        "fourteen": 14, "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18,
        "nineteen": 19, "twenty": 20, "thirty": 30, "forty": 40, "fifty": 50, "sixty": 60,
        "seventy": 70, "eighty": 80, "ninety": 90, "hundred": 100
      },
      de: {} // se genera abajo (números compuestos alemanes son una sola palabra)
    };

    const ones = ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];
    const onesStandalone = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];
    const teens = ["zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn"];
    const tens = ["", "", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];
    const map = NUMBER_WORDS.de;
    onesStandalone.forEach((w, i) => { map[w] = i; });
    teens.forEach((w, i) => { map[w] = 10 + i; });
    for (let ten = 2; ten <= 9; ten++) {
      map[tens[ten]] = ten * 10;
      for (let one = 1; one <= 9; one++) {
        map[ones[one] + "und" + tens[ten]] = ten * 10 + one;
      }
    }
    map["hundert"] = 100;
    map["einhundert"] = 100;

    return NUMBER_WORDS;
  }

  const CN_DIGITS = { "零": 0, "一": 1, "二": 2, "两": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9 };
  const CN_UNITS = { "十": 10, "百": 100 };

  function parseChineseNumber(text) {
    const chars = Array.from(text).filter((c) => c in CN_DIGITS || c in CN_UNITS);
    if (chars.length === 0) return null;
    let total = 0;
    let section = 0;
    for (const ch of chars) {
      if (ch in CN_DIGITS) {
        section = CN_DIGITS[ch];
      } else {
        const unit = CN_UNITS[ch];
        if (unit === 10 && section === 0) section = 1; // "十" solo = 10
        total += section * unit;
        section = 0;
      }
    }
    total += section;
    return total;
  }

  function parseSpokenNumber(transcript, language, numberWords) {
    const cleaned = transcript.toLowerCase().trim();

    const digitMatch = cleaned.match(/\d+/);
    if (digitMatch) return parseInt(digitMatch[0], 10);

    if (language === "zh") return parseChineseNumber(cleaned);

    const wordMap = numberWords[language] || numberWords.es;

    if (language === "de") {
      // Los compuestos alemanes van en una sola palabra: basta con localizarla.
      const words = cleaned.replace(/[.,]/g, "").split(/\s+/);
      for (const w of words) {
        if (w in wordMap) return wordMap[w];
      }
      return null;
    }

    const words = cleaned.replace(/[.,-]/g, " ").split(/\s+/).filter(Boolean);
    let total = null;
    for (const word of words) {
      if (word === "y" || word === "and") continue;
      if (word in wordMap) {
        const val = wordMap[word];
        if (val === 100 && total !== null && total > 0 && total < 10) {
          total = total * 100; // p.ej. "one" + "hundred"
        } else if (total === null) {
          total = val;
        } else if (total % 10 === 0 && total < 100 && val < 10) {
          total += val; // p.ej. "treinta" + "y dos" / "twenty" + "one"
        } else {
          total = val;
        }
      }
    }
    return total;
  }

  const GameLogic = {
    createFactDeck,
    generateQuestion,
    buildNumberWords,
    CN_DIGITS,
    CN_UNITS,
    parseChineseNumber,
    parseSpokenNumber
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = GameLogic;
  } else {
    root.GameLogic = GameLogic;
  }
})(typeof window !== "undefined" ? window : globalThis);
