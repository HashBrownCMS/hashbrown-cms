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

                    this.model.token = Router.query('token') || this.model.token;

                    return _.div({ class: 'input-group field-editor' }, _.input({ class: 'form-control', type: 'text', value: this.model.token, placeholder: 'Input GitHub API token' }).change(onChange), _.div({ class: 'input-group-btn' }, _.button({ class: 'btn btn-primary' }, 'Renew').click(onClickRenew)));
                }

                /**
                 * Render organisation picker
                 */

            }, {
                key: "renderOrgPicker",
                value: function renderOrgPicker() {
                    var view = this;

                    var $editor = _.div({ class: 'field-editor dropdown-editor' }, _.select({ class: 'form-control' }, _.option({ value: this.model.org }, this.model.org)).change(onChange));

                    function onChange() {
                        var org = $(this).val();

                        view.model.org = org;

                        view.render();
                    }

                    $editor.children('select').val(view.model.org);

                    $.ajax({
                        type: 'get',
                        url: '/api/github/orgs?token=' + this.model.token,
                        success: function success(orgs) {
                            _.append($editor.children('select').empty(), _.option({ value: '' }, '(none)'), _.each(orgs, function (i, org) {
                                return _.option({ value: org.login }, org.login);
                            }));

                            $editor.children('select').val(view.model.org);
                        }
                    });

                    return $editor;
                }

                /**
                 * Render repository picker
                 */

            }, {
                key: "renderRepoPicker",
                value: function renderRepoPicker() {
                    var view = this;

                    var $editor = _.div({ class: 'field-editor dropdown-editor' }, _.select({ class: 'form-control' }, _.option({ value: this.model.repo }, this.model.repo)).change(onChange));

                    function onChange() {
                        var repo = $(this).val();

                        view.model.repo = repo;

                        view.render();
                    }

                    $editor.children('select').val(view.model.repo);

                    $.ajax({
                        type: 'get',
                        url: '/api/github/repos?token=' + this.model.token + '&org=' + this.model.org,
                        success: function success(repos) {
                            $editor.children('select').html(_.each(repos, function (i, repo) {
                                return _.option({ value: repo.full_name }, repo.full_name);
                            }));

                            $editor.children('select').val(view.model.repo);
                        }
                    });

                    return $editor;
                }
            }, {
                key: "render",
                value: function render() {
                    this.$element.empty();

                    _.append(this.$element,
                    // Token
                    _.div({ class: 'field-container github-token' }, _.div({ class: 'field-key' }, 'Token'), _.div({ class: 'field-value' }, this.renderTokenEditor())),

                    // Org picker
                    _.div({ class: 'field-container github-org' }, _.div({ class: 'field-key' }, 'Organisation'), _.div({ class: 'field-value' }, this.renderOrgPicker())),

                    // Repo picker
                    _.div({ class: 'field-container github-repo' }, _.div({ class: 'field-key' }, 'Repository'), _.div({ class: 'field-value' }, this.renderRepoPicker())));
                }
            }]);

            return ConnectionEditor;
        }(View);

        resources.connectionEditors['GitHub Pages'] = ConnectionEditor;
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

        resources.connectionEditors['JSON Tree'] = JsonTreeConnectionEditor;
    }, {}] }, {}, [1, 3]);