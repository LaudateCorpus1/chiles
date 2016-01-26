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

const newNodes = [];
doc.walkPostOrder(n => {
  if (n.type === 'Line') {
    newNodes.push(doc.insert(`// ADDED: ${n.value}\n`, n.range[0]));
    n.setSource(`// -> (${n.value})`);
  }
});

console.log(doc.repr());
console.log(doc.toString());

_.each(newNodes, n => {
  console.log([n.getSource()]);
});
