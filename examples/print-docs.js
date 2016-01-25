const _ = require('lodash');
const chiles = require('../dist/chiles.js');

const src = `
// eslint-disable
/**
 * Class comment
 */
class A {

  constructor() {
  }

  /**
   * Method A comment
   */
  methodA() {
  }

}
`;

const doc = chiles(src);
console.log(doc.repr());


doc.walk(n => {
  var comment = null;
  if (n.type === 'ClassDeclaration') {
    comment = _.last(n.leadingComments);
    console.log('Class Name: ', n.id.name);
    console.log(comment.getSource());
  } else if (n.type === 'MethodDefinition') {
    comment = _.last(n.leadingComments);
    console.log('Method Name: ', n.key.name);
    if (comment) {
      console.log(comment.getSource());
    }
  }
});
