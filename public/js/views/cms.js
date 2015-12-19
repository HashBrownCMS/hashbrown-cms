"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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
        module.exports = {
            "plugins": {
                "github": {
                    "client": {
                        "id": "d8390386d316435085fd",
                        "secret": "da7efffe15e224a74768b3dc26dce5f9a08ad58c"
                    }
                }
            },
            "menu": {
                "hide": {
                    "all": false
                }
            },
            "debug": {
                "verbosity": 3
            }
        };
    }, {}], 2: [function (require, module, exports) {
        function appropriateIssue(issue) {
            // Updating issue milestones requires a number only
            if (issue.milestone) {
                issue.milestone = issue.milestone.number;
            }

            // Updating issue assignees requires a login name only
            if (issue.assignee) {
                issue.assignee = issue.assignee.login;
            }

            // Updating issue labels requires a string only
            if (issue.labels) {
                for (var i in issue.labels) {
                    issue.labels[i] = issue.labels[i].name;
                }
            }

            return issue;
        }

        window.api = {
            call: function call(url, callback, obj) {
                obj = obj || {};

                obj.buffer = obj.buffer || {};
                obj.buffer.token = localStorage.getItem('api-token');

                $.post(url, obj, function (res) {
                    if (res.err) {
                        console.log('Error:', res.err);
                        console.log('Data:', res.data);

                        if (res.err.json) {
                            alert('(' + res.mode + ') ' + res.url + ': ' + res.err.json.message);
                        }
                    } else if (callback) {
                        callback(res);
                    }
                });
            },

            /**
             * Issue tracking
             */
            issues: {
                fetch: function fetch(callback) {
                    api.call('/api/issue-tracking/issues/fetch/' + req.params.user + '/' + req.params.repo, callback);
                },

                create: function create(data, callback) {
                    api.call('/api/issue-tracking/issues/create/' + req.params.user + '/' + req.params.repo, callback, appropriateIssue(data));
                },

                update: function update(data, callback) {
                    api.call('/api/issue-tracking/issues/update/' + req.params.user + '/' + req.params.repo, callback, appropriateIssue(data));
                }
            },

            labels: {
                fetch: function fetch(callback) {
                    api.call('/api/issue-tracking/labels/fetch/' + req.params.user + '/' + req.params.repo, callback);
                },

                create: function create(data, callback) {
                    api.call('/api/issue-tracking/labels/create/' + req.params.user + '/' + req.params.repo, callback, data);
                }
            },

            issueColumns: function issueColumns(callback) {
                env.get(function (json) {
                    var columns = json.putaitu.issues.columns;

                    columns.unshift('backlog');
                    columns.push('done');

                    callback(columns);
                });
            },

            milestones: {
                fetch: function fetch(callback) {
                    api.call('/api/issue-tracking/milestones/fetch/' + req.params.user + '/' + req.params.repo, callback);
                }
            },

            /**
             * Organisations
             */
            collaborators: {
                fetch: function fetch(callback) {
                    api.call('/api/collaborators/fetch/' + req.params.user + '/' + req.params.repo, callback);
                }
            },

            /** 
             * Git
             */
            repo: function repo(callback) {
                api.call('/api/git/repo/' + req.params.user + '/' + req.params.repo, callback);
            },

            branches: {
                get: function get(callback) {
                    api.call('/api/git/branches/' + req.params.user + '/' + req.params.repo, function (branches) {
                        branches.sort(function (a, b) {
                            if (a.name < b.name) {
                                return -1;
                            } else if (a.name > b.name) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });

                        callback(branches);
                    });
                }
            },

            file: {
                fetch: function fetch(path, callback) {
                    api.call('/api/git/file/fetch/' + req.params.user + '/' + req.params.repo + '/' + path, callback);
                },

                update: function update(data, path, callback) {
                    api.call('/api/git/file/update/' + req.params.user + '/' + req.params.repo + '/' + path, callback, data);
                },

                create: function create(data, path, callback) {
                    api.call('/api/git/file/create/' + req.params.user + '/' + req.params.repo + '/' + path, callback, data);
                }
            },

            tree: {
                fetch: function fetch(callback) {
                    api.call('/api/git/tree/fetch/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch, callback);
                }
            },

            repos: function repos(callback) {
                api.call('/api/git/repos/' + req.params.user, callback);
            },

            compare: function compare(base, head, callback) {
                api.call('/api/git/compare/' + req.params.user + '/' + req.params.repo + '/' + base + '/' + head, callback);
            },

            merge: function merge(base, head, callback) {
                api.call('/api/git/merge/' + req.params.user + '/' + req.params.repo, callback, { base: base, head: head });
            },

            /** 
             * Abstract CMS
             */
            structs: {
                pages: {
                    fetch: function fetch(path, callback) {
                        api.call('/api/structs/fetch/' + req.params.user + '/' + req.params.repo + '/pages/' + path, callback);
                    }
                },

                sections: {
                    fetch: function fetch(path, callback) {
                        api.call('/api/structs/fetch/' + req.params.user + '/' + req.params.repo + '/sections/' + path, callback);
                    }
                },

                blocks: {
                    fetch: function fetch(path, callback) {
                        api.call('/api/structs/fetch/' + req.params.user + '/' + req.params.repo + '/blocks/' + path, callback);
                    }
                },

                fields: {
                    fetch: function fetch(callback) {
                        api.call('/api/structs/fetch/' + req.params.user + '/' + req.params.repo + '/fields', callback);
                    }
                }
            },

            templates: {
                pages: {
                    fetch: function fetch(path, callback) {
                        api.call('/api/templates/fetch/' + req.params.user + '/' + req.params.repo + '/pages/' + path, callback);
                    }
                },

                sections: {
                    fetch: function fetch(path, callback) {
                        api.call('/api/templates/fetch/' + req.params.user + '/' + req.params.repo + '/blocks/' + path, callback);
                    }
                },

                blocks: {
                    fetch: function fetch(path, callback) {
                        api.call('/api/templates/fetch/' + req.params.user + '/' + req.params.repo + '/blocks/' + path, callback);
                    }
                }
            },

            content: {
                fetch: function fetch(path, callback) {
                    api.call('/api/content/fetch/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch + '/' + path, callback);
                },

                publish: function publish(content, path, callback) {
                    api.content.bake(content.data, function (baked) {
                        content.data = baked;

                        api.call('/api/content/publish/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch + '/' + path, callback, data);
                    });
                },

                save: function save(content, path, callback) {
                    api.call('/api/content/save/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch + '/' + path, callback, content);
                },

                bake: function bake(content, callback) {
                    api.call('/api/content/bake', callback, content);
                }
            }
        };
    }, {}], 3: [function (require, module, exports) {
        require('./core/Templating');
        require('./core/View');
        require('./core/Router');
        require('./core/ContextMenu');

        require('./helper');
        require('./api');
        require('./env');
    }, { "./api": 2, "./core/ContextMenu": 4, "./core/Router": 5, "./core/Templating": 6, "./core/View": 7, "./env": 8, "./helper": 9 }], 4: [function (require, module, exports) {
        'use strict';

        var ContextMenu = (function (_View) {
            _inherits(ContextMenu, _View);

            function ContextMenu(args) {
                _classCallCheck(this, ContextMenu);

                // Recycle other context menus

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ContextMenu).call(this, args));

                if ($('.context-menu').length > 0) {
                    _this.$element = $('.context-menu');
                } else {
                    _this.$element = _.ul({ class: 'context-menu dropdown-menu', role: 'menu' });
                }

                _this.$element.css({
                    position: 'absolute',
                    'z-index': 1200,
                    top: _this.pos.y,
                    left: _this.pos.x,
                    display: 'block'
                });

                _this.fetch();
                return _this;
            }

            _createClass(ContextMenu, [{
                key: "render",
                value: function render() {
                    var view = this;

                    view.$element.html(_.each(view.model, function (label, func) {
                        if (func == '---') {
                            return _.li({ class: 'dropdown-header' }, label);
                        } else {
                            return _.li({ class: typeof func === 'function' ? '' : 'disabled' }, _.a({ tabindex: '-1', href: '#' }, label).click(function (e) {
                                e.preventDefault();
                                e.stopPropagation();

                                if (func) {
                                    func(e);

                                    view.remove();
                                }
                            }));
                        }
                    }));

                    $('body').append(view.$element);
                }
            }]);

            return ContextMenu;
        })(View);

        // jQuery extention

        jQuery.fn.extend({
            context: function context(menuItems) {
                return this.each(function () {
                    $(this).on('contextmenu', function (e) {
                        if (e.ctrlKey) {
                            return;
                        }

                        e.preventDefault();
                        e.stopPropagation();

                        if (e.which == 3) {
                            var menu = new ContextMenu({
                                model: menuItems,
                                pos: {
                                    x: e.pageX,
                                    y: e.pageY
                                }
                            });
                        }
                    });
                });
            }
        });

        // Event handling
        $('body').click(function (e) {
            if ($(e.target).parents('.context-menu').length < 1) {
                ViewHelper.removeAll('ContextMenu');
            }
        });
    }, {}], 5: [function (require, module, exports) {
        'use strict';

        var pathToRegexp = require('path-to-regexp');

        var routes = [];

        var Router = (function () {
            function Router() {
                _classCallCheck(this, Router);
            }

            _createClass(Router, null, [{
                key: "route",
                value: function route(path, controller) {
                    routes[path] = {
                        controller: controller
                    };
                }
            }, {
                key: "go",
                value: function go(url) {
                    location.hash = url;
                }
            }, {
                key: "goToBaseDir",
                value: function goToBaseDir() {
                    var url = this.url || '/';
                    var base = new String(url).substring(0, url.lastIndexOf('/'));

                    this.go(base);
                }
            }, {
                key: "init",
                value: function init() {
                    // Get the url
                    var url = location.hash.slice(1) || '/';
                    var trimmed = url.substring(0, url.indexOf('?'));

                    if (trimmed) {
                        url = trimmed;
                    }
                    // Look for route
                    var context = {};
                    var route = undefined;

                    // Exact match
                    if (routes[url]) {
                        path = routes[url];

                        // Use path to regexp
                    } else {
                            for (var _path in routes) {
                                var keys = [];
                                var re = pathToRegexp(_path, keys);
                                var values = re.exec(url);

                                // A match was found
                                if (re.test(url)) {
                                    // Set the route
                                    route = routes[_path];

                                    // Add context variables (first result (0) is the entire path,
                                    // so assign that manually and start the counter at 1 instead)
                                    route.url = url;
                                    var counter = 1;

                                    var _iteratorNormalCompletion = true;
                                    var _didIteratorError = false;
                                    var _iteratorError = undefined;

                                    try {
                                        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                            var key = _step.value;

                                            route[key.name] = values[counter];
                                            counter++;
                                        }
                                    } catch (err) {
                                        _didIteratorError = true;
                                        _iteratorError = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion && _iterator.return) {
                                                _iterator.return();
                                            }
                                        } finally {
                                            if (_didIteratorError) {
                                                throw _iteratorError;
                                            }
                                        }
                                    }

                                    break;
                                }
                            }
                        }

                    if (route) {
                        route.controller();
                    }
                }
            }]);

            return Router;
        })();

        window.addEventListener('hashchange', Router.init);
        window.Router = Router;
    }, { "path-to-regexp": 23 }], 6: [function (require, module, exports) {
        var Templating = {};

        function append(el, content) {
            if (Object.prototype.toString.call(content) === '[object Array]') {
                for (var i in content) {
                    append(el, content[i]);
                }
            } else if (content) {
                el.append(content);
            }
        }

        function create(tag, attr, content) {
            var el = $('<' + tag + '></' + tag + '>');

            // If the attribute parameter fails, it's probably an element or a string
            try {
                for (var k in attr) {
                    el.attr(k, attr[k]);
                }
            } catch (err) {
                content = attr;
            }

            append(el, content);

            return el;
        }

        function declareMethod(type) {
            Templating[type] = function (attr, content) {
                return create(type, attr, content);
            };
        }

        function declareBootstrapMethod(type) {
            var tagName = 'div';

            if (type.indexOf('|') > -1) {
                tagName = type.split('|')[1];
                type = type.split('|')[0];
            }

            var functionName = type.replace(/-/g, '_');

            Templating[functionName] = function (attr, content) {
                return create(tagName, attr, content).addClass(type);
            };
        }

        var elementTypes = [
        // Block elements
        'div', 'section', 'nav', 'hr', 'label', 'textarea', 'audio', 'video', 'canvas', 'iframe',

        // Inline elements
        'img',

        // Table elements
        'table', 'thead', 'tbody', 'th', 'td', 'tr',

        // Select
        'select', 'option', 'input',

        // Headings
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',

        // Body text
        'span', 'p', 'strong', 'b',

        // Action buttons
        'a', 'button',

        // List
        'ol', 'ul', 'li',

        // Forms
        'form', 'input'];

        var bootstrapTypes = ['row', 'col', 'col-xs-1', 'col-xs-2', 'col-xs-3', 'col-xs-4', 'col-xs-5', 'col-xs-6', 'col-xs-7', 'col-xs-8', 'col-xs-9', 'col-xs-10', 'col-xs-11', 'col-xs-12', 'col-sm-1', 'col-sm-2', 'col-sm-3', 'col-sm-4', 'col-sm-5', 'col-sm-6', 'col-sm-7', 'col-sm-8', 'col-sm-9', 'col-sm-10', 'col-sm-11', 'col-sm-12', 'col-md-1', 'col-md-2', 'col-md-3', 'col-md-4', 'col-md-5', 'col-md-6', 'col-md-7', 'col-md-8', 'col-md-9', 'col-md-10', 'col-md-11', 'col-md-12', 'col-lg-1', 'col-lg-2', 'col-lg-3', 'col-lg-4', 'col-lg-5', 'col-lg-6', 'col-lg-7', 'col-lg-8', 'col-lg-9', 'col-lg-10', 'col-lg-11', 'col-lg-12', 'jumbotron', 'container', 'panel', 'panel-heading', 'panel-footer', 'panel-collapse', 'panel-body', 'navbar|nav', 'navbar-nav|ul', 'collapse', 'glyphicon|span', 'btn|button', 'btn-group', 'list-group', 'list-group-item', 'input-group', 'input-group-btn|span', 'input-group-addon|span', 'form-control|input'];

        for (var i in elementTypes) {
            declareMethod(elementTypes[i]);
        }

        for (var i in bootstrapTypes) {
            declareBootstrapMethod(bootstrapTypes[i]);
        }

        Templating.if = function (condition, content) {
            return condition ? content : null;
        };

        Templating.each = function (array, callback) {
            var elements = [];

            for (var i in array) {
                var element = callback(i, array[i]);

                if (element) {
                    elements.push(element);
                }
            }

            return elements;
        };

        window._ = Templating;
    }, {}], 7: [function (require, module, exports) {
        'use strict'

        /**
         *  jQuery extension
         */
        ;
        (function ($) {
            $.event.special.destroyed = {
                remove: function remove(o) {
                    if (o.handler) {
                        o.handler();
                    }
                }
            };
        })(jQuery);

        /**
         * GUID
         */
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        /**
         * Helper
         */
        var instances = [];

        var ViewHelper = (function () {
            function ViewHelper() {
                _classCallCheck(this, ViewHelper);
            }

            _createClass(ViewHelper, null, [{
                key: "getAll",
                value: function getAll(type) {
                    var results = [];

                    if (type) {
                        for (var i in instances) {
                            var instance = instances[i];
                            var name = instance.name;

                            if (name == type) {
                                results.push(instance);
                            }
                        }
                    } else {
                        results = instances;
                    }

                    return results;
                }
            }, {
                key: "get",
                value: function get(type) {
                    var results = ViewHelper.getAll(type);
                    var view = results.length > 0 ? results[0] : null;

                    return view;
                }
            }, {
                key: "clear",
                value: function clear(type) {
                    for (var _guid in instances) {
                        var instance = instances[_guid];
                        var name = instance.constructor.name;

                        if (!type || name == type) {
                            instance.remove();
                        }
                    }
                }
            }, {
                key: "removeAll",
                value: function removeAll(type) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = ViewHelper.getAll(type)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var view = _step2.value;

                            view.remove();
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            }]);

            return ViewHelper;
        })();

        window.ViewHelper = ViewHelper;

        /**
         * Class
         */

        var View = (function () {
            /**
             * Init
             */

            function View(args) {
                _classCallCheck(this, View);

                this.name = this.constructor.name;
                this.guid = guid();
                this.events = {};

                this.adopt(args);

                instances[this.guid] = this;
            }

            _createClass(View, [{
                key: "getName",
                value: function getName() {
                    var name = this.constructor.toString();
                    name = name.substring('function '.length);
                    name = name.substring(0, name.indexOf('('));

                    return name;
                }
            }, {
                key: "init",
                value: function init() {
                    this.prerender();
                    this.render();
                    this.postrender();

                    if (this.$element) {
                        this.element = this.$element[0];
                        this.$element.data('view', this);
                        this.$element.bind('destroyed', function () {
                            var view = $(this).data('view');

                            if (view) {
                                $(this).data('view').remove();
                            }
                        });
                    }

                    this.trigger('ready', this);
                    this.isReady = true;
                }
            }, {
                key: "ready",
                value: function ready(callback) {
                    if (this.isReady) {
                        callback(this);
                    } else {
                        this.on('ready', callback);
                    }
                }

                // Adopt values

            }, {
                key: "adopt",
                value: function adopt(args) {
                    for (var k in args) {
                        this[k] = args[k];
                    }

                    return this;
                }

                /**
                 * Rendering
                 */

            }, {
                key: "prerender",
                value: function prerender() {}
            }, {
                key: "render",
                value: function render() {}
            }, {
                key: "postrender",
                value: function postrender() {}

                /**
                 * Events
                 */
                // Removes the view from DOM and memory

            }, {
                key: "remove",
                value: function remove(timeout) {
                    var view = this;

                    if (!view.destroyed) {
                        view.destroyed = true;

                        setTimeout(function () {
                            view.trigger('remove');

                            if (view.$element && view.$element.length > 0) {
                                view.$element.remove();
                            }

                            instances.splice(view.guid, 1);
                        }, timeout || 0);
                    }
                }

                // Call an event (for internal use)

            }, {
                key: "call",
                value: function call(callback, data, ui) {
                    callback(data, ui, this);
                }

                // Trigger an event

            }, {
                key: "trigger",
                value: function trigger(e, obj) {
                    if (this.events[e]) {
                        if (typeof this.events[e] === 'function') {
                            this.events[e](obj);
                        } else {
                            for (var i in this.events[e]) {
                                if (this.events[e][i]) {
                                    this.events[e][i](obj);
                                }
                            }
                        }
                    }
                }

                // Bind an event

            }, {
                key: "on",
                value: function on(e, callback) {
                    var view = this;

                    // No events registered, register this as the only event
                    if (!this.events[e]) {
                        this.events[e] = function (data) {
                            view.call(callback, data, this);
                        };

                        // Events have already been registered, add to callback array
                    } else {
                            // Only one event is registered, so convert from a single reference to an array
                            if (!this.events[e].length) {
                                this.events[e] = [this.events[e]];
                            }

                            // Insert the event call into the array
                            this.events[e].push(function (data) {
                                view.call(callback, data, this);
                            });
                        }
                }

                // Check if event exists

            }, {
                key: "hasEvent",
                value: function hasEvent(name) {
                    for (var k in this.events) {
                        if (k == name) {
                            return true;
                        }
                    }

                    return false;
                }

                /**
                 * Fetch
                 */

            }, {
                key: "fetch",
                value: function fetch() {
                    var view = this;

                    function getModel() {
                        // Get model from URL
                        if (!view.model && typeof view.modelUrl === 'string') {
                            $.getJSON(view.modelUrl, function (data) {
                                view.model = data;

                                view.init();
                            });

                            // Get model with function
                        } else if (!view.model && typeof view.modelFunction === 'function') {
                                view.modelFunction(function (data) {
                                    view.model = data;

                                    view.init();
                                });

                                // Just perform the initialisation
                            } else {
                                    view.init();
                                }
                    }

                    // Get rendered content from URL
                    if (typeof view.renderUrl === 'string') {
                        $.get(view.renderUrl, function (html) {
                            if (view.$element) {
                                view.$element.append(html);
                            } else {
                                view.$element = $(html);
                            }

                            // And then get the model
                            getModel();
                        });

                        // If no render url is defined, just get the model
                    } else {
                            getModel();
                        }
                }
            }]);

            return View;
        })();

        window.View = View;
    }, {}], 8: [function (require, module, exports) {
        var Debug = require('../src/helpers/debug');

        window.env = {
            remote: null,
            local: require('../env.json'),

            /** 
             * Get remote env.json
             */
            get: function get(callback) {
                if (remote.json) {
                    callback(remote.json);
                } else {
                    api.file.fetch('/_env.json', function (data) {
                        var json = {};

                        try {
                            json = JSON.parse(data.content);
                        } catch (e) {
                            Debug.log(e, 'env');
                        }

                        json.putaitu = json.putaitu || {};
                        json.putaitu.issues = json.putaitu.issues || {};
                        json.putaitu.issues.columns = json.putaitu.issues.columns || [];

                        env.remote = json;

                        callback(env.remote);
                    });
                }
            },

            /** 
             * Set remote env.json
             */
            set: function set(json, callback) {
                json = json || env.json;

                var data = {
                    content: JSON.stringify(json)
                };

                api.file.create(data, '/_env.json', function () {
                    env.json = json;

                    if (callback) {
                        callback();
                    }
                });
            }
        };
    }, { "../env.json": 1, "../src/helpers/debug": 24 }], 9: [function (require, module, exports) {
        var Helper = (function () {
            function Helper() {
                _classCallCheck(this, Helper);
            }

            _createClass(Helper, null, [{
                key: "formatDate",
                value: function formatDate(input) {
                    var date = new Date(input);
                    var output = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

                    return output;
                }
            }, {
                key: "basename",
                value: function basename(path, extension) {
                    var base = new String(path).substring(path.lastIndexOf('/') + 1);

                    if (extension) {
                        base = base.replace(extension, '');
                    }

                    return base;
                }
            }, {
                key: "basedir",
                value: function basedir(path) {
                    var base = new String(path).substring(0, path.lastIndexOf('/'));

                    return base;
                }
            }, {
                key: "truncate",
                value: function truncate(string, max, addDots) {
                    var output = string;

                    if (output.length > max) {
                        output = output.substring(0, max);

                        if (addDots) {
                            output += '...';
                        }
                    }

                    return output;
                }
            }]);

            return Helper;
        })();

        window.helper = Helper;
    }, {}], 10: [function (require, module, exports) {
        'use strict';

        require('../client');
        require('./partials/navbar');

        var Tree = require('./partials/cms-tree');
        var Editor = require('./partials/cms-editor');

        var CMS = (function (_View2) {
            _inherits(CMS, _View2);

            function CMS(args) {
                _classCallCheck(this, CMS);

                var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(CMS).call(this, args));

                _this2.initRoutes();
                _this2.init();
                return _this2;
            }

            _createClass(CMS, [{
                key: "initRoutes",
                value: function initRoutes() {
                    // Pages
                    Router.route('/content/:path*', function () {
                        ViewHelper.get('Editor').openAsync(this.path);
                    });

                    // Media
                    Router.route('/media/:path*', function () {
                        console.log(this.path);
                    });
                }
            }, {
                key: "render",
                value: function render() {
                    $('.page-content').html(_.div({ class: 'container' }, [new Tree().$element, new Editor().$element]));

                    // Start router
                    Router.init();
                }
            }]);

            return CMS;
        })(View);

        new CMS();
    }, { "../client": 3, "./partials/cms-editor": 11, "./partials/cms-tree": 12, "./partials/navbar": 21 }], 11: [function (require, module, exports) {
        var Editor = (function (_View3) {
            _inherits(Editor, _View3);

            function Editor(args) {
                _classCallCheck(this, Editor);

                // Register events

                var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Editor).call(this, args));

                _this3.on('clickPublish', _this3.onClickPublish);
                _this3.on('clickSave', _this3.onClickSave);

                _this3.initFieldEditors();

                _this3.$element = _.div({ class: 'panel panel-default editor' }, [_.div({ class: 'panel-heading hidden' }, [_.div({ class: 'btn-group content-actions' }, [_.button({ class: 'btn btn-primary btn-publish' }, ['Save ', _.span({ class: 'glyphicon glyphicon-floppy-disk' })]).click(_this3.events.clickSave), _.button({ class: 'btn btn-success btn-publish' }, ['Publish ', _.span({ class: 'glyphicon glyphicon-upload' })]).click(_this3.events.clickPublish)]), _.div({ class: 'btn-group field-anchors' })]), _.div({ class: 'panel-body' }, [_.h1('Welcome to the Putaitu CMS editor!'), _.p('Pick a content node from the navigation menu above to begin')])]);
                return _this3;
            }

            /**
             * Events
             */

            _createClass(Editor, [{
                key: "onClickPublish",
                value: function onClickPublish(e, element, view) {
                    api.content.publish(view.model, view.path, function () {
                        console.log('done!');
                    });
                }
            }, {
                key: "onClickSave",
                value: function onClickSave(e, element, view) {
                    api.content.save(view.model, view.path, function () {
                        console.log('done!');
                    });
                }

                /**
                 * Actions
                 */

            }, {
                key: "initFieldEditors",
                value: function initFieldEditors() {
                    this.fieldEditors = {
                        'text': require('./field-editors/text'),
                        'text-html': require('./field-editors/text-html'),
                        'url': require('./field-editors/url'),
                        'checkbox': require('./field-editors/checkbox'),
                        'template-picker': require('./field-editors/template-picker'),
                        'struct-picker': require('./field-editors/struct-picker'),
                        'date-picker': require('./field-editors/date-picker')
                    };
                }
            }, {
                key: "clear",
                value: function clear() {
                    this.$element.children('panel-body').html(_.div({ class: 'spinner-container' }, _.div({ class: 'spinner' })));
                }
            }, {
                key: "openAsync",
                value: function openAsync(path) {
                    var view = this;

                    view.clear();

                    ViewHelper.get('Tree').ready(function (view) {
                        view.highlight('content/' + path);
                    });

                    api.content.fetch(path, function (content) {
                        view.model = content;
                        view.path = path;

                        view.render();
                    });
                }
            }, {
                key: "getFieldEditor",
                value: function getFieldEditor(editorName, alias, fieldModel, isArray) {
                    var view = this;

                    var FieldEditor = view.fieldEditors[editorName];

                    if (FieldEditor) {
                        var fieldEditorInstance = new FieldEditor({ model: fieldModel });

                        fieldEditorInstance.on('change', function () {
                            console.log(view.model);
                        });

                        return fieldEditorInstance;
                    }
                }
            }, {
                key: "render",
                value: function render() {
                    var view = this;

                    api.structs.fields.fetch(function (fieldStructs) {
                        view.$element.children('.panel-heading').removeClass('hidden').children('.field-anchors').empty();
                        view.$element.children('.panel-body').empty();

                        var _loop = function _loop(anchorLabel) {
                            // Render anchor points
                            function onClickAnchor(e) {
                                e.preventDefault();

                                var $btn = $(this);

                                $('html, body').animate({
                                    scrollTop: $('#' + $btn.attr('aria-scrollto')).offset().top
                                }, 500);
                            }

                            var $btn = view.$element.children('.panel-heading').children('.field-anchors').append(_.button({ class: 'btn btn-default', 'aria-scrollto': 'anchor-' + anchorLabel }, anchorLabel).click(onClickAnchor));

                            var $h4 = view.$element.children('.panel-body').append(_.h4({ id: 'anchor-' + anchorLabel, class: 'field-anchor' }, anchorLabel));

                            // Render properties
                            var props = view.model.data[anchorLabel];

                            for (var alias in props) {
                                var fieldModel = props[alias];
                                var fieldStruct = fieldStructs[fieldModel.struct];

                                if (fieldStruct) {
                                    var fieldEditorView = view.getFieldEditor(fieldStruct.editor, alias, fieldModel);

                                    if (fieldEditorView) {
                                        view.$element.children('.panel-body').append(_.div({ class: 'input-group field-editor-container' }, [_.span({ class: 'field-editor-label input-group-addon' }, fieldModel.label), fieldEditorView.$element]));
                                    } else {
                                        console.log('No field editor with name "' + fieldStruct.editor + '" was found');
                                    }
                                } else {
                                    console.log('No field struct with name "' + fieldModel.struct + '" was found');
                                }
                            }
                        };

                        for (var anchorLabel in view.model.data) {
                            _loop(anchorLabel);
                        }
                    });
                }
            }]);

            return Editor;
        })(View);

        module.exports = Editor;
    }, { "./field-editors/checkbox": 13, "./field-editors/date-picker": 14, "./field-editors/struct-picker": 16, "./field-editors/template-picker": 17, "./field-editors/text": 19, "./field-editors/text-html": 18, "./field-editors/url": 20 }], 12: [function (require, module, exports) {
        var Tree = (function (_View4) {
            _inherits(Tree, _View4);

            function Tree(args) {
                _classCallCheck(this, Tree);

                var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Tree).call(this, args));

                _this4.dirs = {};

                // Register events
                _this4.on('clickFolder', _this4.onClickFolder);
                _this4.on('clickFile', _this4.onClickFile);
                _this4.on('clickCloseRootNav', _this4.onClickCloseRootNav);
                _this4.on('clickDeleteItem', _this4.onClickDeleteItem);
                _this4.on('clickRenameItem', _this4.onClickRenameItem);

                // Prerender container
                _this4.$element = _.div({ class: 'tree panel panel-default' }, [_.div({ class: 'panel-heading' }), _.div({ class: 'panel-body' })]);

                _this4.modelFunction = api.tree.fetch;
                _this4.fetch();
                return _this4;
            }

            /**
             * Events
             */

            _createClass(Tree, [{
                key: "onClickFolder",
                value: function onClickFolder(e, element, view) {
                    e.preventDefault();

                    view.highlight($(element).attr('href').replace('#/', ''));
                }
            }, {
                key: "onClickFile",
                value: function onClickFile(e, element, view) {
                    view.highlight($(element).attr('href').replace('#/', ''));
                }
            }, {
                key: "onClickCloseRootNav",
                value: function onClickCloseRootNav(e, element, view) {
                    view.$element.find('.nav-root > li').toggleClass('active', false);
                    view.$element.find('.tab-pane').toggleClass('active', false);
                }
            }, {
                key: "onClickDeleteItem",
                value: function onClickDeleteItem(e, element, view) {
                    console.log('deleted');
                }
            }, {
                key: "onClickRenameItem",
                value: function onClickRenameItem(e, element, view) {
                    console.log('renamed');
                }

                /**
                 * Actions
                 */

            }, {
                key: "sortFoldersFirst",
                value: function sortFoldersFirst(array) {
                    array.sort(function (a, b) {
                        if (a.mode == '040000' && b.mode != '040000') {
                            return -1;
                        } else if (a.mode != '040000' && b.mode == '040000') {
                            return 1;
                        } else {
                            return 0;
                        }
                    });

                    return array;
                }
            }, {
                key: "highlight",
                value: function highlight(path) {
                    var $fileAnchor = $('.tree li a[href="#/' + path + '"]');
                    var $file = $fileAnchor.parent();

                    $('.tree .file').toggleClass('active', false);

                    // Highlighting a file does not unhighlight a folder
                    if ($file.hasClass('folder')) {
                        $('.tree .folder').toggleClass('active', false);
                    }

                    $file.toggleClass('active', true);

                    $file.parents('.folder').toggleClass('active', true);
                }
            }, {
                key: "filterPath",
                value: function filterPath(path, recursive) {
                    function filter(file) {
                        var i = file.path.indexOf(path);

                        var hasPath = i == 0;
                        var isNotSelf = file.path != path;
                        var shouldInclude = true;

                        // Include only direct children if specified
                        if (hasPath && isNotSelf && !recursive) {
                            // Trim the path down to after this folder
                            var base = file.path.replace(path, '');

                            // Files will have a slash at position 0, folders won't have one
                            shouldInclude = base.indexOf('/') <= 0;
                        }

                        return hasPath && isNotSelf && shouldInclude;
                    }

                    return this.model.tree.filter(filter);
                }
            }, {
                key: "getFolderContent",
                value: function getFolderContent(path, recursive) {
                    return this.sortFoldersFirst(this.filterPath(path, recursive));
                }
            }, {
                key: "getCurrentRoot",
                value: function getCurrentRoot() {
                    return this.$rootNav.find('li.active a').attr('aria-controls');
                }

                /**
                 * Tree data
                 */

            }, {
                key: "prerender",
                value: function prerender() {
                    this.dirs.content = this.getFolderContent('_content/', true);
                    this.dirs.media = this.getFolderContent('media/', true);
                }

                /** 
                 * Render
                 */

            }, {
                key: "render",
                value: function render() {
                    var view = this;

                    this.$element.children('.panel-heading').html([
                    // Close root nav button
                    _.button({ class: 'btn close' }, _.span({ class: 'glyphicon glyphicon-remove' })).click(view.events.clickCloseRootNav),

                    // Root folders
                    this.$rootNav = _.div({ class: 'nav-root btn-group', role: 'tablist' }, _.each(this.dirs, function (label, files) {
                        return _.a({ class: 'btn btn-default', href: '#' + label, 'aria-controls': label, role: 'tab', 'data-toggle': 'tab' }, label);
                    }))]);

                    this.$element.children('.panel-body').html([
                    // Subfolders
                    this.$subNav = _.nav({ class: 'tab-content nav-sub' }, _.each(this.dirs, function (label, files) {
                        return _.div({ role: 'tab-panel', id: label, class: 'tab-pane' }, _.ul({ class: 'folder-content' }, _.each(files, function (i, file) {
                            var contextMenuItems = {
                                'Rename': view.events.clickRenameItem,
                                'Delete': view.events.clickDeleteItem
                            };

                            var dragHandler = {
                                dragstart: function dragstart(e) {
                                    e.originalEvent.dataTransfer.setData('href', $el.children('a').attr('href'));
                                },

                                dragend: function dragend() {
                                    $('.drag-over').toggleClass('drag-over', false);
                                }
                            };

                            var dropHandler = {
                                dragleave: function dragleave(e) {
                                    e.preventDefault();

                                    $(e.target).toggleClass('drag-over', false);
                                },

                                dragover: function dragover(e) {
                                    e.preventDefault();

                                    /*let $folder = $(this).parents('.folder');
                                    let $folderContent = $(this).parents('.folder-content');*/

                                    $(e.target).parents('.folder-content').toggleClass('drag-over', false);
                                    $(e.target).find('.folder-content').toggleClass('drag-over', false);
                                    $(e.target).toggleClass('drag-over', true);
                                },

                                drop: function drop(e) {
                                    e.preventDefault();
                                    var href = e.originalEvent.dataTransfer.getData('href');

                                    var $fileAnchor = $('.tree li a[href="' + href + '"]');
                                    var $file = $fileAnchor.parent();
                                    var $target = $(e.target);

                                    // Is this is a folder, redirect to folder content container
                                    if ($target.siblings('.folder-content').length > 0) {
                                        $target = $target.siblings('.folder-content');
                                    }

                                    var isFolder = $target.hasClass('folder-content');
                                    var isSelf = $target.is($fileAnchor.siblings('.folder-content'));

                                    if (isFolder && !isSelf) {
                                        $target.append($file);

                                        view.highlight(href.replace('#/', ''));
                                    }
                                }
                            };

                            var isDir = file.mode == '040000';
                            var name = helper.basename(file.path).replace('.json', '');
                            var $el = undefined;

                            if (isDir) {
                                $el = _.li({ class: 'folder', draggable: 'true' }, [_.a({ href: '#/' + file.path.replace('_', '') }, [_.glyphicon({ class: 'glyphicon-folder-close' }), name]).click(view.events.clickFolder).context(contextMenuItems).on(dragHandler), _.ul({ class: 'folder-content', id: file.sha }).on(dropHandler)]);
                            } else {
                                $el = _.li({ class: 'file', draggable: 'true' }, _.a({ href: '#/' + file.path.replace('_', '').replace('.json', '') }, [_.glyphicon({ class: 'glyphicon-file' }), name]).click(view.events.clickFile).context(contextMenuItems).on(dragHandler));
                            }

                            return $el;
                        })));
                    }))]);

                    // Put files into folders
                    view.$subNav.find('.file, .folder').each(function (i) {
                        var path = $(this).children('a').attr('href');
                        var dir = helper.basedir(path);

                        var $folder = view.$subNav.find('.folder a[href="' + dir + '"]').parent();

                        if ($folder) {
                            $folder.children('.folder-content').append($(this));
                        }
                    });
                }
            }]);

            return Tree;
        })(View);

        module.exports = Tree;
    }, {}], 13: [function (require, module, exports) {
        'use strict';

        var FieldEditor = require('./field');

        var CheckboxEditor = (function (_FieldEditor) {
            _inherits(CheckboxEditor, _FieldEditor);

            function CheckboxEditor(args) {
                _classCallCheck(this, CheckboxEditor);

                var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(CheckboxEditor).call(this, args));

                _this5.fetch();
                return _this5;
            }

            _createClass(CheckboxEditor, [{
                key: "renderField",
                value: function renderField() {
                    var view = this;

                    return _.div({ class: 'checkbox-editor' }, _.button({ class: 'btn btn-default btn-toggle', 'data-checked': this.model.value }, _.span({ class: 'glyphicon glyphicon-ok' })).click(function (e) {
                        $(this).attr('data-checked', $(this).attr('data-checked') != 'true');

                        view.onChangeBoolValue(e, this, view);
                    }));
                }
            }]);

            return CheckboxEditor;
        })(FieldEditor);

        module.exports = CheckboxEditor;
    }, { "./field": 15 }], 14: [function (require, module, exports) {
        'use strict';

        var FieldEditor = require('./field');

        var DatePicker = (function (_FieldEditor2) {
            _inherits(DatePicker, _FieldEditor2);

            function DatePicker(args) {
                _classCallCheck(this, DatePicker);

                var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(DatePicker).call(this, args));

                _this6.fetch();
                return _this6;
            }

            _createClass(DatePicker, [{
                key: "renderField",
                value: function renderField(value) {
                    var date = undefined;
                    var view = this;

                    if (value) {
                        date = new Date(value);
                    } else {
                        date = new Date();
                    }

                    function update() {
                        // Max/min levels
                        $el.children('.date-picker-year').attr('min', 0).attr('max', 3000);

                        $el.children('.date-picker-month').attr('min', 1).attr('max', 12);

                        $el.children('.date-picker-day').attr('min', 1).attr('max', 31);

                        $el.children('.date-picker-hour').attr('min', 0).attr('max', 23);

                        $el.children('.date-picker-minute').attr('min', 0).attr('max', 59);

                        $el.children('.date-picker-second').attr('min', 0).attr('max', 59);

                        // Update data
                        $el.attr('data-date', date.toString());
                        $el.children('.date-picker-preview').html(date.toString());
                        view.events.changeDateValue(date);
                    }

                    function onChangeYear() {
                        date.setFullYear($(this).val());
                        update();
                    }

                    function onChangeMonth() {
                        date.setMonth($(this).val() - 1);
                        update();
                    }

                    function onChangeDay() {
                        date.setDate($(this).val());
                        update();
                    }

                    function onChangeHour() {
                        date.setHours($(this).val());
                        update();
                    }

                    function onChangeMinute() {
                        date.setMinutes($(this).val());
                        update();
                    }

                    function onChangeSecond() {
                        date.setSeconds($(this).val());
                        update();
                    }

                    var $el = _.div({ class: 'date-picker' }, _.div({ class: 'date-picker-preview' }, date.toString()));

                    if (!view.model.locked) {
                        $el.append([_.input({ class: 'form-control date-picker-year', type: 'number', value: date.getFullYear() }).bind('change paste propertychange keyup', onChangeYear), _.input({ class: 'form-control date-picker-month', type: 'number', value: date.getMonth() + 1 }).bind('change paste propertychange keyup', onChangeMonth), _.input({ class: 'form-control date-picker-day', type: 'number', value: date.getDate() }).bind('change paste propertychange keyup', onChangeDay), _.input({ class: 'form-control date-picker-hour', type: 'number', value: date.getHours() }).bind('change paste propertychange keyup', onChangeHour), _.input({ class: 'form-control date-picker-minute', type: 'number', value: date.getMinutes() }).bind('change paste propertychange keyup', onChangeMinute), _.input({ class: 'form-control date-picker-second', type: 'number', value: date.getSeconds() }).bind('change paste propertychange keyup', onChangeSecond)]);
                    }

                    return $el;
                }
            }]);

            return DatePicker;
        })(FieldEditor);

        module.exports = DatePicker;
    }, { "./field": 15 }], 15: [function (require, module, exports) {
        'use strict';

        var FieldEditor = (function (_View5) {
            _inherits(FieldEditor, _View5);

            function FieldEditor(args) {
                _classCallCheck(this, FieldEditor);

                // Register events

                var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(FieldEditor).call(this, args));

                _this7.on('changeTextValue', _this7.onChangeTextValue);
                _this7.on('changeBoolValue', _this7.onChangeBoolValue);
                return _this7;
            }

            _createClass(FieldEditor, [{
                key: "onChangeTextValue",
                value: function onChangeTextValue(e, element, view) {
                    if (view.model.isArray) {
                        var i = $(element).parents('.field-editor').index();

                        view.model.value[i] = $(element).val();
                    } else {
                        view.model.value = $(element).val();
                    }

                    view.trigger('change');
                }
            }, {
                key: "onChangeDateValue",
                value: function onChangeDateValue(e, element, view) {
                    if (view.model.isArray) {
                        var i = $(element).parents('.field-editor').index();

                        view.model.value[i] = $(element).data('date');
                    } else {
                        view.model.value = $(element).data('date');
                    }

                    view.trigger('change');
                }
            }, {
                key: "onChangeBoolValue",
                value: function onChangeBoolValue(e, element, view) {
                    if (view.model.isArray) {
                        var i = $(element).parents('.field-editor').index();

                        view.model.value[i] = $(element).attr('data-checked') == 'true';
                    } else {
                        view.model.value = $(element).attr('data-checked') == 'true';
                    }

                    view.trigger('change');
                }
            }, {
                key: "renderField",
                value: function renderField() {}
            }, {
                key: "render",
                value: function render() {
                    var _this8 = this;

                    var view = this;

                    if (this.model.isArray) {
                        (function () {
                            var onClickAdd = function onClickAdd() {
                                view.model.value = view.model.value || [];

                                $(this).before(addField(view.model.value.length, null));

                                view.model.value.push(null);
                            };

                            var addField = function addField(i, value) {
                                function onClickRemove() {
                                    if (view.model.value.length > 1) {
                                        $field.remove();
                                        $btnRemove.remove();
                                        view.model.value.splice(i, 1);
                                    }
                                }

                                var $field = view.renderField(value);

                                var $btnRemove = _.span({ class: 'input-group-btn' }, _.button({ class: 'btn btn-danger' }, [_.span({ class: 'glyphicon glyphicon-remove' })]).click(onClickRemove));

                                return _.div({ class: 'field-editor input-group' }, [$btnRemove, $field]);
                            };

                            if (!_this8.model.value || _this8.model.value.length < 1) {
                                _this8.model.value = [null];
                            }

                            _this8.$element = _.div({ class: 'field-editor-array' }, _.each(_this8.model.value, addField));

                            _this8.$element.append(_.button({ class: 'btn btn-success' }, _.span({ class: 'glyphicon glyphicon-plus' })).click(onClickAdd));
                        })();
                    } else {
                        this.$element = _.div({ class: 'field-editor' }, this.renderField(this.model.value));
                    }
                }
            }]);

            return FieldEditor;
        })(View);

        module.exports = FieldEditor;
    }, {}], 16: [function (require, module, exports) {
        'use strict';

        var FieldEditor = require('./field');

        var StructPicker = (function (_FieldEditor3) {
            _inherits(StructPicker, _FieldEditor3);

            function StructPicker(args) {
                _classCallCheck(this, StructPicker);

                var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(StructPicker).call(this, args));

                _this9.fetch();
                return _this9;
            }

            _createClass(StructPicker, [{
                key: "renderField",
                value: function renderField() {
                    var view = this;

                    return _.div({ class: 'struct-picker' }, _.select({ class: 'form-control' }, _.each(view.model.allowed || [], function (i, struct) {
                        return _.option({ value: struct }, struct);
                    })).change(this.events.changeTextValue));
                }
            }]);

            return StructPicker;
        })(FieldEditor);

        module.exports = StructPicker;
    }, { "./field": 15 }], 17: [function (require, module, exports) {
        'use strict';

        var FieldEditor = require('./field');

        var TemplatePicker = (function (_FieldEditor4) {
            _inherits(TemplatePicker, _FieldEditor4);

            function TemplatePicker(args) {
                _classCallCheck(this, TemplatePicker);

                var _this10 = _possibleConstructorReturn(this, Object.getPrototypeOf(TemplatePicker).call(this, args));

                _this10.fetch();
                return _this10;
            }

            _createClass(TemplatePicker, [{
                key: "renderField",
                value: function renderField() {
                    var view = this;

                    return _.div({ class: 'template-picker' }, _.select({ class: 'form-control' }, _.each(view.model.allowed || [], function (i, template) {
                        return _.option({ value: template }, template);
                    })).change(this.events.changeTextValue));
                }
            }]);

            return TemplatePicker;
        })(FieldEditor);

        module.exports = TemplatePicker;
    }, { "./field": 15 }], 18: [function (require, module, exports) {
        'use strict';

        var FieldEditor = require('./field');

        var TextHtmlEditor = (function (_FieldEditor5) {
            _inherits(TextHtmlEditor, _FieldEditor5);

            function TextHtmlEditor(args) {
                _classCallCheck(this, TextHtmlEditor);

                var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(TextHtmlEditor).call(this, args));

                _this11.fetch();
                return _this11;
            }

            _createClass(TextHtmlEditor, [{
                key: "renderField",
                value: function renderField(value) {
                    return _.div({ class: 'text-html-editor' }, _.textarea({ class: 'form-control' }, value).bind('change paste propertychange keyup', this.events.changeTextValue));
                }
            }]);

            return TextHtmlEditor;
        })(FieldEditor);

        module.exports = TextHtmlEditor;
    }, { "./field": 15 }], 19: [function (require, module, exports) {
        'use strict';

        var FieldEditor = require('./field');

        var TextEditor = (function (_FieldEditor6) {
            _inherits(TextEditor, _FieldEditor6);

            function TextEditor(args) {
                _classCallCheck(this, TextEditor);

                var _this12 = _possibleConstructorReturn(this, Object.getPrototypeOf(TextEditor).call(this, args));

                _this12.fetch();
                return _this12;
            }

            _createClass(TextEditor, [{
                key: "renderField",
                value: function renderField(value) {
                    return _.div({ class: 'text-editor' }, _.input({ type: 'text', class: 'form-control', value: value }).bind('change paste propertychange keyup', this.events.changeTextValue));
                }
            }]);

            return TextEditor;
        })(FieldEditor);

        module.exports = TextEditor;
    }, { "./field": 15 }], 20: [function (require, module, exports) {
        'use strict';

        var FieldEditor = require('./field');

        var UrlEditor = (function (_FieldEditor7) {
            _inherits(UrlEditor, _FieldEditor7);

            function UrlEditor(args) {
                _classCallCheck(this, UrlEditor);

                var _this13 = _possibleConstructorReturn(this, Object.getPrototypeOf(UrlEditor).call(this, args));

                _this13.fetch();
                return _this13;
            }

            _createClass(UrlEditor, [{
                key: "renderField",
                value: function renderField(value) {
                    value = value || location.hash.replace('#/content/pages', '').replace('.json', '') + '/';

                    return _.div({ class: 'url-editor' }, _.input({ class: 'form-control', type: 'text', value: value }).bind('change paste propertychange keyup', this.events.changeTextValue));
                }
            }]);

            return UrlEditor;
        })(FieldEditor);

        module.exports = UrlEditor;
    }, { "./field": 15 }], 21: [function (require, module, exports) {
        var Navbar = (function (_View6) {
            _inherits(Navbar, _View6);

            function Navbar(args) {
                _classCallCheck(this, Navbar);

                var _this14 = _possibleConstructorReturn(this, Object.getPrototypeOf(Navbar).call(this, args));

                var view = _this14;

                api.repo(function (repo) {
                    view.repo = repo;

                    view.init();
                });
                return _this14;
            }

            _createClass(Navbar, [{
                key: "render",
                value: function render() {
                    var view = this;

                    $('.navbar-content').html(_.div({ class: 'navbar navbar-default' }, _.div({ class: 'container' }, [_.if(!env.local.menu.hide.all, _.ul({ class: 'nav navbar-nav' }, [_.li(_.a({ href: '/repos/' + req.params.user }, [_.span({ class: 'glyphicon glyphicon-arrow-left' }), ' Repos'])), _.if(!env.local.menu.hide.deployment, _.li(_.a({ href: '/repos/' + req.params.user + '/' + req.params.repo + '/deployment/' }, [_.span({ class: 'glyphicon glyphicon-upload' }), ' Deployment']))), _.if(!env.local.menu.hide.collaborators, _.li(_.a({ href: '/repos/' + req.params.user + '/' + req.params.repo + '/collaborators/' }, [_.span({ class: 'glyphicon glyphicon-user' }), ' Collaborators']))), _.if(!env.local.menu.hide.issues, _.li(_.a({ href: '/repos/' + req.params.user + '/' + req.params.repo + '/issues/' }, [_.span({ class: 'glyphicon glyphicon-exclamation-sign' }), ' Issues']))), _.if(!env.local.menu.hide.settings, _.li(_.a({ href: '/repos/' + req.params.user + '/' + req.params.repo + '/settings/' }, [_.span({ class: 'glyphicon glyphicon-cog' }), ' Settings'])))]), _.ul({ class: 'nav navbar-nav navbar-right' }, _.li({ class: 'navbar-btn' }, _.div({ class: 'input-group' }, [_.span({ class: 'input-group-addon' }, 'git'), function () {
                        var element = _.input({ class: 'form-control', type: 'text', value: '' });

                        element.attr('value', view.repo.cloneUrl);

                        return element;
                    }]))))])));

                    // Set active navigation button
                    $('.navbar-content .navbar-nav li').each(function (i) {
                        var a = $(this).children('a');
                        var isActive = location.pathname == a.attr('href') || location.pathname + '/' == a.attr('href');

                        $(this).toggleClass('active', isActive);
                    });
                }
            }]);

            return Navbar;
        })(View);

        new Navbar();
    }, {}], 22: [function (require, module, exports) {
        module.exports = Array.isArray || function (arr) {
            return Object.prototype.toString.call(arr) == '[object Array]';
        };
    }, {}], 23: [function (require, module, exports) {
        var isarray = require('isarray');

        /**
         * Expose `pathToRegexp`.
         */
        module.exports = pathToRegexp;
        module.exports.parse = parse;
        module.exports.compile = compile;
        module.exports.tokensToFunction = tokensToFunction;
        module.exports.tokensToRegExp = tokensToRegExp;

        /**
         * The main path matching regexp utility.
         *
         * @type {RegExp}
         */
        var PATH_REGEXP = new RegExp([
        // Match escaped characters that would otherwise appear in future matches.
        // This allows the user to escape special characters that won't transform.
        '(\\\\.)',
        // Match Express-style parameters and un-named parameters with a prefix
        // and optional suffixes. Matches appear as:
        //
        // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
        // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
        // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
        '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');

        /**
         * Parse a string for the raw tokens.
         *
         * @param  {String} str
         * @return {Array}
         */
        function parse(str) {
            var tokens = [];
            var key = 0;
            var index = 0;
            var path = '';
            var res;

            while ((res = PATH_REGEXP.exec(str)) != null) {
                var m = res[0];
                var escaped = res[1];
                var offset = res.index;
                path += str.slice(index, offset);
                index = offset + m.length;

                // Ignore already escaped sequences.
                if (escaped) {
                    path += escaped[1];
                    continue;
                }

                // Push the current path onto the tokens.
                if (path) {
                    tokens.push(path);
                    path = '';
                }

                var prefix = res[2];
                var name = res[3];
                var capture = res[4];
                var group = res[5];
                var suffix = res[6];
                var asterisk = res[7];

                var repeat = suffix === '+' || suffix === '*';
                var optional = suffix === '?' || suffix === '*';
                var delimiter = prefix || '/';
                var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

                tokens.push({
                    name: name || key++,
                    prefix: prefix || '',
                    delimiter: delimiter,
                    optional: optional,
                    repeat: repeat,
                    pattern: escapeGroup(pattern)
                });
            }

            // Match any characters still remaining.
            if (index < str.length) {
                path += str.substr(index);
            }

            // If the path exists, push it onto the end.
            if (path) {
                tokens.push(path);
            }

            return tokens;
        }

        /**
         * Compile a string to a template function for the path.
         *
         * @param  {String}   str
         * @return {Function}
         */
        function compile(str) {
            return tokensToFunction(parse(str));
        }

        /**
         * Expose a method for transforming tokens into the path function.
         */
        function tokensToFunction(tokens) {
            // Compile all the tokens into regexps.
            var matches = new Array(tokens.length);

            // Compile all the patterns before compilation.
            for (var i = 0; i < tokens.length; i++) {
                if (_typeof(tokens[i]) === 'object') {
                    matches[i] = new RegExp('^' + tokens[i].pattern + '$');
                }
            }

            return function (obj) {
                var path = '';
                var data = obj || {};

                for (var i = 0; i < tokens.length; i++) {
                    var token = tokens[i];

                    if (typeof token === 'string') {
                        path += token;

                        continue;
                    }

                    var value = data[token.name];
                    var segment;

                    if (value == null) {
                        if (token.optional) {
                            continue;
                        } else {
                            throw new TypeError('Expected "' + token.name + '" to be defined');
                        }
                    }

                    if (isarray(value)) {
                        if (!token.repeat) {
                            throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"');
                        }

                        if (value.length === 0) {
                            if (token.optional) {
                                continue;
                            } else {
                                throw new TypeError('Expected "' + token.name + '" to not be empty');
                            }
                        }

                        for (var j = 0; j < value.length; j++) {
                            segment = encodeURIComponent(value[j]);

                            if (!matches[i].test(segment)) {
                                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
                            }

                            path += (j === 0 ? token.prefix : token.delimiter) + segment;
                        }

                        continue;
                    }

                    segment = encodeURIComponent(value);

                    if (!matches[i].test(segment)) {
                        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
                    }

                    path += token.prefix + segment;
                }

                return path;
            };
        }

        /**
         * Escape a regular expression string.
         *
         * @param  {String} str
         * @return {String}
         */
        function escapeString(str) {
            return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1');
        }

        /**
         * Escape the capturing group by escaping special characters and meaning.
         *
         * @param  {String} group
         * @return {String}
         */
        function escapeGroup(group) {
            return group.replace(/([=!:$\/()])/g, '\\$1');
        }

        /**
         * Attach the keys as a property of the regexp.
         *
         * @param  {RegExp} re
         * @param  {Array}  keys
         * @return {RegExp}
         */
        function attachKeys(re, keys) {
            re.keys = keys;
            return re;
        }

        /**
         * Get the flags for a regexp from the options.
         *
         * @param  {Object} options
         * @return {String}
         */
        function flags(options) {
            return options.sensitive ? '' : 'i';
        }

        /**
         * Pull out keys from a regexp.
         *
         * @param  {RegExp} path
         * @param  {Array}  keys
         * @return {RegExp}
         */
        function regexpToRegexp(path, keys) {
            // Use a negative lookahead to match only capturing groups.
            var groups = path.source.match(/\((?!\?)/g);

            if (groups) {
                for (var i = 0; i < groups.length; i++) {
                    keys.push({
                        name: i,
                        prefix: null,
                        delimiter: null,
                        optional: false,
                        repeat: false,
                        pattern: null
                    });
                }
            }

            return attachKeys(path, keys);
        }

        /**
         * Transform an array into a regexp.
         *
         * @param  {Array}  path
         * @param  {Array}  keys
         * @param  {Object} options
         * @return {RegExp}
         */
        function arrayToRegexp(path, keys, options) {
            var parts = [];

            for (var i = 0; i < path.length; i++) {
                parts.push(pathToRegexp(path[i], keys, options).source);
            }

            var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

            return attachKeys(regexp, keys);
        }

        /**
         * Create a path regexp from string input.
         *
         * @param  {String} path
         * @param  {Array}  keys
         * @param  {Object} options
         * @return {RegExp}
         */
        function stringToRegexp(path, keys, options) {
            var tokens = parse(path);
            var re = tokensToRegExp(tokens, options);

            // Attach keys back to the regexp.
            for (var i = 0; i < tokens.length; i++) {
                if (typeof tokens[i] !== 'string') {
                    keys.push(tokens[i]);
                }
            }

            return attachKeys(re, keys);
        }

        /**
         * Expose a function for taking tokens and returning a RegExp.
         *
         * @param  {Array}  tokens
         * @param  {Array}  keys
         * @param  {Object} options
         * @return {RegExp}
         */
        function tokensToRegExp(tokens, options) {
            options = options || {};

            var strict = options.strict;
            var end = options.end !== false;
            var route = '';
            var lastToken = tokens[tokens.length - 1];
            var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

            // Iterate over the tokens and create our regexp string.
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];

                if (typeof token === 'string') {
                    route += escapeString(token);
                } else {
                    var prefix = escapeString(token.prefix);
                    var capture = token.pattern;

                    if (token.repeat) {
                        capture += '(?:' + prefix + capture + ')*';
                    }

                    if (token.optional) {
                        if (prefix) {
                            capture = '(?:' + prefix + '(' + capture + '))?';
                        } else {
                            capture = '(' + capture + ')?';
                        }
                    } else {
                        capture = prefix + '(' + capture + ')';
                    }

                    route += capture;
                }
            }

            // In non-strict mode we allow a slash at the end of match. If the path to
            // match already ends with a slash, we remove it for consistency. The slash
            // is valid at the end of a path match, not in the middle. This is important
            // in non-ending mode, where "/test/" shouldn't match "/test//route".
            if (!strict) {
                route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
            }

            if (end) {
                route += '$';
            } else {
                // In non-ending mode, we need the capturing groups to match as much as
                // possible by using a positive lookahead to the end or next path segment.
                route += strict && endsWithSlash ? '' : '(?=\\/|$)';
            }

            return new RegExp('^' + route, flags(options));
        }

        /**
         * Normalize the given path string, returning a regular expression.
         *
         * An empty array can be passed in for the keys, which will hold the
         * placeholder key descriptions. For example, using `/user/:id`, `keys` will
         * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
         *
         * @param  {(String|RegExp|Array)} path
         * @param  {Array}                 [keys]
         * @param  {Object}                [options]
         * @return {RegExp}
         */
        function pathToRegexp(path, keys, options) {
            keys = keys || [];

            if (!isarray(keys)) {
                options = keys;
                keys = [];
            } else if (!options) {
                options = {};
            }

            if (path instanceof RegExp) {
                return regexpToRegexp(path, keys, options);
            }

            if (isarray(path)) {
                return arrayToRegexp(path, keys, options);
            }

            return stringToRegexp(path, keys, options);
        }
    }, { "isarray": 22 }], 24: [function (require, module, exports) {
        'use strict';

        var env = require('../../env.json');

        function makeTitle(src) {
            var title = 'Putaitu ';

            if (typeof src === 'string') {
                title += '(' + src + ')';
            } else if (src && src.constructor) {
                title += '(' + src.constructor.name + ')';
            }

            title += ':';

            return title;
        }

        var Debug = (function () {
            function Debug() {
                _classCallCheck(this, Debug);
            }

            _createClass(Debug, null, [{
                key: "error",
                value: function error(err, src, obj) {
                    if (obj) {
                        console.log('[ERROR] ' + makeTitle(src), err, obj);
                    } else {
                        console.log('[ERROR] ' + makeTitle(src), err);
                    }

                    console.trace();
                }
            }, {
                key: "log",
                value: function log(msg, src) {
                    if (env.debug.verbosity > 0) {
                        console.log(makeTitle(src), msg);
                    }
                }
            }, {
                key: "log2",
                value: function log2(msg, src) {
                    if (env.debug.verbosity > 1) {
                        console.log('-- ' + makeTitle(src), msg);
                    }
                }
            }, {
                key: "log3",
                value: function log3(msg, src) {
                    if (env.debug.verbosity > 2) {
                        console.log('--- ' + makeTitle(src), msg);
                    }
                }
            }]);

            return Debug;
        })();

        module.exports = Debug;
    }, { "../../env.json": 1 }] }, {}, [10]);