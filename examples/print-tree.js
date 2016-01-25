const chiles = require('../dist/chiles.js');

const src = `
//i1
/*b1*/
function /*b1*/ abc(a, b) /*b3*/ {
  if /*b4*/ (true) /*b5*/ {
    //i2
    return 'no';
  } /*b6*/ else /*b7*/ {
    //i3
  }
  //i4
}
//i5
var a = 5;
//i6
`;

const doc = chiles(src);
console.log(doc.repr());
