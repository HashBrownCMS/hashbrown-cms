"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

                data.token = localStorage.getItem('gh-oauth-token');

                $.post(url, data, function (res) {
                    if (res.err) {
                        console.log(res.data);
                        alert('(' + res.mode + ') ' + res.url + ': ' + res.err.json.message);
                    } else if (callback) {
                        callback(res);
                    }
                });
            },

            repos: function repos(callback) {
                api.call('/api/' + req.params.user + '/repos/', callback);
            },

            compare: function compare(base, head, callback) {
                api.call('/api/' + req.params.user + '/' + req.params.repo + '/compare/' + base + '/' + head, callback);
            },

            merge: function merge(base, head, callback) {
                api.call('/api/' + req.params.user + '/' + req.params.repo + '/merge', callback, { base: base, head: head });
            },

            file: {
                fetch: function fetch(path, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/fetch/file' + path, callback);
                },

                update: function update(data, path, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/update/file' + path, callback, data);
                },

                create: function create(data, path, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/create/file' + path, callback, data);
                }
            },

            tree: {
                fetch: function fetch(callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch + '/fetch/tree', callback);
                }
            },

            issues: {
                fetch: function fetch(callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/fetch/issues', callback);
                },

                create: function create(data, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/create/issues', callback, appropriateIssue(data));
                },

                update: function update(data, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/update/issues', callback, appropriateIssue(data));
                }
            },

            labels: {
                fetch: function fetch(callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/fetch/labels', callback);
                },

                create: function create(data, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/create/labels', callback, data);
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

            milestones: function milestones(callback) {
                api.call('/api/' + req.params.user + '/' + req.params.repo + '/milestones', callback);
            },

            collaborators: function collaborators(callback) {
                api.call('/api/' + req.params.user + '/' + req.params.repo + '/collaborators', callback);
            },

            repo: function repo(callback) {
                api.call('/api/' + req.params.user + '/' + req.params.repo, callback);
            },

            branches: {
                get: function get(callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/branches/', function (branches) {
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
            }
        };
    }, {}], 2: [function (require, module, exports) {
        require('./core/Templating');
        require('./core/View');

        require('./helper');
        require('./api');

        window.env = {
            json: null,
            sha: null,

            get: function get(callback) {
                if (env.json) {
                    callback(env.json);
                } else {
                    api.file.fetch('/env.json', function (contents) {
                        var json = '{}';

                        try {
                            json = atob(contents.content);
                        } catch (e) {
                            console.log(e);
                            console.log(contents);
                        }

                        json = JSON.parse(json) || {};
                        json.putaitu = json.putaitu || {};
                        json.putaitu.issues = json.putaitu.issues || {};
                        json.putaitu.issues.columns = json.putaitu.issues.columns || [];

                        env.json = json;
                        env.sha = contents.sha;

                        callback(env.json);
                    });
                }
            },

            set: function set(json, callback) {
                json = json || env.json;

                var contents = {
                    content: btoa(JSON.stringify(json)),
                    sha: env.sha,
                    comment: 'Updating env.json'
                };

                api.file.create(contents, '/env.json', function () {
                    env.json = json;

                    if (callback) {
                        callback();
                    }
                });
            }
        };
    }, { "./api": 1, "./core/Templating": 3, "./core/View": 4, "./helper": 5 }], 3: [function (require, module, exports) {
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
    }, {}], 4: [function (require, module, exports) {
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
                            var name = instance.constructor.name;

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

                    return results.length > 0 ? results[0] : null;
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
                key: "remove",
                value: function remove(timeout) {
                    var view = this;

                    setTimeout(function () {
                        view.trigger('remove');

                        if (view.$element && view.$element.length > 0) {
                            view.$element.remove();
                        }

                        delete instances[view.guid];
                    }, timeout || 0);
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

                this.name = this.getName();
                this.guid = guid();
                this.events = {};

                this.adopt(args);

                instances[this.guid] = this;
            }

            _createClass(View, [{
                key: "getName",
                value: function getName() {
                    var name = constructor.toString();
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
                            $(this).data('view').remove();
                        });
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
                // Destroy

            }, {
                key: "destroy",
                value: function destroy() {
                    if (this.$element) {
                        this.$element.remove();
                    }

                    instances.splice(this.guid, 1);

                    delete this;
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
                        if (this.events[e].length) {
                            for (var i in this.events[e]) {
                                if (this.events[e][i]) {
                                    this.events[e][i](obj);
                                }
                            }
                        } else {
                            this.events[e](obj);
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
    }, {}], 5: [function (require, module, exports) {
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
    }, {}], 6: [function (require, module, exports) {
        window.page = require('page');

        require('../client');
        require('./partials/navbar');

        var Tree = require('./partials/cms-tree');
        var Editor = require('./partials/cms-editor');

        var CMS = (function (_View) {
            _inherits(CMS, _View);

            function CMS(args) {
                _classCallCheck(this, CMS);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CMS).call(this, args));

                _this.initRoutes();
                _this.init();
                return _this;
            }

            _createClass(CMS, [{
                key: "initRoutes",
                value: function initRoutes() {
                    page.base('/repos/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch + '/cms');

                    // Pages
                    page('/pages/:path', function (ctx) {
                        api.file.fetch(ctx.path, function (content) {
                            ViewHelper.get('Editor').show(content);
                        });
                    });

                    // Media
                    page('/media/:path', function () {
                        console.log(req.params);
                    });
                }
            }, {
                key: "render",
                value: function render() {
                    $('.page-content').html(_.div({ class: 'container' }, [new Tree().$element, new Editor().$element]));

                    // Start router
                    page();
                }
            }]);

            return CMS;
        })(View);

        new CMS();
    }, { "../client": 2, "./partials/cms-editor": 7, "./partials/cms-tree": 8, "./partials/navbar": 9, "page": 11 }], 7: [function (require, module, exports) {
        var Editor = (function (_View2) {
            _inherits(Editor, _View2);

            function Editor(args) {
                _classCallCheck(this, Editor);

                var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Editor).call(this, args));

                self.$element = _.div({ class: 'container editor' });
                return _this2;
            }

            _createClass(Editor, [{
                key: "open",
                value: function open(content) {
                    this.model = content;

                    this.render();
                }
            }, {
                key: "render",
                value: function render() {
                    this.$element.html(JSON.stringify(this.model));
                }
            }]);

            return Editor;
        })(View);

        module.exports = Editor;
    }, {}], 8: [function (require, module, exports) {
        var Tree = (function (_View3) {
            _inherits(Tree, _View3);

            function Tree(args) {
                _classCallCheck(this, Tree);

                var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Tree).call(this, args));

                _this3.dirs = {};

                // Register events
                _this3.on('openFolder', _this3.onOpenFolder);

                // Prerender container
                _this3.$element = _.div({ class: 'tree' });

                _this3.modelFunction = api.tree.fetch;
                _this3.fetch();
                return _this3;
            }

            /**
             * Events
             */

            _createClass(Tree, [{
                key: "onOpenFolder",
                value: function onOpenFolder(e, element, view) {
                    var path = $(e.target).data('path');

                    if (path.indexOf('/media') == 0) {
                        page(path);
                    }
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
                    this.dirs.pages = this.getFolderContent('pages/', true);
                    this.dirs.media = this.getFolderContent('media/', true);
                }

                /** 
                 * Render
                 */

            }, {
                key: "render",
                value: function render() {
                    var view = this;

                    this.$element.html([
                    // Root folders
                    this.$rootNav = _.ul({ class: 'nav nav-root nav-tabs', role: 'tablist' }, _.each(this.dirs, function (label, files) {
                        return _.li({ role: 'presentation', class: '' }, _.a({ href: '#' + label, 'aria-controls': label, role: 'tab', 'data-toggle': 'tab' }, label));
                    })),

                    // Subfolders
                    this.$subNav = _.nav({ class: 'tab-content nav-sub' }, _.each(this.dirs, function (label, files) {
                        return _.div({ role: 'tab-panel', id: label, class: 'list-group tab-pane' }, _.each(files, function (i, file) {
                            var isDir = file.mode == '040000';
                            var name = helper.basename(file.path);

                            if (isDir) {
                                return _.panel({ class: 'panel-default' }, [_.panel_heading({ role: 'tab' }, _.a({ class: 'panel-title collapsed', 'data-toggle': 'collapse', role: 'button', href: '#' + file.sha, 'data-path': '/' + file.path }, [name, _.glyphicon({ class: 'glyphicon-folder-close' }), _.glyphicon({ class: 'glyphicon-folder-open' })]).click(view.events.openFolder)), _.panel_collapse({ class: 'collapse', role: 'tabpanel', id: file.sha }, _.panel_body())]);
                            } else {
                                return _.a({ class: 'list-group-item', href: '/' + file.path }, [name, _.glyphicon({ class: 'glyphicon-file' })]).click(function (e) {
                                    e.preventDefault();

                                    page($(this).attr('href'));
                                });
                            }
                        }));
                    }))]);

                    // Put files into folders
                    view.$subNav.find('.list-group-item').each(function (i) {
                        var dir = helper.basedir($(this).attr('href'));

                        view.$subNav.find('a[data-path="' + dir + '"]').parents('.panel').eq(0).find('.panel-body').append($(this));
                    });
                }
            }]);

            return Tree;
        })(View);

        module.exports = Tree;
    }, {}], 9: [function (require, module, exports) {
        var Navbar = (function (_View4) {
            _inherits(Navbar, _View4);

            function Navbar(args) {
                _classCallCheck(this, Navbar);

                var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Navbar).call(this, args));

                var view = _this4;

                api.repo(function (repo) {
                    view.repo = repo;

                    view.init();
                });
                return _this4;
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
    }, {}], 10: [function (require, module, exports) {
        module.exports = Array.isArray || function (arr) {
            return Object.prototype.toString.call(arr) == '[object Array]';
        };
    }, {}], 11: [function (require, module, exports) {
        (function (process) {
            /* globals require, module */

            'use strict'

            /**
             * Module dependencies.
             */

            ;
            var pathtoRegexp = require('path-to-regexp');

            /**
             * Module exports.
             */

            module.exports = page;

            /**
             * Detect click event
             */
            var clickEvent = 'undefined' !== typeof document && document.ontouchstart ? 'touchstart' : 'click';

            /**
             * To work properly with the URL
             * history.location generated polyfill in https://github.com/devote/HTML5-History-API
             */

            var location = 'undefined' !== typeof window && (window.history.location || window.location);

            /**
             * Perform initial dispatch.
             */

            var dispatch = true;

            /**
             * Decode URL components (query string, pathname, hash).
             * Accommodates both regular percent encoding and x-www-form-urlencoded format.
             */
            var decodeURLComponents = true;

            /**
             * Base path.
             */

            var base = '';

            /**
             * Running flag.
             */

            var running;

            /**
             * HashBang option
             */

            var hashbang = false;

            /**
             * Previous context, for capturing
             * page exit events.
             */

            var prevContext;

            /**
             * Register `path` with callback `fn()`,
             * or route `path`, or redirection,
             * or `page.start()`.
             *
             *   page(fn);
             *   page('*', fn);
             *   page('/user/:id', load, user);
             *   page('/user/' + user.id, { some: 'thing' });
             *   page('/user/' + user.id);
             *   page('/from', '/to')
             *   page();
             *
             * @param {String|Function} path
             * @param {Function} fn...
             * @api public
             */

            function page(path, fn) {
                // <callback>
                if ('function' === typeof path) {
                    return page('*', path);
                }

                // route <path> to <callback ...>
                if ('function' === typeof fn) {
                    var route = new Route(path);
                    for (var i = 1; i < arguments.length; ++i) {
                        page.callbacks.push(route.middleware(arguments[i]));
                    }
                    // show <path> with [state]
                } else if ('string' === typeof path) {
                        page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
                        // start [options]
                    } else {
                            page.start(path);
                        }
            }

            /**
             * Callback functions.
             */

            page.callbacks = [];
            page.exits = [];

            /**
             * Current path being processed
             * @type {String}
             */
            page.current = '';

            /**
             * Number of pages navigated to.
             * @type {number}
             *
             *     page.len == 0;
             *     page('/login');
             *     page.len == 1;
             */

            page.len = 0;

            /**
             * Get or set basepath to `path`.
             *
             * @param {String} path
             * @api public
             */

            page.base = function (path) {
                if (0 === arguments.length) return base;
                base = path;
            };

            /**
             * Bind with the given `options`.
             *
             * Options:
             *
             *    - `click` bind to click events [true]
             *    - `popstate` bind to popstate [true]
             *    - `dispatch` perform initial dispatch [true]
             *
             * @param {Object} options
             * @api public
             */

            page.start = function (options) {
                options = options || {};
                if (running) return;
                running = true;
                if (false === options.dispatch) dispatch = false;
                if (false === options.decodeURLComponents) decodeURLComponents = false;
                if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
                if (false !== options.click) {
                    document.addEventListener(clickEvent, onclick, false);
                }
                if (true === options.hashbang) hashbang = true;
                if (!dispatch) return;
                var url = hashbang && ~location.hash.indexOf('#!') ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
                page.replace(url, null, true, dispatch);
            };

            /**
             * Unbind click and popstate event handlers.
             *
             * @api public
             */

            page.stop = function () {
                if (!running) return;
                page.current = '';
                page.len = 0;
                running = false;
                document.removeEventListener(clickEvent, onclick, false);
                window.removeEventListener('popstate', onpopstate, false);
            };

            /**
             * Show `path` with optional `state` object.
             *
             * @param {String} path
             * @param {Object} state
             * @param {Boolean} dispatch
             * @return {Context}
             * @api public
             */

            page.show = function (path, state, dispatch, push) {
                var ctx = new Context(path, state);
                page.current = ctx.path;
                if (false !== dispatch) page.dispatch(ctx);
                if (false !== ctx.handled && false !== push) ctx.pushState();
                return ctx;
            };

            /**
             * Goes back in the history
             * Back should always let the current route push state and then go back.
             *
             * @param {String} path - fallback path to go back if no more history exists, if undefined defaults to page.base
             * @param {Object} [state]
             * @api public
             */

            page.back = function (path, state) {
                if (page.len > 0) {
                    // this may need more testing to see if all browsers
                    // wait for the next tick to go back in history
                    history.back();
                    page.len--;
                } else if (path) {
                    setTimeout(function () {
                        page.show(path, state);
                    });
                } else {
                    setTimeout(function () {
                        page.show(base, state);
                    });
                }
            };

            /**
             * Register route to redirect from one path to other
             * or just redirect to another route
             *
             * @param {String} from - if param 'to' is undefined redirects to 'from'
             * @param {String} [to]
             * @api public
             */
            page.redirect = function (from, to) {
                // Define route from a path to another
                if ('string' === typeof from && 'string' === typeof to) {
                    page(from, function (e) {
                        setTimeout(function () {
                            page.replace(to);
                        }, 0);
                    });
                }

                // Wait for the push state and replace it with another
                if ('string' === typeof from && 'undefined' === typeof to) {
                    setTimeout(function () {
                        page.replace(from);
                    }, 0);
                }
            };

            /**
             * Replace `path` with optional `state` object.
             *
             * @param {String} path
             * @param {Object} state
             * @return {Context}
             * @api public
             */

            page.replace = function (path, state, init, dispatch) {
                var ctx = new Context(path, state);
                page.current = ctx.path;
                ctx.init = init;
                ctx.save(); // save before dispatching, which may redirect
                if (false !== dispatch) page.dispatch(ctx);
                return ctx;
            };

            /**
             * Dispatch the given `ctx`.
             *
             * @param {Object} ctx
             * @api private
             */

            page.dispatch = function (ctx) {
                var prev = prevContext,
                    i = 0,
                    j = 0;

                prevContext = ctx;

                function nextExit() {
                    var fn = page.exits[j++];
                    if (!fn) return nextEnter();
                    fn(prev, nextExit);
                }

                function nextEnter() {
                    var fn = page.callbacks[i++];

                    if (ctx.path !== page.current) {
                        ctx.handled = false;
                        return;
                    }
                    if (!fn) return unhandled(ctx);
                    fn(ctx, nextEnter);
                }

                if (prev) {
                    nextExit();
                } else {
                    nextEnter();
                }
            };

            /**
             * Unhandled `ctx`. When it's not the initial
             * popstate then redirect. If you wish to handle
             * 404s on your own use `page('*', callback)`.
             *
             * @param {Context} ctx
             * @api private
             */

            function unhandled(ctx) {
                if (ctx.handled) return;
                var current;

                if (hashbang) {
                    current = base + location.hash.replace('#!', '');
                } else {
                    current = location.pathname + location.search;
                }

                if (current === ctx.canonicalPath) return;
                page.stop();
                ctx.handled = false;
                location.href = ctx.canonicalPath;
            }

            /**
             * Register an exit route on `path` with
             * callback `fn()`, which will be called
             * on the previous context when a new
             * page is visited.
             */
            page.exit = function (path, fn) {
                if (typeof path === 'function') {
                    return page.exit('*', path);
                }

                var route = new Route(path);
                for (var i = 1; i < arguments.length; ++i) {
                    page.exits.push(route.middleware(arguments[i]));
                }
            };

            /**
             * Remove URL encoding from the given `str`.
             * Accommodates whitespace in both x-www-form-urlencoded
             * and regular percent-encoded form.
             *
             * @param {str} URL component to decode
             */
            function decodeURLEncodedURIComponent(val) {
                if (typeof val !== 'string') {
                    return val;
                }
                return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
            }

            /**
             * Initialize a new "request" `Context`
             * with the given `path` and optional initial `state`.
             *
             * @param {String} path
             * @param {Object} state
             * @api public
             */

            function Context(path, state) {
                if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + (hashbang ? '#!' : '') + path;
                var i = path.indexOf('?');

                this.canonicalPath = path;
                this.path = path.replace(base, '') || '/';
                if (hashbang) this.path = this.path.replace('#!', '') || '/';

                this.title = document.title;
                this.state = state || {};
                this.state.path = path;
                this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
                this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
                this.params = {};

                // fragment
                this.hash = '';
                if (!hashbang) {
                    if (! ~this.path.indexOf('#')) return;
                    var parts = this.path.split('#');
                    this.path = parts[0];
                    this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
                    this.querystring = this.querystring.split('#')[0];
                }
            }

            /**
             * Expose `Context`.
             */

            page.Context = Context;

            /**
             * Push state.
             *
             * @api private
             */

            Context.prototype.pushState = function () {
                page.len++;
                history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
            };

            /**
             * Save the context state.
             *
             * @api public
             */

            Context.prototype.save = function () {
                history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
            };

            /**
             * Initialize `Route` with the given HTTP `path`,
             * and an array of `callbacks` and `options`.
             *
             * Options:
             *
             *   - `sensitive`    enable case-sensitive routes
             *   - `strict`       enable strict matching for trailing slashes
             *
             * @param {String} path
             * @param {Object} options.
             * @api private
             */

            function Route(path, options) {
                options = options || {};
                this.path = path === '*' ? '(.*)' : path;
                this.method = 'GET';
                this.regexp = pathtoRegexp(this.path, this.keys = [], options.sensitive, options.strict);
            }

            /**
             * Expose `Route`.
             */

            page.Route = Route;

            /**
             * Return route middleware with
             * the given callback `fn()`.
             *
             * @param {Function} fn
             * @return {Function}
             * @api public
             */

            Route.prototype.middleware = function (fn) {
                var self = this;
                return function (ctx, next) {
                    if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
                    next();
                };
            };

            /**
             * Check if this route matches `path`, if so
             * populate `params`.
             *
             * @param {String} path
             * @param {Object} params
             * @return {Boolean}
             * @api private
             */

            Route.prototype.match = function (path, params) {
                var keys = this.keys,
                    qsIndex = path.indexOf('?'),
                    pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
                    m = this.regexp.exec(decodeURIComponent(pathname));

                if (!m) return false;

                for (var i = 1, len = m.length; i < len; ++i) {
                    var key = keys[i - 1];
                    var val = decodeURLEncodedURIComponent(m[i]);
                    if (val !== undefined || !hasOwnProperty.call(params, key.name)) {
                        params[key.name] = val;
                    }
                }

                return true;
            };

            /**
             * Handle "populate" events.
             */

            var onpopstate = (function () {
                var loaded = false;
                if ('undefined' === typeof window) {
                    return;
                }
                if (document.readyState === 'complete') {
                    loaded = true;
                } else {
                    window.addEventListener('load', function () {
                        setTimeout(function () {
                            loaded = true;
                        }, 0);
                    });
                }
                return function onpopstate(e) {
                    if (!loaded) return;
                    if (e.state) {
                        var path = e.state.path;
                        page.replace(path, e.state);
                    } else {
                        page.show(location.pathname + location.hash, undefined, undefined, false);
                    }
                };
            })();
            /**
             * Handle "click" events.
             */

            function onclick(e) {

                if (1 !== which(e)) return;

                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                if (e.defaultPrevented) return;

                // ensure link
                var el = e.target;
                while (el && 'A' !== el.nodeName) {
                    el = el.parentNode;
                }if (!el || 'A' !== el.nodeName) return;

                // Ignore if tag has
                // 1. "download" attribute
                // 2. rel="external" attribute
                if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

                // ensure non-hash for the same path
                var link = el.getAttribute('href');
                if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return;

                // Check for mailto: in the href
                if (link && link.indexOf('mailto:') > -1) return;

                // check target
                if (el.target) return;

                // x-origin
                if (!sameOrigin(el.href)) return;

                // rebuild path
                var path = el.pathname + el.search + (el.hash || '');

                // strip leading "/[drive letter]:" on NW.js on Windows
                if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
                    path = path.replace(/^\/[a-zA-Z]:\//, '/');
                }

                // same page
                var orig = path;

                if (path.indexOf(base) === 0) {
                    path = path.substr(base.length);
                }

                if (hashbang) path = path.replace('#!', '');

                if (base && orig === path) return;

                e.preventDefault();
                page.show(orig);
            }

            /**
             * Event button.
             */

            function which(e) {
                e = e || window.event;
                return null === e.which ? e.button : e.which;
            }

            /**
             * Check if `href` is the same origin.
             */

            function sameOrigin(href) {
                var origin = location.protocol + '//' + location.hostname;
                if (location.port) origin += ':' + location.port;
                return href && 0 === href.indexOf(origin);
            }

            page.sameOrigin = sameOrigin;
        }).call(this, require("rH1JPG"));
    }, { "path-to-regexp": 12, "rH1JPG": 13 }], 12: [function (require, module, exports) {
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
    }, { "isarray": 10 }], 13: [function (require, module, exports) {
        // shim for using process in browser

        var process = module.exports = {};

        process.nextTick = (function () {
            var canSetImmediate = typeof window !== 'undefined' && window.setImmediate;
            var canPost = typeof window !== 'undefined' && window.postMessage && window.addEventListener;

            if (canSetImmediate) {
                return function (f) {
                    return window.setImmediate(f);
                };
            }

            if (canPost) {
                var queue = [];
                window.addEventListener('message', function (ev) {
                    var source = ev.source;
                    if ((source === window || source === null) && ev.data === 'process-tick') {
                        ev.stopPropagation();
                        if (queue.length > 0) {
                            var fn = queue.shift();
                            fn();
                        }
                    }
                }, true);

                return function nextTick(fn) {
                    queue.push(fn);
                    window.postMessage('process-tick', '*');
                };
            }

            return function nextTick(fn) {
                setTimeout(fn, 0);
            };
        })();

        process.title = 'browser';
        process.browser = true;
        process.env = {};
        process.argv = [];

        function noop() {}

        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;

        process.binding = function (name) {
            throw new Error('process.binding is not supported');
        };

        // TODO(shtylman)
        process.cwd = function () {
            return '/';
        };
        process.chdir = function (dir) {
            throw new Error('process.chdir is not supported');
        };
    }, {}] }, {}, [6]);