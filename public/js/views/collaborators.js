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
            call: function call(url, callback, data) {
                data = data || {};

                data.token = localStorage.getItem('api-token');

                $.post(url, data, function (res) {
                    if (res.err) {
                        console.log(res.err, res.data);

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
                    api.call('/api/content/fetch/' + req.params.user + '/' + req.params.repo + '/' + path, callback);
                },

                publish: function publish(json, path, callback) {
                    api.content.bake(baked, function (baked) {
                        var data = {
                            content: JSON.stringify(baked)
                        };

                        api.call('/api/content/publish/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch + '/' + path, callback, data);
                    });
                },

                save: function save(json, path, callback) {
                    var data = {
                        content: JSON.stringify(json)
                    };

                    api.file.create(data, '/_content/' + path + '.json', callback);
                },

                bake: function bake(page, callback) {
                    function bakeProperty(prop) {
                        var type = Object.prototype.toString.call(prop);
                        var baked = '';

                        if (type === '[object Array]') {
                            baked = [];

                            for (var i in prop) {
                                baked.push(bakeProperty(prop[i]));
                            }
                        } else if (prop.value) {
                            baked = prop.value;
                        }

                        return baked;
                    }

                    function bakeProperties(json) {
                        var baked = {};

                        for (var k in json) {
                            var prop = json[k];

                            baked[k] = bakeProperty(prop);
                        }

                        return baked;
                    }

                    var baked = bakeProperties(page);

                    api.call('/api/content/bake', callback, baked);
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
    }, { "path-to-regexp": 13 }], 6: [function (require, module, exports) {
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
            json: null,

            get: function get(callback) {
                if (env.json) {
                    callback(env.json);
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

                        env.json = json;

                        callback(env.json);
                    });
                }
            },

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
    }, { "../src/helpers/debug": 14 }], 9: [function (require, module, exports) {
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
        require('../client');
        require('./partials/navbar');

        var Collaborators = (function (_View2) {
            _inherits(Collaborators, _View2);

            function Collaborators(args) {
                _classCallCheck(this, Collaborators);

                var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Collaborators).call(this, args));

                var view = _this2;

                _this2.modelFunction = api.collaborators.fetch;

                _this2.fetch();
                return _this2;
            }

            _createClass(Collaborators, [{
                key: "render",
                value: function render() {
                    $('.page-content').html(_.div({ class: 'container' }, _.div({ class: 'row' }, [_.each(this.model, function (i, collaborator) {
                        return _.div({ class: 'col-xs-2' }, _.div({ class: 'thumbnail' }, [_.img({ src: collaborator.avatarUrl }), _.h4({ class: 'text-center' }, collaborator.login), _.button({ class: 'btn btn-danger form-control' }, 'Remove')]));
                    }), _.div({ class: 'col-xs-2' }, _.div({ class: 'thumbnail' }, _.button({ class: 'btn btn-success form-control' }, 'Add')))])));
                }
            }]);

            return Collaborators;
        })(View);

        new Collaborators();
    }, { "../client": 3, "./partials/navbar": 11 }], 11: [function (require, module, exports) {
        var Navbar = (function (_View3) {
            _inherits(Navbar, _View3);

            function Navbar(args) {
                _classCallCheck(this, Navbar);

                var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Navbar).call(this, args));

                var view = _this3;

                api.repo(function (repo) {
                    view.repo = repo;

                    view.init();
                });
                return _this3;
            }

            _createClass(Navbar, [{
                key: "render",
                value: function render() {
                    var view = this;

                    $('.navbar-content').html(_.div({ class: 'navbar navbar-default' }, _.div({ class: 'container' }, [_.ul({ class: 'nav navbar-nav' }, [_.li(_.a({ href: '/repos/' + req.params.user }, [_.span({ class: 'glyphicon glyphicon-arrow-left' }), ' Repos'])), _.li(_.a({ href: '/repos/' + req.params.user + '/' + req.params.repo + '/deployment/' }, [_.span({ class: 'glyphicon glyphicon-upload' }), ' Deployment'])), _.li(_.a({ href: '/repos/' + req.params.user + '/' + req.params.repo + '/collaborators/' }, [_.span({ class: 'glyphicon glyphicon-user' }), ' Collaborators'])), _.li(_.a({ href: '/repos/' + req.params.user + '/' + req.params.repo + '/issues/' }, [_.span({ class: 'glyphicon glyphicon-exclamation-sign' }), ' Issues'])), _.li(_.a({ href: '/repos/' + req.params.user + '/' + req.params.repo + '/settings/' }, [_.span({ class: 'glyphicon glyphicon-cog' }), ' Settings']))]), _.ul({ class: 'nav navbar-nav navbar-right' }, _.li({ class: 'navbar-btn' }, _.div({ class: 'input-group' }, [_.span({ class: 'input-group-addon' }, 'git'), function () {
                        var element = _.input({ class: 'form-control', type: 'text', value: '' });

                        element.attr('value', view.repo.cloneUrl);

                        return element;
                    }])))])));

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
    }, {}], 12: [function (require, module, exports) {
        module.exports = Array.isArray || function (arr) {
            return Object.prototype.toString.call(arr) == '[object Array]';
        };
    }, {}], 13: [function (require, module, exports) {
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
    }, { "isarray": 12 }], 14: [function (require, module, exports) {
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
                    console.log('[ERROR] ' + makeTitle(src), err, obj);
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