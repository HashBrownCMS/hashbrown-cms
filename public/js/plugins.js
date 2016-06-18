"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
            }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        require('./views/ConnectionEditor');
    }, { "./views/ConnectionEditor": 2 }], 2: [function (require, module, exports) {
        var ConnectionEditor = function (_View) {
            _inherits(ConnectionEditor, _View);

            function ConnectionEditor(params) {
                _classCallCheck(this, ConnectionEditor);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ConnectionEditor).call(this, params));

                _this.$element = _.div({ class: 'github-editor' });

                _this.fetch();
                return _this;
            }

            /**
             * Get organisations
             */


            _createClass(ConnectionEditor, [{
                key: "getOrgs",
                value: function getOrgs() {
                    return new Promise(function (callback) {
                        $.ajax({
                            type: 'get',
                            url: '/api/github/orgs/?connectionId=' + Router.params.id,
                            success: function success(orgs) {
                                callback(orgs);
                            }
                        });
                    });
                }

                /**
                 * Render token editor
                 */

            }, {
                key: "renderTokenEditor",
                value: function renderTokenEditor() {
                    var view = this;

                    function onChange() {
                        view.model.token = $(this).val();
                    }

                    function onClickRenew() {
                        location = '/api/github/oauth/start?route=' + Router.url;
                    }

                    this.model.token = this.model.token || Router.query('token');

                    return _.div({ class: 'input-group field-editor' }, _.input({ class: 'form-control', type: 'text', value: this.model.token, placeholder: 'Input GitHub API token' }).change(onChange), _.div({ class: 'input-group-btn' }, _.button({ class: 'btn btn-primary' }, 'Renew').click(onClickRenew)));
                }

                /**
                 * Render repository picker
                 */

            }, {
                key: "renderRepoPicker",
                value: function renderRepoPicker() {
                    var view = this;

                    var $editor = _.div({ class: 'field-editor dropdown-editor' });

                    function onChange() {
                        var repo = $(this).val();

                        view.model.repo = repo;

                        view.render();
                    }

                    $.ajax({
                        type: 'get',
                        url: '/api/github/' + view.model.org + '/repos',
                        success: function success(orgs) {
                            $editor.html(_.select({ class: 'form-control' }, _.each(repos, function (i, repos) {
                                return _.option({ value: repo.name }, repo.name);
                            })).change(onChange));

                            $editor.children('select').val(view.model.repo);
                        }
                    });

                    return $editor;
                }

                /**
                 * Render directory picker
                 *
                 * @param {String} alias
                 */

            }, {
                key: "renderDirPicker",
                value: function renderDirPicker(alias, defaultValue) {
                    var view = this;

                    var $editor = _.div({ class: 'field-editor dropdown-editor' });

                    function onChange() {
                        var dir = $(this).val();

                        view.model[alias] = dir;
                    }

                    $.ajax({
                        type: 'get',
                        url: '/api/github/' + view.model.org + '/' + view.model.repo + '/dirs',
                        success: function success(dirs) {
                            view.dirs = dirs;

                            // Use alias as fallback dir name
                            if (!view.model[alias]) {
                                var foundFallbackDir = false;

                                // Look for fallback dir name in remote directories
                                var _iteratorNormalCompletion = true;
                                var _didIteratorError = false;
                                var _iteratorError = undefined;

                                try {
                                    for (var _iterator = view.dirs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                        var dir = _step.value;

                                        if (dir == alias) {
                                            foundFallbackDir = true;
                                            break;
                                        }
                                    }

                                    // If not found, add it
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

                                if (!foundFallbackDir) {
                                    view.dirs.push(alias);
                                }

                                view.model[alias] = alias;
                            }

                            $editor.html(_.select({ class: 'form-control' }, _.each(view.dirs, function (i, dir) {
                                return _.option({ value: dir }, '/' + dir);
                            })).change(onChange));

                            $editor.children('select').val(view.model[alias]);
                        }
                    });

                    return $editor;
                }
            }, {
                key: "render",
                value: function render() {
                    this.$element.empty();

                    // Token
                    _.append(this.$element, _.div({ class: 'field-container github-token' }, _.div({ class: 'field-key' }, 'Token'), _.div({ class: 'field-value' }, this.renderTokenEditor())));
                    /*
                            this.$element.append(
                                _.div({class: 'field-container github-repo'},
                                    _.div({class: 'field-key'}, 'Content directory'),
                                    _.div({class: 'field-value'},
                                        this.renderRepoPicker()
                                    )
                                )
                            );
                    
                            // Render directory pickers if repo is picked
                            if(this.model.repo) {
                                this.$element.append([
                                    _.div({class: 'field-container github-content-dir'},
                                        _.div({class: 'field-key'}, 'Content directory'),
                                        _.div({class: 'field-value'},
                                            this.renderDirPicker('content')
                                        )
                                    ),
                                    _.div({class: 'field-container github-media-dir'},
                                        _.div({class: 'field-key'}, 'Media directory'),
                                        _.div({class: 'field-value'},
                                            this.renderDirPicker('media')
                                        )
                                    )
                                ]);
                            }*/
                }
            }]);

            return ConnectionEditor;
        }(View);

        resources.connectionEditors.github = ConnectionEditor;
    }, {}], 3: [function (require, module, exports) {
        'use strict';

        require('./views/JsonTreeConnectionEditor');
    }, { "./views/JsonTreeConnectionEditor": 4 }], 4: [function (require, module, exports) {
        var JsonTreeConnectionEditor = function (_View2) {
            _inherits(JsonTreeConnectionEditor, _View2);

            function JsonTreeConnectionEditor(params) {
                _classCallCheck(this, JsonTreeConnectionEditor);

                var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(JsonTreeConnectionEditor).call(this, params));

                _this2.$element = _.div({ class: 'github-editor' });

                _this2.fetch();
                return _this2;
            }

            _createClass(JsonTreeConnectionEditor, [{
                key: "render",
                value: function render() {}
            }]);

            return JsonTreeConnectionEditor;
        }(View);

        resources.connectionEditors.jsontree = JsonTreeConnectionEditor;
    }, {}] }, {}, [1, 3]);