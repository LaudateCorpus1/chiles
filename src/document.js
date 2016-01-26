import _ from 'lodash';
import {insertNode} from './util.js';


function makeNode(type, range) {
  return {
    type: '_' + type,
    range,
  };
}


class Document {

  constructor(chunks) {
    this.chunks = chunks;
    this.root = {
      type: 'Document',
      range: [0, chunks.length],
      _owner: this,
      _parent: null,
      _next: null,
      _prev: null,
      _child: [],
    };
  }

  getSourceFrom(start, end) {
    return this.chunks.slice(start, end).join('');
  }

  getSource(node) {
    return this.chunks.slice(...node.range).join('');
  }

  setSource(node, text) {
    this.update(text, node.range[0], node.range[1]);
    // Children may have been removed or simply not aligned with their range
    node._child = [];
  }

  repr() {
    const result = [];
    const fn = (node, level) => {
      const r = node.range;
      result.push(_.repeat('  ', level) + `[${r[0]} - ${r[1]}]: ${node.type}`);
    };
    this.walk(fn);
    return result.join('\n');
  }

  walkPostOrder(fn) {
    let level = 0;
    let crt = this.root;
    let loop = true;
    while (loop) {
      if (crt._child.length) {
        crt = crt._child[0];
        level += 1;
      } else {
        fn(crt, level);
        while (crt._next === null) {
          crt = crt._parent;
          level -= 1;
          fn(crt, level);
          if (crt === this.root) {
            loop = false;
            return this;
          }
        }
        crt = crt._next;
      }
    }
  }

  walk(fn) {
    let level = 0;
    let crt = this.root;
    let loop = true;
    while (loop) {
      fn(crt, level);
      if (crt._child.length) {
        crt = crt._child[0];
        level += 1;
      } else {
        while (crt._next === null) {
          crt = crt._parent;
          level -= 1;
          if (crt === this.root) {
            loop = false;
            return this;
          }
        }
        crt = crt._next;
      }
    }
  }

  walkRec(fn) {
    function rec(node, level, callback) {
      callback(node, level);
      _.each(node._child, c => {
        rec(c, level + 1, callback);
      });
    }
    rec(this.root, 0, fn);
  }

  insert(text, start, type = 'Unknown') {
    this.update(text, start, start);
    const newNode = {
      type: '_' + type,
      range: [start, start + text.length],
    };
    insertNode(newNode, this.root);
    return newNode;
  }

  update(text, start, end) {
    const chunks = this.chunks;
    const chunk = text.split('');
    const left = chunks.slice(0, start);
    const right = chunks.slice(end);
    const delta = chunk.length - (end - start);
    chunks.splice(0, chunks.length);
    chunks.push(...left, ...chunk, ...right);
    let n = this.root;
    let r;
    let updated;
    let loop = true;
    while (loop) {
      r = n.range;
      updated = false;
      if (r[1] >= end) {
        r[1] += delta;
        updated = true;
      }
      if (r[0] >= end) {
        r[0] += delta;
        updated = true;
      }
      if (n._child.length && updated) {
        n = n._child[0];
      } else {
        while (n._next === null) {
          n = n._parent;
          if (n === this.root) {
            loop = false;
            return this;
          }
        }
        n = n._next;
      }
    }
  }

  toString() {
    return this.chunks.join('');
  }

}

export default Document;
