import Parser from '../src/parser.js';


/* eslint-env jasmine */
/* eslint-disable padded-blocks */
describe('parser module:', () => {

  const src1 = `
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
  const repr1 = `[0 - 170]: Document
  [0 - 170]: Program
    [1 - 5]: Line
    [6 - 12]: Block
    [13 - 148]: FunctionDeclaration
      [22 - 28]: Block
      [29 - 32]: Identifier
      [33 - 34]: Identifier
      [36 - 37]: Identifier
      [39 - 45]: Block
      [46 - 148]: BlockStatement
        [50 - 139]: IfStatement
          [53 - 59]: Block
          [61 - 65]: Literal
          [67 - 73]: Block
          [74 - 105]: BlockStatement
            [80 - 84]: Line
            [89 - 101]: ReturnStatement
              [96 - 100]: Literal
          [106 - 112]: Block
          [118 - 124]: Block
          [125 - 139]: BlockStatement
            [131 - 135]: Line
        [142 - 146]: Line
    [149 - 153]: Line
    [154 - 164]: VariableDeclaration
      [158 - 163]: VariableDeclarator
        [158 - 159]: Identifier
        [162 - 163]: Literal
    [165 - 169]: Line`;
  const doc1 = new Parser(src1).parse();


  describe('function parse', () => {

    it('should create a valid tree with all its comments.', () => {
      const root = doc1.root;
      expect(root.type).toEqual('Document');
      expect(root._child[0].type).toEqual('Program');

      const fn = root._child[0]._child[2];
      expect(fn.type).toEqual('FunctionDeclaration');
      expect(fn._child[5].type).toEqual('BlockStatement');
    });

  });


  describe('Document.repr', () => {

    it('should create a string representation of the ranges.', () => {
      expect(doc1.repr()).toEqual(repr1);
    });

  });

});
