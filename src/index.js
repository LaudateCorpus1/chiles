import Parser from './parser.js';

function chiles(text) {
  return new Parser(text).parse();
}

module.exports = chiles;
