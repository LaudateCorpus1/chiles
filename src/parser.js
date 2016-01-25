import * as esprima from 'esprima';
import _ from 'lodash';
import Document from './document.js';


function getSource() {
  return this._owner.getSource(this);
}

function setSource(text) {
  this._owner.setSource(this, text);
}


class Parser {

  constructor(text) {
    this.text = text;
    this.doc = new Document(text.split(''));
    this.links = ['_owner', '_parent', '_child', '_next', '_prev'];
  }

  parse() {
    const data = esprima.parse(this.text, {
      sourceType: 'module',
      range: true,
      loc: true,
      attachComment: true,
    });
    // Modifying the range to be able to capture all the comments
    if (data.type === 'Program') {
      data.range[0] = 0;
      data.range[1] = this.text.length;
    }
    this.doc.root.getSource = getSource;
    this.doc.root.setSource = setSource;
    this.doc.root._parent = this.doc.root;
    this.link(data, this.doc.root);
    return this.doc;
  }

  appendNode(node, parent) {
    node._owner = this.doc;
    node._child = [];
    node._next = null;
    node._prev = null;
    node.getSource = getSource;
    node.setSource = setSource;
    this.insertNode(this.doc.root, node);
  }

  link(node, parent) {
    this.appendNode(node, parent);
    _.each(_.keys(node), (key) => {
      if (_.indexOf(this.links, key) > -1 || _.includes(key, 'Comments')) {
        return;
      }
      const child = node[key];
      if (_.isArray(child)) {
        _.each(child, (c) => {
          if (c && typeof c.type === 'string') {
            this.link(c, node);
          }
        });
      } else if (child && typeof child.type === 'string') {
        this.link(child, node);
      }
    });
  }

  nodeContains(big, small) {
    return big.range[0] <= small.range[0] && small.range[1] <= big.range[1];
  }

  isNodePosition(sibling, node) {
    return sibling.range[0] > node.range[1];
  }

  insertNode(parent, child) {
    if (!parent._child.length) {
      child._parent = parent;
      parent._child.push(child);
      return;
    }
    let nextLevel = false;
    const index = _.findIndex(parent._child, big => {
      if (this.nodeContains(big, child)) {
        this.insertNode(big, child);
        nextLevel = true;
        return true;
      }
      return this.isNodePosition(big, child);
    });
    if (!nextLevel) {
      if (index > -1) {
        parent._child.splice(index, 0, child);
        if (index > 0) {
          parent._child[index - 1]._next = child;
          child._prev = parent._child[index - 1];
        }
        child._next = parent._child[index + 1];
        parent._child[index + 1]._prev = child;
      } else {
        const last = _.last(parent._child);
        last._next = child;
        child._prev = last;
        parent._child.push(child);
      }
      child._parent = parent;
    }
  }

}

export default Parser;
