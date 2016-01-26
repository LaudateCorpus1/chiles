import * as esprima from 'esprima';
import _ from 'lodash';
import {
  getSource,
  setSource,
  insertNode,
} from './util.js';
import Document from './document.js';


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
      attachComment: true,
    });
    // Modifying the range to be able to capture all the comments
    if (data.type === 'Program') {
      data.range[0] = 0;
      data.range[1] = this.text.length;
    }
    const root = this.doc.root;
    root.getSource = getSource;
    root.setSource = setSource;
    root._parent = root;
    this.link(data, root);
    return this.doc;
  }

  link(node, parent) {
    insertNode(node, parent);
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

}


export default Parser;
