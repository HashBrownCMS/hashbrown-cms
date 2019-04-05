'use strict';

/**
 * A helper class for handling markdown
 *
 * @memberof HashBrown.Client.Helpers
 */
class MarkdownHelper {
    /**
     * Converts a string from HTML to markdown
     *
     * @param {String} html
     *
     * @return {String} Markdown
     *
     * MIT License
     *  
     * Copyright (c) 2017 Dom Christie
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     */
    static fromHtml(html) {
        function extend (destination) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (source.hasOwnProperty(key)) destination[key] = source[key];
                }
            }
            return destination
        }

        function repeat (character, count) {
            return Array(count + 1).join(character)
        }

        var blockElements = [
            'address', 'article', 'aside', 'audio', 'blockquote', 'body', 'canvas',
            'center', 'dd', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption',
            'figure', 'footer', 'form', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'header', 'hgroup', 'hr', 'html', 'isindex', 'li', 'main', 'menu', 'nav',
            'noframes', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table',
            'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'
        ];

        function isBlock (node) {
            return blockElements.indexOf(node.nodeName.toLowerCase()) !== -1
        }

        var voidElements = [
            'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
            'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
        ];

        function isVoid (node) {
            return voidElements.indexOf(node.nodeName.toLowerCase()) !== -1
        }

        var voidSelector = voidElements.join();
        
        function hasVoid (node) {
            return node.querySelector && node.querySelector(voidSelector)
        }

        var rules = {};

        rules.paragraph = {
            filter: 'p',

            replacement: function (content) {
                return '\n\n' + content + '\n\n'
            }
        };

        rules.lineBreak = {
            filter: 'br',

            replacement: function (content, node, options) {
                return options.br + '\n'
            }
        };

        rules.heading = {
            filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

            replacement: function (content, node, options) {
                var hLevel = Number(node.nodeName.charAt(1));

                if (options.headingStyle === 'setext' && hLevel < 3) {
                    var underline = repeat((hLevel === 1 ? '=' : '-'), content.length);
                    return (
                        '\n\n' + content + '\n' + underline + '\n\n'
                    )
                } else {
                    return '\n\n' + repeat('#', hLevel) + ' ' + content + '\n\n'
                }
            }
        };

        rules.blockquote = {
            filter: 'blockquote',

            replacement: function (content) {
                content = content.replace(/^\n+|\n+$/g, '');
                content = content.replace(/^/gm, '> ');
                return '\n\n' + content + '\n\n'
            }
        };

        rules.list = {
            filter: ['ul', 'ol'],

            replacement: function (content, node) {
                var parent = node.parentNode;
                if (parent.nodeName === 'LI' && parent.lastElementChild === node) {
                    return '\n' + content
                } else {
                    return '\n\n' + content + '\n\n'
                }
            }
        };

        rules.listItem = {
            filter: 'li',

            replacement: function (content, node, options) {
                content = content
                    .replace(/^\n+/, '') // remove leading newlines
                    .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
                    .replace(/\n/gm, '\n    '); // indent
                var prefix = options.bulletListMarker + '   ';
                var parent = node.parentNode;
                if (parent.nodeName === 'OL') {
                    var start = parent.getAttribute('start');
                    var index = Array.prototype.indexOf.call(parent.children, node);
                    prefix = (start ? Number(start) + index : index + 1) + '.  ';
                }
                return (
                    prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
                )
            }
        };

        rules.indentedCodeBlock = {
            filter: function (node, options) {
                return (
                    options.codeBlockStyle === 'indented' &&
                    node.nodeName === 'PRE' &&
                    node.firstChild &&
                    node.firstChild.nodeName === 'CODE'
                )
            },

            replacement: function (content, node, options) {
                return (
                    '\n\n    ' +
                    node.firstChild.textContent.replace(/\n/g, '\n    ') +
                    '\n\n'
                )
            }
        };

        rules.fencedCodeBlock = {
            filter: function (node, options) {
                return (
                    options.codeBlockStyle === 'fenced' &&
                    node.nodeName === 'PRE' &&
                    node.firstChild &&
                    node.firstChild.nodeName === 'CODE'
                )
            },

            replacement: function (content, node, options) {
                var className = node.firstChild.className || '';
                var language = (className.match(/language-(\S+)/) || [null, ''])[1];

                return (
                    '\n\n' + options.fence + language + '\n' +
                    node.firstChild.textContent +
                    '\n' + options.fence + '\n\n'
                )
            }
        };

        rules.horizontalRule = {
            filter: 'hr',

            replacement: function (content, node, options) {
                return '\n\n' + options.hr + '\n\n'
            }
        };

        rules.inlineLink = {
            filter: function (node, options) {
                return (
                    options.linkStyle === 'inlined' &&
                    node.nodeName === 'A' &&
                    node.getAttribute('href')
                )
            },

            replacement: function (content, node) {
                var href = node.getAttribute('href');
                var title = node.title ? ' "' + node.title + '"' : '';
                return '[' + content + '](' + href + title + ')'
            }
        };

        rules.referenceLink = {
            filter: function (node, options) {
                return (
                    options.linkStyle === 'referenced' &&
                    node.nodeName === 'A' &&
                    node.getAttribute('href')
                )
            },

            replacement: function (content, node, options) {
                var href = node.getAttribute('href');
                var title = node.title ? ' "' + node.title + '"' : '';
                var replacement;
                var reference;

                switch (options.linkReferenceStyle) {
                    case 'collapsed':
                        replacement = '[' + content + '][]';
                        reference = '[' + content + ']: ' + href + title;
                        break
                    case 'shortcut':
                        replacement = '[' + content + ']';
                        reference = '[' + content + ']: ' + href + title;
                        break
                    default:
                        var id = this.references.length + 1;
                        replacement = '[' + content + '][' + id + ']';
                        reference = '[' + id + ']: ' + href + title;
                }

                this.references.push(reference);
                return replacement
            },

            references: [],

            append: function (options) {
                var references = '';
                if (this.references.length) {
                    references = '\n\n' + this.references.join('\n') + '\n\n';
                    this.references = []; // Reset references
                }
                return references
            }
        };

        rules.emphasis = {
            filter: ['em', 'i'],

            replacement: function (content, node, options) {
                if (!content.trim()) return ''
                return options.emDelimiter + content + options.emDelimiter
            }
        };

        rules.strong = {
            filter: ['strong', 'b'],

            replacement: function (content, node, options) {
                if (!content.trim()) return ''
                return options.strongDelimiter + content + options.strongDelimiter
            }
        };

        rules.code = {
            filter: function (node) {
                var hasSiblings = node.previousSibling || node.nextSibling;
                var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings;

                return node.nodeName === 'CODE' && !isCodeBlock
            },

            replacement: function (content) {
                if (!content.trim()) return ''

                var delimiter = '`';
                var leadingSpace = '';
                var trailingSpace = '';
                var matches = content.match(/`+/gm);
                if (matches) {
                    if (/^`/.test(content)) leadingSpace = ' ';
                    if (/`$/.test(content)) trailingSpace = ' ';
                    while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + '`';
                }

                return delimiter + leadingSpace + content + trailingSpace + delimiter
            }
        };

        rules.image = {
            filter: 'img',

            replacement: function (content, node) {
                var alt = node.alt || '';
                var src = node.getAttribute('src') || '';
                var title = node.title || '';
                var titlePart = title ? ' "' + title + '"' : '';
                return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : ''
            }
        };

        /**
         * Manages a collection of rules used to convert HTML to Markdown
         */
        function Rules (options) {
            this.options = options;
            this._keep = [];
            this._remove = [];

            this.blankRule = {
                replacement: options.blankReplacement
            };

            this.keepReplacement = options.keepReplacement;

            this.defaultRule = {
                replacement: options.defaultReplacement
            };

            this.array = [];
            for (var key in options.rules) this.array.push(options.rules[key]);
        }

        Rules.prototype = {
            add: function (key, rule) {
                this.array.unshift(rule);
            },

            keep: function (filter) {
                this._keep.unshift({
                    filter: filter,
                    replacement: this.keepReplacement
                });
            },

            remove: function (filter) {
                this._remove.unshift({
                    filter: filter,
                    replacement: function () {
                        return ''
                    }
                });
            },

            forNode: function (node) {
                if (node.isBlank) return this.blankRule
                var rule;

                if ((rule = findRule(this.array, node, this.options))) return rule
                if ((rule = findRule(this._keep, node, this.options))) return rule
                if ((rule = findRule(this._remove, node, this.options))) return rule

                return this.defaultRule
            },

            forEach: function (fn) {
                for (var i = 0; i < this.array.length; i++) fn(this.array[i], i);
            }
        };

        function findRule (rules, node, options) {
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                if (filterValue(rule, node, options)) return rule
            }
            return void 0
        }

        function filterValue (rule, node, options) {
            var filter = rule.filter;
            if (typeof filter === 'string') {
                if (filter === node.nodeName.toLowerCase()) return true
            } else if (Array.isArray(filter)) {
                if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true
            } else if (typeof filter === 'function') {
                if (filter.call(rule, node, options)) return true
            } else {
                throw new TypeError('`filter` needs to be a string, array, or function')
            }
        }

        /**
         * The collapseWhitespace function is adapted from collapse-whitespace
         * by Luc Thevenard.
         *
         * The MIT License (MIT)
         *
         * Copyright (c) 2014 Luc Thevenard <lucthevenard@gmail.com>
         *
         * Permission is hereby granted, free of charge, to any person obtaining a copy
         * of this software and associated documentation files (the "Software"), to deal
         * in the Software without restriction, including without limitation the rights
         * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
         * copies of the Software, and to permit persons to whom the Software is
         * furnished to do so, subject to the following conditions:
         *
         * The above copyright notice and this permission notice shall be included in
         * all copies or substantial portions of the Software.
         *
         * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
         * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
         * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
         * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
         * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
         * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
         * THE SOFTWARE.
         */

        /**
         * collapseWhitespace(options) removes extraneous whitespace from an the given element.
         *
         * @param {Object} options
         */
        function collapseWhitespace (options) {
            var element = options.element;
            var isBlock = options.isBlock;
            var isVoid = options.isVoid;
            var isPre = options.isPre || function (node) {
                return node.nodeName === 'PRE'
            };

            if (!element.firstChild || isPre(element)) return

            var prevText = null;
            var prevVoid = false;

            var prev = null;
            var node = next(prev, element, isPre);

            while (node !== element) {
                if (node.nodeType === 3 || node.nodeType === 4) { // Node.TEXT_NODE or Node.CDATA_SECTION_NODE
                    var text = node.data.replace(/[ \r\n\t]+/g, ' ');

                    if ((!prevText || / $/.test(prevText.data)) &&
                        !prevVoid && text[0] === ' ') {
                        text = text.substr(1);
                    }

                    // `text` might be empty at this point.
                    if (!text) {
                        node = remove(node);
                        continue
                    }

                    node.data = text;

                    prevText = node;
                } else if (node.nodeType === 1) { // Node.ELEMENT_NODE
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
                    continue
                }

                var nextNode = next(prev, node, isPre);
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
        function remove (node) {
            var next = node.nextSibling || node.parentNode;

            node.parentNode.removeChild(node);

            return next
        }

        /**
         * next(prev, current, isPre) returns the next node in the sequence, given the
         * current and previous nodes.
         *
         * @param {Node} prev
         * @param {Node} current
         * @param {Function} isPre
         * @return {Node}
         */
        function next (prev, current, isPre) {
            if ((prev && prev.parentNode === current) || isPre(current)) {
                return current.nextSibling || current.parentNode
            }

            return current.firstChild || current.nextSibling || current.parentNode
        }

        /*
         * Set up window for Node.js
         */

        var root = (typeof window !== 'undefined' ? window : {});

        /*
         * Parsing HTML strings
         */

        function canParseHTMLNatively () {
            var Parser = root.DOMParser;
            var canParse = false;

            // Adapted from https://gist.github.com/1129031
            // Firefox/Opera/IE throw errors on unsupported types
            try {
                // WebKit returns null on unsupported types
                if (new Parser().parseFromString('', 'text/html')) {
                    canParse = true;
                }
            } catch (e) {}

            return canParse
        }

        function createHTMLParser () {
            var Parser = function () {};

            {
                if (shouldUseActiveX()) {
                    Parser.prototype.parseFromString = function (string) {
                        var doc = new window.ActiveXObject('htmlfile');
                        doc.designMode = 'on'; // disable on-page scripts
                        doc.open();
                        doc.write(string);
                        doc.close();
                        return doc
                    };
                } else {
                    Parser.prototype.parseFromString = function (string) {
                        var doc = document.implementation.createHTMLDocument('');
                        doc.open();
                        doc.write(string);
                        doc.close();
                        return doc
                    };
                }
            }
            return Parser
        }

        function shouldUseActiveX () {
            var useActiveX = false;
            try {
                document.implementation.createHTMLDocument('').open();
            } catch (e) {
                if (window.ActiveXObject) useActiveX = true;
            }
            return useActiveX
        }

        var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();

        function RootNode (input) {
            var root;
            if (typeof input === 'string') {
                var doc = htmlParser().parseFromString(
                    // DOM parsers arrange elements in the <head> and <body>.
                    // Wrapping in a custom element ensures elements are reliably arranged in
                    // a single element.
                    '<x-turndown id="turndown-root">' + input + '</x-turndown>',
                    'text/html'
                );
                root = doc.getElementById('turndown-root');
            } else {
                root = input.cloneNode(true);
            }
            collapseWhitespace({
                element: root,
                isBlock: isBlock,
                isVoid: isVoid
            });

            return root
        }

        var _htmlParser;
        function htmlParser () {
            _htmlParser = _htmlParser || new HTMLParser();
            return _htmlParser
        }

        function Node (node) {
            node.isBlock = isBlock(node);
            node.isCode = node.nodeName.toLowerCase() === 'code' || node.parentNode.isCode;
            node.isBlank = isBlank(node);
            node.flankingWhitespace = flankingWhitespace(node);
            return node
        }

        function isBlank (node) {
            return (
                ['A', 'TH', 'TD', 'IFRAME', 'SCRIPT', 'AUDIO', 'VIDEO'].indexOf(node.nodeName) === -1 &&
                /^\s*$/i.test(node.textContent) &&
                !isVoid(node) &&
                !hasVoid(node)
            )
        }

        function flankingWhitespace (node) {
            var leading = '';
            var trailing = '';

            if (!node.isBlock) {
                var hasLeading = /^[ \r\n\t]/.test(node.textContent);
                var hasTrailing = /[ \r\n\t]$/.test(node.textContent);

                if (hasLeading && !isFlankedByWhitespace('left', node)) {
                    leading = ' ';
                }
                if (hasTrailing && !isFlankedByWhitespace('right', node)) {
                    trailing = ' ';
                }
            }

            return { leading: leading, trailing: trailing }
        }

        function isFlankedByWhitespace (side, node) {
            var sibling;
            var regExp;
            var isFlanked;

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
            return isFlanked
        }

        var reduce = Array.prototype.reduce;
        var leadingNewLinesRegExp = /^\n*/;
        var trailingNewLinesRegExp = /\n*$/;
        var escapes = [
            [/\\/g, '\\\\'],
            [/\*/g, '\\*'],
            [/^-/g, '\\-'],
            [/^\+ /g, '\\+ '],
            [/^(=+)/g, '\\$1'],
            [/^(#{1,6}) /g, '\\$1 '],
            [/`/g, '\\`'],
            [/^~~~/g, '\\~~~'],
            [/\[/g, '\\['],
            [/\]/g, '\\]'],
            [/^>/g, '\\>'],
            [/_/g, '\\_'],
            [/^(\d+)\. /g, '$1\\. ']
        ];

        function TurndownService (options) {
            if (!(this instanceof TurndownService)) return new TurndownService(options)

            var defaults = {
                rules: rules,
                headingStyle: 'setext',
                hr: '* * *',
                bulletListMarker: '*',
                codeBlockStyle: 'indented',
                fence: '```',
                emDelimiter: '_',
                strongDelimiter: '**',
                linkStyle: 'inlined',
                linkReferenceStyle: 'full',
                br: '  ',
                blankReplacement: function (content, node) {
                    return node.isBlock ? '\n\n' : ''
                },
                keepReplacement: function (content, node) {
                    return node.isBlock ? '\n\n' + node.outerHTML + '\n\n' : node.outerHTML
                },
                defaultReplacement: function (content, node) {
                    return node.isBlock ? '\n\n' + content + '\n\n' : content
                }
            };
            this.options = extend({}, defaults, options);
            this.rules = new Rules(this.options);
        }

        TurndownService.prototype = {
            /**
             * The entry point for converting a string or DOM node to Markdown
             * @public
             * @param {String|HTMLElement} input The string or DOM node to convert
             * @returns A Markdown representation of the input
             * @type String
             */

            turndown: function (input) {
                if (!canConvert(input)) {
                    throw new TypeError(
                        input + ' is not a string, or an element/document/fragment node.'
                    )
                }

                if (input === '') return ''

                var output = process.call(this, new RootNode(input));
                return postProcess.call(this, output)
            },

            /**
             * Add one or more plugins
             * @public
             * @param {Function|Array} plugin The plugin or array of plugins to add
             * @returns The Turndown instance for chaining
             * @type Object
             */

            use: function (plugin) {
                if (Array.isArray(plugin)) {
                    for (var i = 0; i < plugin.length; i++) this.use(plugin[i]);
                } else if (typeof plugin === 'function') {
                    plugin(this);
                } else {
                    throw new TypeError('plugin must be a Function or an Array of Functions')
                }
                return this
            },

            /**
             * Adds a rule
             * @public
             * @param {String} key The unique key of the rule
             * @param {Object} rule The rule
             * @returns The Turndown instance for chaining
             * @type Object
             */

            addRule: function (key, rule) {
                this.rules.add(key, rule);
                return this
            },

            /**
             * Keep a node (as HTML) that matches the filter
             * @public
             * @param {String|Array|Function} filter The unique key of the rule
             * @returns The Turndown instance for chaining
             * @type Object
             */

            keep: function (filter) {
                this.rules.keep(filter);
                return this
            },

            /**
             * Remove a node that matches the filter
             * @public
             * @param {String|Array|Function} filter The unique key of the rule
             * @returns The Turndown instance for chaining
             * @type Object
             */

            remove: function (filter) {
                this.rules.remove(filter);
                return this
            },

            /**
             * Escapes Markdown syntax
             * @public
             * @param {String} string The string to escape
             * @returns A string with Markdown syntax escaped
             * @type String
             */

            escape: function (string) {
                return escapes.reduce(function (accumulator, escape) {
                    return accumulator.replace(escape[0], escape[1])
                }, string)
            }
        };

        /**
         * Reduces a DOM node down to its Markdown string equivalent
         * @private
         * @param {HTMLElement} parentNode The node to convert
         * @returns A Markdown representation of the node
         * @type String
         */

        function process (parentNode) {
            var self = this;
            return reduce.call(parentNode.childNodes, function (output, node) {
                node = new Node(node);

                var replacement = '';
                if (node.nodeType === 3) {
                    replacement = node.isCode ? node.nodeValue : self.escape(node.nodeValue);
                } else if (node.nodeType === 1) {
                    replacement = replacementForNode.call(self, node);
                }

                return join(output, replacement)
            }, '')
        }

        /**
         * Appends strings as each rule requires and trims the output
         * @private
         * @param {String} output The conversion output
         * @returns A trimmed version of the ouput
         * @type String
         */

        function postProcess (output) {
            var self = this;
            this.rules.forEach(function (rule) {
                if (typeof rule.append === 'function') {
                    output = join(output, rule.append(self.options));
                }
            });

            return output.replace(/^[\t\r\n]+/, '').replace(/[\t\r\n\s]+$/, '')
        }

        /**
         * Converts an element node to its Markdown equivalent
         * @private
         * @param {HTMLElement} node The node to convert
         * @returns A Markdown representation of the node
         * @type String
         */

        function replacementForNode (node) {
            var rule = this.rules.forNode(node);
            var content = process.call(this, node);
            var whitespace = node.flankingWhitespace;
            if (whitespace.leading || whitespace.trailing) content = content.trim();
            return (
                whitespace.leading +
                rule.replacement(content, node, this.options) +
                whitespace.trailing
            )
        }

        /**
         * Determines the new lines between the current output and the replacement
         * @private
         * @param {String} output The current conversion output
         * @param {String} replacement The string to append to the output
         * @returns The whitespace to separate the current output and the replacement
         * @type String
         */

        function separatingNewlines (output, replacement) {
            var newlines = [
                output.match(trailingNewLinesRegExp)[0],
                replacement.match(leadingNewLinesRegExp)[0]
            ].sort();
            var maxNewlines = newlines[newlines.length - 1];
            return maxNewlines.length < 2 ? maxNewlines : '\n\n'
        }

        function join (string1, string2) {
            var separator = separatingNewlines(string1, string2);

            // Remove trailing/leading newlines and replace with separator
            string1 = string1.replace(trailingNewLinesRegExp, '');
            string2 = string2.replace(leadingNewLinesRegExp, '');

            return string1 + separator + string2
        }

        /**
         * Determines whether an input can be converted
         * @private
         * @param {String|HTMLElement} input Describe this parameter
         * @returns Describe what it returns
         * @type String|Object|Array|Boolean|Number
         */

        function canConvert (input) {
            return (
                input != null && (
                    typeof input === 'string' ||
                    (input.nodeType && (
                        input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11
                    ))
                )
            )
        }

        return new TurndownService().turndown(html);
    }

    /**
     * Converts a markdown string to HTML
     *
     * @param {String} markdown
     *
     * @return {String} HTML
     *
     * Copyright (c) 2011-2018, Christopher Jeffrey (https://github.com/chjj/)
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    static toHtml(markdown) {
        /**
         * Block-Level Grammar
         */
        var block = {
            newline: /^\n+/,
            code: /^( {4}[^\n]+\n*)+/,
            fences: noop,
            hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
            heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
            nptable: noop,
            blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
            list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
            html: '^ {0,3}(?:' // optional indentation
            + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
            + '|comment[^\\n]*(\\n+|$)' // (2)
            + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
            + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
            + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
            + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
            + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
            + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
            + ')',
            def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
            table: noop,
            lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
            paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)*)/,
            text: /^[^\n]+/
        };

        block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
        block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
        block.def = edit(block.def)
            .replace('label', block._label)
            .replace('title', block._title)
            .getRegex();

        block.bullet = /(?:[*+-]|\d{1,9}\.)/;
        block.item = /^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/;
        block.item = edit(block.item, 'gm')
            .replace(/bull/g, block.bullet)
            .getRegex();

        block.list = edit(block.list)
            .replace(/bull/g, block.bullet)
            .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
            .replace('def', '\\n+(?=' + block.def.source + ')')
            .getRegex();

        block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
            + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
            + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
            + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
            + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
            + '|track|ul';
        block._comment = /<!--(?!-?>)[\s\S]*?-->/;
        block.html = edit(block.html, 'i')
            .replace('comment', block._comment)
            .replace('tag', block._tag)
            .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
            .getRegex();

        block.paragraph = edit(block.paragraph)
            .replace('hr', block.hr)
            .replace('heading', block.heading)
            .replace('lheading', block.lheading)
            .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
            .getRegex();

        block.blockquote = edit(block.blockquote)
            .replace('paragraph', block.paragraph)
            .getRegex();

        /**
         * Normal Block Grammar
         */

        block.normal = merge({}, block);

        /**
         * GFM Block Grammar
         */

        block.gfm = merge({}, block.normal, {
            fences: /^ {0,3}(`{3,}|~{3,})([^`\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
            paragraph: /^/,
            heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
        });

        block.gfm.paragraph = edit(block.paragraph)
            .replace('(?!', '(?!'
                + block.gfm.fences.source.replace('\\1', '\\2') + '|'
                + block.list.source.replace('\\1', '\\3') + '|')
            .getRegex();

        /**
         * GFM + Tables Block Grammar
         */

        block.tables = merge({}, block.gfm, {
            nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
            table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
        });

        /**
         * Pedantic grammar
         */

        block.pedantic = merge({}, block.normal, {
            html: edit(
                '^ *(?:comment *(?:\\n|\\s*$)'
                + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
                + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
            .replace('comment', block._comment)
            .replace(/tag/g, '(?!(?:'
                + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
                + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
                + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
            .getRegex(),
            def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/
        });

        /**
         * Block Lexer
         */

        function Lexer(options) {
            this.tokens = [];
            this.tokens.links = Object.create(null);
            this.options = options || marked.defaults;
            this.rules = block.normal;

            if (this.options.pedantic) {
                this.rules = block.pedantic;
            } else if (this.options.gfm) {
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

        Lexer.lex = function(src, options) {
            var lexer = new Lexer(options);
            return lexer.lex(src);
        };

        /**
         * Preprocessing
         */

        Lexer.prototype.lex = function(src) {
            src = src
                .replace(/\r\n|\r/g, '\n')
                .replace(/\t/g, '    ')
                .replace(/\u00a0/g, ' ')
                .replace(/\u2424/g, '\n');

            return this.token(src, true);
        };

        /**
         * Lexing
         */

        Lexer.prototype.token = function(src, top) {
            src = src.replace(/^ +$/gm, '');
            var next,
                loose,
                cap,
                bull,
                b,
                item,
                listStart,
                listItems,
                t,
                space,
                i,
                tag,
                l,
                isordered,
                istask,
                ischecked;

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
                        text: !this.options.pedantic
                        ? rtrim(cap, '\n')
                        : cap
                    });
                    continue;
                }

                // fences (gfm)
                if (cap = this.rules.fences.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'code',
                        lang: cap[2] ? cap[2].trim() : cap[2],
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
                if (cap = this.rules.nptable.exec(src)) {
                    item = {
                        type: 'table',
                        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
                        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                        cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
                    };

                    if (item.header.length === item.align.length) {
                        src = src.substring(cap[0].length);

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
                            item.cells[i] = splitCells(item.cells[i], item.header.length);
                        }

                        this.tokens.push(item);

                        continue;
                    }
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
                    this.token(cap, top);

                    this.tokens.push({
                        type: 'blockquote_end'
                    });

                    continue;
                }

                // list
                if (cap = this.rules.list.exec(src)) {
                    src = src.substring(cap[0].length);
                    bull = cap[2];
                    isordered = bull.length > 1;

                    listStart = {
                        type: 'list_start',
                        ordered: isordered,
                        start: isordered ? +bull : '',
                        loose: false
                    };

                    this.tokens.push(listStart);

                    // Get each top-level item.
                    cap = cap[0].match(this.rules.item);

                    listItems = [];
                    next = false;
                    l = cap.length;
                    i = 0;

                    for (; i < l; i++) {
                        item = cap[i];

                        // Remove the list item's bullet
                        // so it is seen as the next token.
                        space = item.length;
                        item = item.replace(/^ *([*+-]|\d+\.) */, '');

                        // Outdent whatever the
                        // list item contains. Hacky.
                        if (~item.indexOf('\n ')) {
                            space -= item.length;
                            item = !this.options.pedantic
                                ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
                                : item.replace(/^ {1,4}/gm, '');
                        }

                        // Determine whether the next list item belongs here.
                        // Backpedal if it does not belong in this list.
                        if (i !== l - 1) {
                            b = block.bullet.exec(cap[i + 1])[0];
                            if (bull.length > 1 ? b.length === 1
                                : (b.length > 1 || (this.options.smartLists && b !== bull))) {
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

                        if (loose) {
                            listStart.loose = true;
                        }

                        // Check for task list items
                        istask = /^\[[ xX]\] /.test(item);
                        ischecked = undefined;
                        if (istask) {
                            ischecked = item[1] !== ' ';
                            item = item.replace(/^\[[ xX]\] +/, '');
                        }

                        t = {
                            type: 'list_item_start',
                            task: istask,
                            checked: ischecked,
                            loose: loose
                        };

                        listItems.push(t);
                        this.tokens.push(t);

                        // Recurse.
                        this.token(item, false);

                        this.tokens.push({
                            type: 'list_item_end'
                        });
                    }

                    if (listStart.loose) {
                        l = listItems.length;
                        i = 0;
                        for (; i < l; i++) {
                            listItems[i].loose = true;
                        }
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
                        type: this.options.sanitize
                        ? 'paragraph'
                        : 'html',
                        pre: !this.options.sanitizer
                        && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
                        text: cap[0]
                    });
                    continue;
                }

                // def
                if (top && (cap = this.rules.def.exec(src))) {
                    src = src.substring(cap[0].length);
                    if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
                    tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
                    if (!this.tokens.links[tag]) {
                        this.tokens.links[tag] = {
                            href: cap[2],
                            title: cap[3]
                        };
                    }
                    continue;
                }

                // table (gfm)
                if (cap = this.rules.table.exec(src)) {
                    item = {
                        type: 'table',
                        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
                        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                        cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
                    };

                    if (item.header.length === item.align.length) {
                        src = src.substring(cap[0].length);

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
                            item.cells[i] = splitCells(
                                item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
                                item.header.length);
                        }

                        this.tokens.push(item);

                        continue;
                    }
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

                // top-level paragraph
                if (top && (cap = this.rules.paragraph.exec(src))) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'paragraph',
                        text: cap[1].charAt(cap[1].length - 1) === '\n'
                        ? cap[1].slice(0, -1)
                        : cap[1]
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
            escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
            autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
            url: noop,
            tag: '^comment'
            + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
            + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
            + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
            + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
            + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
            link: /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/,
            reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
            nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
            strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
            em: /^_([^\s_])_(?!_)|^\*([^\s*"<\[])\*(?!\*)|^_([^\s][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s"<\[][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
            code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
            br: /^( {2,}|\\)\n(?!\s*$)/,
            del: noop,
            text: /^(`+|[^`])[\s\S]*?(?=[\\<!\[`*]|\b_| {2,}\n|$)/
        };

        // list of punctuation marks from common mark spec
        // without ` and ] to workaround Rule 17 (inline code blocks/links)
        inline._punctuation = '!"#$%&\'()*+,\\-./:;<=>?@\\[^_{|}~';
        inline.em = edit(inline.em).replace(/punctuation/g, inline._punctuation).getRegex();

        inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

        inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
        inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
        inline.autolink = edit(inline.autolink)
            .replace('scheme', inline._scheme)
            .replace('email', inline._email)
            .getRegex();

        inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

        inline.tag = edit(inline.tag)
            .replace('comment', block._comment)
            .replace('attribute', inline._attribute)
            .getRegex();

        inline._label = /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|`(?!`)|[^\[\]\\`])*?/;
        inline._href = /\s*(<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*)/;
        inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

        inline.link = edit(inline.link)
            .replace('label', inline._label)
            .replace('href', inline._href)
            .replace('title', inline._title)
            .getRegex();

        inline.reflink = edit(inline.reflink)
            .replace('label', inline._label)
            .getRegex();

        /**
         * Normal Inline Grammar
         */

        inline.normal = merge({}, inline);

        /**
         * Pedantic Inline Grammar
         */

        inline.pedantic = merge({}, inline.normal, {
            strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
            em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
            link: edit(/^!?\[(label)\]\((.*?)\)/)
            .replace('label', inline._label)
            .getRegex(),
            reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
            .replace('label', inline._label)
            .getRegex()
        });

        /**
         * GFM Inline Grammar
         */

        inline.gfm = merge({}, inline.normal, {
            escape: edit(inline.escape).replace('])', '~|])').getRegex(),
            _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
            url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
            _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
            del: /^~+(?=\S)([\s\S]*?\S)~+/,
            text: edit(inline.text)
            .replace(']|', '~]|')
            .replace('|$', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|$')
            .getRegex()
        });

        inline.gfm.url = edit(inline.gfm.url, 'i')
            .replace('email', inline.gfm._extended_email)
            .getRegex();
        /**
         * GFM + Line Breaks Inline Grammar
         */

        inline.breaks = merge({}, inline.gfm, {
            br: edit(inline.br).replace('{2,}', '*').getRegex(),
            text: edit(inline.gfm.text).replace('{2,}', '*').getRegex()
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

            if (this.options.pedantic) {
                this.rules = inline.pedantic;
            } else if (this.options.gfm) {
                if (this.options.breaks) {
                    this.rules = inline.breaks;
                } else {
                    this.rules = inline.gfm;
                }
            }
        }

        /**
         * Expose Inline Rules
         */

        InlineLexer.rules = inline;

        /**
         * Static Lexing/Compiling Method
         */

        InlineLexer.output = function(src, links, options) {
            var inline = new InlineLexer(links, options);
            return inline.output(src);
        };

        /**
         * Lexing/Compiling
         */

        InlineLexer.prototype.output = function(src) {
            var out = '',
                link,
                text,
                href,
                title,
                cap,
                prevCapZero;

            while (src) {
                // escape
                if (cap = this.rules.escape.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += escape(cap[1]);
                    continue;
                }

                // tag
                if (cap = this.rules.tag.exec(src)) {
                    if (!this.inLink && /^<a /i.test(cap[0])) {
                        this.inLink = true;
                    } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
                        this.inLink = false;
                    }
                    if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
                        this.inRawBlock = true;
                    } else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
                        this.inRawBlock = false;
                    }

                    src = src.substring(cap[0].length);
                    out += this.options.sanitize
                        ? this.options.sanitizer
                        ? this.options.sanitizer(cap[0])
                        : escape(cap[0])
                        : cap[0];
                    continue;
                }

                // link
                if (cap = this.rules.link.exec(src)) {
                    var lastParenIndex = findClosingBracket(cap[2], '()');
                    if (lastParenIndex > -1) {
                        var linkLen = cap[0].length - (cap[2].length - lastParenIndex) - (cap[3] || '').length;
                        cap[2] = cap[2].substring(0, lastParenIndex);
                        cap[0] = cap[0].substring(0, linkLen).trim();
                        cap[3] = '';
                    }
                    src = src.substring(cap[0].length);
                    this.inLink = true;
                    href = cap[2];
                    if (this.options.pedantic) {
                        link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

                        if (link) {
                            href = link[1];
                            title = link[3];
                        } else {
                            title = '';
                        }
                    } else {
                        title = cap[3] ? cap[3].slice(1, -1) : '';
                    }
                    href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
                    out += this.outputLink(cap, {
                        href: InlineLexer.escapes(href),
                        title: InlineLexer.escapes(title)
                    });
                    this.inLink = false;
                    continue;
                }

                // reflink, nolink
                if ((cap = this.rules.reflink.exec(src))
                    || (cap = this.rules.nolink.exec(src))) {
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
                    out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
                    continue;
                }

                // em
                if (cap = this.rules.em.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
                    continue;
                }

                // code
                if (cap = this.rules.code.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += this.renderer.codespan(escape(cap[2].trim(), true));
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

                // autolink
                if (cap = this.rules.autolink.exec(src)) {
                    src = src.substring(cap[0].length);
                    if (cap[2] === '@') {
                        text = escape(this.mangle(cap[1]));
                        href = 'mailto:' + text;
                    } else {
                        text = escape(cap[1]);
                        href = text;
                    }
                    out += this.renderer.link(href, null, text);
                    continue;
                }

                // url (gfm)
                if (!this.inLink && (cap = this.rules.url.exec(src))) {
                    if (cap[2] === '@') {
                        text = escape(cap[0]);
                        href = 'mailto:' + text;
                    } else {
                        // do extended autolink path validation
                        do {
                            prevCapZero = cap[0];
                            cap[0] = this.rules._backpedal.exec(cap[0])[0];
                        } while (prevCapZero !== cap[0]);
                        text = escape(cap[0]);
                        if (cap[1] === 'www.') {
                            href = 'http://' + text;
                        } else {
                            href = text;
                        }
                    }
                    src = src.substring(cap[0].length);
                    out += this.renderer.link(href, null, text);
                    continue;
                }

                // text
                if (cap = this.rules.text.exec(src)) {
                    src = src.substring(cap[0].length);
                    if (this.inRawBlock) {
                        out += this.renderer.text(cap[0]);
                    } else {
                        out += this.renderer.text(escape(this.smartypants(cap[0])));
                    }
                    continue;
                }

                if (src) {
                    throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
                }
            }

            return out;
        };

        InlineLexer.escapes = function(text) {
            return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;
        };

        /**
         * Compile Link
         */

        InlineLexer.prototype.outputLink = function(cap, link) {
            var href = link.href,
                title = link.title ? escape(link.title) : null;

            return cap[0].charAt(0) !== '!'
                ? this.renderer.link(href, title, this.output(cap[1]))
                : this.renderer.image(href, title, escape(cap[1]));
        };

        /**
         * Smartypants Transformations
         */

        InlineLexer.prototype.smartypants = function(text) {
            if (!this.options.smartypants) return text;
            return text
            // em-dashes
                .replace(/---/g, '\u2014')
            // en-dashes
                .replace(/--/g, '\u2013')
            // opening singles
                .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
            // closing singles & apostrophes
                .replace(/'/g, '\u2019')
            // opening doubles
                .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
            // closing doubles
                .replace(/"/g, '\u201d')
            // ellipses
                .replace(/\.{3}/g, '\u2026');
        };

        /**
         * Mangle Links
         */

        InlineLexer.prototype.mangle = function(text) {
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
            this.options = options || marked.defaults;
        }

        Renderer.prototype.code = function(code, infostring, escaped) {
            var lang = (infostring || '').match(/\S*/)[0];
            if (this.options.highlight) {
                var out = this.options.highlight(code, lang);
                if (out != null && out !== code) {
                    escaped = true;
                    code = out;
                }
            }

            if (!lang) {
                return '<pre><code>'
                    + (escaped ? code : escape(code, true))
                    + '</code></pre>';
            }

            return '<pre><code class="'
                + this.options.langPrefix
                + escape(lang, true)
                + '">'
                + (escaped ? code : escape(code, true))
                + '</code></pre>\n';
        };

        Renderer.prototype.blockquote = function(quote) {
            return '<blockquote>\n' + quote + '</blockquote>\n';
        };

        Renderer.prototype.html = function(html) {
            return html;
        };

        Renderer.prototype.heading = function(text, level, raw, slugger) {
            if (this.options.headerIds) {
                return '<h'
                    + level
                    + ' id="'
                    + this.options.headerPrefix
                    + slugger.slug(raw)
                    + '">'
                    + text
                    + '</h'
                    + level
                    + '>\n';
            }
            // ignore IDs
            return '<h' + level + '>' + text + '</h' + level + '>\n';
        };

        Renderer.prototype.hr = function() {
            return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
        };

        Renderer.prototype.list = function(body, ordered, start) {
            var type = ordered ? 'ol' : 'ul',
                startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
            return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
        };

        Renderer.prototype.listitem = function(text) {
            return '<li>' + text + '</li>\n';
        };

        Renderer.prototype.checkbox = function(checked) {
            return '<input '
                + (checked ? 'checked="" ' : '')
                + 'disabled="" type="checkbox"'
                + (this.options.xhtml ? ' /' : '')
                + '> ';
        };

        Renderer.prototype.paragraph = function(text) {
            return '<p>' + text + '</p>\n';
        };

        Renderer.prototype.table = function(header, body) {
            if (body) body = '<tbody>' + body + '</tbody>';

            return '<table>\n'
                + '<thead>\n'
                + header
                + '</thead>\n'
                + body
                + '</table>\n';
        };

        Renderer.prototype.tablerow = function(content) {
            return '<tr>\n' + content + '</tr>\n';
        };

        Renderer.prototype.tablecell = function(content, flags) {
            var type = flags.header ? 'th' : 'td';
            var tag = flags.align
                ? '<' + type + ' align="' + flags.align + '">'
                : '<' + type + '>';
            return tag + content + '</' + type + '>\n';
        };

        // span level renderer
        Renderer.prototype.strong = function(text) {
            return '<strong>' + text + '</strong>';
        };

        Renderer.prototype.em = function(text) {
            return '<em>' + text + '</em>';
        };

        Renderer.prototype.codespan = function(text) {
            return '<code>' + text + '</code>';
        };

        Renderer.prototype.br = function() {
            return this.options.xhtml ? '<br/>' : '<br>';
        };

        Renderer.prototype.del = function(text) {
            return '<del>' + text + '</del>';
        };

        Renderer.prototype.link = function(href, title, text) {
            href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
            if (href === null) {
                return text;
            }
            var out = '<a href="' + escape(href) + '"';
            if (title) {
                out += ' title="' + title + '"';
            }
            out += '>' + text + '</a>';
            return out;
        };

        Renderer.prototype.image = function(href, title, text) {
            href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
            if (href === null) {
                return text;
            }

            var out = '<img src="' + href + '" alt="' + text + '"';
            if (title) {
                out += ' title="' + title + '"';
            }
            out += this.options.xhtml ? '/>' : '>';
            return out;
        };

        Renderer.prototype.text = function(text) {
            return text;
        };

        /**
         * TextRenderer
         * returns only the textual part of the token
         */

        function TextRenderer() {}

        // no need for block level renderers

        TextRenderer.prototype.strong =
            TextRenderer.prototype.em =
            TextRenderer.prototype.codespan =
            TextRenderer.prototype.del =
            TextRenderer.prototype.text = function (text) {
                return text;
            };

        TextRenderer.prototype.link =
            TextRenderer.prototype.image = function(href, title, text) {
                return '' + text;
            };

        TextRenderer.prototype.br = function() {
            return '';
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
            this.slugger = new Slugger();
        }

        /**
         * Static Parse Method
         */

        Parser.parse = function(src, options) {
            var parser = new Parser(options);
            return parser.parse(src);
        };

        /**
         * Parse Loop
         */

        Parser.prototype.parse = function(src) {
            this.inline = new InlineLexer(src.links, this.options);
            // use an InlineLexer with a TextRenderer to extract pure text
            this.inlineText = new InlineLexer(
                src.links,
                merge({}, this.options, {renderer: new TextRenderer()})
            );
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

        Parser.prototype.next = function() {
            return this.token = this.tokens.pop();
        };

        /**
         * Preview Next Token
         */

        Parser.prototype.peek = function() {
            return this.tokens[this.tokens.length - 1] || 0;
        };

        /**
         * Parse Text Tokens
         */

        Parser.prototype.parseText = function() {
            var body = this.token.text;

            while (this.peek().type === 'text') {
                body += '\n' + this.next().text;
            }

            return this.inline.output(body);
        };

        /**
         * Parse Current Token
         */

        Parser.prototype.tok = function() {
            switch (this.token.type) {
                case 'space': {
                    return '';
                }
                case 'hr': {
                    return this.renderer.hr();
                }
                case 'heading': {
                    return this.renderer.heading(
                        this.inline.output(this.token.text),
                        this.token.depth,
                        unescape(this.inlineText.output(this.token.text)),
                        this.slugger);
                }
                case 'code': {
                    return this.renderer.code(this.token.text,
                        this.token.lang,
                        this.token.escaped);
                }
                case 'table': {
                    var header = '',
                    body = '',
                    i,
                    row,
                    cell,
                    j;

                    // header
                    cell = '';
                    for (i = 0; i < this.token.header.length; i++) {
                        cell += this.renderer.tablecell(
                            this.inline.output(this.token.header[i]),
                            { header: true, align: this.token.align[i] }
                        );
                    }
                    header += this.renderer.tablerow(cell);

                    for (i = 0; i < this.token.cells.length; i++) {
                        row = this.token.cells[i];

                        cell = '';
                        for (j = 0; j < row.length; j++) {
                            cell += this.renderer.tablecell(
                                this.inline.output(row[j]),
                                { header: false, align: this.token.align[j] }
                            );
                        }

                        body += this.renderer.tablerow(cell);
                    }
                    return this.renderer.table(header, body);
                }
                case 'blockquote_start': {
                    body = '';

                    while (this.next().type !== 'blockquote_end') {
                        body += this.tok();
                    }

                    return this.renderer.blockquote(body);
                }
                case 'list_start': {
                    body = '';
                    var ordered = this.token.ordered,
                    start = this.token.start;

                    while (this.next().type !== 'list_end') {
                        body += this.tok();
                    }

                    return this.renderer.list(body, ordered, start);
                }
                case 'list_item_start': {
                    body = '';
                    var loose = this.token.loose;
                    var checked = this.token.checked;
                    var task = this.token.task;

                    if (this.token.task) {
                        body += this.renderer.checkbox(checked);
                    }

                    while (this.next().type !== 'list_item_end') {
                        body += !loose && this.token.type === 'text'
                            ? this.parseText()
                            : this.tok();
                    }
                    return this.renderer.listitem(body, task, checked);
                }
                case 'html': {
                    // TODO parse inline content if parameter markdown=1
                    return this.renderer.html(this.token.text);
                }
                case 'paragraph': {
                    return this.renderer.paragraph(this.inline.output(this.token.text));
                }
                case 'text': {
                    return this.renderer.paragraph(this.parseText());
                }
                default: {
                    var errMsg = 'Token with "' + this.token.type + '" type was not found.';
                    if (this.options.silent) {
                        console.log(errMsg);
                    } else {
                        throw new Error(errMsg);
                    }
                }
            }
        };

        /**
         * Slugger generates header id
         */

        function Slugger () {
            this.seen = {};
        }

        /**
         * Convert string to unique id
         */

        Slugger.prototype.slug = function (value) {
            var slug = value
                .toLowerCase()
                .trim()
                .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
                .replace(/\s/g, '-');

            if (this.seen.hasOwnProperty(slug)) {
                var originalSlug = slug;
                do {
                    this.seen[originalSlug]++;
                    slug = originalSlug + '-' + this.seen[originalSlug];
                } while (this.seen.hasOwnProperty(slug));
            }
            this.seen[slug] = 0;

            return slug;
        };

        /**
         * Helpers
         */

        function escape(html, encode) {
            if (encode) {
                if (escape.escapeTest.test(html)) {
                    return html.replace(escape.escapeReplace, function (ch) { return escape.replacements[ch]; });
                }
            } else {
                if (escape.escapeTestNoEncode.test(html)) {
                    return html.replace(escape.escapeReplaceNoEncode, function (ch) { return escape.replacements[ch]; });
                }
            }

            return html;
        }

        escape.escapeTest = /[&<>"']/;
        escape.escapeReplace = /[&<>"']/g;
        escape.replacements = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        escape.escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
        escape.escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;

        function unescape(html) {
            // explicitly match decimal, hex, and named HTML entities
            return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
                n = n.toLowerCase();
                if (n === 'colon') return ':';
                if (n.charAt(0) === '#') {
                    return n.charAt(1) === 'x'
                        ? String.fromCharCode(parseInt(n.substring(2), 16))
                        : String.fromCharCode(+n.substring(1));
                }
                return '';
            });
        }

        function edit(regex, opt) {
            regex = regex.source || regex;
            opt = opt || '';
            return {
                replace: function(name, val) {
                    val = val.source || val;
                    val = val.replace(/(^|[^\[])\^/g, '$1');
                    regex = regex.replace(name, val);
                    return this;
                },
                getRegex: function() {
                    return new RegExp(regex, opt);
                }
            };
        }

        function cleanUrl(sanitize, base, href) {
            if (sanitize) {
                try {
                    var prot = decodeURIComponent(unescape(href))
                        .replace(/[^\w:]/g, '')
                        .toLowerCase();
                } catch (e) {
                    return null;
                }
                if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
                    return null;
                }
            }
            if (base && !originIndependentUrl.test(href)) {
                href = resolveUrl(base, href);
            }
            try {
                href = encodeURI(href).replace(/%25/g, '%');
            } catch (e) {
                return null;
            }
            return href;
        }

        function resolveUrl(base, href) {
            if (!baseUrls[' ' + base]) {
                // we can ignore everything in base after the last slash of its path component,
                // but we might need to add _that_
                // https://tools.ietf.org/html/rfc3986#section-3
                if (/^[^:]+:\/*[^/]*$/.test(base)) {
                    baseUrls[' ' + base] = base + '/';
                } else {
                    baseUrls[' ' + base] = rtrim(base, '/', true);
                }
            }
            base = baseUrls[' ' + base];

            if (href.slice(0, 2) === '//') {
                return base.replace(/:[\s\S]*/, ':') + href;
            } else if (href.charAt(0) === '/') {
                return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
            } else {
                return base + href;
            }
        }
        var baseUrls = {};
        var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

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

        function splitCells(tableRow, count) {
            // ensure that every cell-delimiting pipe has a space
            // before it to distinguish it from an escaped pipe
            var row = tableRow.replace(/\|/g, function (match, offset, str) {
                var escaped = false,
                    curr = offset;
                while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
                if (escaped) {
                    // odd number of slashes means | is escaped
                    // so we leave it alone
                    return '|';
                } else {
                    // add space before unescaped |
                    return ' |';
                }
            }),
                cells = row.split(/ \|/),
                i = 0;

            if (cells.length > count) {
                cells.splice(count);
            } else {
                while (cells.length < count) cells.push('');
            }

            for (; i < cells.length; i++) {
                // leading or trailing whitespace is ignored per the gfm spec
                cells[i] = cells[i].trim().replace(/\\\|/g, '|');
            }
            return cells;
        }

        // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
        // /c*$/ is vulnerable to REDOS.
        // invert: Remove suffix of non-c chars instead. Default falsey.
        function rtrim(str, c, invert) {
            if (str.length === 0) {
                return '';
            }

            // Length of suffix matching the invert condition.
            var suffLen = 0;

            // Step left until we fail to match the invert condition.
            while (suffLen < str.length) {
                var currChar = str.charAt(str.length - suffLen - 1);
                if (currChar === c && !invert) {
                    suffLen++;
                } else if (currChar !== c && invert) {
                    suffLen++;
                } else {
                    break;
                }
            }

            return str.substr(0, str.length - suffLen);
        }

        function findClosingBracket(str, b) {
            if (str.indexOf(b[1]) === -1) {
                return -1;
            }
            var level = 0;
            for (var i = 0; i < str.length; i++) {
                if (str[i] === '\\') {
                    i++;
                } else if (str[i] === b[0]) {
                    level++;
                } else if (str[i] === b[1]) {
                    level--;
                    if (level < 0) {
                        return i;
                    }
                }
            }
            return -1;
        }

        /**
         * Marked
         */

        function marked(src, opt, callback) {
            // throw error in case of non string input
            if (typeof src === 'undefined' || src === null) {
                throw new Error('marked(): input parameter is undefined or null');
            }
            if (typeof src !== 'string') {
                throw new Error('marked(): input parameter is of type '
                    + Object.prototype.toString.call(src) + ', string expected');
            }

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

                var done = function(err) {
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

                    return err
                        ? callback(err)
                        : callback(null, out);
                };

                if (!highlight || highlight.length < 3) {
                    return done();
                }

                delete opt.highlight;

                if (!pending) return done();

                for (; i < tokens.length; i++) {
                    (function(token) {
                        if (token.type !== 'code') {
                            return --pending || done();
                        }
                        return highlight(token.text, token.lang, function(err, code) {
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
                e.message += '\nPlease report this to https://github.com/markedjs/marked.';
                if ((opt || marked.defaults).silent) {
                    return '<p>An error occurred:</p><pre>'
                        + escape(e.message + '', true)
                        + '</pre>';
                }
                throw e;
            }
        }

        /**
         * Options
         */

        marked.options =
            marked.setOptions = function(opt) {
                merge(marked.defaults, opt);
                return marked;
            };

        marked.getDefaults = function () {
            return {
                baseUrl: null,
                breaks: false,
                gfm: true,
                headerIds: true,
                headerPrefix: '',
                highlight: null,
                langPrefix: 'language-',
                mangle: true,
                pedantic: false,
                renderer: new Renderer(),
                sanitize: false,
                sanitizer: null,
                silent: false,
                smartLists: false,
                smartypants: false,
                tables: true,
                xhtml: false
            };
        };

        marked.defaults = marked.getDefaults();

        /**
         * Expose
         */

        marked.Parser = Parser;
        marked.parser = Parser.parse;

        marked.Renderer = Renderer;
        marked.TextRenderer = TextRenderer;

        marked.Lexer = Lexer;
        marked.lexer = Lexer.lex;

        marked.InlineLexer = InlineLexer;
        marked.inlineLexer = InlineLexer.output;

        marked.Slugger = Slugger;

        marked.parse = marked;

        return marked(markdown);
    }
}

module.exports = MarkdownHelper;
