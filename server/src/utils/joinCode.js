const crypto = require("crypto");

/** Uppercase alphanumeric without ambiguous glyphs (length 8 for guessing resistance). */
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function makeJoinCode() {
  let out = "";
  for (let i = 0; i < 8; i += 1) {
    out += ALPHABET[crypto.randomInt(ALPHABET.length)];
  }
  return out;
}

module.exports = { makeJoinCode };
