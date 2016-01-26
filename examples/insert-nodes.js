const _ = require('lodash');
const chiles = require('../dist/chiles.js');

const src = `
//i1
function abc(a, b) {
  //i2
}
//i3
`;

const doc = chiles(src);

console.log(doc.repr());
console.log(doc.toString());

doc.walkPostOrder(n => {
  if (n.type === 'Line') {
    doc.insert('// another\n', n.range[0]);
    n.setSource(`// -> (${n.value})`);
  }
});

console.log(doc.repr());
console.log(doc.toString());
