"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/fetch/file/' + path, callback);
                },

                update: function update(data, path, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/update/file/' + path, callback, data);
                },

                create: function create(data, path, callback) {
                    api.call('/api/' + req.params.user + '/' + req.params.repo + '/create/file/' + path, callback, data);
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

            branches: function branches(callback) {
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
        };
    }, {}], 2: [function (require, module, exports) {
        window._ = require('./core/Templating');
        require('./core/View');

        require('./api');

        window.env = {
            json: null,
            sha: null,

            get: function get(callback) {
                if (env.json) {
                    callback(env.json);
                } else {
                    api.file.fetch('env.json', function (contents) {
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

                api.file.create(contents, 'env.json', function () {
                    env.json = json;

                    if (callback) {
                        callback();
                    }
                });
            }
        };

        window.helper = {
            formatDate: function formatDate(input) {
                var date = new Date(input);
                var output = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

                return output;
            }
        };
    }, { "./api": 1, "./core/Templating": 3, "./core/View": 4 }], 3: [function (require, module, exports) {
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

        module.exports = Templating;
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
                key: "fetch",
                value: function fetch() {}
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

                                view.readyOrInit();
                            });

                            // Get model with function
                        } else if (!view.model && typeof view.modelFunction === 'function') {
                                view.modelFunction(function (data) {
                                    view.model = data;

                                    view.readyOrInit();
                                });

                                // Just perform the initialisation
                            } else {
                                    view.readyOrInit();
                                }
                    }

                    // Get rendered content from URL
                    if (typeof view.renderUrl === 'string') {
                        $.ajax({
                            url: view.renderUrl,
                            type: 'get',
                            success: function success(html) {

                                if (view.$element) {
                                    view.$element.append(html);
                                } else {
                                    view.$element = $(html);
                                }

                                // And then get the model
                                getModel();
                            }
                        });

                        // Just get the model
                    } else {
                            getModel();
                        }
                }
            }]);

            return View;
        })();

        window.View = View;
    }, {}], 5: [function (require, module, exports) {
        require('../client');

        $('.navbar-content').html(_.div({ class: 'navbar navbar-default' }, _.div({ class: 'container' }, _.ul({ class: 'nav navbar-nav' }, _.li(_.a({ href: '/' }, [_.span({ class: 'glyphicon glyphicon-arrow-left' }), ' Logout']))))));

        api.repos(function (repos) {
            $('.page-content').html(_.div({ class: 'container dashboard-container' }, _.div({ class: 'row' }, _.each(repos, function (i, repo) {
                return _.div({ class: 'col-md-4' }, _.div({ class: 'panel panel-primary' }, [_.div({ class: 'panel-heading' }, _.h4({ class: 'panel-title' }, repo.name)), _.div({ class: 'panel-body' }, [_.p(repo.description), _.a({ class: 'btn btn-primary center-block', href: '/repos/' + repo.fullName + '/deployment/' }, 'Open')])]));
            }))));
        });
    }, { "../client": 2 }] }, {}, [5]);