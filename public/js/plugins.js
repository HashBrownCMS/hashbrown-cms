"use strict";

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        onReady('navbar', function () {
            ViewHelper.get('NavbarMain').renderPane({
                label: 'GitHub',
                route: '/github/',
                icon: 'github',
                items: [{
                    name: 'Issues',
                    path: 'issues',
                    icon: 'exclamation-circle'
                }, {
                    name: 'Wiki',
                    path: 'wiki',
                    icon: 'book'
                }]
            });
        });

        Router.route('/github/', function () {
            ViewHelper.get('NavbarMain').showTab('/github/');

            $('.workspace').html(_.div({ class: 'dashboard-container' }, [_.h1('GitHub dashboard'), _.p('Please click on a feature to proceed')]));
        });

        Router.route('/github/issues/', function () {
            ViewHelper.get('NavbarMain').highlightItem('issues');
        });

        Router.route('/github/wiki/', function () {
            ViewHelper.get('NavbarMain').highlightItem('wiki');
        });
    }, {}] }, {}, [1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        var DateEditor = function (_View) {
            _inherits(DateEditor, _View);

            function DateEditor(params) {
                _classCallCheck(this, DateEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DateEditor).call(this, params));

                _this.init();
                return _this;
            }

            _createClass(DateEditor, [{
                key: "onChange",
                value: function onChange() {
                    this.trigger('change', this.$input.val());
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    var date = new Date(this.value);

                    this.$element = _.div({ class: 'field-editor date-editor' }, this.disabled ? _.p({}, date) : this.$input = _.input({ class: 'form-control', type: 'text', value: this.value }));

                    if (this.$input) {
                        this.$input.datepicker();

                        this.$input.on('changeDate', function () {
                            editor.onChange();
                        });
                    }
                }
            }]);

            return DateEditor;
        }(View);

        resources.editors['20002'] = DateEditor;
    }, {}] }, {}, [1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        var PageReferenceEditor = function (_View) {
            _inherits(PageReferenceEditor, _View);

            function PageReferenceEditor(params) {
                _classCallCheck(this, PageReferenceEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PageReferenceEditor).call(this, params));

                _this.init();
                return _this;
            }

            _createClass(PageReferenceEditor, [{
                key: "onChange",
                value: function onChange() {
                    this.trigger('change', this.$select.val());
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    this.$element = _.div({ class: 'field-editor input-group page-reference-editor' }, [this.$select = _.select({ class: 'form-control' }, _.each(window.resources.pages, function (id, page) {
                        return _.option({ value: page.id }, page.title);
                    })).change(function () {
                        editor.onChange();
                    }), _.div({ class: 'input-group-btn' }, this.$clearBtn = _.button({ class: 'btn btn-primary' }, 'Clear'))]);

                    this.$select.val(editor.value);

                    this.$clearBtn.click(function () {
                        editor.$select.val(null);

                        editor.onChange();
                    });
                }
            }]);

            return PageReferenceEditor;
        }(View);

        resources.editors['20006'] = PageReferenceEditor;
    }, {}] }, {}, [1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        var PeriodEditor = function (_View) {
            _inherits(PeriodEditor, _View);

            function PeriodEditor(params) {
                _classCallCheck(this, PeriodEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PeriodEditor).call(this, params));

                _this.init();
                return _this;
            }

            _createClass(PeriodEditor, [{
                key: "onChange",
                value: function onChange() {
                    var newValue = {
                        enabled: this.$toggle[0].checked,
                        from: this.$from.val(),
                        to: this.$to.val()
                    };

                    this.trigger('change', newValue);
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    editor.value = editor.value || {};
                    editor.value.enabled = editor.value.enabled == true || editor.value.enabled == "true";

                    var toDate = new Date(editor.value.to);
                    var fromDate = new Date(editor.value.from);
                    var switchId = 'switch-' + $('.switch').length;

                    this.$element = _.div({ class: 'field-editor period-editor' }, _.div({ class: 'input-group' }, [this.$from = _.input({ class: 'form-control' + (editor.value.enabled ? '' : ' disabled'), type: 'text', value: editor.value.from }), _.div({ class: 'arrow-middle input-group-addon' }, _.span({ class: 'fa fa-arrow-right' })), this.$to = _.input({ class: 'form-control' + (editor.value.enabled ? '' : ' disabled'), type: 'text', value: editor.value.to }), _.div({ class: 'input-group-addon' }, _.div({ class: 'switch' }, [this.$toggle = _.input({ id: switchId, class: 'form-control switch', type: 'checkbox' }), _.label({ for: switchId })]))]));

                    this.$from.datepicker();
                    this.$to.datepicker();

                    this.$toggle[0].checked = editor.value.enabled;

                    this.$from.on('changeDate', function () {
                        editor.onChange();
                    });

                    this.$to.on('changeDate', function () {
                        editor.onChange();
                    });

                    this.$toggle.on('change', function () {
                        editor.$from.toggleClass('disabled', !this.checked);
                        editor.$to.toggleClass('disabled', !this.checked);

                        editor.onChange();
                    });
                }
            }]);

            return PeriodEditor;
        }(View);

        resources.editors['20005'] = PeriodEditor;
    }, {}] }, {}, [1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
      }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, f, f.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    /**
     * This file automatically generated from `build.js`.
     * Do not manually edit.
     */

    module.exports = ["address", "article", "aside", "audio", "blockquote", "canvas", "dd", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "main", "nav", "noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video"];
  }, {}], 2: [function (require, module, exports) {}, {}], 3: [function (require, module, exports) {
    'use strict';

    var voidElements = require('void-elements');
    Object.keys(voidElements).forEach(function (name) {
      voidElements[name.toUpperCase()] = 1;
    });

    var blockElements = {};
    require('block-elements').forEach(function (name) {
      blockElements[name.toUpperCase()] = 1;
    });

    /**
     * isBlockElem(node) determines if the given node is a block element.
     *
     * @param {Node} node
     * @return {Boolean}
     */
    function isBlockElem(node) {
      return !!(node && blockElements[node.nodeName]);
    }

    /**
     * isVoid(node) determines if the given node is a void element.
     *
     * @param {Node} node
     * @return {Boolean}
     */
    function isVoid(node) {
      return !!(node && voidElements[node.nodeName]);
    }

    /**
     * whitespace(elem [, isBlock]) removes extraneous whitespace from an
     * the given element. The function isBlock may optionally be passed in
     * to determine whether or not an element is a block element; if none
     * is provided, defaults to using the list of block elements provided
     * by the `block-elements` module.
     *
     * @param {Node} elem
     * @param {Function} blockTest
     */
    function collapseWhitespace(elem, isBlock) {
      if (!elem.firstChild || elem.nodeName === 'PRE') return;

      if (typeof isBlock !== 'function') {
        isBlock = isBlockElem;
      }

      var prevText = null;
      var prevVoid = false;

      var prev = null;
      var node = next(prev, elem);

      while (node !== elem) {
        if (node.nodeType === 3) {
          // Node.TEXT_NODE
          var text = node.data.replace(/[ \r\n\t]+/g, ' ');

          if ((!prevText || / $/.test(prevText.data)) && !prevVoid && text[0] === ' ') {
            text = text.substr(1);
          }

          // `text` might be empty at this point.
          if (!text) {
            node = remove(node);
            continue;
          }

          node.data = text;
          prevText = node;
        } else if (node.nodeType === 1) {
          // Node.ELEMENT_NODE
          if (isBlock(node) || node.nodeName === 'BR') {
            if (prevText) {
              prevText.data = prevText.data.replace(/ $/, '');
            }

            prevText = null;
            prevVoid = false;
          } else if (isVoid(node)) {
            // Avoid trimming space around non-block, non-BR void elements.
            prevText = null;
            prevVoid = true;
          }
        } else {
          node = remove(node);
          continue;
        }

        var nextNode = next(prev, node);
        prev = node;
        node = nextNode;
      }

      if (prevText) {
        prevText.data = prevText.data.replace(/ $/, '');
        if (!prevText.data) {
          remove(prevText);
        }
      }
    }

    /**
     * remove(node) removes the given node from the DOM and returns the
     * next node in the sequence.
     *
     * @param {Node} node
     * @return {Node} node
     */
    function remove(node) {
      var next = node.nextSibling || node.parentNode;

      node.parentNode.removeChild(node);

      return next;
    }

    /**
     * next(prev, current) returns the next node in the sequence, given the
     * current and previous nodes.
     *
     * @param {Node} prev
     * @param {Node} current
     * @return {Node}
     */
    function next(prev, current) {
      if (prev && prev.parentNode === current || current.nodeName === 'PRE') {
        return current.nextSibling || current.parentNode;
      }

      return current.firstChild || current.nextSibling || current.parentNode;
    }

    module.exports = collapseWhitespace;
  }, { "block-elements": 1, "void-elements": 8 }], 4: [function (require, module, exports) {
    (function (global) {
      /**
       * marked - a markdown parser
       * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
       * https://github.com/chjj/marked
       */

      ;(function () {

        /**
         * Block-Level Grammar
         */

        var block = {
          newline: /^\n+/,
          code: /^( {4}[^\n]+\n*)+/,
          fences: noop,
          hr: /^( *[-*_]){3,} *(?:\n+|$)/,
          heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
          nptable: noop,
          lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
          blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
          list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
          html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
          def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
          table: noop,
          paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
          text: /^[^\n]+/
        };

        block.bullet = /(?:[*+-]|\d+\.)/;
        block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
        block.item = replace(block.item, 'gm')(/bull/g, block.bullet)();

        block.list = replace(block.list)(/bull/g, block.bullet)('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')('def', '\\n+(?=' + block.def.source + ')')();

        block.blockquote = replace(block.blockquote)('def', block.def)();

        block._tag = '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code' + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo' + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

        block.html = replace(block.html)('comment', /<!--[\s\S]*?-->/)('closed', /<(tag)[\s\S]+?<\/\1>/)('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, block._tag)();

        block.paragraph = replace(block.paragraph)('hr', block.hr)('heading', block.heading)('lheading', block.lheading)('blockquote', block.blockquote)('tag', '<' + block._tag)('def', block.def)();

        /**
         * Normal Block Grammar
         */

        block.normal = merge({}, block);

        /**
         * GFM Block Grammar
         */

        block.gfm = merge({}, block.normal, {
          fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
          paragraph: /^/,
          heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
        });

        block.gfm.paragraph = replace(block.paragraph)('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|' + block.list.source.replace('\\1', '\\3') + '|')();

        /**
         * GFM + Tables Block Grammar
         */

        block.tables = merge({}, block.gfm, {
          nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
          table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
        });

        /**
         * Block Lexer
         */

        function Lexer(options) {
          this.tokens = [];
          this.tokens.links = {};
          this.options = options || marked.defaults;
          this.rules = block.normal;

          if (this.options.gfm) {
            if (this.options.tables) {
              this.rules = block.tables;
            } else {
              this.rules = block.gfm;
            }
          }
        }

        /**
         * Expose Block Rules
         */

        Lexer.rules = block;

        /**
         * Static Lex Method
         */

        Lexer.lex = function (src, options) {
          var lexer = new Lexer(options);
          return lexer.lex(src);
        };

        /**
         * Preprocessing
         */

        Lexer.prototype.lex = function (src) {
          src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ').replace(/\u00a0/g, ' ').replace(/\u2424/g, '\n');

          return this.token(src, true);
        };

        /**
         * Lexing
         */

        Lexer.prototype.token = function (src, top, bq) {
          var src = src.replace(/^ +$/gm, ''),
              next,
              loose,
              cap,
              bull,
              b,
              item,
              space,
              i,
              l;

          while (src) {
            // newline
            if (cap = this.rules.newline.exec(src)) {
              src = src.substring(cap[0].length);
              if (cap[0].length > 1) {
                this.tokens.push({
                  type: 'space'
                });
              }
            }

            // code
            if (cap = this.rules.code.exec(src)) {
              src = src.substring(cap[0].length);
              cap = cap[0].replace(/^ {4}/gm, '');
              this.tokens.push({
                type: 'code',
                text: !this.options.pedantic ? cap.replace(/\n+$/, '') : cap
              });
              continue;
            }

            // fences (gfm)
            if (cap = this.rules.fences.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'code',
                lang: cap[2],
                text: cap[3] || ''
              });
              continue;
            }

            // heading
            if (cap = this.rules.heading.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'heading',
                depth: cap[1].length,
                text: cap[2]
              });
              continue;
            }

            // table no leading pipe (gfm)
            if (top && (cap = this.rules.nptable.exec(src))) {
              src = src.substring(cap[0].length);

              item = {
                type: 'table',
                header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                cells: cap[3].replace(/\n$/, '').split('\n')
              };

              for (i = 0; i < item.align.length; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              for (i = 0; i < item.cells.length; i++) {
                item.cells[i] = item.cells[i].split(/ *\| */);
              }

              this.tokens.push(item);

              continue;
            }

            // lheading
            if (cap = this.rules.lheading.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'heading',
                depth: cap[2] === '=' ? 1 : 2,
                text: cap[1]
              });
              continue;
            }

            // hr
            if (cap = this.rules.hr.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'hr'
              });
              continue;
            }

            // blockquote
            if (cap = this.rules.blockquote.exec(src)) {
              src = src.substring(cap[0].length);

              this.tokens.push({
                type: 'blockquote_start'
              });

              cap = cap[0].replace(/^ *> ?/gm, '');

              // Pass `top` to keep the current
              // "toplevel" state. This is exactly
              // how markdown.pl works.
              this.token(cap, top, true);

              this.tokens.push({
                type: 'blockquote_end'
              });

              continue;
            }

            // list
            if (cap = this.rules.list.exec(src)) {
              src = src.substring(cap[0].length);
              bull = cap[2];

              this.tokens.push({
                type: 'list_start',
                ordered: bull.length > 1
              });

              // Get each top-level item.
              cap = cap[0].match(this.rules.item);

              next = false;
              l = cap.length;
              i = 0;

              for (; i < l; i++) {
                item = cap[i];

                // Remove the list item's bullet
                // so it is seen as the next token.
                space = item.length;
                item = item.replace(/^ *([*+-]|\d+\.) +/, '');

                // Outdent whatever the
                // list item contains. Hacky.
                if (~item.indexOf('\n ')) {
                  space -= item.length;
                  item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
                }

                // Determine whether the next list item belongs here.
                // Backpedal if it does not belong in this list.
                if (this.options.smartLists && i !== l - 1) {
                  b = block.bullet.exec(cap[i + 1])[0];
                  if (bull !== b && !(bull.length > 1 && b.length > 1)) {
                    src = cap.slice(i + 1).join('\n') + src;
                    i = l - 1;
                  }
                }

                // Determine whether item is loose or not.
                // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
                // for discount behavior.
                loose = next || /\n\n(?!\s*$)/.test(item);
                if (i !== l - 1) {
                  next = item.charAt(item.length - 1) === '\n';
                  if (!loose) loose = next;
                }

                this.tokens.push({
                  type: loose ? 'loose_item_start' : 'list_item_start'
                });

                // Recurse.
                this.token(item, false, bq);

                this.tokens.push({
                  type: 'list_item_end'
                });
              }

              this.tokens.push({
                type: 'list_end'
              });

              continue;
            }

            // html
            if (cap = this.rules.html.exec(src)) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: this.options.sanitize ? 'paragraph' : 'html',
                pre: !this.options.sanitizer && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
                text: cap[0]
              });
              continue;
            }

            // def
            if (!bq && top && (cap = this.rules.def.exec(src))) {
              src = src.substring(cap[0].length);
              this.tokens.links[cap[1].toLowerCase()] = {
                href: cap[2],
                title: cap[3]
              };
              continue;
            }

            // table (gfm)
            if (top && (cap = this.rules.table.exec(src))) {
              src = src.substring(cap[0].length);

              item = {
                type: 'table',
                header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
              };

              for (i = 0; i < item.align.length; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              for (i = 0; i < item.cells.length; i++) {
                item.cells[i] = item.cells[i].replace(/^ *\| *| *\| *$/g, '').split(/ *\| */);
              }

              this.tokens.push(item);

              continue;
            }

            // top-level paragraph
            if (top && (cap = this.rules.paragraph.exec(src))) {
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'paragraph',
                text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
              });
              continue;
            }

            // text
            if (cap = this.rules.text.exec(src)) {
              // Top-level should never reach here.
              src = src.substring(cap[0].length);
              this.tokens.push({
                type: 'text',
                text: cap[0]
              });
              continue;
            }

            if (src) {
              throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
          }

          return this.tokens;
        };

        /**
         * Inline-Level Grammar
         */

        var inline = {
          escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
          autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
          url: noop,
          tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
          link: /^!?\[(inside)\]\(href\)/,
          reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
          nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
          strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
          em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
          code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
          br: /^ {2,}\n(?!\s*$)/,
          del: noop,
          text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
        };

        inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
        inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

        inline.link = replace(inline.link)('inside', inline._inside)('href', inline._href)();

        inline.reflink = replace(inline.reflink)('inside', inline._inside)();

        /**
         * Normal Inline Grammar
         */

        inline.normal = merge({}, inline);

        /**
         * Pedantic Inline Grammar
         */

        inline.pedantic = merge({}, inline.normal, {
          strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
          em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
        });

        /**
         * GFM Inline Grammar
         */

        inline.gfm = merge({}, inline.normal, {
          escape: replace(inline.escape)('])', '~|])')(),
          url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
          del: /^~~(?=\S)([\s\S]*?\S)~~/,
          text: replace(inline.text)(']|', '~]|')('|', '|https?://|')()
        });

        /**
         * GFM + Line Breaks Inline Grammar
         */

        inline.breaks = merge({}, inline.gfm, {
          br: replace(inline.br)('{2,}', '*')(),
          text: replace(inline.gfm.text)('{2,}', '*')()
        });

        /**
         * Inline Lexer & Compiler
         */

        function InlineLexer(links, options) {
          this.options = options || marked.defaults;
          this.links = links;
          this.rules = inline.normal;
          this.renderer = this.options.renderer || new Renderer();
          this.renderer.options = this.options;

          if (!this.links) {
            throw new Error('Tokens array requires a `links` property.');
          }

          if (this.options.gfm) {
            if (this.options.breaks) {
              this.rules = inline.breaks;
            } else {
              this.rules = inline.gfm;
            }
          } else if (this.options.pedantic) {
            this.rules = inline.pedantic;
          }
        }

        /**
         * Expose Inline Rules
         */

        InlineLexer.rules = inline;

        /**
         * Static Lexing/Compiling Method
         */

        InlineLexer.output = function (src, links, options) {
          var inline = new InlineLexer(links, options);
          return inline.output(src);
        };

        /**
         * Lexing/Compiling
         */

        InlineLexer.prototype.output = function (src) {
          var out = '',
              link,
              text,
              href,
              cap;

          while (src) {
            // escape
            if (cap = this.rules.escape.exec(src)) {
              src = src.substring(cap[0].length);
              out += cap[1];
              continue;
            }

            // autolink
            if (cap = this.rules.autolink.exec(src)) {
              src = src.substring(cap[0].length);
              if (cap[2] === '@') {
                text = cap[1].charAt(6) === ':' ? this.mangle(cap[1].substring(7)) : this.mangle(cap[1]);
                href = this.mangle('mailto:') + text;
              } else {
                text = escape(cap[1]);
                href = text;
              }
              out += this.renderer.link(href, null, text);
              continue;
            }

            // url (gfm)
            if (!this.inLink && (cap = this.rules.url.exec(src))) {
              src = src.substring(cap[0].length);
              text = escape(cap[1]);
              href = text;
              out += this.renderer.link(href, null, text);
              continue;
            }

            // tag
            if (cap = this.rules.tag.exec(src)) {
              if (!this.inLink && /^<a /i.test(cap[0])) {
                this.inLink = true;
              } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
                this.inLink = false;
              }
              src = src.substring(cap[0].length);
              out += this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0];
              continue;
            }

            // link
            if (cap = this.rules.link.exec(src)) {
              src = src.substring(cap[0].length);
              this.inLink = true;
              out += this.outputLink(cap, {
                href: cap[2],
                title: cap[3]
              });
              this.inLink = false;
              continue;
            }

            // reflink, nolink
            if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
              src = src.substring(cap[0].length);
              link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
              link = this.links[link.toLowerCase()];
              if (!link || !link.href) {
                out += cap[0].charAt(0);
                src = cap[0].substring(1) + src;
                continue;
              }
              this.inLink = true;
              out += this.outputLink(cap, link);
              this.inLink = false;
              continue;
            }

            // strong
            if (cap = this.rules.strong.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.strong(this.output(cap[2] || cap[1]));
              continue;
            }

            // em
            if (cap = this.rules.em.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.em(this.output(cap[2] || cap[1]));
              continue;
            }

            // code
            if (cap = this.rules.code.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.codespan(escape(cap[2], true));
              continue;
            }

            // br
            if (cap = this.rules.br.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.br();
              continue;
            }

            // del (gfm)
            if (cap = this.rules.del.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.del(this.output(cap[1]));
              continue;
            }

            // text
            if (cap = this.rules.text.exec(src)) {
              src = src.substring(cap[0].length);
              out += this.renderer.text(escape(this.smartypants(cap[0])));
              continue;
            }

            if (src) {
              throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
          }

          return out;
        };

        /**
         * Compile Link
         */

        InlineLexer.prototype.outputLink = function (cap, link) {
          var href = escape(link.href),
              title = link.title ? escape(link.title) : null;

          return cap[0].charAt(0) !== '!' ? this.renderer.link(href, title, this.output(cap[1])) : this.renderer.image(href, title, escape(cap[1]));
        };

        /**
         * Smartypants Transformations
         */

        InlineLexer.prototype.smartypants = function (text) {
          if (!this.options.smartypants) return text;
          return text
          // em-dashes
          .replace(/---/g, "—")
          // en-dashes
          .replace(/--/g, "–")
          // opening singles
          .replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘")
          // closing singles & apostrophes
          .replace(/'/g, "’")
          // opening doubles
          .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“")
          // closing doubles
          .replace(/"/g, "”")
          // ellipses
          .replace(/\.{3}/g, "…");
        };

        /**
         * Mangle Links
         */

        InlineLexer.prototype.mangle = function (text) {
          if (!this.options.mangle) return text;
          var out = '',
              l = text.length,
              i = 0,
              ch;

          for (; i < l; i++) {
            ch = text.charCodeAt(i);
            if (Math.random() > 0.5) {
              ch = 'x' + ch.toString(16);
            }
            out += '&#' + ch + ';';
          }

          return out;
        };

        /**
         * Renderer
         */

        function Renderer(options) {
          this.options = options || {};
        }

        Renderer.prototype.code = function (code, lang, escaped) {
          if (this.options.highlight) {
            var out = this.options.highlight(code, lang);
            if (out != null && out !== code) {
              escaped = true;
              code = out;
            }
          }

          if (!lang) {
            return '<pre><code>' + (escaped ? code : escape(code, true)) + '\n</code></pre>';
          }

          return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">' + (escaped ? code : escape(code, true)) + '\n</code></pre>\n';
        };

        Renderer.prototype.blockquote = function (quote) {
          return '<blockquote>\n' + quote + '</blockquote>\n';
        };

        Renderer.prototype.html = function (html) {
          return html;
        };

        Renderer.prototype.heading = function (text, level, raw) {
          return '<h' + level + ' id="' + this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h' + level + '>\n';
        };

        Renderer.prototype.hr = function () {
          return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
        };

        Renderer.prototype.list = function (body, ordered) {
          var type = ordered ? 'ol' : 'ul';
          return '<' + type + '>\n' + body + '</' + type + '>\n';
        };

        Renderer.prototype.listitem = function (text) {
          return '<li>' + text + '</li>\n';
        };

        Renderer.prototype.paragraph = function (text) {
          return '<p>' + text + '</p>\n';
        };

        Renderer.prototype.table = function (header, body) {
          return '<table>\n' + '<thead>\n' + header + '</thead>\n' + '<tbody>\n' + body + '</tbody>\n' + '</table>\n';
        };

        Renderer.prototype.tablerow = function (content) {
          return '<tr>\n' + content + '</tr>\n';
        };

        Renderer.prototype.tablecell = function (content, flags) {
          var type = flags.header ? 'th' : 'td';
          var tag = flags.align ? '<' + type + ' style="text-align:' + flags.align + '">' : '<' + type + '>';
          return tag + content + '</' + type + '>\n';
        };

        // span level renderer
        Renderer.prototype.strong = function (text) {
          return '<strong>' + text + '</strong>';
        };

        Renderer.prototype.em = function (text) {
          return '<em>' + text + '</em>';
        };

        Renderer.prototype.codespan = function (text) {
          return '<code>' + text + '</code>';
        };

        Renderer.prototype.br = function () {
          return this.options.xhtml ? '<br/>' : '<br>';
        };

        Renderer.prototype.del = function (text) {
          return '<del>' + text + '</del>';
        };

        Renderer.prototype.link = function (href, title, text) {
          if (this.options.sanitize) {
            try {
              var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
            } catch (e) {
              return '';
            }
            if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
              return '';
            }
          }
          var out = '<a href="' + href + '"';
          if (title) {
            out += ' title="' + title + '"';
          }
          out += '>' + text + '</a>';
          return out;
        };

        Renderer.prototype.image = function (href, title, text) {
          var out = '<img src="' + href + '" alt="' + text + '"';
          if (title) {
            out += ' title="' + title + '"';
          }
          out += this.options.xhtml ? '/>' : '>';
          return out;
        };

        Renderer.prototype.text = function (text) {
          return text;
        };

        /**
         * Parsing & Compiling
         */

        function Parser(options) {
          this.tokens = [];
          this.token = null;
          this.options = options || marked.defaults;
          this.options.renderer = this.options.renderer || new Renderer();
          this.renderer = this.options.renderer;
          this.renderer.options = this.options;
        }

        /**
         * Static Parse Method
         */

        Parser.parse = function (src, options, renderer) {
          var parser = new Parser(options, renderer);
          return parser.parse(src);
        };

        /**
         * Parse Loop
         */

        Parser.prototype.parse = function (src) {
          this.inline = new InlineLexer(src.links, this.options, this.renderer);
          this.tokens = src.reverse();

          var out = '';
          while (this.next()) {
            out += this.tok();
          }

          return out;
        };

        /**
         * Next Token
         */

        Parser.prototype.next = function () {
          return this.token = this.tokens.pop();
        };

        /**
         * Preview Next Token
         */

        Parser.prototype.peek = function () {
          return this.tokens[this.tokens.length - 1] || 0;
        };

        /**
         * Parse Text Tokens
         */

        Parser.prototype.parseText = function () {
          var body = this.token.text;

          while (this.peek().type === 'text') {
            body += '\n' + this.next().text;
          }

          return this.inline.output(body);
        };

        /**
         * Parse Current Token
         */

        Parser.prototype.tok = function () {
          switch (this.token.type) {
            case 'space':
              {
                return '';
              }
            case 'hr':
              {
                return this.renderer.hr();
              }
            case 'heading':
              {
                return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text);
              }
            case 'code':
              {
                return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
              }
            case 'table':
              {
                var header = '',
                    body = '',
                    i,
                    row,
                    cell,
                    flags,
                    j;

                // header
                cell = '';
                for (i = 0; i < this.token.header.length; i++) {
                  flags = { header: true, align: this.token.align[i] };
                  cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), { header: true, align: this.token.align[i] });
                }
                header += this.renderer.tablerow(cell);

                for (i = 0; i < this.token.cells.length; i++) {
                  row = this.token.cells[i];

                  cell = '';
                  for (j = 0; j < row.length; j++) {
                    cell += this.renderer.tablecell(this.inline.output(row[j]), { header: false, align: this.token.align[j] });
                  }

                  body += this.renderer.tablerow(cell);
                }
                return this.renderer.table(header, body);
              }
            case 'blockquote_start':
              {
                var body = '';

                while (this.next().type !== 'blockquote_end') {
                  body += this.tok();
                }

                return this.renderer.blockquote(body);
              }
            case 'list_start':
              {
                var body = '',
                    ordered = this.token.ordered;

                while (this.next().type !== 'list_end') {
                  body += this.tok();
                }

                return this.renderer.list(body, ordered);
              }
            case 'list_item_start':
              {
                var body = '';

                while (this.next().type !== 'list_item_end') {
                  body += this.token.type === 'text' ? this.parseText() : this.tok();
                }

                return this.renderer.listitem(body);
              }
            case 'loose_item_start':
              {
                var body = '';

                while (this.next().type !== 'list_item_end') {
                  body += this.tok();
                }

                return this.renderer.listitem(body);
              }
            case 'html':
              {
                var html = !this.token.pre && !this.options.pedantic ? this.inline.output(this.token.text) : this.token.text;
                return this.renderer.html(html);
              }
            case 'paragraph':
              {
                return this.renderer.paragraph(this.inline.output(this.token.text));
              }
            case 'text':
              {
                return this.renderer.paragraph(this.parseText());
              }
          }
        };

        /**
         * Helpers
         */

        function escape(html, encode) {
          return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        function unescape(html) {
          return html.replace(/&([#\w]+);/g, function (_, n) {
            n = n.toLowerCase();
            if (n === 'colon') return ':';
            if (n.charAt(0) === '#') {
              return n.charAt(1) === 'x' ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
            }
            return '';
          });
        }

        function replace(regex, opt) {
          regex = regex.source;
          opt = opt || '';
          return function self(name, val) {
            if (!name) return new RegExp(regex, opt);
            val = val.source || val;
            val = val.replace(/(^|[^\[])\^/g, '$1');
            regex = regex.replace(name, val);
            return self;
          };
        }

        function noop() {}
        noop.exec = noop;

        function merge(obj) {
          var i = 1,
              target,
              key;

          for (; i < arguments.length; i++) {
            target = arguments[i];
            for (key in target) {
              if (Object.prototype.hasOwnProperty.call(target, key)) {
                obj[key] = target[key];
              }
            }
          }

          return obj;
        }

        /**
         * Marked
         */

        function marked(src, opt, callback) {
          if (callback || typeof opt === 'function') {
            if (!callback) {
              callback = opt;
              opt = null;
            }

            opt = merge({}, marked.defaults, opt || {});

            var highlight = opt.highlight,
                tokens,
                pending,
                i = 0;

            try {
              tokens = Lexer.lex(src, opt);
            } catch (e) {
              return callback(e);
            }

            pending = tokens.length;

            var done = function done(err) {
              if (err) {
                opt.highlight = highlight;
                return callback(err);
              }

              var out;

              try {
                out = Parser.parse(tokens, opt);
              } catch (e) {
                err = e;
              }

              opt.highlight = highlight;

              return err ? callback(err) : callback(null, out);
            };

            if (!highlight || highlight.length < 3) {
              return done();
            }

            delete opt.highlight;

            if (!pending) return done();

            for (; i < tokens.length; i++) {
              (function (token) {
                if (token.type !== 'code') {
                  return --pending || done();
                }
                return highlight(token.text, token.lang, function (err, code) {
                  if (err) return done(err);
                  if (code == null || code === token.text) {
                    return --pending || done();
                  }
                  token.text = code;
                  token.escaped = true;
                  --pending || done();
                });
              })(tokens[i]);
            }

            return;
          }
          try {
            if (opt) opt = merge({}, marked.defaults, opt);
            return Parser.parse(Lexer.lex(src, opt), opt);
          } catch (e) {
            e.message += '\nPlease report this to https://github.com/chjj/marked.';
            if ((opt || marked.defaults).silent) {
              return '<p>An error occured:</p><pre>' + escape(e.message + '', true) + '</pre>';
            }
            throw e;
          }
        }

        /**
         * Options
         */

        marked.options = marked.setOptions = function (opt) {
          merge(marked.defaults, opt);
          return marked;
        };

        marked.defaults = {
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: false,
          sanitizer: null,
          mangle: true,
          smartLists: false,
          silent: false,
          highlight: null,
          langPrefix: 'lang-',
          smartypants: false,
          headerPrefix: '',
          renderer: new Renderer(),
          xhtml: false
        };

        /**
         * Expose
         */

        marked.Parser = Parser;
        marked.parser = Parser.parse;

        marked.Renderer = Renderer;

        marked.Lexer = Lexer;
        marked.lexer = Lexer.lex;

        marked.InlineLexer = InlineLexer;
        marked.inlineLexer = InlineLexer.output;

        marked.parse = marked;

        if (typeof module !== 'undefined' && (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
          module.exports = marked;
        } else if (typeof define === 'function' && define.amd) {
          define(function () {
            return marked;
          });
        } else {
          this.marked = marked;
        }
      }).call(function () {
        return this || (typeof window !== 'undefined' ? window : global);
      }());
    }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, {}], 5: [function (require, module, exports) {
    /*
     * to-markdown - an HTML to Markdown converter
     *
     * Copyright 2011-15, Dom Christie
     * Licenced under the MIT licence
     *
     */

    'use strict';

    var toMarkdown;
    var converters;
    var mdConverters = require('./lib/md-converters');
    var gfmConverters = require('./lib/gfm-converters');
    var collapse = require('collapse-whitespace');

    /*
     * Set up window and document for Node.js
     */

    var _window = typeof window !== 'undefined' ? window : this,
        _document;
    if (typeof document === 'undefined') {
      _document = require('jsdom').jsdom();
    } else {
      _document = document;
    }

    /*
     * Utilities
     */

    function trim(string) {
      return string.replace(/^[ \r\n\t]+|[ \r\n\t]+$/g, '');
    }

    var blocks = ['address', 'article', 'aside', 'audio', 'blockquote', 'body', 'canvas', 'center', 'dd', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'html', 'isindex', 'li', 'main', 'menu', 'nav', 'noframes', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'];

    function isBlock(node) {
      return blocks.indexOf(node.nodeName.toLowerCase()) !== -1;
    }

    var voids = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

    function isVoid(node) {
      return voids.indexOf(node.nodeName.toLowerCase()) !== -1;
    }

    /*
     * Parsing HTML strings
     */

    function canParseHtml() {
      var Parser = _window.DOMParser,
          canParse = false;

      // Adapted from https://gist.github.com/1129031
      // Firefox/Opera/IE throw errors on unsupported types
      try {
        // WebKit returns null on unsupported types
        if (new Parser().parseFromString('', 'text/html')) {
          canParse = true;
        }
      } catch (e) {}
      return canParse;
    }

    function createHtmlParser() {
      var Parser = function Parser() {};

      Parser.prototype.parseFromString = function (string) {
        var newDoc = _document.implementation.createHTMLDocument('');

        if (string.toLowerCase().indexOf('<!doctype') > -1) {
          newDoc.documentElement.innerHTML = string;
        } else {
          newDoc.body.innerHTML = string;
        }
        return newDoc;
      };
      return Parser;
    }

    var HtmlParser = canParseHtml() ? _window.DOMParser : createHtmlParser();

    function htmlToDom(string) {
      var tree = new HtmlParser().parseFromString(string, 'text/html');
      collapse(tree, isBlock);
      return tree;
    }

    /*
     * Flattens DOM tree into single array
     */

    function bfsOrder(node) {
      var inqueue = [node],
          outqueue = [],
          elem,
          children,
          i;

      while (inqueue.length > 0) {
        elem = inqueue.shift();
        outqueue.push(elem);
        children = elem.childNodes;
        for (i = 0; i < children.length; i++) {
          if (children[i].nodeType === 1) {
            inqueue.push(children[i]);
          }
        }
      }
      outqueue.shift();
      return outqueue;
    }

    /*
     * Contructs a Markdown string of replacement text for a given node
     */

    function getContent(node) {
      var text = '';
      for (var i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].nodeType === 1) {
          text += node.childNodes[i]._replacement;
        } else if (node.childNodes[i].nodeType === 3) {
          text += node.childNodes[i].data;
        } else {
          continue;
        }
      }
      return text;
    }

    /*
     * Returns the HTML string of an element with its contents converted
     */

    function outer(node, content) {
      return node.cloneNode(false).outerHTML.replace('><', '>' + content + '<');
    }

    function canConvert(node, filter) {
      if (typeof filter === 'string') {
        return filter === node.nodeName.toLowerCase();
      }
      if (Array.isArray(filter)) {
        return filter.indexOf(node.nodeName.toLowerCase()) !== -1;
      } else if (typeof filter === 'function') {
        return filter.call(toMarkdown, node);
      } else {
        throw new TypeError('`filter` needs to be a string, array, or function');
      }
    }

    function isFlankedByWhitespace(side, node) {
      var sibling, regExp, isFlanked;

      if (side === 'left') {
        sibling = node.previousSibling;
        regExp = / $/;
      } else {
        sibling = node.nextSibling;
        regExp = /^ /;
      }

      if (sibling) {
        if (sibling.nodeType === 3) {
          isFlanked = regExp.test(sibling.nodeValue);
        } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
          isFlanked = regExp.test(sibling.textContent);
        }
      }
      return isFlanked;
    }

    function flankingWhitespace(node) {
      var leading = '',
          trailing = '';

      if (!isBlock(node)) {
        var hasLeading = /^[ \r\n\t]/.test(node.innerHTML),
            hasTrailing = /[ \r\n\t]$/.test(node.innerHTML);

        if (hasLeading && !isFlankedByWhitespace('left', node)) {
          leading = ' ';
        }
        if (hasTrailing && !isFlankedByWhitespace('right', node)) {
          trailing = ' ';
        }
      }

      return { leading: leading, trailing: trailing };
    }

    /*
     * Finds a Markdown converter, gets the replacement, and sets it on
     * `_replacement`
     */

    function process(node) {
      var replacement,
          content = getContent(node);

      // Remove blank nodes
      if (!isVoid(node) && !/A/.test(node.nodeName) && /^\s*$/i.test(content)) {
        node._replacement = '';
        return;
      }

      for (var i = 0; i < converters.length; i++) {
        var converter = converters[i];

        if (canConvert(node, converter.filter)) {
          if (typeof converter.replacement !== 'function') {
            throw new TypeError('`replacement` needs to be a function that returns a string');
          }

          var whitespace = flankingWhitespace(node);

          if (whitespace.leading || whitespace.trailing) {
            content = trim(content);
          }
          replacement = whitespace.leading + converter.replacement.call(toMarkdown, content, node) + whitespace.trailing;
          break;
        }
      }

      node._replacement = replacement;
    }

    toMarkdown = function toMarkdown(input, options) {
      options = options || {};

      if (typeof input !== 'string') {
        throw new TypeError(input + ' is not a string');
      }

      // Escape potential ol triggers
      input = input.replace(/(\d+)\. /g, '$1\\. ');

      var clone = htmlToDom(input).body,
          nodes = bfsOrder(clone),
          output;

      converters = mdConverters.slice(0);
      if (options.gfm) {
        converters = gfmConverters.concat(converters);
      }

      if (options.converters) {
        converters = options.converters.concat(converters);
      }

      // Process through nodes in reverse (so deepest child elements are first).
      for (var i = nodes.length - 1; i >= 0; i--) {
        process(nodes[i]);
      }
      output = getContent(clone);

      return output.replace(/^[\t\r\n]+|[\t\r\n\s]+$/g, '').replace(/\n\s+\n/g, '\n\n').replace(/\n{3,}/g, '\n\n');
    };

    toMarkdown.isBlock = isBlock;
    toMarkdown.isVoid = isVoid;
    toMarkdown.trim = trim;
    toMarkdown.outer = outer;

    module.exports = toMarkdown;
  }, { "./lib/gfm-converters": 6, "./lib/md-converters": 7, "collapse-whitespace": 3, "jsdom": 2 }], 6: [function (require, module, exports) {
    'use strict';

    function cell(content, node) {
      var index = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
      var prefix = ' ';
      if (index === 0) {
        prefix = '| ';
      }
      return prefix + content + ' |';
    }

    var highlightRegEx = /highlight highlight-(\S+)/;

    module.exports = [{
      filter: 'br',
      replacement: function replacement() {
        return '\n';
      }
    }, {
      filter: ['del', 's', 'strike'],
      replacement: function replacement(content) {
        return '~~' + content + '~~';
      }
    }, {
      filter: function filter(node) {
        return node.type === 'checkbox' && node.parentNode.nodeName === 'LI';
      },
      replacement: function replacement(content, node) {
        return (node.checked ? '[x]' : '[ ]') + ' ';
      }
    }, {
      filter: ['th', 'td'],
      replacement: function replacement(content, node) {
        return cell(content, node);
      }
    }, {
      filter: 'tr',
      replacement: function replacement(content, node) {
        var borderCells = '';
        var alignMap = { left: ':--', right: '--:', center: ':-:' };

        if (node.parentNode.nodeName === 'THEAD') {
          for (var i = 0; i < node.childNodes.length; i++) {
            var align = node.childNodes[i].attributes.align;
            var border = '---';

            if (align) {
              border = alignMap[align.value] || border;
            }

            borderCells += cell(border, node.childNodes[i]);
          }
        }
        return '\n' + content + (borderCells ? '\n' + borderCells : '');
      }
    }, {
      filter: 'table',
      replacement: function replacement(content) {
        return '\n\n' + content + '\n\n';
      }
    }, {
      filter: ['thead', 'tbody', 'tfoot'],
      replacement: function replacement(content) {
        return content;
      }
    },

    // Fenced code blocks
    {
      filter: function filter(node) {
        return node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE';
      },
      replacement: function replacement(content, node) {
        return '\n\n```\n' + node.firstChild.textContent + '\n```\n\n';
      }
    },

    // Syntax-highlighted code blocks
    {
      filter: function filter(node) {
        return node.nodeName === 'PRE' && node.parentNode.nodeName === 'DIV' && highlightRegEx.test(node.parentNode.className);
      },
      replacement: function replacement(content, node) {
        var language = node.parentNode.className.match(highlightRegEx)[1];
        return '\n\n```' + language + '\n' + node.textContent + '\n```\n\n';
      }
    }, {
      filter: function filter(node) {
        return node.nodeName === 'DIV' && highlightRegEx.test(node.className);
      },
      replacement: function replacement(content) {
        return '\n\n' + content + '\n\n';
      }
    }];
  }, {}], 7: [function (require, module, exports) {
    'use strict';

    module.exports = [{
      filter: 'p',
      replacement: function replacement(content) {
        return '\n\n' + content + '\n\n';
      }
    }, {
      filter: 'br',
      replacement: function replacement() {
        return '  \n';
      }
    }, {
      filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      replacement: function replacement(content, node) {
        var hLevel = node.nodeName.charAt(1);
        var hPrefix = '';
        for (var i = 0; i < hLevel; i++) {
          hPrefix += '#';
        }
        return '\n\n' + hPrefix + ' ' + content + '\n\n';
      }
    }, {
      filter: 'hr',
      replacement: function replacement() {
        return '\n\n* * *\n\n';
      }
    }, {
      filter: ['em', 'i'],
      replacement: function replacement(content) {
        return '_' + content + '_';
      }
    }, {
      filter: ['strong', 'b'],
      replacement: function replacement(content) {
        return '**' + content + '**';
      }
    },

    // Inline code
    {
      filter: function filter(node) {
        var hasSiblings = node.previousSibling || node.nextSibling;
        var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings;

        return node.nodeName === 'CODE' && !isCodeBlock;
      },
      replacement: function replacement(content) {
        return '`' + content + '`';
      }
    }, {
      filter: function filter(node) {
        return node.nodeName === 'A' && node.getAttribute('href');
      },
      replacement: function replacement(content, node) {
        var titlePart = node.title ? ' "' + node.title + '"' : '';
        return '[' + content + '](' + node.getAttribute('href') + titlePart + ')';
      }
    }, {
      filter: 'img',
      replacement: function replacement(content, node) {
        var alt = node.alt || '';
        var src = node.getAttribute('src') || '';
        var title = node.title || '';
        var titlePart = title ? ' "' + title + '"' : '';
        return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : '';
      }
    },

    // Code blocks
    {
      filter: function filter(node) {
        return node.nodeName === 'PRE' && node.firstChild.nodeName === 'CODE';
      },
      replacement: function replacement(content, node) {
        return '\n\n    ' + node.firstChild.textContent.replace(/\n/g, '\n    ') + '\n\n';
      }
    }, {
      filter: 'blockquote',
      replacement: function replacement(content) {
        content = this.trim(content);
        content = content.replace(/\n{3,}/g, '\n\n');
        content = content.replace(/^/gm, '> ');
        return '\n\n' + content + '\n\n';
      }
    }, {
      filter: 'li',
      replacement: function replacement(content, node) {
        content = content.replace(/^\s+/, '').replace(/\n/gm, '\n    ');
        var prefix = '*   ';
        var parent = node.parentNode;
        var index = Array.prototype.indexOf.call(parent.children, node) + 1;

        prefix = /ol/i.test(parent.nodeName) ? index + '.  ' : '*   ';
        return prefix + content;
      }
    }, {
      filter: ['ul', 'ol'],
      replacement: function replacement(content, node) {
        var strings = [];
        for (var i = 0; i < node.childNodes.length; i++) {
          strings.push(node.childNodes[i]._replacement);
        }

        if (/li/i.test(node.parentNode.nodeName)) {
          return '\n' + strings.join('\n');
        }
        return '\n\n' + strings.join('\n') + '\n\n';
      }
    }, {
      filter: function filter(node) {
        return this.isBlock(node);
      },
      replacement: function replacement(content, node) {
        return '\n\n' + this.outer(node, content) + '\n\n';
      }
    },

    // Anything else!
    {
      filter: function filter() {
        return true;
      },
      replacement: function replacement(content, node) {
        return this.outer(node, content);
      }
    }];
  }, {}], 8: [function (require, module, exports) {
    /**
     * This file automatically generated from `pre-publish.js`.
     * Do not manually edit.
     */

    module.exports = {
      "area": true,
      "base": true,
      "br": true,
      "col": true,
      "embed": true,
      "hr": true,
      "img": true,
      "input": true,
      "keygen": true,
      "link": true,
      "menuitem": true,
      "meta": true,
      "param": true,
      "source": true,
      "track": true,
      "wbr": true
    };
  }, {}], 9: [function (require, module, exports) {
    'use strict';

    // Lib

    var markdownToHtml = require('marked');
    var htmlToMarkdown = require('to-markdown');

    /**
     * A rich text editor
     */

    var RichTextEditor = function (_View) {
      _inherits(RichTextEditor, _View);

      function RichTextEditor(params) {
        _classCallCheck(this, RichTextEditor);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RichTextEditor).call(this, params));

        _this.init();
        return _this;
      }

      /**
       * Event: Change input
       */


      _createClass(RichTextEditor, [{
        key: "onChange",
        value: function onChange() {
          this.trigger('change', this.$textarea.val());
        }
      }, {
        key: "render",
        value: function render() {
          var editor = this;

          // Main element
          this.$element = _.div({ class: 'field-editor rich-text-editor panel panel-default' }, [
          // Toolbar
          _.div({ class: 'panel-heading' }, _.div({ class: 'btn-group' }, [_.button({ class: 'btn btn-default', 'data-wrap': 'strong' }, _.span({ class: 'fa fa-bold' })), _.button({ class: 'btn btn-default', 'data-wrap': 'em' }, _.span({ class: 'fa fa-italic' }))])),

          // HTML output
          _.div({ class: 'panel-body' }, this.$output = _.div({ class: 'rte-output', contenteditable: true }).bind('change propertychange keyup paste', function () {
            editor.$textarea.val(htmlToMarkdown(editor.$output.html()));

            editor.onChange();
          })),

          // Markdown editor
          _.div({ class: 'panel-footer' }, this.$textarea = _.textarea({ class: 'form-control', type: 'text' }, this.value).bind('change propertychange keyup paste', function () {
            editor.$output.html(markdownToHtml(editor.$textarea.val()));

            editor.onChange();
          }))]);

          // Initial call to render markdown as HTML
          this.$output.html(markdownToHtml(this.$textarea.val()));
        }
      }]);

      return RichTextEditor;
    }(View);

    resources.editors['20001'] = RichTextEditor;
  }, { "marked": 4, "to-markdown": 5 }] }, {}, [9]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        var SchemaReferenceEditor = function (_View) {
            _inherits(SchemaReferenceEditor, _View);

            function SchemaReferenceEditor(params) {
                _classCallCheck(this, SchemaReferenceEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SchemaReferenceEditor).call(this, params));

                _this.init();
                return _this;
            }

            /**
             * Event: Change input
             */


            _createClass(SchemaReferenceEditor, [{
                key: "onChange",
                value: function onChange() {
                    this.trigger('change', this.$select.val());
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    this.$element = _.div({ class: 'field-editor schema-reference-editor' }, this.$select = _.select({ class: 'form-control' }, _.each(window.resources.schemas, function (id, schema) {
                        if (editor.config) {
                            var id = parseInt(schema.id);

                            if (editor.config.min && id < editor.config.min) {
                                return;
                            }

                            if (editor.config.max && id > editor.config.max) {
                                return;
                            }
                        }

                        return _.option({ value: schema.id }, schema.name);
                    })).change(function () {
                        editor.onChange();
                    }));

                    this.$select.val(editor.value);
                }
            }]);

            return SchemaReferenceEditor;
        }(View);

        resources.editors['20004'] = SchemaReferenceEditor;
    }, {}] }, {}, [1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        /**
         * A simple string editor
         */

        var StringEditor = function (_View) {
            _inherits(StringEditor, _View);

            function StringEditor(params) {
                _classCallCheck(this, StringEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StringEditor).call(this, params));

                _this.init();
                return _this;
            }

            /**
             * Event: Change
             */


            _createClass(StringEditor, [{
                key: "onChange",
                value: function onChange() {
                    this.trigger('change', this.$input.val());
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    // Main element
                    this.$element = _.div({ class: 'field-editor string-editor' }, this.$input = _.input({ class: 'form-control', value: this.value }).bind('change propertychange paste keyup', function () {
                        editor.onChange();
                    }));
                }
            }]);

            return StringEditor;
        }(View);

        resources.editors['20000'] = StringEditor;
    }, {}] }, {}, [1]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        var UrlEditor = function (_View) {
            _inherits(UrlEditor, _View);

            function UrlEditor(params) {
                _classCallCheck(this, UrlEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UrlEditor).call(this, params));

                _this.init();
                return _this;
            }

            _createClass(UrlEditor, [{
                key: "regenerate",
                value: function regenerate() {
                    this.$input.val('/new-url/');

                    this.trigger('change', this.$input.val());
                }
            }, {
                key: "onChange",
                value: function onChange() {
                    this.trigger('change', this.$input.val());
                }
            }, {
                key: "render",
                value: function render() {
                    var editor = this;

                    this.$element = _.div({ class: 'field-editor url-editor input-group' }, [this.$input = _.input({ class: 'form-control', value: this.value }).bind('change propertychange paste keyup', function () {
                        this.onChange();
                    }), _.div({ class: 'input-group-btn' }, _.button({ class: 'btn btn-primary' }, 'Regenerate ').click(function () {
                        editor.regenerate();
                    }))]);
                }
            }]);

            return UrlEditor;
        }(View);

        resources.editors['20003'] = UrlEditor;
    }, {}] }, {}, [1]);