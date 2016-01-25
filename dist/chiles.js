module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _parser = __webpack_require__(1);

	var _parser2 = _interopRequireDefault(_parser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function chiles(text) {
	  return new _parser2.default(text).parse();
	}

	module.exports = chiles;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _esprima = __webpack_require__(2);

	var esprima = _interopRequireWildcard(_esprima);

	var _lodash = __webpack_require__(3);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _document = __webpack_require__(4);

	var _document2 = _interopRequireDefault(_document);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function getSource() {
	  return this._owner.getSource(this);
	}

	function setSource(text) {
	  this._owner.setSource(this, text);
	}

	var Parser = function () {
	  function Parser(text) {
	    _classCallCheck(this, Parser);

	    this.text = text;
	    this.doc = new _document2.default(text.split(''));
	    this.links = ['_owner', '_parent', '_child', '_next', '_prev'];
	  }

	  _createClass(Parser, [{
	    key: 'parse',
	    value: function parse() {
	      var data = esprima.parse(this.text, {
	        sourceType: 'module',
	        range: true,
	        loc: true,
	        attachComment: true
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
	  }, {
	    key: 'appendNode',
	    value: function appendNode(node, parent) {
	      node._owner = this.doc;
	      node._child = [];
	      node._next = null;
	      node._prev = null;
	      node.getSource = getSource;
	      node.setSource = setSource;
	      this.insertNode(this.doc.root, node);
	    }
	  }, {
	    key: 'link',
	    value: function link(node, parent) {
	      var _this = this;

	      this.appendNode(node, parent);
	      _lodash2.default.each(_lodash2.default.keys(node), function (key) {
	        if (_lodash2.default.indexOf(_this.links, key) > -1 || _lodash2.default.includes(key, 'Comments')) {
	          return;
	        }
	        var child = node[key];
	        if (_lodash2.default.isArray(child)) {
	          _lodash2.default.each(child, function (c) {
	            if (c && typeof c.type === 'string') {
	              _this.link(c, node);
	            }
	          });
	        } else if (child && typeof child.type === 'string') {
	          _this.link(child, node);
	        }
	      });
	    }
	  }, {
	    key: 'nodeContains',
	    value: function nodeContains(big, small) {
	      return big.range[0] <= small.range[0] && small.range[1] <= big.range[1];
	    }
	  }, {
	    key: 'isNodePosition',
	    value: function isNodePosition(sibling, node) {
	      return sibling.range[0] > node.range[1];
	    }
	  }, {
	    key: 'insertNode',
	    value: function insertNode(parent, child) {
	      var _this2 = this;

	      if (!parent._child.length) {
	        child._parent = parent;
	        parent._child.push(child);
	        return;
	      }
	      var nextLevel = false;
	      var index = _lodash2.default.findIndex(parent._child, function (big) {
	        if (_this2.nodeContains(big, child)) {
	          _this2.insertNode(big, child);
	          nextLevel = true;
	          return true;
	        }
	        return _this2.isNodePosition(big, child);
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
	          var last = _lodash2.default.last(parent._child);
	          last._next = child;
	          child._prev = last;
	          parent._child.push(child);
	        }
	        child._parent = parent;
	      }
	    }
	  }]);

	  return Parser;
	}();

	exports.default = Parser;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("esprima");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _lodash = __webpack_require__(3);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Document = function () {
	  function Document(chunks) {
	    _classCallCheck(this, Document);

	    this.chunks = chunks;
	    this.root = {
	      type: 'Document',
	      range: [0, chunks.length],
	      _owner: this,
	      _parent: null,
	      _next: null,
	      _prev: null,
	      _child: []
	    };
	  }

	  _createClass(Document, [{
	    key: 'getSource',
	    value: function getSource(node) {
	      var _chunks;

	      return (_chunks = this.chunks).slice.apply(_chunks, _toConsumableArray(node.range)).join('');
	    }
	  }, {
	    key: 'setSource',
	    value: function setSource(node, text) {
	      this.update(text, node.range[0], node.range[1]);
	      // Children may have been removed or simply not aligned with their range
	      node._child = [];
	    }
	  }, {
	    key: 'repr',
	    value: function repr() {
	      var result = [];
	      var fn = function fn(node, level) {
	        var r = node.range;
	        result.push(_lodash2.default.repeat('  ', level) + ('[' + r[0] + ' - ' + r[1] + ']: ' + node.type));
	      };
	      this.walk(fn);
	      return result.join('\n');
	    }
	  }, {
	    key: 'walkPostOrder',
	    value: function walkPostOrder(fn) {
	      var level = 0;
	      var crt = this.root;
	      var loop = true;
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
	  }, {
	    key: 'walk',
	    value: function walk(fn) {
	      var level = 0;
	      var crt = this.root;
	      var loop = true;
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
	  }, {
	    key: 'walkRec',
	    value: function walkRec(fn) {
	      function rec(node, level, callback) {
	        callback(node, level);
	        _lodash2.default.each(node._child, function (c) {
	          rec(c, level + 1, callback);
	        });
	      }
	      rec(this.root, 0, fn);
	    }
	  }, {
	    key: 'insert',
	    value: function insert(text, start) {
	      this.update(text, start, start);
	    }
	  }, {
	    key: 'update',
	    value: function update(text, start, end) {
	      var chunks = this.chunks;
	      var chunk = text.split('');
	      var left = chunks.slice(0, start);
	      var right = chunks.slice(end);
	      var delta = chunk.length - (end - start);
	      chunks.splice(0, chunks.length);
	      chunks.push.apply(chunks, _toConsumableArray(left).concat(_toConsumableArray(chunk), _toConsumableArray(right)));
	      var n = this.root;
	      var r = undefined,
	          updated = undefined;
	      var loop = true;
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
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return this.chunks.join('');
	    }
	  }]);

	  return Document;
	}();

	exports.default = Document;

/***/ }
/******/ ]);