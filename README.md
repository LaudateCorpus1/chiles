# Chiles

Wrapper around [esprima](https://www.npmjs.com/package/esprima) to modify javascript documents.

# example

Modify inline comments and add comment extra comments before each comment.

``` js
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
    doc.update('\n', n.range[0], n.range[0], null);
    newNodes.push(doc.insert(`// ADDED: ${n.value}`, n.range[0] - 1));
    n.setSource(`// -> (${n.value})`);
  }
});

console.log(doc.repr());
console.log(doc.toString());

_.each(newNodes, n => {
  console.log([n.getSource()]);
});
```

output:

```
[0 - 41]: Document
  [0 - 41]: Program
    [1 - 5]: Line
    [6 - 35]: FunctionDeclaration
      [15 - 18]: Identifier
      [19 - 20]: Identifier
      [22 - 23]: Identifier
      [25 - 35]: BlockStatement
        [29 - 33]: Line
    [36 - 40]: Line

//i1
function abc(a, b) {
  //i2
}
//i3

[0 - 98]: Document
  [0 - 98]: Program
    [1 - 13]: _Unknown
    [14 - 24]: Line
    [25 - 73]: FunctionDeclaration
      [34 - 37]: Identifier
      [38 - 39]: Identifier
      [41 - 42]: Identifier
      [44 - 73]: BlockStatement
        [48 - 60]: _Unknown
        [61 - 71]: Line
    [74 - 86]: _Unknown
    [87 - 97]: Line

// ADDED: i1
// -> (i1)
function abc(a, b) {
  // ADDED: i2
// -> (i2)
}
// ADDED: i3
// -> (i3)

[ '// ADDED: i1' ]
[ '// ADDED: i2' ]
[ '// ADDED: i3' ]
```

# methods

``` js
const chiles = require('chiles');
```

## chiles(src)

Parse the string source `src` with esprima, returns a single `Document` object which can
be used to modify the original source.

## Document

A document object has the following methods:

`str(start, end)`: returns a substring from the source with the specified endpoints.

`repr()`: Utility function displaying all the changes and the node types for the document.

`walkPostOrder(fn)`: Walks through the document and executes the function `fn` on a node only
 after all its children have been visited. The function `fn` takes in paramters `node` and `level`.
 
`insert(text, start, type = 'Unknown')`: Inserts the text `text` at the index spefied by `start`.
We may optionally specified the type of node that corresponds to the inserted text.

`update(text, start, end, type = 'Unknown')`: Replace a substring from the source with the specified
text. Usually useful when modifying a piece of text that has not yet been claimed by a node.

*WARNING:* At the moment there is no checks to make sure that the range we are modifying does not
belong to another node. 

`toString()`: Obtain the current document as a string.

## nodes

Each node in a Document has the following properties:

`_prev`:

`_next`:

`_child`:

`_parent`:

`_owner`:

`setSource`:

`getSource`:

# install

With npm:

```
npm install chiles
```
