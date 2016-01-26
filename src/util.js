import _ from 'lodash';

function getSource() {
  return this._owner.getSource(this);
}

function setSource(text) {
  this._owner.setSource(this, text);
}

function nodeContains(big, small) {
  return big.range[0] <= small.range[0] && small.range[1] <= big.range[1];
}

function isNodePosition(sibling, node) {
  return sibling.range[0] >= node.range[1];
}

function _insertNode(parent, child) {
  if (!parent._child.length) {
    child._parent = parent;
    parent._child.push(child);
    return;
  }
  let nextLevel = false;
  const index = _.findIndex(parent._child, big => {
    if (nodeContains(big, child)) {
      _insertNode(big, child);
      nextLevel = true;
      return true;
    }
    return isNodePosition(big, child);
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

function insertNode(node, parent) {
  node._owner = parent._owner;
  node._child = [];
  node._next = null;
  node._prev = null;
  node.getSource = getSource;
  node.setSource = setSource;
  _insertNode(parent._owner.root, node);
}


export {
  getSource,
  setSource,
  insertNode,
};
