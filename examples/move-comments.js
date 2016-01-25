const _ = require('lodash');
const chiles = require('../dist/chiles.js');

const src = `
var a = new Class(
/**
 * Class comment
 */
{

  method() {}

});
`;

const doc = chiles(src);
console.log(doc.repr());


doc.walk(n => {
  if (n.type === 'NewExpression') {
    const identifier = n._child[0];
    const comment = n._child[1];
    const object = n._child[2];
    const value = comment.getSource();
    comment.setSource('');
    doc.update('', identifier.range[1] + 1, object.range[0]);
    doc.insert(value + '\n', n._parent._parent.range[0]);
  }
});

console.log(doc.toString());
console.log(doc.repr());
