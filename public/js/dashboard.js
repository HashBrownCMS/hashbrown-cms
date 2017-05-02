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

	window._crypto = null;

	// Helper functions
	__webpack_require__(2);

	// Get package file
	window.app = __webpack_require__(190);

	// Views
	window.ProjectEditor = __webpack_require__(200);
	window.BackupEditor = __webpack_require__(201);
	window.MigrationEditor = __webpack_require__(202);
	window.InfoEditor = __webpack_require__(203);
	window.LanguageEditor = __webpack_require__(204);
	window.UserEditor = __webpack_require__(114);

	// Models
	window.Project = __webpack_require__(205);
	window.User = __webpack_require__(177);

	// --------------------
	// Get current user
	// --------------------
	apiCall('get', 'user').then(function (user) {
	    User.current = new User(user);

	    return apiCall('get', 'server/projects');
	})

	// --------------------
	// Projects
	// --------------------
	.then(function (projects) {
	    // Get next project
	    function renderNext(i) {
	        return apiCall('get', 'server/projects/' + projects[i]).then(function (project) {
	            var projectEditor = new ProjectEditor({
	                model: new Project(project)
	            });

	            $('.dashboard-container .projects .project-list').append(projectEditor.$element);

	            // If there are more projects to render, render the next one
	            if (i < projects.length - 1) {
	                return renderNext(i + 1);

	                // If not, just resolve normally
	            } else {
	                return Promise.resolve();
	            }
	        });
	    }

	    // Get next project
	    if (projects.length > 0) {
	        return renderNext(0);

	        // Resolve normally
	    } else {
	        return Promise.resolve();
	    }
	})

	// --------------------
	// Users
	// --------------------
	.then(function () {
	    if (!User.current.isAdmin) {
	        return Promise.resolve();
	    }

	    return apiCall('get', 'users');
	}).then(function (users) {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        var _loop = function _loop() {
	            var user = _step.value;

	            user = new User(user);

	            var $user = void 0;
	            var $projectList = void 0;

	            var renderUser = function renderUser() {
	                _.append($user.empty(), _.div({ class: 'user-info' }, _.span({ class: 'user-icon fa fa-' + (user.isAdmin ? 'black-tie' : 'user') }), _.h4((user.fullName || user.username || user.email || user.id) + (user.id == User.current.id ? ' (you)' : '')), _.p(user.isAdmin ? 'Admin' : 'Editor')), _.div({ class: 'user-actions' }, _.button({ class: 'btn btn-primary', title: 'Edit user' }, 'Edit').on('click', function () {
	                    var userEditor = new UserEditor({ model: user });

	                    userEditor.on('save', function () {
	                        renderUser();
	                    });
	                }), _.button({ class: 'btn btn-primary', title: 'Remove user' }, 'Remove').on('click', function () {
	                    UI.confirmModal('remove', 'Delete user "' + (user.fullName || user.username || user.email || user.id) + '"', 'Are you sure you want to remove this user?', function () {
	                        apiCall('delete', 'user/' + user.id).then(function () {
	                            $user.remove();
	                        }).catch(UI.errorModal);
	                    });
	                })));
	            };

	            $('.dashboard-container .users .user-list').append($user = _.div({ class: 'user raised' }));

	            renderUser();
	        };

	        for (var _iterator = (users || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            _loop();
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
	})

	// --------------------
	// Restart button
	// --------------------
	.then(function () {
	    if (!User.current.isAdmin) {
	        return Promise.resolve();
	    }

	    $('.btn-restart').click(function () {
	        apiCall('post', 'server/restart').then(function () {
	            listenForRestart();
	        });
	    });
	})

	// --------------------
	// Updates
	// --------------------
	.then(function () {
	    if (!User.current.isAdmin) {
	        return;
	    }

	    apiCall('get', 'server/update/check').then(function (update) {
	        if (update.behind) {
	            $('.dashboard-container').prepend(_.div({ class: 'update' }, _.p('You are ' + update.amount + ' version' + (update.amount != '1' ? 's' : '') + ' behind ' + update.branch), _.p('Comment: "' + update.comment + '"'), _.button({ class: 'btn btn-primary btn-update-hashbrown' }, 'Update').click(function () {
	                UI.messageModal('Update', 'HashBrown is updating (this may take a minute)...', false);

	                apiCall('post', 'server/update/start').then(function () {
	                    new MessageModal({
	                        model: {
	                            title: 'Success',
	                            body: 'HashBrown was updated successfully'
	                        },
	                        buttons: [{
	                            label: 'Cool!',
	                            class: 'btn-primary',
	                            callback: function callback() {
	                                listenForRestart();
	                            }
	                        }]
	                    });
	                }).catch(UI.errorModal);
	            })));
	        }
	    });
	}).catch(UI.errorModal);

	// --------------------
	// Navbar
	// --------------------
	$('.navbar-main a').click(function () {
	    $('.navbar-main a').removeClass('active');
	    $(this).addClass('active');
	});

	// --------------------
	// Invite a user
	// --------------------
	$('.btn-invite-user').click(function () {
	    customApiCall('get', '/api/users').then(function (users) {
	        /**
	         * Generate password
	         */
	        function generatePassword() {
	            var length = 8,
	                charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
	                retVal = "";
	            for (var i = 0, n = charset.length; i < length; ++i) {
	                retVal += charset.charAt(Math.floor(Math.random() * n));
	            }
	            return retVal;
	        }

	        /**
	         * Event: On submit user changes
	         */
	        function onSubmit() {
	            var username = addUserModal.$element.find('input.username').val();

	            // Check if username was email
	            var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	            var isEmail = emailRegex.test(username);

	            // Check if en existing user has the same information
	            var existingUser = users.filter(function (user) {
	                return user.username == username || user.email == username;
	            })[0];

	            // The user was found
	            if (existingUser) {
	                UI.errorModal(new Error('User "' + username + '" already exists'));
	                return;
	            }

	            // An email was provided, send invitation    
	            if (isEmail) {
	                var _modal = UI.confirmModal('invite', 'Add user', 'Do you want to invite a new user with email "' + username + '"?', function () {
	                    customApiCall('post', '/api/user/invite', {
	                        email: username
	                    }).then(function () {
	                        UI.messageModal('Invite user', 'Invitation was sent to ' + username);
	                    }).catch(errorModal);

	                    var $buttons = _modal.$element.find('button').attr('disabled', true).addClass('disabled');

	                    return false;
	                });

	                return;
	            }

	            // User doesn't exist, create it
	            var $passwd = void 0;

	            var modal = UI.confirmModal('create', 'Add user', [_.p('Set password for new user "' + username + '"'), $passwd = _.input({ required: true, pattern: '.{6,}', class: 'form-control', type: 'text', value: generatePassword(), placeholder: 'Type new password' })], function () {
	                var password = $passwd.val() || '';
	                var scopes = {};

	                apiCall('post', 'user/new', {
	                    username: username,
	                    password: password,
	                    scopes: {}
	                }).then(function () {
	                    UI.messageModal('Create user', 'User "' + username + '" was created with password "' + password + '".', function () {
	                        location.reload();
	                    });
	                }).catch(errorModal);

	                var $buttons = modal.$element.find('button').attr('disabled', true).addClass('disabled');

	                return false;
	            });
	        }

	        // Renders the modal
	        var addUserModal = UI.confirmModal('OK', 'Add user', _.input({ class: 'form-control username', placeholder: 'Username or email', type: 'text' }).on('change keyup paste propertychange input'), onSubmit);
	    }).catch(errorModal);
	});

	// --------------------
	// Create project
	// --------------------
	$('.btn-create-project').click(function () {
	    function onClickCreate() {
	        var name = modal.$element.find('input').val();

	        if (name) {
	            apiCall('post', 'server/projects/new', { name: name }).then(function () {
	                location.reload();
	            }).catch(UI.errorModal);
	        } else {
	            return false;
	        }
	    }

	    var modal = new MessageModal({
	        model: {
	            title: 'Create new project',
	            body: [_.input({ class: 'form-control', type: 'text', placeholder: 'Project name' })]
	        },
	        buttons: [{
	            label: 'Cancel',
	            class: 'btn-default'
	        }, {
	            label: 'Create',
	            class: 'btn-primary',
	            callback: onClickCreate
	        }]
	    });
	});

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	// Libraries
	__webpack_require__(3);
	window.Promise = __webpack_require__(12);
	window.marked = __webpack_require__(51);
	window.toMarkdown = __webpack_require__(52);

	// Common views
	window.MessageModal = __webpack_require__(60);

	// Common helpers
	window.UI = __webpack_require__(61);
	window.ProjectHelper = __webpack_require__(62);
	window.LanguageHelper = __webpack_require__(63);
	window.SettingsHelper = __webpack_require__(66);

	window.debug = __webpack_require__(68);
	window.debug.verbosity = 3;

	/**
	 * Checks if the currently logged in user is admin
	 *
	 * @resurns {Boolean} Is admin
	 */
	window.isCurrentUserAdmin = function isCurrentUserAdmin() {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = resources.users[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var user = _step.value;

	            if (user.isCurrent) {
	                return user.isAdmin;
	            }
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

	    return false;
	};

	/**
	 * Checks if the currently logged in user has a particular scope
	 *
	 * @param {String} scope
	 *
	 * @resurns {Boolean} Has scope
	 */
	window.currentUserHasScope = function currentUserHasScope(scope) {
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;

	    try {
	        for (var _iterator2 = resources.users[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var user = _step2.value;

	            if (user.isCurrent) {
	                return user.hasScope(scope);
	            }
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

	    return false;
	};

	/**
	 * Handles a required parameter
	 */
	window.requiredParam = function requiredParam(name) {
	    throw new Error('Parameter "' + name + '" is required');
	};

	/**
	 * Gets a cookie by name
	 *
	 * @param {String} name
	 *
	 * @returns {String} value
	 */
	window.getCookie = function getCookie(name) {
	    var value = "; " + document.cookie;
	    var parts = value.split("; " + name + "=");

	    if (parts.length == 2) {
	        return parts.pop().split(";").shift();
	    }
	};

	/**
	 * Copies string to the clipboard
	 *
	 * @param {String} string
	 */
	window.copyToClipboard = function copyToClipboard(string) {
	    var text = document.createElement('TEXTAREA');

	    text.innerHTML = string;

	    document.body.appendChild(text);

	    text.select();

	    try {
	        var success = document.execCommand('copy');

	        if (!success) {
	            UI.errorModal('Your browser does not yet support copying to clipboard');
	        }
	    } catch (e) {
	        UI.errorModal(e.toString());
	    }

	    document.body.removeChild(text);
	};

	/**
	 * Wraps an API URL
	 *
	 * @param {String} url
	 *
	 * @returns {String} API URL
	 */
	window.apiUrl = function apiUrl(url) {
	    var newUrl = '/api/';

	    if (ProjectHelper.currentProject) {
	        newUrl += ProjectHelper.currentProject + '/';
	    }

	    if (ProjectHelper.currentEnvironment) {
	        newUrl += ProjectHelper.currentEnvironment + '/';
	    }

	    newUrl += url;

	    return newUrl;
	};

	/**
	 * Wraps an API call
	 *
	 * @param {String} method
	 * @param {String} url
	 * @param {Object} data
	 *
	 * @returns {Promise} Response
	 */
	window.apiCall = function apiCall(method, url, data) {
	    return customApiCall(method, apiUrl(url), data);
	};

	/**
	 * Wraps an API call with a custom path
	 *
	 * @param {String} method
	 * @param {String} url
	 * @param {Object} data
	 *
	 * @returns {Promise} Response
	 */
	window.customApiCall = function customApiCall(method, url, data) {
	    return new Promise(function (resolve, reject) {
	        var xhr = new XMLHttpRequest();
	        xhr.open(method.toUpperCase(), url);
	        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

	        if (data) {
	            if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
	                data = JSON.stringify(data);
	            }

	            xhr.send(data);
	        } else {
	            xhr.send();
	        }

	        xhr.onreadystatechange = function () {
	            var DONE = 4;
	            var OK = 200;
	            var NOT_MODIFIED = 304;
	            var UNAUTHORIZED = 403;

	            if (xhr.readyState === DONE) {
	                if (xhr.status === UNAUTHORIZED) {
	                    location = '/login/?path=' + location.pathname + location.hash;

	                    reject(new Error('User is not logged in'));
	                } else if (xhr.status == OK || xhr.status == NOT_MODIFIED) {
	                    var response = xhr.responseText;

	                    if (response && response != 'OK') {
	                        try {
	                            response = JSON.parse(response);
	                        } catch (e) {
	                            // If the response isn't JSON, then so be it

	                        }
	                    }

	                    resolve(response);
	                } else {
	                    reject(new Error(xhr.responseText));
	                }
	            }
	        };
	    });
	};

	/**
	 * Listens for server restart
	 */
	window.listenForRestart = function listenForRestart() {
	    UI.messageModal('Restart', 'HashBrown is restarting...', false);

	    function poke() {
	        $.ajax({
	            type: 'get',
	            url: '/',
	            success: function success() {
	                location.reload();
	            },
	            error: function error() {
	                poke();
	            }
	        });
	    }

	    poke();
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(4);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var pathToRegexp = __webpack_require__(5);

	var routes = [];

	var Router = function () {
	    function Router() {
	        _classCallCheck(this, Router);
	    }

	    _createClass(Router, null, [{
	        key: 'route',

	        /**
	         * Creates a new route
	         *
	         * @param {String} path
	         * @param {Function} controller
	         */
	        value: function route(path, controller) {
	            routes[path] = {
	                controller: controller
	            };
	        }

	        /**
	         * Goes to the route
	         *
	         * @param {String} url
	         * @param {Boolean} quiet
	         */

	    }, {
	        key: 'go',
	        value: function go(url, quiet) {
	            if (quiet) {
	                window.history.pushState(url, url, '#' + url);
	                this.directToRoute(url, true);
	            } else {
	                location.hash = url;
	            }
	        }

	        /**
	         * Goes to the base directory
	         */

	    }, {
	        key: 'goToBaseDir',
	        value: function goToBaseDir() {
	            var url = this.url || '/';
	            var base = new String(url).substring(0, url.lastIndexOf('/'));

	            this.go(base);
	        }

	        /**
	         * Gets a query string parameter
	         *
	         * @param {String} name
	         *
	         * @returns {String} Value
	         */

	    }, {
	        key: 'query',
	        value: function query(name) {
	            var url = window.location.href;

	            name = name.replace(/[\[\]]/g, "\\$&");

	            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	            var results = regex.exec(url);

	            if (!results) return null;
	            if (!results[2]) return '';

	            return decodeURIComponent(results[2].replace(/\+/g, " "));
	        }

	        /**
	         * Directs to the route
	         *
	         * @param {String} url
	         * @param {Boolean} quiet
	         */

	    }, {
	        key: 'directToRoute',
	        value: function directToRoute(url, quiet) {
	            // Look for route
	            var context = {};
	            var route = void 0;

	            // Exact match
	            if (routes[url]) {
	                route = routes[url];

	                // Use path to regexp
	            } else {
	                for (var path in routes) {
	                    var keys = [];
	                    var re = pathToRegexp(path, keys);
	                    var values = re.exec(url);

	                    // A match was found
	                    if (re.test(url)) {
	                        // Set the route
	                        route = routes[path];

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
	                                Router.params[key.name] = values[counter];

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

	            Router.url = url;

	            if (route && !quiet) {
	                route.controller();
	            }
	        }

	        /**
	         * Initialise
	         */

	    }, {
	        key: 'init',
	        value: function init() {
	            // Get the url
	            var url = location.hash.slice(1) || '/';
	            var trimmed = url.substring(0, url.indexOf('?'));

	            Router.params = {};

	            if (trimmed) {
	                url = trimmed;
	            }

	            // If a check is implemented, execute it
	            if (typeof Router.check === 'function') {
	                Router.check(
	                // Pass the proposed route
	                url,

	                // Cancel method
	                function () {
	                    location.hash = Router.url;
	                },

	                // Proceed method
	                function () {
	                    Router.directToRoute(url);
	                });

	                // If not, proceed as normal
	            } else {
	                Router.directToRoute(url);
	            }
	        }
	    }]);

	    return Router;
	}();

	window.addEventListener('hashchange', Router.init);
	window.Router = Router;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var isarray = __webpack_require__(6);

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
	'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');

	/**
	 * Parse a string for the raw tokens.
	 *
	 * @param  {string}  str
	 * @param  {Object=} options
	 * @return {!Array}
	 */
	function parse(str, options) {
	  var tokens = [];
	  var key = 0;
	  var index = 0;
	  var path = '';
	  var defaultDelimiter = options && options.delimiter || '/';
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

	    var next = str[index];
	    var prefix = res[2];
	    var name = res[3];
	    var capture = res[4];
	    var group = res[5];
	    var modifier = res[6];
	    var asterisk = res[7];

	    // Push the current path onto the tokens.
	    if (path) {
	      tokens.push(path);
	      path = '';
	    }

	    var partial = prefix != null && next != null && next !== prefix;
	    var repeat = modifier === '+' || modifier === '*';
	    var optional = modifier === '?' || modifier === '*';
	    var delimiter = res[2] || defaultDelimiter;
	    var pattern = capture || group;

	    tokens.push({
	      name: name || key++,
	      prefix: prefix || '',
	      delimiter: delimiter,
	      optional: optional,
	      repeat: repeat,
	      partial: partial,
	      asterisk: !!asterisk,
	      pattern: pattern ? escapeGroup(pattern) : asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?'
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
	 * @param  {string}             str
	 * @param  {Object=}            options
	 * @return {!function(Object=, Object=)}
	 */
	function compile(str, options) {
	  return tokensToFunction(parse(str, options));
	}

	/**
	 * Prettier encoding of URI path segments.
	 *
	 * @param  {string}
	 * @return {string}
	 */
	function encodeURIComponentPretty(str) {
	  return encodeURI(str).replace(/[\/?#]/g, function (c) {
	    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	  });
	}

	/**
	 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
	 *
	 * @param  {string}
	 * @return {string}
	 */
	function encodeAsterisk(str) {
	  return encodeURI(str).replace(/[?#]/g, function (c) {
	    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	  });
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
	      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
	    }
	  }

	  return function (obj, opts) {
	    var path = '';
	    var data = obj || {};
	    var options = opts || {};
	    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

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
	          // Prepend partial segment prefixes.
	          if (token.partial) {
	            path += token.prefix;
	          }

	          continue;
	        } else {
	          throw new TypeError('Expected "' + token.name + '" to be defined');
	        }
	      }

	      if (isarray(value)) {
	        if (!token.repeat) {
	          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`');
	        }

	        if (value.length === 0) {
	          if (token.optional) {
	            continue;
	          } else {
	            throw new TypeError('Expected "' + token.name + '" to not be empty');
	          }
	        }

	        for (var j = 0; j < value.length; j++) {
	          segment = encode(value[j]);

	          if (!matches[i].test(segment)) {
	            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`');
	          }

	          path += (j === 0 ? token.prefix : token.delimiter) + segment;
	        }

	        continue;
	      }

	      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

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
	 * @param  {string} str
	 * @return {string}
	 */
	function escapeString(str) {
	  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
	}

	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {string} group
	 * @return {string}
	 */
	function escapeGroup(group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1');
	}

	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {!RegExp} re
	 * @param  {Array}   keys
	 * @return {!RegExp}
	 */
	function attachKeys(re, keys) {
	  re.keys = keys;
	  return re;
	}

	/**
	 * Get the flags for a regexp from the options.
	 *
	 * @param  {Object} options
	 * @return {string}
	 */
	function flags(options) {
	  return options.sensitive ? '' : 'i';
	}

	/**
	 * Pull out keys from a regexp.
	 *
	 * @param  {!RegExp} path
	 * @param  {!Array}  keys
	 * @return {!RegExp}
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
	        partial: false,
	        asterisk: false,
	        pattern: null
	      });
	    }
	  }

	  return attachKeys(path, keys);
	}

	/**
	 * Transform an array into a regexp.
	 *
	 * @param  {!Array}  path
	 * @param  {Array}   keys
	 * @param  {!Object} options
	 * @return {!RegExp}
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
	 * @param  {string}  path
	 * @param  {!Array}  keys
	 * @param  {!Object} options
	 * @return {!RegExp}
	 */
	function stringToRegexp(path, keys, options) {
	  return tokensToRegExp(parse(path, options), keys, options);
	}

	/**
	 * Expose a function for taking tokens and returning a RegExp.
	 *
	 * @param  {!Array}          tokens
	 * @param  {(Array|Object)=} keys
	 * @param  {Object=}         options
	 * @return {!RegExp}
	 */
	function tokensToRegExp(tokens, keys, options) {
	  if (!isarray(keys)) {
	    options = /** @type {!Object} */keys || options;
	    keys = [];
	  }

	  options = options || {};

	  var strict = options.strict;
	  var end = options.end !== false;
	  var route = '';

	  // Iterate over the tokens and create our regexp string.
	  for (var i = 0; i < tokens.length; i++) {
	    var token = tokens[i];

	    if (typeof token === 'string') {
	      route += escapeString(token);
	    } else {
	      var prefix = escapeString(token.prefix);
	      var capture = '(?:' + token.pattern + ')';

	      keys.push(token);

	      if (token.repeat) {
	        capture += '(?:' + prefix + capture + ')*';
	      }

	      if (token.optional) {
	        if (!token.partial) {
	          capture = '(?:' + prefix + '(' + capture + '))?';
	        } else {
	          capture = prefix + '(' + capture + ')?';
	        }
	      } else {
	        capture = prefix + '(' + capture + ')';
	      }

	      route += capture;
	    }
	  }

	  var delimiter = escapeString(options.delimiter || '/');
	  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

	  // In non-strict mode we allow a slash at the end of match. If the path to
	  // match already ends with a slash, we remove it for consistency. The slash
	  // is valid at the end of a path match, not in the middle. This is important
	  // in non-ending mode, where "/test/" shouldn't match "/test//route".
	  if (!strict) {
	    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
	  }

	  if (end) {
	    route += '$';
	  } else {
	    // In non-ending mode, we need the capturing groups to match as much as
	    // possible by using a positive lookahead to the end or next path segment.
	    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
	  }

	  return attachKeys(new RegExp('^' + route, flags(options)), keys);
	}

	/**
	 * Normalize the given path string, returning a regular expression.
	 *
	 * An empty array can be passed in for the keys, which will hold the
	 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
	 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
	 *
	 * @param  {(string|RegExp|Array)} path
	 * @param  {(Array|Object)=}       keys
	 * @param  {Object=}               options
	 * @return {!RegExp}
	 */
	function pathToRegexp(path, keys, options) {
	  if (!isarray(keys)) {
	    options = /** @type {!Object} */keys || options;
	    keys = [];
	  }

	  options = options || {};

	  if (path instanceof RegExp) {
	    return regexpToRegexp(path, /** @type {!Array} */keys);
	  }

	  if (isarray(path)) {
	    return arrayToRegexp( /** @type {!Array} */path, /** @type {!Array} */keys, options);
	  }

	  return stringToRegexp( /** @type {string} */path, /** @type {!Array} */keys, options);
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	var FunctionTemplating = {};
	var lastCondition = void 0;

	/**
	 * Appends content to an element
	 *
	 * @param {HTMLElement} element
	 * @param {Object} content
	 */
	function append(element, content) {
	    if (Object.prototype.toString.call(content) === '[object Array]') {
	        for (var _i in content) {
	            append(element, content[_i]);
	        }
	    } else if (content) {
	        // jQuery logic
	        if (typeof jQuery !== 'undefined') {
	            if (element instanceof jQuery == false) {
	                element = $(element);
	            }

	            element.append(content);

	            // Native JavaScript logic
	        } else {
	            if (typeof content === 'number' || typeof content === 'string') {
	                element.innerHTML += content.toString();
	            } else {
	                element.appendChild(content);
	            }
	        }
	    }
	}

	/**
	 * Assigns event handler shorthands to element
	 * This is done to prevent extending the HTMLElement prototype
	 *
	 * @param {HTMLElement} element
	 */
	function assignEvents(element) {
	    /**
	     * Handles the 'addEventListener' method
	     *
	     * @param {String} type
	     * @param {Function} callback
	     */
	    element.on = function on(type, callback) {
	        element.addEventListener(type, callback);

	        return element;
	    };

	    /**
	     * Handles the 'removeEventListener' method
	     *
	     * @param {String} type
	     * @param {Function} callback
	     */
	    element.off = function off(type, callback) {
	        element.removeEventListener(type, callback);

	        return element;
	    };

	    /**
	     * Removes an element
	     */
	    element.remove = function remove() {
	        element.parentNode.removeChild(element);
	    };

	    // Define shorthand methods
	    var shorthands = ['blur', 'change', 'click', 'focus', 'hover', 'keydown', 'keypress', 'keyup', 'mousedown', 'mouseenter', 'mouseleave', 'mouseout', 'mouseover', 'mouseup', 'select'];

	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        var _loop = function _loop() {
	            var shorthand = _step.value;

	            element[shorthand] = function (callback) {
	                return element.on(shorthand, callback);
	            };
	        };

	        for (var _iterator = shorthands[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            _loop();
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
	}

	/**
	 * Creates an element
	 *
	 * @param {String} tag
	 * @param {Object} attr
	 * @param {Object} contents
	 *
	 * @returns {HTMLElement} element
	 */
	function create(tag, attr, contents) {
	    var element = document.createElement(tag.toUpperCase());

	    var isContents = function isContents(obj) {
	        if (!obj) {
	            return false;
	        }

	        return obj instanceof Array || obj instanceof HTMLElement || typeof jQuery !== 'undefined' && obj instanceof jQuery || typeof obj === 'string' || typeof obj === 'number';
	    };

	    // The attribute parameter is the content
	    if (isContents(attr)) {
	        contents = [attr, contents];

	        // The attribute parameter was defined as an object
	    } else if (typeof attr !== 'undefined' && attr instanceof Object && attr instanceof Array == false) {
	        try {
	            for (var k in attr) {
	                // Null, undefined or false values should not be included
	                if (!attr[k] && attr[k] !== 0) {
	                    continue;
	                }

	                element.setAttribute(k, attr[k]);
	            }
	        } catch (e) {
	            console.log(e);

	            console.log(attr, isContents(attr));
	        }
	    }

	    append(element, contents);

	    // jQuery logic
	    if (typeof jQuery !== 'undefined') {
	        return $(element);

	        // Native JavaScript logic
	    } else {
	        // Assign custom event functions to element instead of extending the prototype
	        assignEvents(element);

	        return element;
	    }
	}

	/**
	 * Declares a rendering method
	 *
	 * @param {String} tag
	 */
	function declareMethod(tag) {
	    FunctionTemplating[tag] = function (attr) {
	        for (var _len = arguments.length, contents = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	            contents[_key - 1] = arguments[_key];
	        }

	        return create(tag, attr, contents);
	    };
	}

	/**
	 * Appends content using the function templating rules
	 *
	 * @params {HTMLElement} parentElement
	 * @params {HTMLElement} contents
	 */
	FunctionTemplating.append = function (parentElement) {
	    for (var _len2 = arguments.length, contents = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        contents[_key2 - 1] = arguments[_key2];
	    }

	    append(parentElement, contents);
	};

	/**
	 * Renders content based on a condition
	 * 
	 * @param {Boolean} condition
	 * @param {HTMLElement} contents
	 *
	 * @returns {HTMLElement} Contents
	 */
	FunctionTemplating.if = function (condition) {
	    lastCondition = condition || false;

	    if (lastCondition) {
	        for (var _len3 = arguments.length, contents = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	            contents[_key3 - 1] = arguments[_key3];
	        }

	        return contents;
	    }
	};

	/**
	 * Uses the last provided condition to simulate an "else" statement
	 *
	 * @param {HTMLElement} contents
	 *
	 * @returns {HTMLElement} Contents
	 */
	FunctionTemplating.else = function () {
	    if (typeof lastCondition === 'undefined') {
	        throw new Error('No "if" statement was provided before this "else" statement');
	    }

	    if (!lastCondition) {
	        for (var _len4 = arguments.length, contents = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	            contents[_key4] = arguments[_key4];
	        }

	        return contents;
	    }
	};

	/**
	 * Loops through an array or object, rendering elements from model data
	 *
	 * @param {Object} array
	 * @param {Function} callback
	 *
	 * @returns {HTMLElement} elements
	 */
	FunctionTemplating.each = function (array, callback) {
	    var elements = [];

	    for (var i in array) {
	        var element = callback(i, array[i]);

	        if (element) {
	            elements.push(element);
	        }
	    }

	    return elements;
	};

	/**
	 * Loops a given number of times, rendering elements for each pass
	 *
	 * @param {Number} iterations
	 * @param {Function} callback
	 *
	 * @returns {HTMLElement} elements
	 */
	FunctionTemplating.loop = function (iterations, callback) {
	    var elements = [];

	    for (var i = 0; i <= iterations; i++) {
	        var element = callback(i);

	        if (element) {
	            elements.push(element);
	        }
	    }

	    return elements;
	};

	/**
	 * A shorthand for document.querySelector
	 *
	 * @param {String} query
	 *
	 * @returns {HTMLElement} element
	 */
	FunctionTemplating.find = function (query) {
	    var element = document.querySelector(query);

	    if (!element) {
	        return null;
	    }

	    if (typeof jQuery !== 'undefined') {
	        return $(element);
	    } else {
	        assignEvents(element);

	        return element;
	    }
	};

	/**
	 * A shorthand for document.querySelectorAll
	 *
	 * @param {String} query
	 *
	 * @returns {HTMLElement[]} element
	 */
	FunctionTemplating.findAll = function (query) {
	    var elements = document.querySelectorAll(query);

	    if (!elements) {
	        return [];
	    }

	    if (typeof jQuery !== 'undefined') {
	        return $(elements);
	    } else {
	        var array = [];

	        for (var _i2 = 0; _i2 < elements.length; _i2++) {
	            array[_i2] = elements[_i2];
	            assignEvents(array[_i2]);
	        }

	        return array;
	    }
	};

	// ----------
	// Init all element types
	// ----------
	var elementTypes = [
	// Block elements
	'div', 'section', 'nav', 'hr', 'label', 'textarea', 'audio', 'video', 'canvas', 'iframe',

	// Inline elements
	'img',

	// Table elements
	'table', 'thead', 'tbody', 'th', 'td', 'tr',

	// Select
	'select', 'option', 'optgroup', 'input',

	// Headings
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6',

	// Body text
	'span', 'p', 'strong', 'b',

	// Action buttons
	'a', 'button',

	// SVG
	'polygon', 'svg',

	// List
	'ol', 'ul', 'li',

	// Forms
	'form', 'input'];

	for (var i in elementTypes) {
	    declareMethod(elementTypes[i]);
	}

	window._ = FunctionTemplating;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var elementTags = [
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

	var ObjectTemplating = function () {
	    function ObjectTemplating(object) {
	        _classCallCheck(this, ObjectTemplating);

	        var template = this;
	        var $elements = [];

	        this.$elements = {};

	        function getTagName(key) {
	            for (var i in elementTags) {
	                var elementTagName = elementTags[i];

	                if (key.indexOf(elementTagName) == 0) {
	                    return elementTagName;
	                }
	            }

	            return null;
	        }

	        function createElement(tag) {
	            return $('<' + tag + '></' + tag + '>');
	        }

	        function parseObject(obj, $parentElement) {
	            if (typeof obj === 'string' && $parentElement) {
	                $parentElement.append(obj);
	            } else {
	                for (var k in obj) {
	                    var v = obj[k];

	                    // ----------
	                    // Function keywords
	                    // ----------
	                    // Each
	                    if (k == 'each') {
	                        if (Array.isArray(v)) {
	                            var array = v[0];
	                            var iterator = v[1];

	                            for (var i in array) {
	                                var newObject = iterator(i, array[i]);

	                                if (newObject) {
	                                    var $newElement = new ObjectTemplating(newObject);

	                                    if ($newElement) {
	                                        if ($parentElement) {
	                                            $parentElement.append($newElement);
	                                        } else {
	                                            $elements[$elements.length] = $newElement;
	                                        }
	                                    }
	                                }
	                            }
	                        } else {
	                            console.log('[Exomon] Usage of "each": Array([Array/Object], [Function]). Argument provided was of type "' + (typeof v === 'undefined' ? 'undefined' : _typeof(v)) + '"');
	                        }

	                        // Content / HTML
	                    } else if (k == 'content' || k == 'html') {
	                        if ($parentElement) {
	                            $parentElement.append(v);
	                        } else {
	                            $elements[$elements.length] = v;
	                        }

	                        // Events / on
	                    } else if (k == 'events' || k == 'on') {
	                        if ($parentElement) {
	                            for (var eventName in v) {
	                                $parentElement.on(eventName, v[eventName]);
	                            }
	                        }
	                    } else {
	                        // ----------
	                        // Create element
	                        // ----------
	                        var keyTagName = getTagName(k);

	                        if (keyTagName) {
	                            var _$newElement = createElement(keyTagName);
	                            var elementName = k.replace(keyTagName, '');

	                            if (elementName) {
	                                if (elementName[0] == '_') {
	                                    elementName = elementName.slice(1);
	                                }

	                                elementName = elementName.charAt(0).toLowerCase() + elementName.slice(1);

	                                template.$elements[elementName] = _$newElement;
	                            }

	                            parseObject(v, _$newElement);

	                            if ($parentElement) {
	                                $parentElement.append(_$newElement);
	                            } else {
	                                $elements[$elements.length] = _$newElement;
	                            }

	                            // ----------
	                            // Add attributes to parent element
	                            // ----------
	                        } else {
	                            if ($parentElement) {
	                                $parentElement.attr(k, v);
	                            }
	                        }
	                    }
	                }
	            }
	        }

	        parseObject(object);

	        if ($elements.length < 1) {
	            this.html = null;
	        } else if ($elements.length == 1) {
	            this.html = $elements[0];
	        } else {
	            this.html = $elements;
	        }
	    }

	    /**
	     * Returns the generated html
	     */


	    _createClass(ObjectTemplating, [{
	        key: 'html',
	        value: function html() {
	            return this.html;
	        }
	    }]);

	    return ObjectTemplating;
	}();

	module.exports = ObjectTemplating;

	window.Template = ObjectTemplating;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Generates a new GUID
	 */

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function guid() {
	    function s4() {
	        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	    }
	    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	var instances = [];

	/**
	 * Helper class for getting instances of Views
	 *
	 * @class ViewHelper
	 */

	var ViewHelper = function () {
	    function ViewHelper() {
	        _classCallCheck(this, ViewHelper);
	    }

	    _createClass(ViewHelper, null, [{
	        key: 'getAll',
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
	        key: 'get',
	        value: function get(type) {
	            var results = ViewHelper.getAll(type);
	            var view = results.length > 0 ? results[0] : null;

	            return view;
	        }
	    }, {
	        key: 'clear',
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
	        key: 'removeAll',
	        value: function removeAll(type) {
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = ViewHelper.getAll(type)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var view = _step.value;

	                    view.remove();
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
	        }
	    }]);

	    return ViewHelper;
	}();

	window.ViewHelper = ViewHelper;

	/**
	 * View class
	 *
	 * @class View
	 *
	 * @param {Object} params
	 */

	var View = function () {
	    function View(params) {
	        _classCallCheck(this, View);

	        this.name = this.constructor.name;
	        this.guid = guid();
	        this.events = {};

	        this.adopt(params);

	        instances[this.guid] = this;
	    }

	    /**
	     * Gets the name of this View
	     */


	    _createClass(View, [{
	        key: 'getName',
	        value: function getName() {
	            var name = this.constructor.toString();
	            name = name.substring('function '.length);
	            name = name.substring(0, name.indexOf('('));

	            return name;
	        }

	        /**
	         * Init
	         */

	    }, {
	        key: 'init',
	        value: function init() {
	            var _this = this;

	            this.prerender();
	            this.render();
	            this.postrender();

	            var element = this.element;

	            if (!element && this.$element && this.$element.length > 0) {
	                element = this.$element[0];
	            }

	            if (!element) {
	                return;
	            }

	            element.addEventListener('DOMNodeRemovedFromDocument', function () {
	                // Wait a few cycles before removing, as the element might just have been relocated
	                setTimeout(function () {
	                    var element = _this.element;

	                    if (!element && _this.$element) {
	                        element = _this.$element[0];
	                    }

	                    if (!element || !element.parentNode) {
	                        _this.remove();
	                    }
	                }, 10);
	            });

	            this.trigger('ready', this);
	            this.isReady = true;
	        }

	        /**
	         * Shorthand for .on('ready')
	         */

	    }, {
	        key: 'ready',
	        value: function ready(callback) {
	            if (this.isReady) {
	                callback(this);
	            } else {
	                this.on('ready', callback);
	            }
	        }

	        /**
	         * Adopts values
	         *
	         * @param {Object} values
	         */

	    }, {
	        key: 'adopt',
	        value: function adopt(params) {
	            for (var k in params) {
	                this[k] = params[k];
	            }

	            return this;
	        }

	        /**
	         * Runs before render
	         */

	    }, {
	        key: 'prerender',
	        value: function prerender() {}

	        /**
	         * Renders this view
	         */

	    }, {
	        key: 'render',
	        value: function render() {
	            var output = void 0;

	            if (typeof this.template === 'function') {
	                output = this.template.call(this, this);
	            }

	            if (output) {
	                // jQuery
	                if (typeof jQuery !== 'undefined') {
	                    if (this.$element) {
	                        this.$element.html(output.children());
	                    } else {
	                        this.$element = output;
	                    }

	                    // Native JavaScript
	                } else {
	                    if (this.element) {
	                        this.element.innerHTML = output.innerHTML;
	                    } else {
	                        this.element = output;
	                    }
	                }
	            }
	        }

	        /**
	         * Runs after render
	         */

	    }, {
	        key: 'postrender',
	        value: function postrender() {}

	        /**
	         * Removes the view from DOM and memory
	         */

	    }, {
	        key: 'remove',
	        value: function remove(timeout) {
	            var _this2 = this;

	            if (!this.destroyed) {
	                this.destroyed = true;

	                setTimeout(function () {
	                    _this2.trigger('remove');

	                    // jQuery
	                    if (typeof jQuery !== 'undefined' && _this2.$element && _this2.$element.length > 0) {
	                        _this2.$element.remove();

	                        // Native JavaScript
	                    } else if (_this2.element && _this2.element.parentElement) {
	                        _this2.element.parentElement.removeChild(_this2.element);
	                    }

	                    delete instances[_this2.guid];
	                }, timeout || 0);
	            }
	        }

	        /**
	         * Call an event (for internal use)
	         */

	    }, {
	        key: 'call',
	        value: function call(callback, data, ui) {
	            callback(data, ui, this);
	        }

	        /**
	         * Trigger an event
	         */

	    }, {
	        key: 'trigger',
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

	        /**
	         * Bind an event
	         */

	    }, {
	        key: 'on',
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

	        /**
	         * Check if event exists
	         */

	    }, {
	        key: 'hasEvent',
	        value: function hasEvent(name) {
	            for (var k in this.events) {
	                if (k == name) {
	                    return true;
	                }
	            }

	            return false;
	        }

	        /**
	         * Fetch model data
	         */

	    }, {
	        key: 'fetch',
	        value: function fetch() {
	            var view = this;

	            function getModel() {
	                // Get model from URL
	                if (!view.model && typeof view.modelUrl === 'string') {
	                    var request = new XMLHttpRequest();
	                    request.open('GET', view.modelUrl, true);

	                    request.onload = function () {
	                        if (request.status >= 200 && request.status < 400) {
	                            // Success!
	                            var data = JSON.parse(request.responseText);

	                            view.model = data;

	                            view.init();
	                        } else {
	                            // We reached our target server, but it returned an error
	                            throw new Error('Couldn\'t fetch model data');
	                        }
	                    };

	                    request.onerror = function (e) {
	                        throw e;
	                    };

	                    request.send();

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

	            // Get the model
	            getModel();
	        }
	    }]);

	    return View;
	}();

	window.View = View;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ContextMenu = function (_View) {
	    _inherits(ContextMenu, _View);

	    function ContextMenu(params) {
	        _classCallCheck(this, ContextMenu);

	        var _this = _possibleConstructorReturn(this, (ContextMenu.__proto__ || Object.getPrototypeOf(ContextMenu)).call(this, params));

	        _this.element = _.ul({ class: 'context-menu dropdown-menu', role: 'menu' });

	        var existingMenu = _.find('.context-menu');

	        if (typeof jQuery !== 'undefined') {
	            if (existingMenu && existingMenu.length > 0) {
	                _this.element = existingMenu;
	            }
	        } else {
	            if (existingMenu) {
	                _this.element = existingMenu;
	            }
	        }

	        if (typeof jQuery !== 'undefined') {
	            _this.$element = _this.element;
	            _this.element = _this.$element[0];
	        }

	        _this.element.style.position = 'absolute';
	        _this.element.style.zIndex = 1200;
	        _this.element.style.top = _this.pos.y;
	        _this.element.style.left = _this.pos.x;
	        _this.element.style.display = 'block';

	        _this.fetch();
	        return _this;
	    }

	    _createClass(ContextMenu, [{
	        key: 'render',
	        value: function render() {
	            var _this2 = this;

	            _.append(this.element, _.each(this.model, function (label, func) {
	                if (func == '---') {
	                    return _.li({ class: 'dropdown-header' }, label);
	                } else {
	                    return _.li({ class: typeof func === 'function' ? '' : 'disabled' }, _.a({ tabindex: '-1', href: '#' }, label).click(function (e) {
	                        e.preventDefault();
	                        e.stopPropagation();

	                        if (func) {
	                            func(e);

	                            _this2.remove();
	                        }
	                    }));
	                }
	            }));

	            _.append(_.find('body'), this.element);

	            var rect = this.element.getBoundingClientRect();

	            if (rect.left + rect.width > window.innerWidth) {
	                this.element.style.left = rect.left - rect.width + 'px';
	            } else if (rect.bottom > window.innerHeight) {
	                this.element.style.top = rect.top - rect.height + 'px';
	            }
	        }
	    }]);

	    return ContextMenu;
	}(View);

	if (typeof jQuery !== 'undefined') {
	    jQuery.fn.extend({
	        exocontext: function exocontext(menuItems) {
	            return this.each(function () {
	                $(this).on('contextmenu', function (e) {
	                    if (e.ctrlKey) {
	                        return;
	                    }

	                    $('.context-menu-target-element').removeClass('context-menu-target-element');

	                    e.preventDefault();
	                    e.stopPropagation();

	                    if (e.which == 3) {
	                        $(this).toggleClass('context-menu-target-element', true);

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
	            $('.context-menu-target-element').removeClass('context-menu-target-element');
	            ViewHelper.removeAll('ContextMenu');
	        }
	    });
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	// ----------
	// Event handlers
	// ----------

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function dragHandler(e) {
	    DragDrop.current.onDrag(e);
	}

	function releaseHandler(e) {
	    DragDrop.current.onReleaseDragHandle(e);
	}

	// ----------
	// Registered DragDrop instances
	// ----------
	var instances = [];

	/**
	 * An instance that allows for elements to be dragged and dropped, using pure JavaScript
	 */

	var DragDrop = function () {
	    _createClass(DragDrop, null, [{
	        key: 'getInstances',

	        /**
	         * Gets all instances
	         *
	         * @returns {Array} instances
	         */
	        value: function getInstances() {
	            return instances;
	        }

	        /**
	         * Destroys a DragDrop instance
	         *
	         * @param {HTMLelement} element
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy(element) {
	            for (var i in instances) {
	                var _instance = instances[i];

	                if (_instance.element == element) {
	                    _instance.element.removeAttribute('data-dragdrop-enabled');
	                    _instance.removeListeners();
	                    instances.splice(i, 1);
	                    break;
	                }
	            }
	        }

	        /**
	         * Checks whether 2 rects intersect
	         *
	         * @param {Rect} r1
	         * @param {Rect} r2
	         *
	         * @returns {Boolean} intersects
	         */

	    }, {
	        key: 'intersectsRect',
	        value: function intersectsRect(r1, r2) {
	            return r1.left < r2.right && r1.right > r2.left && r1.top < r2.bottom && r1.bottom > r2.top;
	        }

	        /**
	         * Gets the hovered drop container
	         *
	         * @param {Number} x
	         * @paraa {Number} y
	         *
	         * @return {HTMLElement} Hovered drop container
	         */

	    }, {
	        key: 'getHoveredDropContainer',
	        value: function getHoveredDropContainer(x, y) {
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = (DragDrop.currentDropContainers || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var container = _step.value;

	                    var rect = container.getBoundingClientRect();

	                    if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
	                        return container;
	                    }
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

	            return null;
	        }

	        /**
	         * Constructs a new instance
	         *
	         * @param {HTMLElement} element
	         * @param {Object} config
	         */

	    }]);

	    function DragDrop(element, config) {
	        _classCallCheck(this, DragDrop);

	        var instance = this;

	        // Register this instance
	        instances.push(instance);

	        // Init element
	        this.element = element;
	        this.element.setAttribute('data-dragdrop-enabled', 'true');

	        // Init listener array
	        this.listeners = [];

	        // Adopt config
	        config = config || {};

	        this.config = {
	            scrollContainer: document.body,
	            dragThreshold: 2,
	            dragScrollSpeed: 2,
	            dropContainerSelector: '',
	            dropContainers: [],
	            lockY: false,
	            lockX: false,
	            onDrag: function onDrag() {},
	            onBeginDrag: function onBeginDrag() {},
	            onEndDrag: function onEndDrag() {}
	        };

	        for (var k in config) {
	            this.config[k] = config[k];
	        }

	        // Detect initial click
	        function downHandler(mousedownEvent) {
	            mousedownEvent.stopPropagation();

	            if (mousedownEvent.which == 1) {

	                // Detect initial move
	                var _moveHandler = function _moveHandler(mousemoveEvent) {
	                    dragFrames++;

	                    if (dragFrames >= instance.config.dragThreshold) {
	                        instance.onMoveDragHandle(mousemoveEvent);

	                        instance.off(instance.element, 'mousemove', _moveHandler);
	                        instance.off(document, 'mouseup', _upHandler);
	                    }
	                };

	                // Detect immediate pointer release


	                var _upHandler = function _upHandler(upEvent) {
	                    instance.off(instance.element, 'mousemove', _moveHandler);
	                    instance.off(document, 'mouseup', _upHandler);
	                };

	                mousedownEvent.preventDefault();

	                var dragFrames = 0;

	                instance.on(instance.element, 'mousemove', _moveHandler);
	                instance.on(document, 'mouseup', _upHandler);
	            }
	        }

	        // Add pointer event
	        this.on(this.element, 'mousedown', downHandler);
	    }

	    /**
	     * Register listener
	     *
	     * @param {HTMLElement} element
	     * @param {String} event
	     * @param {Function} handler
	     */


	    _createClass(DragDrop, [{
	        key: 'on',
	        value: function on(element, event, handler) {
	            element.addEventListener(event, handler);

	            this.listeners.push({
	                element: element,
	                event: event,
	                handler: handler
	            });
	        }

	        /**
	         * Unregister listener
	         *
	         * @param {HTMLElement} element
	         * @param {String} event
	         * @param {Function} handler
	         */

	    }, {
	        key: 'off',
	        value: function off(element, event, handler) {
	            element.removeEventListener(event, handler);

	            for (var i in this.listeners) {
	                var listener = this.listeners[i];

	                if (listener.element == element && listener.event == event && listener.handler == handler) {
	                    this.listeners.splice(i, 1);
	                    break;
	                }
	            }
	        }

	        /**
	         * Removes all event listeners
	         */

	    }, {
	        key: 'removeListeners',
	        value: function removeListeners() {
	            for (var i in this.listeners) {
	                var listener = this.listeners[i];

	                listener.element.removeEventListener(listener.event, listener.handler);
	            }

	            this.listeners = [];
	        }

	        /**
	         * Gets all drop containers
	         *
	         * @returns {Array} containers
	         */

	    }, {
	        key: 'updateDropContainers',
	        value: function updateDropContainers() {
	            var _this = this;

	            DragDrop.currentDropContainers = [];

	            // An array of elements are specified
	            if (this.config.dropContainers && this.config.dropContainers.length > 0) {
	                DragDrop.currentDropContainers = this.config.dropContainers;

	                // A selector is specified
	            } else if (this.config.dropContainerSelector) {
	                DragDrop.currentDropContainers = document.querySelectorAll(this.config.dropContainerSelector);

	                // Nothing was specified, use immediate parent
	            } else {
	                DragDrop.currentDropContainers = [this.element.parentElement];
	            }

	            // Convert NodeList to Array
	            if (DragDrop.currentDropContainers instanceof NodeList) {
	                var array = [];
	                var nodeList = DragDrop.currentDropContainers;

	                for (var i = nodeList.length; i--; array.unshift(nodeList[i])) {}

	                DragDrop.currentDropContainers = array;
	            }

	            // If the element itself was found, filter it out
	            DragDrop.currentDropContainers = DragDrop.currentDropContainers.filter(function (dropContainer) {
	                var isSelf = dropContainer == _this.element || dropContainer.parentElement == _this.element;

	                if (isSelf) {
	                    return false;
	                } else {
	                    dropContainer.dataset.dragdropDropContainer = true;
	                    return true;
	                }
	            });
	        }

	        /**
	         * Event: Move drag handle
	         *
	         * @param {Event} e
	         */

	    }, {
	        key: 'onMoveDragHandle',
	        value: function onMoveDragHandle(e) {
	            e.preventDefault();
	            e.stopPropagation();

	            // Cache scroll container position for later restoration
	            var lastScrollPos = {
	                top: this.config.scrollContainer.scrollTop,
	                left: this.config.scrollContainer.scrollLeft
	            };

	            DragDrop.current = this;

	            // Prevent overlapping mouse interaction on body
	            document.body.style.userSelect = 'none';
	            document.body.style.pointerAction = 'none';

	            // Find parent element with position set to anything but static
	            var positionParent = this.element.parentElement;

	            while (window.getComputedStyle(positionParent).position == 'static' && positionParent != document.body) {
	                positionParent = positionParent.parentElement;
	            }

	            // Get rects of element and position parent
	            var positionParentRect = positionParent.getBoundingClientRect();
	            var elementRect = this.element.getBoundingClientRect();

	            // Calculate element offset
	            var elementOffset = {
	                top: elementRect.top - positionParentRect.top,
	                left: elementRect.left - positionParentRect.left
	            };

	            // Get computed style
	            var computedStyle = window.getComputedStyle(this.element);

	            // Calculate pointer offset
	            var pointerOffset = {
	                top: elementOffset.top - e.pageY,
	                left: elementOffset.left - e.pageX
	            };

	            // Cache the pointer offset
	            this.pointerOffset = pointerOffset;

	            // Cache the previous parent element
	            this.previousParent = this.element.parentElement;

	            // Set temporary styling
	            this.element.style.position = 'absolute';
	            this.element.style.top = elementOffset.top;
	            this.element.style.left = elementOffset.left;
	            this.element.style.width = elementRect.width;
	            this.element.style.height = elementRect.height;
	            this.element.style.zIndex = 999;

	            // Cache drop containers
	            this.updateDropContainers();

	            // Insert placeholder
	            var placeholder = document.createElement('DIV');

	            placeholder.id = 'dragdrop-placeholder';
	            placeholder.style.height = computedStyle.height;
	            placeholder.style.width = computedStyle.width;

	            this.element.parentElement.insertBefore(placeholder, this.element);

	            // Add pointer movement logic
	            this.on(document, 'mousemove', dragHandler);

	            // Add pointer release logic
	            this.on(document, 'mouseup', releaseHandler);

	            // Fire begin drag event
	            if (typeof this.config.onBeginDrag === 'function') {
	                this.config.onBeginDrag(this);
	            }

	            // Restore last scroll container scroll position
	            this.config.scrollContainer.scrollTop = lastScrollPos.top;
	            this.config.scrollContainer.scrollLeft = lastScrollPos.left;
	        }

	        /**
	         * Event: On drag
	         *
	         * @param {Event} e
	         */

	    }, {
	        key: 'onDrag',
	        value: function onDrag(e) {
	            e.preventDefault();
	            e.stopPropagation();

	            // Apply new styling to element
	            if (!this.config.lockY) {
	                this.element.style.top = e.pageY + this.config.scrollContainer.scrollTop + this.pointerOffset.top;
	            }

	            if (!this.config.lockX) {
	                this.element.style.left = e.pageX + this.config.scrollContainer.scrollLeft + this.pointerOffset.left;
	            }

	            // Scroll page if dragging near the top or bottom
	            var bounds = this.config.scrollContainer.getBoundingClientRect();

	            // TODO: Figure out why this keeps resetting to 0 every frame
	            if (e.pageY > bounds.bottom - 50) {
	                this.config.scrollContainer.scrollTop += this.config.dragScrollSpeed;
	            } else if (e.pageY < bounds.top + 50) {
	                this.config.scrollContainer.scrollTop -= this.config.dragScrollSpeed;
	            } else if (e.pageX > bounds.right - 50) {
	                this.config.scrollContainer.scrollLeft += this.config.dragScrollSpeed;
	            } else if (e.pageX < bounds.left + 50) {
	                this.config.scrollContainer.scrollLeft -= this.config.dragScrollSpeed;
	            }

	            // Fire drag event
	            if (typeof this.config.onDrag === 'function') {
	                this.config.onDrag(this);
	            }

	            // Scan for drop containers
	            var elementRect = this.element.getBoundingClientRect();

	            elementRect.center = elementRect.left + elementRect.width / 2;
	            elementRect.middle = elementRect.top + elementRect.height / 2;

	            // Use array of drop containers sorted by their "proximity" to the pointer on the Z axis
	            var hoveredDropContainer = DragDrop.getHoveredDropContainer(e.pageX, e.pageY);

	            // We only need the first index, as that is the closest to the cursor
	            if (hoveredDropContainer) {
	                this.onHoverDropContainer(hoveredDropContainer);
	            }

	            // Make sure to trigger the leave event on any other drop containers, if they were previously hovered
	            for (var i = 0; i < DragDrop.currentDropContainers.length; i++) {
	                var dropContainer = DragDrop.currentDropContainers[i];

	                if (dropContainer != hoveredDropContainer && dropContainer.dataset.dragdropHovering) {
	                    this.onLeaveDropContainer(dropContainer, e);
	                }
	            }
	        }

	        /**
	         * Event: On release drag handle
	         *
	         * @param {Event} e
	         */

	    }, {
	        key: 'onReleaseDragHandle',
	        value: function onReleaseDragHandle(e) {
	            e.preventDefault();
	            e.stopPropagation();

	            DragDrop.current = null;

	            // Remove pointer events
	            this.off(document, 'mousemove', dragHandler);
	            this.off(document, 'mouseup', releaseHandler);

	            // Grab hovered drop container
	            var hoveredDropContainer = document.querySelector('*[data-dragdrop-drop-container="true"][data-dragdrop-hovering="true"]');

	            // Remove drop container events
	            for (var i = 0; i < DragDrop.currentDropContainers.length; i++) {
	                var dropContainer = DragDrop.currentDropContainers[i];

	                delete dropContainer.dataset.dragdropDropContainer;
	                delete dropContainer.dataset.dragdropHovering;
	            }

	            // Get placeholder
	            var placeholder = document.getElementById('dragdrop-placeholder');

	            // Set new parent
	            // NOTE: Somehow this can delete the inner HTML of an element. Why?
	            placeholder.parentElement.insertBefore(this.element, placeholder);

	            // Remove placeholder
	            placeholder.parentElement.removeChild(placeholder);

	            // Remove temporary styling
	            document.body.removeAttribute('style');
	            this.element.removeAttribute('style');

	            // Add back the grab cursor style
	            this.element.style.cursor = 'grab';

	            // Remove cached variables
	            this.pointerOffset = null;
	            this.previousParent = null;
	            this.dragHandler = null;

	            // Fire end drag event
	            if (typeof this.config.onEndDrag === 'function') {
	                this.config.onEndDrag(this, hoveredDropContainer);
	            }
	        }

	        /**
	         * Event: Hover drop container
	         *
	         * @param {HTMLElement} dropContainer
	         * @param {Event} e
	         */

	    }, {
	        key: 'onHoverDropContainer',
	        value: function onHoverDropContainer(dropContainer, e) {
	            dropContainer.dataset.dragdropHovering = true;

	            var elementRect = this.element.getBoundingClientRect();
	            var placeholder = document.getElementById('dragdrop-placeholder');
	            var childNodes = dropContainer.querySelectorAll('*[data-dragdrop-enabled="true"]');

	            if (dropContainer.dataset.dragdropUnsorted) {
	                // Do nothing so far

	            } else if (childNodes.length < 1) {
	                dropContainer.appendChild(placeholder);
	            } else {
	                for (var i = 0; i < childNodes.length; i++) {
	                    var child = childNodes[i];
	                    var childRect = child.getBoundingClientRect();

	                    // If we're dropping onto a new parent drop container,
	                    // set pointer events of children to none,
	                    // so they don't interfere with drop container selection
	                    if (dropContainer != this.previousParent) {
	                        child.style.pointerEvents = 'none';
	                    }

	                    childRect.center = childRect.left + childRect.width / 2;
	                    childRect.middle = childRect.top + childRect.height / 2;

	                    if (this.config.lockX) {
	                        if (elementRect.top > childRect.top && elementRect.top < childRect.bottom) {
	                            child.parentElement.insertBefore(placeholder, child.nextSibling);
	                            break;
	                        } else if (elementRect.top < childRect.top && elementRect.bottom > childRect.top) {
	                            child.parentElement.insertBefore(placeholder, child);
	                            break;
	                        }
	                    } else if (this.config.lockY) {
	                        if (elementRect.left > childRect.left && elementRect.left < childRect.right) {
	                            child.parentElement.insertBefore(placeholder, child.nextSibling);
	                            break;
	                        } else if (elementRect.left < childRect.left && elementRect.right > childRect.left) {
	                            child.parentElement.insertBefore(placeholder, child);
	                            break;
	                        }
	                    } else {
	                        if (DragDrop.intersectsRect(elementRect, childRect) && child.nextSibling) {
	                            child.parentElement.insertBefore(placeholder, child.nextSibling);
	                            break;
	                        }
	                    }
	                }
	            }
	        }

	        /**
	         * Event: Leave drop container
	         *
	         * @param {HTMLElement} dropContainer
	         * @param {Event} e
	         */

	    }, {
	        key: 'onLeaveDropContainer',
	        value: function onLeaveDropContainer(dropContainer, e) {
	            dropContainer.removeAttribute('data-dragdrop-hovering');

	            var childNodes = dropContainer.querySelectorAll('*[data-dragdrop-enabled="true"]');

	            for (var i = 0; i < childNodes.length; i++) {
	                var child = childNodes[i];

	                //  Remove custom pointer events style
	                child.style.pointerEvents = null;
	            }
	        }
	    }]);

	    return DragDrop;
	}();

	window.DragDrop = DragDrop;

	if (typeof jQuery !== 'undefined') {
	    jQuery.fn.extend({
	        exodragdrop: function exodragdrop(config) {
	            return this.each(function () {
	                if (config == 'destroy') {
	                    DragDrop.destroy(this);
	                } else {
	                    new DragDrop(this, config);
	                }
	            });
	        }
	    });
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var old;
	if (typeof Promise !== "undefined") old = Promise;
	function noConflict() {
	    try {
	        if (Promise === bluebird) Promise = old;
	    } catch (e) {}
	    return bluebird;
	}
	var bluebird = __webpack_require__(13)();
	bluebird.noConflict = noConflict;
	module.exports = bluebird;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";

	module.exports = function () {
	    var makeSelfResolutionError = function makeSelfResolutionError() {
	        return new TypeError("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
	    };
	    var reflectHandler = function reflectHandler() {
	        return new Promise.PromiseInspection(this._target());
	    };
	    var apiRejection = function apiRejection(msg) {
	        return Promise.reject(new TypeError(msg));
	    };
	    function Proxyable() {}
	    var UNDEFINED_BINDING = {};
	    var util = __webpack_require__(15);

	    var getDomain;
	    if (util.isNode) {
	        getDomain = function getDomain() {
	            var ret = process.domain;
	            if (ret === undefined) ret = null;
	            return ret;
	        };
	    } else {
	        getDomain = function getDomain() {
	            return null;
	        };
	    }
	    util.notEnumerableProp(Promise, "_getDomain", getDomain);

	    var es5 = __webpack_require__(16);
	    var Async = __webpack_require__(17);
	    var async = new Async();
	    es5.defineProperty(Promise, "_async", { value: async });
	    var errors = __webpack_require__(22);
	    var TypeError = Promise.TypeError = errors.TypeError;
	    Promise.RangeError = errors.RangeError;
	    var CancellationError = Promise.CancellationError = errors.CancellationError;
	    Promise.TimeoutError = errors.TimeoutError;
	    Promise.OperationalError = errors.OperationalError;
	    Promise.RejectionError = errors.OperationalError;
	    Promise.AggregateError = errors.AggregateError;
	    var INTERNAL = function INTERNAL() {};
	    var APPLY = {};
	    var NEXT_FILTER = {};
	    var tryConvertToPromise = __webpack_require__(23)(Promise, INTERNAL);
	    var PromiseArray = __webpack_require__(24)(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable);
	    var Context = __webpack_require__(25)(Promise);
	    /*jshint unused:false*/
	    var createContext = Context.create;
	    var debug = __webpack_require__(26)(Promise, Context);
	    var CapturedTrace = debug.CapturedTrace;
	    var PassThroughHandlerContext = __webpack_require__(27)(Promise, tryConvertToPromise, NEXT_FILTER);
	    var catchFilter = __webpack_require__(28)(NEXT_FILTER);
	    var nodebackForPromise = __webpack_require__(29);
	    var errorObj = util.errorObj;
	    var tryCatch = util.tryCatch;
	    function check(self, executor) {
	        if (self == null || self.constructor !== Promise) {
	            throw new TypeError("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
	        }
	        if (typeof executor !== "function") {
	            throw new TypeError("expecting a function but got " + util.classString(executor));
	        }
	    }

	    function Promise(executor) {
	        if (executor !== INTERNAL) {
	            check(this, executor);
	        }
	        this._bitField = 0;
	        this._fulfillmentHandler0 = undefined;
	        this._rejectionHandler0 = undefined;
	        this._promise0 = undefined;
	        this._receiver0 = undefined;
	        this._resolveFromExecutor(executor);
	        this._promiseCreated();
	        this._fireEvent("promiseCreated", this);
	    }

	    Promise.prototype.toString = function () {
	        return "[object Promise]";
	    };

	    Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
	        var len = arguments.length;
	        if (len > 1) {
	            var catchInstances = new Array(len - 1),
	                j = 0,
	                i;
	            for (i = 0; i < len - 1; ++i) {
	                var item = arguments[i];
	                if (util.isObject(item)) {
	                    catchInstances[j++] = item;
	                } else {
	                    return apiRejection("Catch statement predicate: " + "expecting an object but got " + util.classString(item));
	                }
	            }
	            catchInstances.length = j;
	            fn = arguments[i];
	            return this.then(undefined, catchFilter(catchInstances, fn, this));
	        }
	        return this.then(undefined, fn);
	    };

	    Promise.prototype.reflect = function () {
	        return this._then(reflectHandler, reflectHandler, undefined, this, undefined);
	    };

	    Promise.prototype.then = function (didFulfill, didReject) {
	        if (debug.warnings() && arguments.length > 0 && typeof didFulfill !== "function" && typeof didReject !== "function") {
	            var msg = ".then() only accepts functions but was passed: " + util.classString(didFulfill);
	            if (arguments.length > 1) {
	                msg += ", " + util.classString(didReject);
	            }
	            this._warn(msg);
	        }
	        return this._then(didFulfill, didReject, undefined, undefined, undefined);
	    };

	    Promise.prototype.done = function (didFulfill, didReject) {
	        var promise = this._then(didFulfill, didReject, undefined, undefined, undefined);
	        promise._setIsFinal();
	    };

	    Promise.prototype.spread = function (fn) {
	        if (typeof fn !== "function") {
	            return apiRejection("expecting a function but got " + util.classString(fn));
	        }
	        return this.all()._then(fn, undefined, undefined, APPLY, undefined);
	    };

	    Promise.prototype.toJSON = function () {
	        var ret = {
	            isFulfilled: false,
	            isRejected: false,
	            fulfillmentValue: undefined,
	            rejectionReason: undefined
	        };
	        if (this.isFulfilled()) {
	            ret.fulfillmentValue = this.value();
	            ret.isFulfilled = true;
	        } else if (this.isRejected()) {
	            ret.rejectionReason = this.reason();
	            ret.isRejected = true;
	        }
	        return ret;
	    };

	    Promise.prototype.all = function () {
	        if (arguments.length > 0) {
	            this._warn(".all() was passed arguments but it does not take any");
	        }
	        return new PromiseArray(this).promise();
	    };

	    Promise.prototype.error = function (fn) {
	        return this.caught(util.originatesFromRejection, fn);
	    };

	    Promise.getNewLibraryCopy = module.exports;

	    Promise.is = function (val) {
	        return val instanceof Promise;
	    };

	    Promise.fromNode = Promise.fromCallback = function (fn) {
	        var ret = new Promise(INTERNAL);
	        ret._captureStackTrace();
	        var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs : false;
	        var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
	        if (result === errorObj) {
	            ret._rejectCallback(result.e, true);
	        }
	        if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
	        return ret;
	    };

	    Promise.all = function (promises) {
	        return new PromiseArray(promises).promise();
	    };

	    Promise.cast = function (obj) {
	        var ret = tryConvertToPromise(obj);
	        if (!(ret instanceof Promise)) {
	            ret = new Promise(INTERNAL);
	            ret._captureStackTrace();
	            ret._setFulfilled();
	            ret._rejectionHandler0 = obj;
	        }
	        return ret;
	    };

	    Promise.resolve = Promise.fulfilled = Promise.cast;

	    Promise.reject = Promise.rejected = function (reason) {
	        var ret = new Promise(INTERNAL);
	        ret._captureStackTrace();
	        ret._rejectCallback(reason, true);
	        return ret;
	    };

	    Promise.setScheduler = function (fn) {
	        if (typeof fn !== "function") {
	            throw new TypeError("expecting a function but got " + util.classString(fn));
	        }
	        return async.setScheduler(fn);
	    };

	    Promise.prototype._then = function (didFulfill, didReject, _, receiver, internalData) {
	        var haveInternalData = internalData !== undefined;
	        var promise = haveInternalData ? internalData : new Promise(INTERNAL);
	        var target = this._target();
	        var bitField = target._bitField;

	        if (!haveInternalData) {
	            promise._propagateFrom(this, 3);
	            promise._captureStackTrace();
	            if (receiver === undefined && (this._bitField & 2097152) !== 0) {
	                if (!((bitField & 50397184) === 0)) {
	                    receiver = this._boundValue();
	                } else {
	                    receiver = target === this ? undefined : this._boundTo;
	                }
	            }
	            this._fireEvent("promiseChained", this, promise);
	        }

	        var domain = getDomain();
	        if (!((bitField & 50397184) === 0)) {
	            var handler,
	                value,
	                settler = target._settlePromiseCtx;
	            if ((bitField & 33554432) !== 0) {
	                value = target._rejectionHandler0;
	                handler = didFulfill;
	            } else if ((bitField & 16777216) !== 0) {
	                value = target._fulfillmentHandler0;
	                handler = didReject;
	                target._unsetRejectionIsUnhandled();
	            } else {
	                settler = target._settlePromiseLateCancellationObserver;
	                value = new CancellationError("late cancellation observer");
	                target._attachExtraTrace(value);
	                handler = didReject;
	            }

	            async.invoke(settler, target, {
	                handler: domain === null ? handler : typeof handler === "function" && util.domainBind(domain, handler),
	                promise: promise,
	                receiver: receiver,
	                value: value
	            });
	        } else {
	            target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
	        }

	        return promise;
	    };

	    Promise.prototype._length = function () {
	        return this._bitField & 65535;
	    };

	    Promise.prototype._isFateSealed = function () {
	        return (this._bitField & 117506048) !== 0;
	    };

	    Promise.prototype._isFollowing = function () {
	        return (this._bitField & 67108864) === 67108864;
	    };

	    Promise.prototype._setLength = function (len) {
	        this._bitField = this._bitField & -65536 | len & 65535;
	    };

	    Promise.prototype._setFulfilled = function () {
	        this._bitField = this._bitField | 33554432;
	        this._fireEvent("promiseFulfilled", this);
	    };

	    Promise.prototype._setRejected = function () {
	        this._bitField = this._bitField | 16777216;
	        this._fireEvent("promiseRejected", this);
	    };

	    Promise.prototype._setFollowing = function () {
	        this._bitField = this._bitField | 67108864;
	        this._fireEvent("promiseResolved", this);
	    };

	    Promise.prototype._setIsFinal = function () {
	        this._bitField = this._bitField | 4194304;
	    };

	    Promise.prototype._isFinal = function () {
	        return (this._bitField & 4194304) > 0;
	    };

	    Promise.prototype._unsetCancelled = function () {
	        this._bitField = this._bitField & ~65536;
	    };

	    Promise.prototype._setCancelled = function () {
	        this._bitField = this._bitField | 65536;
	        this._fireEvent("promiseCancelled", this);
	    };

	    Promise.prototype._setWillBeCancelled = function () {
	        this._bitField = this._bitField | 8388608;
	    };

	    Promise.prototype._setAsyncGuaranteed = function () {
	        if (async.hasCustomScheduler()) return;
	        this._bitField = this._bitField | 134217728;
	    };

	    Promise.prototype._receiverAt = function (index) {
	        var ret = index === 0 ? this._receiver0 : this[index * 4 - 4 + 3];
	        if (ret === UNDEFINED_BINDING) {
	            return undefined;
	        } else if (ret === undefined && this._isBound()) {
	            return this._boundValue();
	        }
	        return ret;
	    };

	    Promise.prototype._promiseAt = function (index) {
	        return this[index * 4 - 4 + 2];
	    };

	    Promise.prototype._fulfillmentHandlerAt = function (index) {
	        return this[index * 4 - 4 + 0];
	    };

	    Promise.prototype._rejectionHandlerAt = function (index) {
	        return this[index * 4 - 4 + 1];
	    };

	    Promise.prototype._boundValue = function () {};

	    Promise.prototype._migrateCallback0 = function (follower) {
	        var bitField = follower._bitField;
	        var fulfill = follower._fulfillmentHandler0;
	        var reject = follower._rejectionHandler0;
	        var promise = follower._promise0;
	        var receiver = follower._receiverAt(0);
	        if (receiver === undefined) receiver = UNDEFINED_BINDING;
	        this._addCallbacks(fulfill, reject, promise, receiver, null);
	    };

	    Promise.prototype._migrateCallbackAt = function (follower, index) {
	        var fulfill = follower._fulfillmentHandlerAt(index);
	        var reject = follower._rejectionHandlerAt(index);
	        var promise = follower._promiseAt(index);
	        var receiver = follower._receiverAt(index);
	        if (receiver === undefined) receiver = UNDEFINED_BINDING;
	        this._addCallbacks(fulfill, reject, promise, receiver, null);
	    };

	    Promise.prototype._addCallbacks = function (fulfill, reject, promise, receiver, domain) {
	        var index = this._length();

	        if (index >= 65535 - 4) {
	            index = 0;
	            this._setLength(0);
	        }

	        if (index === 0) {
	            this._promise0 = promise;
	            this._receiver0 = receiver;
	            if (typeof fulfill === "function") {
	                this._fulfillmentHandler0 = domain === null ? fulfill : util.domainBind(domain, fulfill);
	            }
	            if (typeof reject === "function") {
	                this._rejectionHandler0 = domain === null ? reject : util.domainBind(domain, reject);
	            }
	        } else {
	            var base = index * 4 - 4;
	            this[base + 2] = promise;
	            this[base + 3] = receiver;
	            if (typeof fulfill === "function") {
	                this[base + 0] = domain === null ? fulfill : util.domainBind(domain, fulfill);
	            }
	            if (typeof reject === "function") {
	                this[base + 1] = domain === null ? reject : util.domainBind(domain, reject);
	            }
	        }
	        this._setLength(index + 1);
	        return index;
	    };

	    Promise.prototype._proxy = function (proxyable, arg) {
	        this._addCallbacks(undefined, undefined, arg, proxyable, null);
	    };

	    Promise.prototype._resolveCallback = function (value, shouldBind) {
	        if ((this._bitField & 117506048) !== 0) return;
	        if (value === this) return this._rejectCallback(makeSelfResolutionError(), false);
	        var maybePromise = tryConvertToPromise(value, this);
	        if (!(maybePromise instanceof Promise)) return this._fulfill(value);

	        if (shouldBind) this._propagateFrom(maybePromise, 2);

	        var promise = maybePromise._target();

	        if (promise === this) {
	            this._reject(makeSelfResolutionError());
	            return;
	        }

	        var bitField = promise._bitField;
	        if ((bitField & 50397184) === 0) {
	            var len = this._length();
	            if (len > 0) promise._migrateCallback0(this);
	            for (var i = 1; i < len; ++i) {
	                promise._migrateCallbackAt(this, i);
	            }
	            this._setFollowing();
	            this._setLength(0);
	            this._setFollowee(promise);
	        } else if ((bitField & 33554432) !== 0) {
	            this._fulfill(promise._value());
	        } else if ((bitField & 16777216) !== 0) {
	            this._reject(promise._reason());
	        } else {
	            var reason = new CancellationError("late cancellation observer");
	            promise._attachExtraTrace(reason);
	            this._reject(reason);
	        }
	    };

	    Promise.prototype._rejectCallback = function (reason, synchronous, ignoreNonErrorWarnings) {
	        var trace = util.ensureErrorObject(reason);
	        var hasStack = trace === reason;
	        if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
	            var message = "a promise was rejected with a non-error: " + util.classString(reason);
	            this._warn(message, true);
	        }
	        this._attachExtraTrace(trace, synchronous ? hasStack : false);
	        this._reject(reason);
	    };

	    Promise.prototype._resolveFromExecutor = function (executor) {
	        if (executor === INTERNAL) return;
	        var promise = this;
	        this._captureStackTrace();
	        this._pushContext();
	        var synchronous = true;
	        var r = this._execute(executor, function (value) {
	            promise._resolveCallback(value);
	        }, function (reason) {
	            promise._rejectCallback(reason, synchronous);
	        });
	        synchronous = false;
	        this._popContext();

	        if (r !== undefined) {
	            promise._rejectCallback(r, true);
	        }
	    };

	    Promise.prototype._settlePromiseFromHandler = function (handler, receiver, value, promise) {
	        var bitField = promise._bitField;
	        if ((bitField & 65536) !== 0) return;
	        promise._pushContext();
	        var x;
	        if (receiver === APPLY) {
	            if (!value || typeof value.length !== "number") {
	                x = errorObj;
	                x.e = new TypeError("cannot .spread() a non-array: " + util.classString(value));
	            } else {
	                x = tryCatch(handler).apply(this._boundValue(), value);
	            }
	        } else {
	            x = tryCatch(handler).call(receiver, value);
	        }
	        var promiseCreated = promise._popContext();
	        bitField = promise._bitField;
	        if ((bitField & 65536) !== 0) return;

	        if (x === NEXT_FILTER) {
	            promise._reject(value);
	        } else if (x === errorObj) {
	            promise._rejectCallback(x.e, false);
	        } else {
	            debug.checkForgottenReturns(x, promiseCreated, "", promise, this);
	            promise._resolveCallback(x);
	        }
	    };

	    Promise.prototype._target = function () {
	        var ret = this;
	        while (ret._isFollowing()) {
	            ret = ret._followee();
	        }return ret;
	    };

	    Promise.prototype._followee = function () {
	        return this._rejectionHandler0;
	    };

	    Promise.prototype._setFollowee = function (promise) {
	        this._rejectionHandler0 = promise;
	    };

	    Promise.prototype._settlePromise = function (promise, handler, receiver, value) {
	        var isPromise = promise instanceof Promise;
	        var bitField = this._bitField;
	        var asyncGuaranteed = (bitField & 134217728) !== 0;
	        if ((bitField & 65536) !== 0) {
	            if (isPromise) promise._invokeInternalOnCancel();

	            if (receiver instanceof PassThroughHandlerContext && receiver.isFinallyHandler()) {
	                receiver.cancelPromise = promise;
	                if (tryCatch(handler).call(receiver, value) === errorObj) {
	                    promise._reject(errorObj.e);
	                }
	            } else if (handler === reflectHandler) {
	                promise._fulfill(reflectHandler.call(receiver));
	            } else if (receiver instanceof Proxyable) {
	                receiver._promiseCancelled(promise);
	            } else if (isPromise || promise instanceof PromiseArray) {
	                promise._cancel();
	            } else {
	                receiver.cancel();
	            }
	        } else if (typeof handler === "function") {
	            if (!isPromise) {
	                handler.call(receiver, value, promise);
	            } else {
	                if (asyncGuaranteed) promise._setAsyncGuaranteed();
	                this._settlePromiseFromHandler(handler, receiver, value, promise);
	            }
	        } else if (receiver instanceof Proxyable) {
	            if (!receiver._isResolved()) {
	                if ((bitField & 33554432) !== 0) {
	                    receiver._promiseFulfilled(value, promise);
	                } else {
	                    receiver._promiseRejected(value, promise);
	                }
	            }
	        } else if (isPromise) {
	            if (asyncGuaranteed) promise._setAsyncGuaranteed();
	            if ((bitField & 33554432) !== 0) {
	                promise._fulfill(value);
	            } else {
	                promise._reject(value);
	            }
	        }
	    };

	    Promise.prototype._settlePromiseLateCancellationObserver = function (ctx) {
	        var handler = ctx.handler;
	        var promise = ctx.promise;
	        var receiver = ctx.receiver;
	        var value = ctx.value;
	        if (typeof handler === "function") {
	            if (!(promise instanceof Promise)) {
	                handler.call(receiver, value, promise);
	            } else {
	                this._settlePromiseFromHandler(handler, receiver, value, promise);
	            }
	        } else if (promise instanceof Promise) {
	            promise._reject(value);
	        }
	    };

	    Promise.prototype._settlePromiseCtx = function (ctx) {
	        this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
	    };

	    Promise.prototype._settlePromise0 = function (handler, value, bitField) {
	        var promise = this._promise0;
	        var receiver = this._receiverAt(0);
	        this._promise0 = undefined;
	        this._receiver0 = undefined;
	        this._settlePromise(promise, handler, receiver, value);
	    };

	    Promise.prototype._clearCallbackDataAtIndex = function (index) {
	        var base = index * 4 - 4;
	        this[base + 2] = this[base + 3] = this[base + 0] = this[base + 1] = undefined;
	    };

	    Promise.prototype._fulfill = function (value) {
	        var bitField = this._bitField;
	        if ((bitField & 117506048) >>> 16) return;
	        if (value === this) {
	            var err = makeSelfResolutionError();
	            this._attachExtraTrace(err);
	            return this._reject(err);
	        }
	        this._setFulfilled();
	        this._rejectionHandler0 = value;

	        if ((bitField & 65535) > 0) {
	            if ((bitField & 134217728) !== 0) {
	                this._settlePromises();
	            } else {
	                async.settlePromises(this);
	            }
	        }
	    };

	    Promise.prototype._reject = function (reason) {
	        var bitField = this._bitField;
	        if ((bitField & 117506048) >>> 16) return;
	        this._setRejected();
	        this._fulfillmentHandler0 = reason;

	        if (this._isFinal()) {
	            return async.fatalError(reason, util.isNode);
	        }

	        if ((bitField & 65535) > 0) {
	            async.settlePromises(this);
	        } else {
	            this._ensurePossibleRejectionHandled();
	        }
	    };

	    Promise.prototype._fulfillPromises = function (len, value) {
	        for (var i = 1; i < len; i++) {
	            var handler = this._fulfillmentHandlerAt(i);
	            var promise = this._promiseAt(i);
	            var receiver = this._receiverAt(i);
	            this._clearCallbackDataAtIndex(i);
	            this._settlePromise(promise, handler, receiver, value);
	        }
	    };

	    Promise.prototype._rejectPromises = function (len, reason) {
	        for (var i = 1; i < len; i++) {
	            var handler = this._rejectionHandlerAt(i);
	            var promise = this._promiseAt(i);
	            var receiver = this._receiverAt(i);
	            this._clearCallbackDataAtIndex(i);
	            this._settlePromise(promise, handler, receiver, reason);
	        }
	    };

	    Promise.prototype._settlePromises = function () {
	        var bitField = this._bitField;
	        var len = bitField & 65535;

	        if (len > 0) {
	            if ((bitField & 16842752) !== 0) {
	                var reason = this._fulfillmentHandler0;
	                this._settlePromise0(this._rejectionHandler0, reason, bitField);
	                this._rejectPromises(len, reason);
	            } else {
	                var value = this._rejectionHandler0;
	                this._settlePromise0(this._fulfillmentHandler0, value, bitField);
	                this._fulfillPromises(len, value);
	            }
	            this._setLength(0);
	        }
	        this._clearCancellationData();
	    };

	    Promise.prototype._settledValue = function () {
	        var bitField = this._bitField;
	        if ((bitField & 33554432) !== 0) {
	            return this._rejectionHandler0;
	        } else if ((bitField & 16777216) !== 0) {
	            return this._fulfillmentHandler0;
	        }
	    };

	    function deferResolve(v) {
	        this.promise._resolveCallback(v);
	    }
	    function deferReject(v) {
	        this.promise._rejectCallback(v, false);
	    }

	    Promise.defer = Promise.pending = function () {
	        debug.deprecated("Promise.defer", "new Promise");
	        var promise = new Promise(INTERNAL);
	        return {
	            promise: promise,
	            resolve: deferResolve,
	            reject: deferReject
	        };
	    };

	    util.notEnumerableProp(Promise, "_makeSelfResolutionError", makeSelfResolutionError);

	    __webpack_require__(30)(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug);
	    __webpack_require__(31)(Promise, INTERNAL, tryConvertToPromise, debug);
	    __webpack_require__(32)(Promise, PromiseArray, apiRejection, debug);
	    __webpack_require__(33)(Promise);
	    __webpack_require__(34)(Promise);
	    __webpack_require__(35)(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain);
	    Promise.Promise = Promise;
	    Promise.version = "3.5.0";
	    __webpack_require__(36)(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
	    __webpack_require__(37)(Promise);
	    __webpack_require__(38)(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
	    __webpack_require__(39)(Promise, INTERNAL, debug);
	    __webpack_require__(40)(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
	    __webpack_require__(41)(Promise);
	    __webpack_require__(42)(Promise, INTERNAL);
	    __webpack_require__(43)(Promise, PromiseArray, tryConvertToPromise, apiRejection);
	    __webpack_require__(44)(Promise, INTERNAL, tryConvertToPromise, apiRejection);
	    __webpack_require__(45)(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
	    __webpack_require__(46)(Promise, PromiseArray, debug);
	    __webpack_require__(47)(Promise, PromiseArray, apiRejection);
	    __webpack_require__(48)(Promise, INTERNAL);
	    __webpack_require__(49)(Promise, INTERNAL);
	    __webpack_require__(50)(Promise);

	    util.toFastProperties(Promise);
	    util.toFastProperties(Promise.prototype);
	    function fillTypes(value) {
	        var p = new Promise(INTERNAL);
	        p._fulfillmentHandler0 = value;
	        p._rejectionHandler0 = value;
	        p._promise0 = value;
	        p._receiver0 = value;
	    }
	    // Complete slack tracking, opt out of field-type tracking and           
	    // stabilize map                                                         
	    fillTypes({ a: 1 });
	    fillTypes({ b: 2 });
	    fillTypes({ c: 3 });
	    fillTypes(1);
	    fillTypes(function () {});
	    fillTypes(undefined);
	    fillTypes(false);
	    fillTypes(new Promise(INTERNAL));
	    debug.setBounds(Async.firstLineError, util.lastLineError);
	    return Promise;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout() {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	})();
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

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

	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var es5 = __webpack_require__(16);
	var canEvaluate = typeof navigator == "undefined";

	var errorObj = { e: {} };
	var tryCatchTarget;
	var globalObject = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : undefined !== undefined ? undefined : null;

	function tryCatcher() {
	    try {
	        var target = tryCatchTarget;
	        tryCatchTarget = null;
	        return target.apply(this, arguments);
	    } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	    }
	}
	function tryCatch(fn) {
	    tryCatchTarget = fn;
	    return tryCatcher;
	}

	var inherits = function inherits(Child, Parent) {
	    var hasProp = {}.hasOwnProperty;

	    function T() {
	        this.constructor = Child;
	        this.constructor$ = Parent;
	        for (var propertyName in Parent.prototype) {
	            if (hasProp.call(Parent.prototype, propertyName) && propertyName.charAt(propertyName.length - 1) !== "$") {
	                this[propertyName + "$"] = Parent.prototype[propertyName];
	            }
	        }
	    }
	    T.prototype = Parent.prototype;
	    Child.prototype = new T();
	    return Child.prototype;
	};

	function isPrimitive(val) {
	    return val == null || val === true || val === false || typeof val === "string" || typeof val === "number";
	}

	function isObject(value) {
	    return typeof value === "function" || (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && value !== null;
	}

	function maybeWrapAsError(maybeError) {
	    if (!isPrimitive(maybeError)) return maybeError;

	    return new Error(safeToString(maybeError));
	}

	function withAppended(target, appendee) {
	    var len = target.length;
	    var ret = new Array(len + 1);
	    var i;
	    for (i = 0; i < len; ++i) {
	        ret[i] = target[i];
	    }
	    ret[i] = appendee;
	    return ret;
	}

	function getDataPropertyOrDefault(obj, key, defaultValue) {
	    if (es5.isES5) {
	        var desc = Object.getOwnPropertyDescriptor(obj, key);

	        if (desc != null) {
	            return desc.get == null && desc.set == null ? desc.value : defaultValue;
	        }
	    } else {
	        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
	    }
	}

	function notEnumerableProp(obj, name, value) {
	    if (isPrimitive(obj)) return obj;
	    var descriptor = {
	        value: value,
	        configurable: true,
	        enumerable: false,
	        writable: true
	    };
	    es5.defineProperty(obj, name, descriptor);
	    return obj;
	}

	function thrower(r) {
	    throw r;
	}

	var inheritedDataKeys = function () {
	    var excludedPrototypes = [Array.prototype, Object.prototype, Function.prototype];

	    var isExcludedProto = function isExcludedProto(val) {
	        for (var i = 0; i < excludedPrototypes.length; ++i) {
	            if (excludedPrototypes[i] === val) {
	                return true;
	            }
	        }
	        return false;
	    };

	    if (es5.isES5) {
	        var getKeys = Object.getOwnPropertyNames;
	        return function (obj) {
	            var ret = [];
	            var visitedKeys = Object.create(null);
	            while (obj != null && !isExcludedProto(obj)) {
	                var keys;
	                try {
	                    keys = getKeys(obj);
	                } catch (e) {
	                    return ret;
	                }
	                for (var i = 0; i < keys.length; ++i) {
	                    var key = keys[i];
	                    if (visitedKeys[key]) continue;
	                    visitedKeys[key] = true;
	                    var desc = Object.getOwnPropertyDescriptor(obj, key);
	                    if (desc != null && desc.get == null && desc.set == null) {
	                        ret.push(key);
	                    }
	                }
	                obj = es5.getPrototypeOf(obj);
	            }
	            return ret;
	        };
	    } else {
	        var hasProp = {}.hasOwnProperty;
	        return function (obj) {
	            if (isExcludedProto(obj)) return [];
	            var ret = [];

	            /*jshint forin:false */
	            enumeration: for (var key in obj) {
	                if (hasProp.call(obj, key)) {
	                    ret.push(key);
	                } else {
	                    for (var i = 0; i < excludedPrototypes.length; ++i) {
	                        if (hasProp.call(excludedPrototypes[i], key)) {
	                            continue enumeration;
	                        }
	                    }
	                    ret.push(key);
	                }
	            }
	            return ret;
	        };
	    }
	}();

	var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
	function isClass(fn) {
	    try {
	        if (typeof fn === "function") {
	            var keys = es5.names(fn.prototype);

	            var hasMethods = es5.isES5 && keys.length > 1;
	            var hasMethodsOtherThanConstructor = keys.length > 0 && !(keys.length === 1 && keys[0] === "constructor");
	            var hasThisAssignmentAndStaticMethods = thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

	            if (hasMethods || hasMethodsOtherThanConstructor || hasThisAssignmentAndStaticMethods) {
	                return true;
	            }
	        }
	        return false;
	    } catch (e) {
	        return false;
	    }
	}

	function toFastProperties(obj) {
	    /*jshint -W027,-W055,-W031*/
	    function FakeConstructor() {}
	    FakeConstructor.prototype = obj;
	    var l = 8;
	    while (l--) {
	        new FakeConstructor();
	    }return obj;
	    eval(obj);
	}

	var rident = /^[a-z$_][a-z$_0-9]*$/i;
	function isIdentifier(str) {
	    return rident.test(str);
	}

	function filledRange(count, prefix, suffix) {
	    var ret = new Array(count);
	    for (var i = 0; i < count; ++i) {
	        ret[i] = prefix + i + suffix;
	    }
	    return ret;
	}

	function safeToString(obj) {
	    try {
	        return obj + "";
	    } catch (e) {
	        return "[no string representation]";
	    }
	}

	function isError(obj) {
	    return obj !== null && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && typeof obj.message === "string" && typeof obj.name === "string";
	}

	function markAsOriginatingFromRejection(e) {
	    try {
	        notEnumerableProp(e, "isOperational", true);
	    } catch (ignore) {}
	}

	function originatesFromRejection(e) {
	    if (e == null) return false;
	    return e instanceof Error["__BluebirdErrorTypes__"].OperationalError || e["isOperational"] === true;
	}

	function canAttachTrace(obj) {
	    return isError(obj) && es5.propertyIsWritable(obj, "stack");
	}

	var ensureErrorObject = function () {
	    if (!("stack" in new Error())) {
	        return function (value) {
	            if (canAttachTrace(value)) return value;
	            try {
	                throw new Error(safeToString(value));
	            } catch (err) {
	                return err;
	            }
	        };
	    } else {
	        return function (value) {
	            if (canAttachTrace(value)) return value;
	            return new Error(safeToString(value));
	        };
	    }
	}();

	function classString(obj) {
	    return {}.toString.call(obj);
	}

	function copyDescriptors(from, to, filter) {
	    var keys = es5.names(from);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        if (filter(key)) {
	            try {
	                es5.defineProperty(to, key, es5.getDescriptor(from, key));
	            } catch (ignore) {}
	        }
	    }
	}

	var asArray = function asArray(v) {
	    if (es5.isArray(v)) {
	        return v;
	    }
	    return null;
	};

	if (typeof Symbol !== "undefined" && Symbol.iterator) {
	    var ArrayFrom = typeof Array.from === "function" ? function (v) {
	        return Array.from(v);
	    } : function (v) {
	        var ret = [];
	        var it = v[Symbol.iterator]();
	        var itResult;
	        while (!(itResult = it.next()).done) {
	            ret.push(itResult.value);
	        }
	        return ret;
	    };

	    asArray = function asArray(v) {
	        if (es5.isArray(v)) {
	            return v;
	        } else if (v != null && typeof v[Symbol.iterator] === "function") {
	            return ArrayFrom(v);
	        }
	        return null;
	    };
	}

	var isNode = typeof process !== "undefined" && classString(process).toLowerCase() === "[object process]";

	var hasEnvVariables = typeof process !== "undefined" && typeof process.env !== "undefined";

	function env(key) {
	    return hasEnvVariables ? process.env[key] : undefined;
	}

	function getNativePromise() {
	    if (typeof Promise === "function") {
	        try {
	            var promise = new Promise(function () {});
	            if ({}.toString.call(promise) === "[object Promise]") {
	                return Promise;
	            }
	        } catch (e) {}
	    }
	}

	function domainBind(self, cb) {
	    return self.bind(cb);
	}

	var ret = {
	    isClass: isClass,
	    isIdentifier: isIdentifier,
	    inheritedDataKeys: inheritedDataKeys,
	    getDataPropertyOrDefault: getDataPropertyOrDefault,
	    thrower: thrower,
	    isArray: es5.isArray,
	    asArray: asArray,
	    notEnumerableProp: notEnumerableProp,
	    isPrimitive: isPrimitive,
	    isObject: isObject,
	    isError: isError,
	    canEvaluate: canEvaluate,
	    errorObj: errorObj,
	    tryCatch: tryCatch,
	    inherits: inherits,
	    withAppended: withAppended,
	    maybeWrapAsError: maybeWrapAsError,
	    toFastProperties: toFastProperties,
	    filledRange: filledRange,
	    toString: safeToString,
	    canAttachTrace: canAttachTrace,
	    ensureErrorObject: ensureErrorObject,
	    originatesFromRejection: originatesFromRejection,
	    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
	    classString: classString,
	    copyDescriptors: copyDescriptors,
	    hasDevTools: typeof chrome !== "undefined" && chrome && typeof chrome.loadTimes === "function",
	    isNode: isNode,
	    hasEnvVariables: hasEnvVariables,
	    env: env,
	    global: globalObject,
	    getNativePromise: getNativePromise,
	    domainBind: domainBind
	};
	ret.isRecentNode = ret.isNode && function () {
	    var version = process.versions.node.split(".").map(Number);
	    return version[0] === 0 && version[1] > 10 || version[0] > 0;
	}();

	if (ret.isNode) ret.toFastProperties(process);

	try {
	    throw new Error();
	} catch (e) {
	    ret.lastLineError = e;
	}
	module.exports = ret;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(14)))

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";

	var isES5 = function () {
	    "use strict";

	    return this === undefined;
	}();

	if (isES5) {
	    module.exports = {
	        freeze: Object.freeze,
	        defineProperty: Object.defineProperty,
	        getDescriptor: Object.getOwnPropertyDescriptor,
	        keys: Object.keys,
	        names: Object.getOwnPropertyNames,
	        getPrototypeOf: Object.getPrototypeOf,
	        isArray: Array.isArray,
	        isES5: isES5,
	        propertyIsWritable: function propertyIsWritable(obj, prop) {
	            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
	            return !!(!descriptor || descriptor.writable || descriptor.set);
	        }
	    };
	} else {
	    var has = {}.hasOwnProperty;
	    var str = {}.toString;
	    var proto = {}.constructor.prototype;

	    var ObjectKeys = function ObjectKeys(o) {
	        var ret = [];
	        for (var key in o) {
	            if (has.call(o, key)) {
	                ret.push(key);
	            }
	        }
	        return ret;
	    };

	    var ObjectGetDescriptor = function ObjectGetDescriptor(o, key) {
	        return { value: o[key] };
	    };

	    var ObjectDefineProperty = function ObjectDefineProperty(o, key, desc) {
	        o[key] = desc.value;
	        return o;
	    };

	    var ObjectFreeze = function ObjectFreeze(obj) {
	        return obj;
	    };

	    var ObjectGetPrototypeOf = function ObjectGetPrototypeOf(obj) {
	        try {
	            return Object(obj).constructor.prototype;
	        } catch (e) {
	            return proto;
	        }
	    };

	    var ArrayIsArray = function ArrayIsArray(obj) {
	        try {
	            return str.call(obj) === "[object Array]";
	        } catch (e) {
	            return false;
	        }
	    };

	    module.exports = {
	        isArray: ArrayIsArray,
	        keys: ObjectKeys,
	        names: ObjectKeys,
	        defineProperty: ObjectDefineProperty,
	        getDescriptor: ObjectGetDescriptor,
	        freeze: ObjectFreeze,
	        getPrototypeOf: ObjectGetPrototypeOf,
	        isES5: isES5,
	        propertyIsWritable: function propertyIsWritable() {
	            return true;
	        }
	    };
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";

	var firstLineError;
	try {
	    throw new Error();
	} catch (e) {
	    firstLineError = e;
	}
	var schedule = __webpack_require__(18);
	var Queue = __webpack_require__(21);
	var util = __webpack_require__(15);

	function Async() {
	    this._customScheduler = false;
	    this._isTickUsed = false;
	    this._lateQueue = new Queue(16);
	    this._normalQueue = new Queue(16);
	    this._haveDrainedQueues = false;
	    this._trampolineEnabled = true;
	    var self = this;
	    this.drainQueues = function () {
	        self._drainQueues();
	    };
	    this._schedule = schedule;
	}

	Async.prototype.setScheduler = function (fn) {
	    var prev = this._schedule;
	    this._schedule = fn;
	    this._customScheduler = true;
	    return prev;
	};

	Async.prototype.hasCustomScheduler = function () {
	    return this._customScheduler;
	};

	Async.prototype.enableTrampoline = function () {
	    this._trampolineEnabled = true;
	};

	Async.prototype.disableTrampolineIfNecessary = function () {
	    if (util.hasDevTools) {
	        this._trampolineEnabled = false;
	    }
	};

	Async.prototype.haveItemsQueued = function () {
	    return this._isTickUsed || this._haveDrainedQueues;
	};

	Async.prototype.fatalError = function (e, isNode) {
	    if (isNode) {
	        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n");
	        process.exit(2);
	    } else {
	        this.throwLater(e);
	    }
	};

	Async.prototype.throwLater = function (fn, arg) {
	    if (arguments.length === 1) {
	        arg = fn;
	        fn = function fn() {
	            throw arg;
	        };
	    }
	    if (typeof setTimeout !== "undefined") {
	        setTimeout(function () {
	            fn(arg);
	        }, 0);
	    } else try {
	        this._schedule(function () {
	            fn(arg);
	        });
	    } catch (e) {
	        throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
	    }
	};

	function AsyncInvokeLater(fn, receiver, arg) {
	    this._lateQueue.push(fn, receiver, arg);
	    this._queueTick();
	}

	function AsyncInvoke(fn, receiver, arg) {
	    this._normalQueue.push(fn, receiver, arg);
	    this._queueTick();
	}

	function AsyncSettlePromises(promise) {
	    this._normalQueue._pushOne(promise);
	    this._queueTick();
	}

	if (!util.hasDevTools) {
	    Async.prototype.invokeLater = AsyncInvokeLater;
	    Async.prototype.invoke = AsyncInvoke;
	    Async.prototype.settlePromises = AsyncSettlePromises;
	} else {
	    Async.prototype.invokeLater = function (fn, receiver, arg) {
	        if (this._trampolineEnabled) {
	            AsyncInvokeLater.call(this, fn, receiver, arg);
	        } else {
	            this._schedule(function () {
	                setTimeout(function () {
	                    fn.call(receiver, arg);
	                }, 100);
	            });
	        }
	    };

	    Async.prototype.invoke = function (fn, receiver, arg) {
	        if (this._trampolineEnabled) {
	            AsyncInvoke.call(this, fn, receiver, arg);
	        } else {
	            this._schedule(function () {
	                fn.call(receiver, arg);
	            });
	        }
	    };

	    Async.prototype.settlePromises = function (promise) {
	        if (this._trampolineEnabled) {
	            AsyncSettlePromises.call(this, promise);
	        } else {
	            this._schedule(function () {
	                promise._settlePromises();
	            });
	        }
	    };
	}

	Async.prototype._drainQueue = function (queue) {
	    while (queue.length() > 0) {
	        var fn = queue.shift();
	        if (typeof fn !== "function") {
	            fn._settlePromises();
	            continue;
	        }
	        var receiver = queue.shift();
	        var arg = queue.shift();
	        fn.call(receiver, arg);
	    }
	};

	Async.prototype._drainQueues = function () {
	    this._drainQueue(this._normalQueue);
	    this._reset();
	    this._haveDrainedQueues = true;
	    this._drainQueue(this._lateQueue);
	};

	Async.prototype._queueTick = function () {
	    if (!this._isTickUsed) {
	        this._isTickUsed = true;
	        this._schedule(this.drainQueues);
	    }
	};

	Async.prototype._reset = function () {
	    this._isTickUsed = false;
	};

	module.exports = Async;
	module.exports.firstLineError = firstLineError;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process, setImmediate) {"use strict";

	var util = __webpack_require__(15);
	var schedule;
	var noAsyncScheduler = function noAsyncScheduler() {
	    throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
	};
	var NativePromise = util.getNativePromise();
	if (util.isNode && typeof MutationObserver === "undefined") {
	    var GlobalSetImmediate = global.setImmediate;
	    var ProcessNextTick = process.nextTick;
	    schedule = util.isRecentNode ? function (fn) {
	        GlobalSetImmediate.call(global, fn);
	    } : function (fn) {
	        ProcessNextTick.call(process, fn);
	    };
	} else if (typeof NativePromise === "function" && typeof NativePromise.resolve === "function") {
	    var nativePromise = NativePromise.resolve();
	    schedule = function schedule(fn) {
	        nativePromise.then(fn);
	    };
	} else if (typeof MutationObserver !== "undefined" && !(typeof window !== "undefined" && window.navigator && (window.navigator.standalone || window.cordova))) {
	    schedule = function () {
	        var div = document.createElement("div");
	        var opts = { attributes: true };
	        var toggleScheduled = false;
	        var div2 = document.createElement("div");
	        var o2 = new MutationObserver(function () {
	            div.classList.toggle("foo");
	            toggleScheduled = false;
	        });
	        o2.observe(div2, opts);

	        var scheduleToggle = function scheduleToggle() {
	            if (toggleScheduled) return;
	            toggleScheduled = true;
	            div2.classList.toggle("foo");
	        };

	        return function schedule(fn) {
	            var o = new MutationObserver(function () {
	                o.disconnect();
	                fn();
	            });
	            o.observe(div, opts);
	            scheduleToggle();
	        };
	    }();
	} else if (typeof setImmediate !== "undefined") {
	    schedule = function schedule(fn) {
	        setImmediate(fn);
	    };
	} else if (typeof setTimeout !== "undefined") {
	    schedule = function schedule(fn) {
	        setTimeout(fn, 0);
	    };
	} else {
	    schedule = noAsyncScheduler;
	}
	module.exports = schedule;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(14), __webpack_require__(19).setImmediate))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var apply = Function.prototype.apply;

	// DOM APIs, for completeness

	exports.setTimeout = function () {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function () {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout = exports.clearInterval = function (timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function () {};
	Timeout.prototype.close = function () {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function (item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function (item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function (item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout) item._onTimeout();
	    }, msecs);
	  }
	};

	// setimmediate attaches itself to the global object
	__webpack_require__(20);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {"use strict";

	(function (global, undefined) {
	    "use strict";

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	        // Callback can either be a function or a string
	        if (typeof callback !== "function") {
	            callback = new Function("" + callback);
	        }
	        // Copy function arguments
	        var args = new Array(arguments.length - 1);
	        for (var i = 0; i < args.length; i++) {
	            args[i] = arguments[i + 1];
	        }
	        // Store and register the task
	        var task = { callback: callback, args: args };
	        tasksByHandle[nextHandle] = task;
	        registerImmediate(nextHandle);
	        return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	            case 0:
	                callback();
	                break;
	            case 1:
	                callback(args[0]);
	                break;
	            case 2:
	                callback(args[0], args[1]);
	                break;
	            case 3:
	                callback(args[0], args[1], args[2]);
	                break;
	            default:
	                callback.apply(undefined, args);
	                break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function registerImmediate(handle) {
	            process.nextTick(function () {
	                runIfPresent(handle);
	            });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function () {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function onGlobalMessage(event) {
	            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function registerImmediate(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function (event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function registerImmediate(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function registerImmediate(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function registerImmediate(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();
	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();
	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();
	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();
	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	})(typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(14)))

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";

	function arrayMove(src, srcIndex, dst, dstIndex, len) {
	    for (var j = 0; j < len; ++j) {
	        dst[j + dstIndex] = src[j + srcIndex];
	        src[j + srcIndex] = void 0;
	    }
	}

	function Queue(capacity) {
	    this._capacity = capacity;
	    this._length = 0;
	    this._front = 0;
	}

	Queue.prototype._willBeOverCapacity = function (size) {
	    return this._capacity < size;
	};

	Queue.prototype._pushOne = function (arg) {
	    var length = this.length();
	    this._checkCapacity(length + 1);
	    var i = this._front + length & this._capacity - 1;
	    this[i] = arg;
	    this._length = length + 1;
	};

	Queue.prototype.push = function (fn, receiver, arg) {
	    var length = this.length() + 3;
	    if (this._willBeOverCapacity(length)) {
	        this._pushOne(fn);
	        this._pushOne(receiver);
	        this._pushOne(arg);
	        return;
	    }
	    var j = this._front + length - 3;
	    this._checkCapacity(length);
	    var wrapMask = this._capacity - 1;
	    this[j + 0 & wrapMask] = fn;
	    this[j + 1 & wrapMask] = receiver;
	    this[j + 2 & wrapMask] = arg;
	    this._length = length;
	};

	Queue.prototype.shift = function () {
	    var front = this._front,
	        ret = this[front];

	    this[front] = undefined;
	    this._front = front + 1 & this._capacity - 1;
	    this._length--;
	    return ret;
	};

	Queue.prototype.length = function () {
	    return this._length;
	};

	Queue.prototype._checkCapacity = function (size) {
	    if (this._capacity < size) {
	        this._resizeTo(this._capacity << 1);
	    }
	};

	Queue.prototype._resizeTo = function (capacity) {
	    var oldCapacity = this._capacity;
	    this._capacity = capacity;
	    var front = this._front;
	    var length = this._length;
	    var moveItemsCount = front + length & oldCapacity - 1;
	    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
	};

	module.exports = Queue;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var es5 = __webpack_require__(16);
	var Objectfreeze = es5.freeze;
	var util = __webpack_require__(15);
	var inherits = util.inherits;
	var notEnumerableProp = util.notEnumerableProp;

	function subError(nameProperty, defaultMessage) {
	    function SubError(message) {
	        if (!(this instanceof SubError)) return new SubError(message);
	        notEnumerableProp(this, "message", typeof message === "string" ? message : defaultMessage);
	        notEnumerableProp(this, "name", nameProperty);
	        if (Error.captureStackTrace) {
	            Error.captureStackTrace(this, this.constructor);
	        } else {
	            Error.call(this);
	        }
	    }
	    inherits(SubError, Error);
	    return SubError;
	}

	var _TypeError, _RangeError;
	var Warning = subError("Warning", "warning");
	var CancellationError = subError("CancellationError", "cancellation error");
	var TimeoutError = subError("TimeoutError", "timeout error");
	var AggregateError = subError("AggregateError", "aggregate error");
	try {
	    _TypeError = TypeError;
	    _RangeError = RangeError;
	} catch (e) {
	    _TypeError = subError("TypeError", "type error");
	    _RangeError = subError("RangeError", "range error");
	}

	var methods = ("join pop push shift unshift slice filter forEach some " + "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

	for (var i = 0; i < methods.length; ++i) {
	    if (typeof Array.prototype[methods[i]] === "function") {
	        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
	    }
	}

	es5.defineProperty(AggregateError.prototype, "length", {
	    value: 0,
	    configurable: false,
	    writable: true,
	    enumerable: true
	});
	AggregateError.prototype["isOperational"] = true;
	var level = 0;
	AggregateError.prototype.toString = function () {
	    var indent = Array(level * 4 + 1).join(" ");
	    var ret = "\n" + indent + "AggregateError of:" + "\n";
	    level++;
	    indent = Array(level * 4 + 1).join(" ");
	    for (var i = 0; i < this.length; ++i) {
	        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
	        var lines = str.split("\n");
	        for (var j = 0; j < lines.length; ++j) {
	            lines[j] = indent + lines[j];
	        }
	        str = lines.join("\n");
	        ret += str + "\n";
	    }
	    level--;
	    return ret;
	};

	function OperationalError(message) {
	    if (!(this instanceof OperationalError)) return new OperationalError(message);
	    notEnumerableProp(this, "name", "OperationalError");
	    notEnumerableProp(this, "message", message);
	    this.cause = message;
	    this["isOperational"] = true;

	    if (message instanceof Error) {
	        notEnumerableProp(this, "message", message.message);
	        notEnumerableProp(this, "stack", message.stack);
	    } else if (Error.captureStackTrace) {
	        Error.captureStackTrace(this, this.constructor);
	    }
	}
	inherits(OperationalError, Error);

	var errorTypes = Error["__BluebirdErrorTypes__"];
	if (!errorTypes) {
	    errorTypes = Objectfreeze({
	        CancellationError: CancellationError,
	        TimeoutError: TimeoutError,
	        OperationalError: OperationalError,
	        RejectionError: OperationalError,
	        AggregateError: AggregateError
	    });
	    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
	        value: errorTypes,
	        writable: false,
	        enumerable: false,
	        configurable: false
	    });
	}

	module.exports = {
	    Error: Error,
	    TypeError: _TypeError,
	    RangeError: _RangeError,
	    CancellationError: errorTypes.CancellationError,
	    OperationalError: errorTypes.OperationalError,
	    TimeoutError: errorTypes.TimeoutError,
	    AggregateError: errorTypes.AggregateError,
	    Warning: Warning
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, INTERNAL) {
	    var util = __webpack_require__(15);
	    var errorObj = util.errorObj;
	    var isObject = util.isObject;

	    function tryConvertToPromise(obj, context) {
	        if (isObject(obj)) {
	            if (obj instanceof Promise) return obj;
	            var then = getThen(obj);
	            if (then === errorObj) {
	                if (context) context._pushContext();
	                var ret = Promise.reject(then.e);
	                if (context) context._popContext();
	                return ret;
	            } else if (typeof then === "function") {
	                if (isAnyBluebirdPromise(obj)) {
	                    var ret = new Promise(INTERNAL);
	                    obj._then(ret._fulfill, ret._reject, undefined, ret, null);
	                    return ret;
	                }
	                return doThenable(obj, then, context);
	            }
	        }
	        return obj;
	    }

	    function doGetThen(obj) {
	        return obj.then;
	    }

	    function getThen(obj) {
	        try {
	            return doGetThen(obj);
	        } catch (e) {
	            errorObj.e = e;
	            return errorObj;
	        }
	    }

	    var hasProp = {}.hasOwnProperty;
	    function isAnyBluebirdPromise(obj) {
	        try {
	            return hasProp.call(obj, "_promise0");
	        } catch (e) {
	            return false;
	        }
	    }

	    function doThenable(x, then, context) {
	        var promise = new Promise(INTERNAL);
	        var ret = promise;
	        if (context) context._pushContext();
	        promise._captureStackTrace();
	        if (context) context._popContext();
	        var synchronous = true;
	        var result = util.tryCatch(then).call(x, resolve, reject);
	        synchronous = false;

	        if (promise && result === errorObj) {
	            promise._rejectCallback(result.e, true, true);
	            promise = null;
	        }

	        function resolve(value) {
	            if (!promise) return;
	            promise._resolveCallback(value);
	            promise = null;
	        }

	        function reject(reason) {
	            if (!promise) return;
	            promise._rejectCallback(reason, synchronous, true);
	            promise = null;
	        }
	        return ret;
	    }

	    return tryConvertToPromise;
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
	    var util = __webpack_require__(15);
	    var isArray = util.isArray;

	    function toResolutionValue(val) {
	        switch (val) {
	            case -2:
	                return [];
	            case -3:
	                return {};
	            case -6:
	                return new Map();
	        }
	    }

	    function PromiseArray(values) {
	        var promise = this._promise = new Promise(INTERNAL);
	        if (values instanceof Promise) {
	            promise._propagateFrom(values, 3);
	        }
	        promise._setOnCancel(this);
	        this._values = values;
	        this._length = 0;
	        this._totalResolved = 0;
	        this._init(undefined, -2);
	    }
	    util.inherits(PromiseArray, Proxyable);

	    PromiseArray.prototype.length = function () {
	        return this._length;
	    };

	    PromiseArray.prototype.promise = function () {
	        return this._promise;
	    };

	    PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
	        var values = tryConvertToPromise(this._values, this._promise);
	        if (values instanceof Promise) {
	            values = values._target();
	            var bitField = values._bitField;
	            ;
	            this._values = values;

	            if ((bitField & 50397184) === 0) {
	                this._promise._setAsyncGuaranteed();
	                return values._then(init, this._reject, undefined, this, resolveValueIfEmpty);
	            } else if ((bitField & 33554432) !== 0) {
	                values = values._value();
	            } else if ((bitField & 16777216) !== 0) {
	                return this._reject(values._reason());
	            } else {
	                return this._cancel();
	            }
	        }
	        values = util.asArray(values);
	        if (values === null) {
	            var err = apiRejection("expecting an array or an iterable object but got " + util.classString(values)).reason();
	            this._promise._rejectCallback(err, false);
	            return;
	        }

	        if (values.length === 0) {
	            if (resolveValueIfEmpty === -5) {
	                this._resolveEmptyArray();
	            } else {
	                this._resolve(toResolutionValue(resolveValueIfEmpty));
	            }
	            return;
	        }
	        this._iterate(values);
	    };

	    PromiseArray.prototype._iterate = function (values) {
	        var len = this.getActualLength(values.length);
	        this._length = len;
	        this._values = this.shouldCopyValues() ? new Array(len) : this._values;
	        var result = this._promise;
	        var isResolved = false;
	        var bitField = null;
	        for (var i = 0; i < len; ++i) {
	            var maybePromise = tryConvertToPromise(values[i], result);

	            if (maybePromise instanceof Promise) {
	                maybePromise = maybePromise._target();
	                bitField = maybePromise._bitField;
	            } else {
	                bitField = null;
	            }

	            if (isResolved) {
	                if (bitField !== null) {
	                    maybePromise.suppressUnhandledRejections();
	                }
	            } else if (bitField !== null) {
	                if ((bitField & 50397184) === 0) {
	                    maybePromise._proxy(this, i);
	                    this._values[i] = maybePromise;
	                } else if ((bitField & 33554432) !== 0) {
	                    isResolved = this._promiseFulfilled(maybePromise._value(), i);
	                } else if ((bitField & 16777216) !== 0) {
	                    isResolved = this._promiseRejected(maybePromise._reason(), i);
	                } else {
	                    isResolved = this._promiseCancelled(i);
	                }
	            } else {
	                isResolved = this._promiseFulfilled(maybePromise, i);
	            }
	        }
	        if (!isResolved) result._setAsyncGuaranteed();
	    };

	    PromiseArray.prototype._isResolved = function () {
	        return this._values === null;
	    };

	    PromiseArray.prototype._resolve = function (value) {
	        this._values = null;
	        this._promise._fulfill(value);
	    };

	    PromiseArray.prototype._cancel = function () {
	        if (this._isResolved() || !this._promise._isCancellable()) return;
	        this._values = null;
	        this._promise._cancel();
	    };

	    PromiseArray.prototype._reject = function (reason) {
	        this._values = null;
	        this._promise._rejectCallback(reason, false);
	    };

	    PromiseArray.prototype._promiseFulfilled = function (value, index) {
	        this._values[index] = value;
	        var totalResolved = ++this._totalResolved;
	        if (totalResolved >= this._length) {
	            this._resolve(this._values);
	            return true;
	        }
	        return false;
	    };

	    PromiseArray.prototype._promiseCancelled = function () {
	        this._cancel();
	        return true;
	    };

	    PromiseArray.prototype._promiseRejected = function (reason) {
	        this._totalResolved++;
	        this._reject(reason);
	        return true;
	    };

	    PromiseArray.prototype._resultCancelled = function () {
	        if (this._isResolved()) return;
	        var values = this._values;
	        this._cancel();
	        if (values instanceof Promise) {
	            values.cancel();
	        } else {
	            for (var i = 0; i < values.length; ++i) {
	                if (values[i] instanceof Promise) {
	                    values[i].cancel();
	                }
	            }
	        }
	    };

	    PromiseArray.prototype.shouldCopyValues = function () {
	        return true;
	    };

	    PromiseArray.prototype.getActualLength = function (len) {
	        return len;
	    };

	    return PromiseArray;
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (Promise) {
	    var longStackTraces = false;
	    var contextStack = [];

	    Promise.prototype._promiseCreated = function () {};
	    Promise.prototype._pushContext = function () {};
	    Promise.prototype._popContext = function () {
	        return null;
	    };
	    Promise._peekContext = Promise.prototype._peekContext = function () {};

	    function Context() {
	        this._trace = new Context.CapturedTrace(peekContext());
	    }
	    Context.prototype._pushContext = function () {
	        if (this._trace !== undefined) {
	            this._trace._promiseCreated = null;
	            contextStack.push(this._trace);
	        }
	    };

	    Context.prototype._popContext = function () {
	        if (this._trace !== undefined) {
	            var trace = contextStack.pop();
	            var ret = trace._promiseCreated;
	            trace._promiseCreated = null;
	            return ret;
	        }
	        return null;
	    };

	    function createContext() {
	        if (longStackTraces) return new Context();
	    }

	    function peekContext() {
	        var lastIndex = contextStack.length - 1;
	        if (lastIndex >= 0) {
	            return contextStack[lastIndex];
	        }
	        return undefined;
	    }
	    Context.CapturedTrace = null;
	    Context.create = createContext;
	    Context.deactivateLongStackTraces = function () {};
	    Context.activateLongStackTraces = function () {
	        var Promise_pushContext = Promise.prototype._pushContext;
	        var Promise_popContext = Promise.prototype._popContext;
	        var Promise_PeekContext = Promise._peekContext;
	        var Promise_peekContext = Promise.prototype._peekContext;
	        var Promise_promiseCreated = Promise.prototype._promiseCreated;
	        Context.deactivateLongStackTraces = function () {
	            Promise.prototype._pushContext = Promise_pushContext;
	            Promise.prototype._popContext = Promise_popContext;
	            Promise._peekContext = Promise_PeekContext;
	            Promise.prototype._peekContext = Promise_peekContext;
	            Promise.prototype._promiseCreated = Promise_promiseCreated;
	            longStackTraces = false;
	        };
	        longStackTraces = true;
	        Promise.prototype._pushContext = Context.prototype._pushContext;
	        Promise.prototype._popContext = Context.prototype._popContext;
	        Promise._peekContext = Promise.prototype._peekContext = peekContext;
	        Promise.prototype._promiseCreated = function () {
	            var ctx = this._peekContext();
	            if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
	        };
	    };
	    return Context;
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	module.exports = function (Promise, Context) {
	    var getDomain = Promise._getDomain;
	    var async = Promise._async;
	    var Warning = __webpack_require__(22).Warning;
	    var util = __webpack_require__(15);
	    var canAttachTrace = util.canAttachTrace;
	    var unhandledRejectionHandled;
	    var possiblyUnhandledRejection;
	    var bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
	    var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
	    var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
	    var stackFramePattern = null;
	    var formatStack = null;
	    var indentStackFrames = false;
	    var printWarning;
	    var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 && (false || util.env("BLUEBIRD_DEBUG") || util.env("NODE_ENV") === "development"));

	    var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 && (debugging || util.env("BLUEBIRD_WARNINGS")));

	    var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 && (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));

	    var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 && (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

	    Promise.prototype.suppressUnhandledRejections = function () {
	        var target = this._target();
	        target._bitField = target._bitField & ~1048576 | 524288;
	    };

	    Promise.prototype._ensurePossibleRejectionHandled = function () {
	        if ((this._bitField & 524288) !== 0) return;
	        this._setRejectionIsUnhandled();
	        async.invokeLater(this._notifyUnhandledRejection, this, undefined);
	    };

	    Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
	        fireRejectionEvent("rejectionHandled", unhandledRejectionHandled, undefined, this);
	    };

	    Promise.prototype._setReturnedNonUndefined = function () {
	        this._bitField = this._bitField | 268435456;
	    };

	    Promise.prototype._returnedNonUndefined = function () {
	        return (this._bitField & 268435456) !== 0;
	    };

	    Promise.prototype._notifyUnhandledRejection = function () {
	        if (this._isRejectionUnhandled()) {
	            var reason = this._settledValue();
	            this._setUnhandledRejectionIsNotified();
	            fireRejectionEvent("unhandledRejection", possiblyUnhandledRejection, reason, this);
	        }
	    };

	    Promise.prototype._setUnhandledRejectionIsNotified = function () {
	        this._bitField = this._bitField | 262144;
	    };

	    Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
	        this._bitField = this._bitField & ~262144;
	    };

	    Promise.prototype._isUnhandledRejectionNotified = function () {
	        return (this._bitField & 262144) > 0;
	    };

	    Promise.prototype._setRejectionIsUnhandled = function () {
	        this._bitField = this._bitField | 1048576;
	    };

	    Promise.prototype._unsetRejectionIsUnhandled = function () {
	        this._bitField = this._bitField & ~1048576;
	        if (this._isUnhandledRejectionNotified()) {
	            this._unsetUnhandledRejectionIsNotified();
	            this._notifyUnhandledRejectionIsHandled();
	        }
	    };

	    Promise.prototype._isRejectionUnhandled = function () {
	        return (this._bitField & 1048576) > 0;
	    };

	    Promise.prototype._warn = function (message, shouldUseOwnTrace, promise) {
	        return warn(message, shouldUseOwnTrace, promise || this);
	    };

	    Promise.onPossiblyUnhandledRejection = function (fn) {
	        var domain = getDomain();
	        possiblyUnhandledRejection = typeof fn === "function" ? domain === null ? fn : util.domainBind(domain, fn) : undefined;
	    };

	    Promise.onUnhandledRejectionHandled = function (fn) {
	        var domain = getDomain();
	        unhandledRejectionHandled = typeof fn === "function" ? domain === null ? fn : util.domainBind(domain, fn) : undefined;
	    };

	    var disableLongStackTraces = function disableLongStackTraces() {};
	    Promise.longStackTraces = function () {
	        if (async.haveItemsQueued() && !config.longStackTraces) {
	            throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
	        }
	        if (!config.longStackTraces && longStackTracesIsSupported()) {
	            var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
	            var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
	            config.longStackTraces = true;
	            disableLongStackTraces = function disableLongStackTraces() {
	                if (async.haveItemsQueued() && !config.longStackTraces) {
	                    throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
	                }
	                Promise.prototype._captureStackTrace = Promise_captureStackTrace;
	                Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
	                Context.deactivateLongStackTraces();
	                async.enableTrampoline();
	                config.longStackTraces = false;
	            };
	            Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
	            Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
	            Context.activateLongStackTraces();
	            async.disableTrampolineIfNecessary();
	        }
	    };

	    Promise.hasLongStackTraces = function () {
	        return config.longStackTraces && longStackTracesIsSupported();
	    };

	    var fireDomEvent = function () {
	        try {
	            if (typeof CustomEvent === "function") {
	                var event = new CustomEvent("CustomEvent");
	                util.global.dispatchEvent(event);
	                return function (name, event) {
	                    var domEvent = new CustomEvent(name.toLowerCase(), {
	                        detail: event,
	                        cancelable: true
	                    });
	                    return !util.global.dispatchEvent(domEvent);
	                };
	            } else if (typeof Event === "function") {
	                var event = new Event("CustomEvent");
	                util.global.dispatchEvent(event);
	                return function (name, event) {
	                    var domEvent = new Event(name.toLowerCase(), {
	                        cancelable: true
	                    });
	                    domEvent.detail = event;
	                    return !util.global.dispatchEvent(domEvent);
	                };
	            } else {
	                var event = document.createEvent("CustomEvent");
	                event.initCustomEvent("testingtheevent", false, true, {});
	                util.global.dispatchEvent(event);
	                return function (name, event) {
	                    var domEvent = document.createEvent("CustomEvent");
	                    domEvent.initCustomEvent(name.toLowerCase(), false, true, event);
	                    return !util.global.dispatchEvent(domEvent);
	                };
	            }
	        } catch (e) {}
	        return function () {
	            return false;
	        };
	    }();

	    var fireGlobalEvent = function () {
	        if (util.isNode) {
	            return function () {
	                return process.emit.apply(process, arguments);
	            };
	        } else {
	            if (!util.global) {
	                return function () {
	                    return false;
	                };
	            }
	            return function (name) {
	                var methodName = "on" + name.toLowerCase();
	                var method = util.global[methodName];
	                if (!method) return false;
	                method.apply(util.global, [].slice.call(arguments, 1));
	                return true;
	            };
	        }
	    }();

	    function generatePromiseLifecycleEventObject(name, promise) {
	        return { promise: promise };
	    }

	    var eventToObjectGenerator = {
	        promiseCreated: generatePromiseLifecycleEventObject,
	        promiseFulfilled: generatePromiseLifecycleEventObject,
	        promiseRejected: generatePromiseLifecycleEventObject,
	        promiseResolved: generatePromiseLifecycleEventObject,
	        promiseCancelled: generatePromiseLifecycleEventObject,
	        promiseChained: function promiseChained(name, promise, child) {
	            return { promise: promise, child: child };
	        },
	        warning: function warning(name, _warning) {
	            return { warning: _warning };
	        },
	        unhandledRejection: function unhandledRejection(name, reason, promise) {
	            return { reason: reason, promise: promise };
	        },
	        rejectionHandled: generatePromiseLifecycleEventObject
	    };

	    var activeFireEvent = function activeFireEvent(name) {
	        var globalEventFired = false;
	        try {
	            globalEventFired = fireGlobalEvent.apply(null, arguments);
	        } catch (e) {
	            async.throwLater(e);
	            globalEventFired = true;
	        }

	        var domEventFired = false;
	        try {
	            domEventFired = fireDomEvent(name, eventToObjectGenerator[name].apply(null, arguments));
	        } catch (e) {
	            async.throwLater(e);
	            domEventFired = true;
	        }

	        return domEventFired || globalEventFired;
	    };

	    Promise.config = function (opts) {
	        opts = Object(opts);
	        if ("longStackTraces" in opts) {
	            if (opts.longStackTraces) {
	                Promise.longStackTraces();
	            } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
	                disableLongStackTraces();
	            }
	        }
	        if ("warnings" in opts) {
	            var warningsOption = opts.warnings;
	            config.warnings = !!warningsOption;
	            wForgottenReturn = config.warnings;

	            if (util.isObject(warningsOption)) {
	                if ("wForgottenReturn" in warningsOption) {
	                    wForgottenReturn = !!warningsOption.wForgottenReturn;
	                }
	            }
	        }
	        if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
	            if (async.haveItemsQueued()) {
	                throw new Error("cannot enable cancellation after promises are in use");
	            }
	            Promise.prototype._clearCancellationData = cancellationClearCancellationData;
	            Promise.prototype._propagateFrom = cancellationPropagateFrom;
	            Promise.prototype._onCancel = cancellationOnCancel;
	            Promise.prototype._setOnCancel = cancellationSetOnCancel;
	            Promise.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
	            Promise.prototype._execute = cancellationExecute;
	            _propagateFromFunction = cancellationPropagateFrom;
	            config.cancellation = true;
	        }
	        if ("monitoring" in opts) {
	            if (opts.monitoring && !config.monitoring) {
	                config.monitoring = true;
	                Promise.prototype._fireEvent = activeFireEvent;
	            } else if (!opts.monitoring && config.monitoring) {
	                config.monitoring = false;
	                Promise.prototype._fireEvent = defaultFireEvent;
	            }
	        }
	        return Promise;
	    };

	    function defaultFireEvent() {
	        return false;
	    }

	    Promise.prototype._fireEvent = defaultFireEvent;
	    Promise.prototype._execute = function (executor, resolve, reject) {
	        try {
	            executor(resolve, reject);
	        } catch (e) {
	            return e;
	        }
	    };
	    Promise.prototype._onCancel = function () {};
	    Promise.prototype._setOnCancel = function (handler) {
	        ;
	    };
	    Promise.prototype._attachCancellationCallback = function (onCancel) {
	        ;
	    };
	    Promise.prototype._captureStackTrace = function () {};
	    Promise.prototype._attachExtraTrace = function () {};
	    Promise.prototype._clearCancellationData = function () {};
	    Promise.prototype._propagateFrom = function (parent, flags) {
	        ;
	        ;
	    };

	    function cancellationExecute(executor, resolve, reject) {
	        var promise = this;
	        try {
	            executor(resolve, reject, function (onCancel) {
	                if (typeof onCancel !== "function") {
	                    throw new TypeError("onCancel must be a function, got: " + util.toString(onCancel));
	                }
	                promise._attachCancellationCallback(onCancel);
	            });
	        } catch (e) {
	            return e;
	        }
	    }

	    function cancellationAttachCancellationCallback(onCancel) {
	        if (!this._isCancellable()) return this;

	        var previousOnCancel = this._onCancel();
	        if (previousOnCancel !== undefined) {
	            if (util.isArray(previousOnCancel)) {
	                previousOnCancel.push(onCancel);
	            } else {
	                this._setOnCancel([previousOnCancel, onCancel]);
	            }
	        } else {
	            this._setOnCancel(onCancel);
	        }
	    }

	    function cancellationOnCancel() {
	        return this._onCancelField;
	    }

	    function cancellationSetOnCancel(onCancel) {
	        this._onCancelField = onCancel;
	    }

	    function cancellationClearCancellationData() {
	        this._cancellationParent = undefined;
	        this._onCancelField = undefined;
	    }

	    function cancellationPropagateFrom(parent, flags) {
	        if ((flags & 1) !== 0) {
	            this._cancellationParent = parent;
	            var branchesRemainingToCancel = parent._branchesRemainingToCancel;
	            if (branchesRemainingToCancel === undefined) {
	                branchesRemainingToCancel = 0;
	            }
	            parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
	        }
	        if ((flags & 2) !== 0 && parent._isBound()) {
	            this._setBoundTo(parent._boundTo);
	        }
	    }

	    function bindingPropagateFrom(parent, flags) {
	        if ((flags & 2) !== 0 && parent._isBound()) {
	            this._setBoundTo(parent._boundTo);
	        }
	    }
	    var _propagateFromFunction = bindingPropagateFrom;

	    function _boundValueFunction() {
	        var ret = this._boundTo;
	        if (ret !== undefined) {
	            if (ret instanceof Promise) {
	                if (ret.isFulfilled()) {
	                    return ret.value();
	                } else {
	                    return undefined;
	                }
	            }
	        }
	        return ret;
	    }

	    function longStackTracesCaptureStackTrace() {
	        this._trace = new CapturedTrace(this._peekContext());
	    }

	    function longStackTracesAttachExtraTrace(error, ignoreSelf) {
	        if (canAttachTrace(error)) {
	            var trace = this._trace;
	            if (trace !== undefined) {
	                if (ignoreSelf) trace = trace._parent;
	            }
	            if (trace !== undefined) {
	                trace.attachExtraTrace(error);
	            } else if (!error.__stackCleaned__) {
	                var parsed = parseStackAndMessage(error);
	                util.notEnumerableProp(error, "stack", parsed.message + "\n" + parsed.stack.join("\n"));
	                util.notEnumerableProp(error, "__stackCleaned__", true);
	            }
	        }
	    }

	    function checkForgottenReturns(returnValue, promiseCreated, name, promise, parent) {
	        if (returnValue === undefined && promiseCreated !== null && wForgottenReturn) {
	            if (parent !== undefined && parent._returnedNonUndefined()) return;
	            if ((promise._bitField & 65535) === 0) return;

	            if (name) name = name + " ";
	            var handlerLine = "";
	            var creatorLine = "";
	            if (promiseCreated._trace) {
	                var traceLines = promiseCreated._trace.stack.split("\n");
	                var stack = cleanStack(traceLines);
	                for (var i = stack.length - 1; i >= 0; --i) {
	                    var line = stack[i];
	                    if (!nodeFramePattern.test(line)) {
	                        var lineMatches = line.match(parseLinePattern);
	                        if (lineMatches) {
	                            handlerLine = "at " + lineMatches[1] + ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
	                        }
	                        break;
	                    }
	                }

	                if (stack.length > 0) {
	                    var firstUserLine = stack[0];
	                    for (var i = 0; i < traceLines.length; ++i) {

	                        if (traceLines[i] === firstUserLine) {
	                            if (i > 0) {
	                                creatorLine = "\n" + traceLines[i - 1];
	                            }
	                            break;
	                        }
	                    }
	                }
	            }
	            var msg = "a promise was created in a " + name + "handler " + handlerLine + "but was not returned from it, " + "see http://goo.gl/rRqMUw" + creatorLine;
	            promise._warn(msg, true, promiseCreated);
	        }
	    }

	    function deprecated(name, replacement) {
	        var message = name + " is deprecated and will be removed in a future version.";
	        if (replacement) message += " Use " + replacement + " instead.";
	        return warn(message);
	    }

	    function warn(message, shouldUseOwnTrace, promise) {
	        if (!config.warnings) return;
	        var warning = new Warning(message);
	        var ctx;
	        if (shouldUseOwnTrace) {
	            promise._attachExtraTrace(warning);
	        } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
	            ctx.attachExtraTrace(warning);
	        } else {
	            var parsed = parseStackAndMessage(warning);
	            warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
	        }

	        if (!activeFireEvent("warning", warning)) {
	            formatAndLogError(warning, "", true);
	        }
	    }

	    function reconstructStack(message, stacks) {
	        for (var i = 0; i < stacks.length - 1; ++i) {
	            stacks[i].push("From previous event:");
	            stacks[i] = stacks[i].join("\n");
	        }
	        if (i < stacks.length) {
	            stacks[i] = stacks[i].join("\n");
	        }
	        return message + "\n" + stacks.join("\n");
	    }

	    function removeDuplicateOrEmptyJumps(stacks) {
	        for (var i = 0; i < stacks.length; ++i) {
	            if (stacks[i].length === 0 || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) {
	                stacks.splice(i, 1);
	                i--;
	            }
	        }
	    }

	    function removeCommonRoots(stacks) {
	        var current = stacks[0];
	        for (var i = 1; i < stacks.length; ++i) {
	            var prev = stacks[i];
	            var currentLastIndex = current.length - 1;
	            var currentLastLine = current[currentLastIndex];
	            var commonRootMeetPoint = -1;

	            for (var j = prev.length - 1; j >= 0; --j) {
	                if (prev[j] === currentLastLine) {
	                    commonRootMeetPoint = j;
	                    break;
	                }
	            }

	            for (var j = commonRootMeetPoint; j >= 0; --j) {
	                var line = prev[j];
	                if (current[currentLastIndex] === line) {
	                    current.pop();
	                    currentLastIndex--;
	                } else {
	                    break;
	                }
	            }
	            current = prev;
	        }
	    }

	    function cleanStack(stack) {
	        var ret = [];
	        for (var i = 0; i < stack.length; ++i) {
	            var line = stack[i];
	            var isTraceLine = "    (No stack trace)" === line || stackFramePattern.test(line);
	            var isInternalFrame = isTraceLine && shouldIgnore(line);
	            if (isTraceLine && !isInternalFrame) {
	                if (indentStackFrames && line.charAt(0) !== " ") {
	                    line = "    " + line;
	                }
	                ret.push(line);
	            }
	        }
	        return ret;
	    }

	    function stackFramesAsArray(error) {
	        var stack = error.stack.replace(/\s+$/g, "").split("\n");
	        for (var i = 0; i < stack.length; ++i) {
	            var line = stack[i];
	            if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
	                break;
	            }
	        }
	        if (i > 0 && error.name != "SyntaxError") {
	            stack = stack.slice(i);
	        }
	        return stack;
	    }

	    function parseStackAndMessage(error) {
	        var stack = error.stack;
	        var message = error.toString();
	        stack = typeof stack === "string" && stack.length > 0 ? stackFramesAsArray(error) : ["    (No stack trace)"];
	        return {
	            message: message,
	            stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
	        };
	    }

	    function formatAndLogError(error, title, isSoft) {
	        if (typeof console !== "undefined") {
	            var message;
	            if (util.isObject(error)) {
	                var stack = error.stack;
	                message = title + formatStack(stack, error);
	            } else {
	                message = title + String(error);
	            }
	            if (typeof printWarning === "function") {
	                printWarning(message, isSoft);
	            } else if (typeof console.log === "function" || _typeof(console.log) === "object") {
	                console.log(message);
	            }
	        }
	    }

	    function fireRejectionEvent(name, localHandler, reason, promise) {
	        var localEventFired = false;
	        try {
	            if (typeof localHandler === "function") {
	                localEventFired = true;
	                if (name === "rejectionHandled") {
	                    localHandler(promise);
	                } else {
	                    localHandler(reason, promise);
	                }
	            }
	        } catch (e) {
	            async.throwLater(e);
	        }

	        if (name === "unhandledRejection") {
	            if (!activeFireEvent(name, reason, promise) && !localEventFired) {
	                formatAndLogError(reason, "Unhandled rejection ");
	            }
	        } else {
	            activeFireEvent(name, promise);
	        }
	    }

	    function formatNonError(obj) {
	        var str;
	        if (typeof obj === "function") {
	            str = "[function " + (obj.name || "anonymous") + "]";
	        } else {
	            str = obj && typeof obj.toString === "function" ? obj.toString() : util.toString(obj);
	            var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
	            if (ruselessToString.test(str)) {
	                try {
	                    var newStr = JSON.stringify(obj);
	                    str = newStr;
	                } catch (e) {}
	            }
	            if (str.length === 0) {
	                str = "(empty array)";
	            }
	        }
	        return "(<" + snip(str) + ">, no stack trace)";
	    }

	    function snip(str) {
	        var maxChars = 41;
	        if (str.length < maxChars) {
	            return str;
	        }
	        return str.substr(0, maxChars - 3) + "...";
	    }

	    function longStackTracesIsSupported() {
	        return typeof captureStackTrace === "function";
	    }

	    var shouldIgnore = function shouldIgnore() {
	        return false;
	    };
	    var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
	    function parseLineInfo(line) {
	        var matches = line.match(parseLineInfoRegex);
	        if (matches) {
	            return {
	                fileName: matches[1],
	                line: parseInt(matches[2], 10)
	            };
	        }
	    }

	    function setBounds(firstLineError, lastLineError) {
	        if (!longStackTracesIsSupported()) return;
	        var firstStackLines = firstLineError.stack.split("\n");
	        var lastStackLines = lastLineError.stack.split("\n");
	        var firstIndex = -1;
	        var lastIndex = -1;
	        var firstFileName;
	        var lastFileName;
	        for (var i = 0; i < firstStackLines.length; ++i) {
	            var result = parseLineInfo(firstStackLines[i]);
	            if (result) {
	                firstFileName = result.fileName;
	                firstIndex = result.line;
	                break;
	            }
	        }
	        for (var i = 0; i < lastStackLines.length; ++i) {
	            var result = parseLineInfo(lastStackLines[i]);
	            if (result) {
	                lastFileName = result.fileName;
	                lastIndex = result.line;
	                break;
	            }
	        }
	        if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex) {
	            return;
	        }

	        shouldIgnore = function shouldIgnore(line) {
	            if (bluebirdFramePattern.test(line)) return true;
	            var info = parseLineInfo(line);
	            if (info) {
	                if (info.fileName === firstFileName && firstIndex <= info.line && info.line <= lastIndex) {
	                    return true;
	                }
	            }
	            return false;
	        };
	    }

	    function CapturedTrace(parent) {
	        this._parent = parent;
	        this._promisesCreated = 0;
	        var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
	        captureStackTrace(this, CapturedTrace);
	        if (length > 32) this.uncycle();
	    }
	    util.inherits(CapturedTrace, Error);
	    Context.CapturedTrace = CapturedTrace;

	    CapturedTrace.prototype.uncycle = function () {
	        var length = this._length;
	        if (length < 2) return;
	        var nodes = [];
	        var stackToIndex = {};

	        for (var i = 0, node = this; node !== undefined; ++i) {
	            nodes.push(node);
	            node = node._parent;
	        }
	        length = this._length = i;
	        for (var i = length - 1; i >= 0; --i) {
	            var stack = nodes[i].stack;
	            if (stackToIndex[stack] === undefined) {
	                stackToIndex[stack] = i;
	            }
	        }
	        for (var i = 0; i < length; ++i) {
	            var currentStack = nodes[i].stack;
	            var index = stackToIndex[currentStack];
	            if (index !== undefined && index !== i) {
	                if (index > 0) {
	                    nodes[index - 1]._parent = undefined;
	                    nodes[index - 1]._length = 1;
	                }
	                nodes[i]._parent = undefined;
	                nodes[i]._length = 1;
	                var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

	                if (index < length - 1) {
	                    cycleEdgeNode._parent = nodes[index + 1];
	                    cycleEdgeNode._parent.uncycle();
	                    cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
	                } else {
	                    cycleEdgeNode._parent = undefined;
	                    cycleEdgeNode._length = 1;
	                }
	                var currentChildLength = cycleEdgeNode._length + 1;
	                for (var j = i - 2; j >= 0; --j) {
	                    nodes[j]._length = currentChildLength;
	                    currentChildLength++;
	                }
	                return;
	            }
	        }
	    };

	    CapturedTrace.prototype.attachExtraTrace = function (error) {
	        if (error.__stackCleaned__) return;
	        this.uncycle();
	        var parsed = parseStackAndMessage(error);
	        var message = parsed.message;
	        var stacks = [parsed.stack];

	        var trace = this;
	        while (trace !== undefined) {
	            stacks.push(cleanStack(trace.stack.split("\n")));
	            trace = trace._parent;
	        }
	        removeCommonRoots(stacks);
	        removeDuplicateOrEmptyJumps(stacks);
	        util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
	        util.notEnumerableProp(error, "__stackCleaned__", true);
	    };

	    var captureStackTrace = function stackDetection() {
	        var v8stackFramePattern = /^\s*at\s*/;
	        var v8stackFormatter = function v8stackFormatter(stack, error) {
	            if (typeof stack === "string") return stack;

	            if (error.name !== undefined && error.message !== undefined) {
	                return error.toString();
	            }
	            return formatNonError(error);
	        };

	        if (typeof Error.stackTraceLimit === "number" && typeof Error.captureStackTrace === "function") {
	            Error.stackTraceLimit += 6;
	            stackFramePattern = v8stackFramePattern;
	            formatStack = v8stackFormatter;
	            var captureStackTrace = Error.captureStackTrace;

	            shouldIgnore = function shouldIgnore(line) {
	                return bluebirdFramePattern.test(line);
	            };
	            return function (receiver, ignoreUntil) {
	                Error.stackTraceLimit += 6;
	                captureStackTrace(receiver, ignoreUntil);
	                Error.stackTraceLimit -= 6;
	            };
	        }
	        var err = new Error();

	        if (typeof err.stack === "string" && err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
	            stackFramePattern = /@/;
	            formatStack = v8stackFormatter;
	            indentStackFrames = true;
	            return function captureStackTrace(o) {
	                o.stack = new Error().stack;
	            };
	        }

	        var hasStackAfterThrow;
	        try {
	            throw new Error();
	        } catch (e) {
	            hasStackAfterThrow = "stack" in e;
	        }
	        if (!("stack" in err) && hasStackAfterThrow && typeof Error.stackTraceLimit === "number") {
	            stackFramePattern = v8stackFramePattern;
	            formatStack = v8stackFormatter;
	            return function captureStackTrace(o) {
	                Error.stackTraceLimit += 6;
	                try {
	                    throw new Error();
	                } catch (e) {
	                    o.stack = e.stack;
	                }
	                Error.stackTraceLimit -= 6;
	            };
	        }

	        formatStack = function formatStack(stack, error) {
	            if (typeof stack === "string") return stack;

	            if (((typeof error === "undefined" ? "undefined" : _typeof(error)) === "object" || typeof error === "function") && error.name !== undefined && error.message !== undefined) {
	                return error.toString();
	            }
	            return formatNonError(error);
	        };

	        return null;
	    }([]);

	    if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
	        printWarning = function printWarning(message) {
	            console.warn(message);
	        };
	        if (util.isNode && process.stderr.isTTY) {
	            printWarning = function printWarning(message, isSoft) {
	                var color = isSoft ? "\x1B[33m" : "\x1B[31m";
	                console.warn(color + message + "\x1B[0m\n");
	            };
	        } else if (!util.isNode && typeof new Error().stack === "string") {
	            printWarning = function printWarning(message, isSoft) {
	                console.warn("%c" + message, isSoft ? "color: darkorange" : "color: red");
	            };
	        }
	    }

	    var config = {
	        warnings: warnings,
	        longStackTraces: false,
	        cancellation: false,
	        monitoring: false
	    };

	    if (longStackTraces) Promise.longStackTraces();

	    return {
	        longStackTraces: function longStackTraces() {
	            return config.longStackTraces;
	        },
	        warnings: function warnings() {
	            return config.warnings;
	        },
	        cancellation: function cancellation() {
	            return config.cancellation;
	        },
	        monitoring: function monitoring() {
	            return config.monitoring;
	        },
	        propagateFromFunction: function propagateFromFunction() {
	            return _propagateFromFunction;
	        },
	        boundValueFunction: function boundValueFunction() {
	            return _boundValueFunction;
	        },
	        checkForgottenReturns: checkForgottenReturns,
	        setBounds: setBounds,
	        warn: warn,
	        deprecated: deprecated,
	        CapturedTrace: CapturedTrace,
	        fireDomEvent: fireDomEvent,
	        fireGlobalEvent: fireGlobalEvent
	    };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, tryConvertToPromise, NEXT_FILTER) {
	    var util = __webpack_require__(15);
	    var CancellationError = Promise.CancellationError;
	    var errorObj = util.errorObj;
	    var catchFilter = __webpack_require__(28)(NEXT_FILTER);

	    function PassThroughHandlerContext(promise, type, handler) {
	        this.promise = promise;
	        this.type = type;
	        this.handler = handler;
	        this.called = false;
	        this.cancelPromise = null;
	    }

	    PassThroughHandlerContext.prototype.isFinallyHandler = function () {
	        return this.type === 0;
	    };

	    function FinallyHandlerCancelReaction(finallyHandler) {
	        this.finallyHandler = finallyHandler;
	    }

	    FinallyHandlerCancelReaction.prototype._resultCancelled = function () {
	        checkCancel(this.finallyHandler);
	    };

	    function checkCancel(ctx, reason) {
	        if (ctx.cancelPromise != null) {
	            if (arguments.length > 1) {
	                ctx.cancelPromise._reject(reason);
	            } else {
	                ctx.cancelPromise._cancel();
	            }
	            ctx.cancelPromise = null;
	            return true;
	        }
	        return false;
	    }

	    function succeed() {
	        return finallyHandler.call(this, this.promise._target()._settledValue());
	    }
	    function fail(reason) {
	        if (checkCancel(this, reason)) return;
	        errorObj.e = reason;
	        return errorObj;
	    }
	    function finallyHandler(reasonOrValue) {
	        var promise = this.promise;
	        var handler = this.handler;

	        if (!this.called) {
	            this.called = true;
	            var ret = this.isFinallyHandler() ? handler.call(promise._boundValue()) : handler.call(promise._boundValue(), reasonOrValue);
	            if (ret === NEXT_FILTER) {
	                return ret;
	            } else if (ret !== undefined) {
	                promise._setReturnedNonUndefined();
	                var maybePromise = tryConvertToPromise(ret, promise);
	                if (maybePromise instanceof Promise) {
	                    if (this.cancelPromise != null) {
	                        if (maybePromise._isCancelled()) {
	                            var reason = new CancellationError("late cancellation observer");
	                            promise._attachExtraTrace(reason);
	                            errorObj.e = reason;
	                            return errorObj;
	                        } else if (maybePromise.isPending()) {
	                            maybePromise._attachCancellationCallback(new FinallyHandlerCancelReaction(this));
	                        }
	                    }
	                    return maybePromise._then(succeed, fail, undefined, this, undefined);
	                }
	            }
	        }

	        if (promise.isRejected()) {
	            checkCancel(this);
	            errorObj.e = reasonOrValue;
	            return errorObj;
	        } else {
	            checkCancel(this);
	            return reasonOrValue;
	        }
	    }

	    Promise.prototype._passThrough = function (handler, type, success, fail) {
	        if (typeof handler !== "function") return this.then();
	        return this._then(success, fail, undefined, new PassThroughHandlerContext(this, type, handler), undefined);
	    };

	    Promise.prototype.lastly = Promise.prototype["finally"] = function (handler) {
	        return this._passThrough(handler, 0, finallyHandler, finallyHandler);
	    };

	    Promise.prototype.tap = function (handler) {
	        return this._passThrough(handler, 1, finallyHandler);
	    };

	    Promise.prototype.tapCatch = function (handlerOrPredicate) {
	        var len = arguments.length;
	        if (len === 1) {
	            return this._passThrough(handlerOrPredicate, 1, undefined, finallyHandler);
	        } else {
	            var catchInstances = new Array(len - 1),
	                j = 0,
	                i;
	            for (i = 0; i < len - 1; ++i) {
	                var item = arguments[i];
	                if (util.isObject(item)) {
	                    catchInstances[j++] = item;
	                } else {
	                    return Promise.reject(new TypeError("tapCatch statement predicate: " + "expecting an object but got " + util.classString(item)));
	                }
	            }
	            catchInstances.length = j;
	            var handler = arguments[i];
	            return this._passThrough(catchFilter(catchInstances, handler, this), 1, undefined, finallyHandler);
	        }
	    };

	    return PassThroughHandlerContext;
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (NEXT_FILTER) {
	    var util = __webpack_require__(15);
	    var getKeys = __webpack_require__(16).keys;
	    var tryCatch = util.tryCatch;
	    var errorObj = util.errorObj;

	    function catchFilter(instances, cb, promise) {
	        return function (e) {
	            var boundTo = promise._boundValue();
	            predicateLoop: for (var i = 0; i < instances.length; ++i) {
	                var item = instances[i];

	                if (item === Error || item != null && item.prototype instanceof Error) {
	                    if (e instanceof item) {
	                        return tryCatch(cb).call(boundTo, e);
	                    }
	                } else if (typeof item === "function") {
	                    var matchesPredicate = tryCatch(item).call(boundTo, e);
	                    if (matchesPredicate === errorObj) {
	                        return matchesPredicate;
	                    } else if (matchesPredicate) {
	                        return tryCatch(cb).call(boundTo, e);
	                    }
	                } else if (util.isObject(e)) {
	                    var keys = getKeys(item);
	                    for (var j = 0; j < keys.length; ++j) {
	                        var key = keys[j];
	                        if (item[key] != e[key]) {
	                            continue predicateLoop;
	                        }
	                    }
	                    return tryCatch(cb).call(boundTo, e);
	                }
	            }
	            return NEXT_FILTER;
	        };
	    }

	    return catchFilter;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var util = __webpack_require__(15);
	var maybeWrapAsError = util.maybeWrapAsError;
	var errors = __webpack_require__(22);
	var OperationalError = errors.OperationalError;
	var es5 = __webpack_require__(16);

	function isUntypedError(obj) {
	    return obj instanceof Error && es5.getPrototypeOf(obj) === Error.prototype;
	}

	var rErrorKey = /^(?:name|message|stack|cause)$/;
	function wrapAsOperationalError(obj) {
	    var ret;
	    if (isUntypedError(obj)) {
	        ret = new OperationalError(obj);
	        ret.name = obj.name;
	        ret.message = obj.message;
	        ret.stack = obj.stack;
	        var keys = es5.keys(obj);
	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            if (!rErrorKey.test(key)) {
	                ret[key] = obj[key];
	            }
	        }
	        return ret;
	    }
	    util.markAsOriginatingFromRejection(obj);
	    return obj;
	}

	function nodebackForPromise(promise, multiArgs) {
	    return function (err, value) {
	        if (promise === null) return;
	        if (err) {
	            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
	            promise._attachExtraTrace(wrapped);
	            promise._reject(wrapped);
	        } else if (!multiArgs) {
	            promise._fulfill(value);
	        } else {
	            var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0));for (var $_i = 1; $_i < $_len; ++$_i) {
	                args[$_i - 1] = arguments[$_i];
	            };
	            promise._fulfill(args);
	        }
	        promise = null;
	    };
	}

	module.exports = nodebackForPromise;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
	    var util = __webpack_require__(15);
	    var tryCatch = util.tryCatch;

	    Promise.method = function (fn) {
	        if (typeof fn !== "function") {
	            throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
	        }
	        return function () {
	            var ret = new Promise(INTERNAL);
	            ret._captureStackTrace();
	            ret._pushContext();
	            var value = tryCatch(fn).apply(this, arguments);
	            var promiseCreated = ret._popContext();
	            debug.checkForgottenReturns(value, promiseCreated, "Promise.method", ret);
	            ret._resolveFromSyncValue(value);
	            return ret;
	        };
	    };

	    Promise.attempt = Promise["try"] = function (fn) {
	        if (typeof fn !== "function") {
	            return apiRejection("expecting a function but got " + util.classString(fn));
	        }
	        var ret = new Promise(INTERNAL);
	        ret._captureStackTrace();
	        ret._pushContext();
	        var value;
	        if (arguments.length > 1) {
	            debug.deprecated("calling Promise.try with more than 1 argument");
	            var arg = arguments[1];
	            var ctx = arguments[2];
	            value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg) : tryCatch(fn).call(ctx, arg);
	        } else {
	            value = tryCatch(fn)();
	        }
	        var promiseCreated = ret._popContext();
	        debug.checkForgottenReturns(value, promiseCreated, "Promise.try", ret);
	        ret._resolveFromSyncValue(value);
	        return ret;
	    };

	    Promise.prototype._resolveFromSyncValue = function (value) {
	        if (value === util.errorObj) {
	            this._rejectCallback(value.e, false);
	        } else {
	            this._resolveCallback(value, true);
	        }
	    };
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (Promise, INTERNAL, tryConvertToPromise, debug) {
	    var calledBind = false;
	    var rejectThis = function rejectThis(_, e) {
	        this._reject(e);
	    };

	    var targetRejected = function targetRejected(e, context) {
	        context.promiseRejectionQueued = true;
	        context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
	    };

	    var bindingResolved = function bindingResolved(thisArg, context) {
	        if ((this._bitField & 50397184) === 0) {
	            this._resolveCallback(context.target);
	        }
	    };

	    var bindingRejected = function bindingRejected(e, context) {
	        if (!context.promiseRejectionQueued) this._reject(e);
	    };

	    Promise.prototype.bind = function (thisArg) {
	        if (!calledBind) {
	            calledBind = true;
	            Promise.prototype._propagateFrom = debug.propagateFromFunction();
	            Promise.prototype._boundValue = debug.boundValueFunction();
	        }
	        var maybePromise = tryConvertToPromise(thisArg);
	        var ret = new Promise(INTERNAL);
	        ret._propagateFrom(this, 1);
	        var target = this._target();
	        ret._setBoundTo(maybePromise);
	        if (maybePromise instanceof Promise) {
	            var context = {
	                promiseRejectionQueued: false,
	                promise: ret,
	                target: target,
	                bindingPromise: maybePromise
	            };
	            target._then(INTERNAL, targetRejected, undefined, ret, context);
	            maybePromise._then(bindingResolved, bindingRejected, undefined, ret, context);
	            ret._setOnCancel(maybePromise);
	        } else {
	            ret._resolveCallback(target);
	        }
	        return ret;
	    };

	    Promise.prototype._setBoundTo = function (obj) {
	        if (obj !== undefined) {
	            this._bitField = this._bitField | 2097152;
	            this._boundTo = obj;
	        } else {
	            this._bitField = this._bitField & ~2097152;
	        }
	    };

	    Promise.prototype._isBound = function () {
	        return (this._bitField & 2097152) === 2097152;
	    };

	    Promise.bind = function (thisArg, value) {
	        return Promise.resolve(value).bind(thisArg);
	    };
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, PromiseArray, apiRejection, debug) {
	    var util = __webpack_require__(15);
	    var tryCatch = util.tryCatch;
	    var errorObj = util.errorObj;
	    var async = Promise._async;

	    Promise.prototype["break"] = Promise.prototype.cancel = function () {
	        if (!debug.cancellation()) return this._warn("cancellation is disabled");

	        var promise = this;
	        var child = promise;
	        while (promise._isCancellable()) {
	            if (!promise._cancelBy(child)) {
	                if (child._isFollowing()) {
	                    child._followee().cancel();
	                } else {
	                    child._cancelBranched();
	                }
	                break;
	            }

	            var parent = promise._cancellationParent;
	            if (parent == null || !parent._isCancellable()) {
	                if (promise._isFollowing()) {
	                    promise._followee().cancel();
	                } else {
	                    promise._cancelBranched();
	                }
	                break;
	            } else {
	                if (promise._isFollowing()) promise._followee().cancel();
	                promise._setWillBeCancelled();
	                child = promise;
	                promise = parent;
	            }
	        }
	    };

	    Promise.prototype._branchHasCancelled = function () {
	        this._branchesRemainingToCancel--;
	    };

	    Promise.prototype._enoughBranchesHaveCancelled = function () {
	        return this._branchesRemainingToCancel === undefined || this._branchesRemainingToCancel <= 0;
	    };

	    Promise.prototype._cancelBy = function (canceller) {
	        if (canceller === this) {
	            this._branchesRemainingToCancel = 0;
	            this._invokeOnCancel();
	            return true;
	        } else {
	            this._branchHasCancelled();
	            if (this._enoughBranchesHaveCancelled()) {
	                this._invokeOnCancel();
	                return true;
	            }
	        }
	        return false;
	    };

	    Promise.prototype._cancelBranched = function () {
	        if (this._enoughBranchesHaveCancelled()) {
	            this._cancel();
	        }
	    };

	    Promise.prototype._cancel = function () {
	        if (!this._isCancellable()) return;
	        this._setCancelled();
	        async.invoke(this._cancelPromises, this, undefined);
	    };

	    Promise.prototype._cancelPromises = function () {
	        if (this._length() > 0) this._settlePromises();
	    };

	    Promise.prototype._unsetOnCancel = function () {
	        this._onCancelField = undefined;
	    };

	    Promise.prototype._isCancellable = function () {
	        return this.isPending() && !this._isCancelled();
	    };

	    Promise.prototype.isCancellable = function () {
	        return this.isPending() && !this.isCancelled();
	    };

	    Promise.prototype._doInvokeOnCancel = function (onCancelCallback, internalOnly) {
	        if (util.isArray(onCancelCallback)) {
	            for (var i = 0; i < onCancelCallback.length; ++i) {
	                this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
	            }
	        } else if (onCancelCallback !== undefined) {
	            if (typeof onCancelCallback === "function") {
	                if (!internalOnly) {
	                    var e = tryCatch(onCancelCallback).call(this._boundValue());
	                    if (e === errorObj) {
	                        this._attachExtraTrace(e.e);
	                        async.throwLater(e.e);
	                    }
	                }
	            } else {
	                onCancelCallback._resultCancelled(this);
	            }
	        }
	    };

	    Promise.prototype._invokeOnCancel = function () {
	        var onCancelCallback = this._onCancel();
	        this._unsetOnCancel();
	        async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
	    };

	    Promise.prototype._invokeInternalOnCancel = function () {
	        if (this._isCancellable()) {
	            this._doInvokeOnCancel(this._onCancel(), true);
	            this._unsetOnCancel();
	        }
	    };

	    Promise.prototype._resultCancelled = function () {
	        this.cancel();
	    };
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (Promise) {
	    function returner() {
	        return this.value;
	    }
	    function thrower() {
	        throw this.reason;
	    }

	    Promise.prototype["return"] = Promise.prototype.thenReturn = function (value) {
	        if (value instanceof Promise) value.suppressUnhandledRejections();
	        return this._then(returner, undefined, undefined, { value: value }, undefined);
	    };

	    Promise.prototype["throw"] = Promise.prototype.thenThrow = function (reason) {
	        return this._then(thrower, undefined, undefined, { reason: reason }, undefined);
	    };

	    Promise.prototype.catchThrow = function (reason) {
	        if (arguments.length <= 1) {
	            return this._then(undefined, thrower, undefined, { reason: reason }, undefined);
	        } else {
	            var _reason = arguments[1];
	            var handler = function handler() {
	                throw _reason;
	            };
	            return this.caught(reason, handler);
	        }
	    };

	    Promise.prototype.catchReturn = function (value) {
	        if (arguments.length <= 1) {
	            if (value instanceof Promise) value.suppressUnhandledRejections();
	            return this._then(undefined, returner, undefined, { value: value }, undefined);
	        } else {
	            var _value = arguments[1];
	            if (_value instanceof Promise) _value.suppressUnhandledRejections();
	            var handler = function handler() {
	                return _value;
	            };
	            return this.caught(value, handler);
	        }
	    };
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (Promise) {
	    function PromiseInspection(promise) {
	        if (promise !== undefined) {
	            promise = promise._target();
	            this._bitField = promise._bitField;
	            this._settledValueField = promise._isFateSealed() ? promise._settledValue() : undefined;
	        } else {
	            this._bitField = 0;
	            this._settledValueField = undefined;
	        }
	    }

	    PromiseInspection.prototype._settledValue = function () {
	        return this._settledValueField;
	    };

	    var value = PromiseInspection.prototype.value = function () {
	        if (!this.isFulfilled()) {
	            throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
	        }
	        return this._settledValue();
	    };

	    var reason = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function () {
	        if (!this.isRejected()) {
	            throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
	        }
	        return this._settledValue();
	    };

	    var isFulfilled = PromiseInspection.prototype.isFulfilled = function () {
	        return (this._bitField & 33554432) !== 0;
	    };

	    var isRejected = PromiseInspection.prototype.isRejected = function () {
	        return (this._bitField & 16777216) !== 0;
	    };

	    var isPending = PromiseInspection.prototype.isPending = function () {
	        return (this._bitField & 50397184) === 0;
	    };

	    var isResolved = PromiseInspection.prototype.isResolved = function () {
	        return (this._bitField & 50331648) !== 0;
	    };

	    PromiseInspection.prototype.isCancelled = function () {
	        return (this._bitField & 8454144) !== 0;
	    };

	    Promise.prototype.__isCancelled = function () {
	        return (this._bitField & 65536) === 65536;
	    };

	    Promise.prototype._isCancelled = function () {
	        return this._target().__isCancelled();
	    };

	    Promise.prototype.isCancelled = function () {
	        return (this._target()._bitField & 8454144) !== 0;
	    };

	    Promise.prototype.isPending = function () {
	        return isPending.call(this._target());
	    };

	    Promise.prototype.isRejected = function () {
	        return isRejected.call(this._target());
	    };

	    Promise.prototype.isFulfilled = function () {
	        return isFulfilled.call(this._target());
	    };

	    Promise.prototype.isResolved = function () {
	        return isResolved.call(this._target());
	    };

	    Promise.prototype.value = function () {
	        return value.call(this._target());
	    };

	    Promise.prototype.reason = function () {
	        var target = this._target();
	        target._unsetRejectionIsUnhandled();
	        return reason.call(target);
	    };

	    Promise.prototype._value = function () {
	        return this._settledValue();
	    };

	    Promise.prototype._reason = function () {
	        this._unsetRejectionIsUnhandled();
	        return this._settledValue();
	    };

	    Promise.PromiseInspection = PromiseInspection;
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain) {
	    var util = __webpack_require__(15);
	    var canEvaluate = util.canEvaluate;
	    var tryCatch = util.tryCatch;
	    var errorObj = util.errorObj;
	    var reject;

	    if (true) {
	        if (canEvaluate) {
	            var thenCallback = function thenCallback(i) {
	                return new Function("value", "holder", "                             \n\
	            'use strict';                                                    \n\
	            holder.pIndex = value;                                           \n\
	            holder.checkFulfillment(this);                                   \n\
	            ".replace(/Index/g, i));
	            };

	            var promiseSetter = function promiseSetter(i) {
	                return new Function("promise", "holder", "                           \n\
	            'use strict';                                                    \n\
	            holder.pIndex = promise;                                         \n\
	            ".replace(/Index/g, i));
	            };

	            var generateHolderClass = function generateHolderClass(total) {
	                var props = new Array(total);
	                for (var i = 0; i < props.length; ++i) {
	                    props[i] = "this.p" + (i + 1);
	                }
	                var assignment = props.join(" = ") + " = null;";
	                var cancellationCode = "var promise;\n" + props.map(function (prop) {
	                    return "                                                         \n\
	                promise = " + prop + ";                                      \n\
	                if (promise instanceof Promise) {                            \n\
	                    promise.cancel();                                        \n\
	                }                                                            \n\
	            ";
	                }).join("\n");
	                var passedArguments = props.join(", ");
	                var name = "Holder$" + total;

	                var code = "return function(tryCatch, errorObj, Promise, async) {    \n\
	            'use strict';                                                    \n\
	            function [TheName](fn) {                                         \n\
	                [TheProperties]                                              \n\
	                this.fn = fn;                                                \n\
	                this.asyncNeeded = true;                                     \n\
	                this.now = 0;                                                \n\
	            }                                                                \n\
	                                                                             \n\
	            [TheName].prototype._callFunction = function(promise) {          \n\
	                promise._pushContext();                                      \n\
	                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n\
	                promise._popContext();                                       \n\
	                if (ret === errorObj) {                                      \n\
	                    promise._rejectCallback(ret.e, false);                   \n\
	                } else {                                                     \n\
	                    promise._resolveCallback(ret);                           \n\
	                }                                                            \n\
	            };                                                               \n\
	                                                                             \n\
	            [TheName].prototype.checkFulfillment = function(promise) {       \n\
	                var now = ++this.now;                                        \n\
	                if (now === [TheTotal]) {                                    \n\
	                    if (this.asyncNeeded) {                                  \n\
	                        async.invoke(this._callFunction, this, promise);     \n\
	                    } else {                                                 \n\
	                        this._callFunction(promise);                         \n\
	                    }                                                        \n\
	                                                                             \n\
	                }                                                            \n\
	            };                                                               \n\
	                                                                             \n\
	            [TheName].prototype._resultCancelled = function() {              \n\
	                [CancellationCode]                                           \n\
	            };                                                               \n\
	                                                                             \n\
	            return [TheName];                                                \n\
	        }(tryCatch, errorObj, Promise, async);                               \n\
	        ";

	                code = code.replace(/\[TheName\]/g, name).replace(/\[TheTotal\]/g, total).replace(/\[ThePassedArguments\]/g, passedArguments).replace(/\[TheProperties\]/g, assignment).replace(/\[CancellationCode\]/g, cancellationCode);

	                return new Function("tryCatch", "errorObj", "Promise", "async", code)(tryCatch, errorObj, Promise, async);
	            };

	            var holderClasses = [];
	            var thenCallbacks = [];
	            var promiseSetters = [];

	            for (var i = 0; i < 8; ++i) {
	                holderClasses.push(generateHolderClass(i + 1));
	                thenCallbacks.push(thenCallback(i + 1));
	                promiseSetters.push(promiseSetter(i + 1));
	            }

	            reject = function reject(reason) {
	                this._reject(reason);
	            };
	        }
	    }

	    Promise.join = function () {
	        var last = arguments.length - 1;
	        var fn;
	        if (last > 0 && typeof arguments[last] === "function") {
	            fn = arguments[last];
	            if (true) {
	                if (last <= 8 && canEvaluate) {
	                    var ret = new Promise(INTERNAL);
	                    ret._captureStackTrace();
	                    var HolderClass = holderClasses[last - 1];
	                    var holder = new HolderClass(fn);
	                    var callbacks = thenCallbacks;

	                    for (var i = 0; i < last; ++i) {
	                        var maybePromise = tryConvertToPromise(arguments[i], ret);
	                        if (maybePromise instanceof Promise) {
	                            maybePromise = maybePromise._target();
	                            var bitField = maybePromise._bitField;
	                            ;
	                            if ((bitField & 50397184) === 0) {
	                                maybePromise._then(callbacks[i], reject, undefined, ret, holder);
	                                promiseSetters[i](maybePromise, holder);
	                                holder.asyncNeeded = false;
	                            } else if ((bitField & 33554432) !== 0) {
	                                callbacks[i].call(ret, maybePromise._value(), holder);
	                            } else if ((bitField & 16777216) !== 0) {
	                                ret._reject(maybePromise._reason());
	                            } else {
	                                ret._cancel();
	                            }
	                        } else {
	                            callbacks[i].call(ret, maybePromise, holder);
	                        }
	                    }

	                    if (!ret._isFateSealed()) {
	                        if (holder.asyncNeeded) {
	                            var domain = getDomain();
	                            if (domain !== null) {
	                                holder.fn = util.domainBind(domain, holder.fn);
	                            }
	                        }
	                        ret._setAsyncGuaranteed();
	                        ret._setOnCancel(holder);
	                    }
	                    return ret;
	                }
	            }
	        }
	        var $_len = arguments.length;var args = new Array($_len);for (var $_i = 0; $_i < $_len; ++$_i) {
	            args[$_i] = arguments[$_i];
	        };
	        if (fn) args.pop();
	        var ret = new PromiseArray(args).promise();
	        return fn !== undefined ? ret.spread(fn) : ret;
	    };
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	module.exports = function (Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
	    var getDomain = Promise._getDomain;
	    var util = __webpack_require__(15);
	    var tryCatch = util.tryCatch;
	    var errorObj = util.errorObj;
	    var async = Promise._async;

	    function MappingPromiseArray(promises, fn, limit, _filter) {
	        this.constructor$(promises);
	        this._promise._captureStackTrace();
	        var domain = getDomain();
	        this._callback = domain === null ? fn : util.domainBind(domain, fn);
	        this._preservedValues = _filter === INTERNAL ? new Array(this.length()) : null;
	        this._limit = limit;
	        this._inFlight = 0;
	        this._queue = [];
	        async.invoke(this._asyncInit, this, undefined);
	    }
	    util.inherits(MappingPromiseArray, PromiseArray);

	    MappingPromiseArray.prototype._asyncInit = function () {
	        this._init$(undefined, -2);
	    };

	    MappingPromiseArray.prototype._init = function () {};

	    MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
	        var values = this._values;
	        var length = this.length();
	        var preservedValues = this._preservedValues;
	        var limit = this._limit;

	        if (index < 0) {
	            index = index * -1 - 1;
	            values[index] = value;
	            if (limit >= 1) {
	                this._inFlight--;
	                this._drainQueue();
	                if (this._isResolved()) return true;
	            }
	        } else {
	            if (limit >= 1 && this._inFlight >= limit) {
	                values[index] = value;
	                this._queue.push(index);
	                return false;
	            }
	            if (preservedValues !== null) preservedValues[index] = value;

	            var promise = this._promise;
	            var callback = this._callback;
	            var receiver = promise._boundValue();
	            promise._pushContext();
	            var ret = tryCatch(callback).call(receiver, value, index, length);
	            var promiseCreated = promise._popContext();
	            debug.checkForgottenReturns(ret, promiseCreated, preservedValues !== null ? "Promise.filter" : "Promise.map", promise);
	            if (ret === errorObj) {
	                this._reject(ret.e);
	                return true;
	            }

	            var maybePromise = tryConvertToPromise(ret, this._promise);
	            if (maybePromise instanceof Promise) {
	                maybePromise = maybePromise._target();
	                var bitField = maybePromise._bitField;
	                ;
	                if ((bitField & 50397184) === 0) {
	                    if (limit >= 1) this._inFlight++;
	                    values[index] = maybePromise;
	                    maybePromise._proxy(this, (index + 1) * -1);
	                    return false;
	                } else if ((bitField & 33554432) !== 0) {
	                    ret = maybePromise._value();
	                } else if ((bitField & 16777216) !== 0) {
	                    this._reject(maybePromise._reason());
	                    return true;
	                } else {
	                    this._cancel();
	                    return true;
	                }
	            }
	            values[index] = ret;
	        }
	        var totalResolved = ++this._totalResolved;
	        if (totalResolved >= length) {
	            if (preservedValues !== null) {
	                this._filter(values, preservedValues);
	            } else {
	                this._resolve(values);
	            }
	            return true;
	        }
	        return false;
	    };

	    MappingPromiseArray.prototype._drainQueue = function () {
	        var queue = this._queue;
	        var limit = this._limit;
	        var values = this._values;
	        while (queue.length > 0 && this._inFlight < limit) {
	            if (this._isResolved()) return;
	            var index = queue.pop();
	            this._promiseFulfilled(values[index], index);
	        }
	    };

	    MappingPromiseArray.prototype._filter = function (booleans, values) {
	        var len = values.length;
	        var ret = new Array(len);
	        var j = 0;
	        for (var i = 0; i < len; ++i) {
	            if (booleans[i]) ret[j++] = values[i];
	        }
	        ret.length = j;
	        this._resolve(ret);
	    };

	    MappingPromiseArray.prototype.preservedValues = function () {
	        return this._preservedValues;
	    };

	    function map(promises, fn, options, _filter) {
	        if (typeof fn !== "function") {
	            return apiRejection("expecting a function but got " + util.classString(fn));
	        }

	        var limit = 0;
	        if (options !== undefined) {
	            if ((typeof options === "undefined" ? "undefined" : _typeof(options)) === "object" && options !== null) {
	                if (typeof options.concurrency !== "number") {
	                    return Promise.reject(new TypeError("'concurrency' must be a number but it is " + util.classString(options.concurrency)));
	                }
	                limit = options.concurrency;
	            } else {
	                return Promise.reject(new TypeError("options argument must be an object but it is " + util.classString(options)));
	            }
	        }
	        limit = typeof limit === "number" && isFinite(limit) && limit >= 1 ? limit : 0;
	        return new MappingPromiseArray(promises, fn, limit, _filter).promise();
	    }

	    Promise.prototype.map = function (fn, options) {
	        return map(this, fn, options, null);
	    };

	    Promise.map = function (promises, fn, options, _filter) {
	        return map(promises, fn, options, _filter);
	    };
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var cr = Object.create;
	if (cr) {
	    var callerCache = cr(null);
	    var getterCache = cr(null);
	    callerCache[" size"] = getterCache[" size"] = 0;
	}

	module.exports = function (Promise) {
	    var util = __webpack_require__(15);
	    var canEvaluate = util.canEvaluate;
	    var isIdentifier = util.isIdentifier;

	    var getMethodCaller;
	    var getGetter;
	    if (true) {
	        var makeMethodCaller = function makeMethodCaller(methodName) {
	            return new Function("ensureMethod", "                                    \n\
	        return function(obj) {                                               \n\
	            'use strict'                                                     \n\
	            var len = this.length;                                           \n\
	            ensureMethod(obj, 'methodName');                                 \n\
	            switch(len) {                                                    \n\
	                case 1: return obj.methodName(this[0]);                      \n\
	                case 2: return obj.methodName(this[0], this[1]);             \n\
	                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
	                case 0: return obj.methodName();                             \n\
	                default:                                                     \n\
	                    return obj.methodName.apply(obj, this);                  \n\
	            }                                                                \n\
	        };                                                                   \n\
	        ".replace(/methodName/g, methodName))(ensureMethod);
	        };

	        var makeGetter = function makeGetter(propertyName) {
	            return new Function("obj", "                                             \n\
	        'use strict';                                                        \n\
	        return obj.propertyName;                                             \n\
	        ".replace("propertyName", propertyName));
	        };

	        var getCompiled = function getCompiled(name, compiler, cache) {
	            var ret = cache[name];
	            if (typeof ret !== "function") {
	                if (!isIdentifier(name)) {
	                    return null;
	                }
	                ret = compiler(name);
	                cache[name] = ret;
	                cache[" size"]++;
	                if (cache[" size"] > 512) {
	                    var keys = Object.keys(cache);
	                    for (var i = 0; i < 256; ++i) {
	                        delete cache[keys[i]];
	                    }cache[" size"] = keys.length - 256;
	                }
	            }
	            return ret;
	        };

	        getMethodCaller = function getMethodCaller(name) {
	            return getCompiled(name, makeMethodCaller, callerCache);
	        };

	        getGetter = function getGetter(name) {
	            return getCompiled(name, makeGetter, getterCache);
	        };
	    }

	    function ensureMethod(obj, methodName) {
	        var fn;
	        if (obj != null) fn = obj[methodName];
	        if (typeof fn !== "function") {
	            var message = "Object " + util.classString(obj) + " has no method '" + util.toString(methodName) + "'";
	            throw new Promise.TypeError(message);
	        }
	        return fn;
	    }

	    function caller(obj) {
	        var methodName = this.pop();
	        var fn = ensureMethod(obj, methodName);
	        return fn.apply(obj, this);
	    }
	    Promise.prototype.call = function (methodName) {
	        var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0));for (var $_i = 1; $_i < $_len; ++$_i) {
	            args[$_i - 1] = arguments[$_i];
	        };
	        if (true) {
	            if (canEvaluate) {
	                var maybeCaller = getMethodCaller(methodName);
	                if (maybeCaller !== null) {
	                    return this._then(maybeCaller, undefined, undefined, args, undefined);
	                }
	            }
	        }
	        args.push(methodName);
	        return this._then(caller, undefined, undefined, args, undefined);
	    };

	    function namedGetter(obj) {
	        return obj[this];
	    }
	    function indexedGetter(obj) {
	        var index = +this;
	        if (index < 0) index = Math.max(0, index + obj.length);
	        return obj[index];
	    }
	    Promise.prototype.get = function (propertyName) {
	        var isIndex = typeof propertyName === "number";
	        var getter;
	        if (!isIndex) {
	            if (canEvaluate) {
	                var maybeGetter = getGetter(propertyName);
	                getter = maybeGetter !== null ? maybeGetter : namedGetter;
	            } else {
	                getter = namedGetter;
	            }
	        } else {
	            getter = indexedGetter;
	        }
	        return this._then(getter, undefined, undefined, propertyName, undefined);
	    };
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug) {
	    var util = __webpack_require__(15);
	    var TypeError = __webpack_require__(22).TypeError;
	    var inherits = __webpack_require__(15).inherits;
	    var errorObj = util.errorObj;
	    var tryCatch = util.tryCatch;
	    var NULL = {};

	    function thrower(e) {
	        setTimeout(function () {
	            throw e;
	        }, 0);
	    }

	    function castPreservingDisposable(thenable) {
	        var maybePromise = tryConvertToPromise(thenable);
	        if (maybePromise !== thenable && typeof thenable._isDisposable === "function" && typeof thenable._getDisposer === "function" && thenable._isDisposable()) {
	            maybePromise._setDisposable(thenable._getDisposer());
	        }
	        return maybePromise;
	    }
	    function dispose(resources, inspection) {
	        var i = 0;
	        var len = resources.length;
	        var ret = new Promise(INTERNAL);
	        function iterator() {
	            if (i >= len) return ret._fulfill();
	            var maybePromise = castPreservingDisposable(resources[i++]);
	            if (maybePromise instanceof Promise && maybePromise._isDisposable()) {
	                try {
	                    maybePromise = tryConvertToPromise(maybePromise._getDisposer().tryDispose(inspection), resources.promise);
	                } catch (e) {
	                    return thrower(e);
	                }
	                if (maybePromise instanceof Promise) {
	                    return maybePromise._then(iterator, thrower, null, null, null);
	                }
	            }
	            iterator();
	        }
	        iterator();
	        return ret;
	    }

	    function Disposer(data, promise, context) {
	        this._data = data;
	        this._promise = promise;
	        this._context = context;
	    }

	    Disposer.prototype.data = function () {
	        return this._data;
	    };

	    Disposer.prototype.promise = function () {
	        return this._promise;
	    };

	    Disposer.prototype.resource = function () {
	        if (this.promise().isFulfilled()) {
	            return this.promise().value();
	        }
	        return NULL;
	    };

	    Disposer.prototype.tryDispose = function (inspection) {
	        var resource = this.resource();
	        var context = this._context;
	        if (context !== undefined) context._pushContext();
	        var ret = resource !== NULL ? this.doDispose(resource, inspection) : null;
	        if (context !== undefined) context._popContext();
	        this._promise._unsetDisposable();
	        this._data = null;
	        return ret;
	    };

	    Disposer.isDisposer = function (d) {
	        return d != null && typeof d.resource === "function" && typeof d.tryDispose === "function";
	    };

	    function FunctionDisposer(fn, promise, context) {
	        this.constructor$(fn, promise, context);
	    }
	    inherits(FunctionDisposer, Disposer);

	    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
	        var fn = this.data();
	        return fn.call(resource, resource, inspection);
	    };

	    function maybeUnwrapDisposer(value) {
	        if (Disposer.isDisposer(value)) {
	            this.resources[this.index]._setDisposable(value);
	            return value.promise();
	        }
	        return value;
	    }

	    function ResourceList(length) {
	        this.length = length;
	        this.promise = null;
	        this[length - 1] = null;
	    }

	    ResourceList.prototype._resultCancelled = function () {
	        var len = this.length;
	        for (var i = 0; i < len; ++i) {
	            var item = this[i];
	            if (item instanceof Promise) {
	                item.cancel();
	            }
	        }
	    };

	    Promise.using = function () {
	        var len = arguments.length;
	        if (len < 2) return apiRejection("you must pass at least 2 arguments to Promise.using");
	        var fn = arguments[len - 1];
	        if (typeof fn !== "function") {
	            return apiRejection("expecting a function but got " + util.classString(fn));
	        }
	        var input;
	        var spreadArgs = true;
	        if (len === 2 && Array.isArray(arguments[0])) {
	            input = arguments[0];
	            len = input.length;
	            spreadArgs = false;
	        } else {
	            input = arguments;
	            len--;
	        }
	        var resources = new ResourceList(len);
	        for (var i = 0; i < len; ++i) {
	            var resource = input[i];
	            if (Disposer.isDisposer(resource)) {
	                var disposer = resource;
	                resource = resource.promise();
	                resource._setDisposable(disposer);
	            } else {
	                var maybePromise = tryConvertToPromise(resource);
	                if (maybePromise instanceof Promise) {
	                    resource = maybePromise._then(maybeUnwrapDisposer, null, null, {
	                        resources: resources,
	                        index: i
	                    }, undefined);
	                }
	            }
	            resources[i] = resource;
	        }

	        var reflectedResources = new Array(resources.length);
	        for (var i = 0; i < reflectedResources.length; ++i) {
	            reflectedResources[i] = Promise.resolve(resources[i]).reflect();
	        }

	        var resultPromise = Promise.all(reflectedResources).then(function (inspections) {
	            for (var i = 0; i < inspections.length; ++i) {
	                var inspection = inspections[i];
	                if (inspection.isRejected()) {
	                    errorObj.e = inspection.error();
	                    return errorObj;
	                } else if (!inspection.isFulfilled()) {
	                    resultPromise.cancel();
	                    return;
	                }
	                inspections[i] = inspection.value();
	            }
	            promise._pushContext();

	            fn = tryCatch(fn);
	            var ret = spreadArgs ? fn.apply(undefined, inspections) : fn(inspections);
	            var promiseCreated = promise._popContext();
	            debug.checkForgottenReturns(ret, promiseCreated, "Promise.using", promise);
	            return ret;
	        });

	        var promise = resultPromise.lastly(function () {
	            var inspection = new Promise.PromiseInspection(resultPromise);
	            return dispose(resources, inspection);
	        });
	        resources.promise = promise;
	        promise._setOnCancel(resources);
	        return promise;
	    };

	    Promise.prototype._setDisposable = function (disposer) {
	        this._bitField = this._bitField | 131072;
	        this._disposer = disposer;
	    };

	    Promise.prototype._isDisposable = function () {
	        return (this._bitField & 131072) > 0;
	    };

	    Promise.prototype._getDisposer = function () {
	        return this._disposer;
	    };

	    Promise.prototype._unsetDisposable = function () {
	        this._bitField = this._bitField & ~131072;
	        this._disposer = undefined;
	    };

	    Promise.prototype.disposer = function (fn) {
	        if (typeof fn === "function") {
	            return new FunctionDisposer(fn, this, createContext());
	        }
	        throw new TypeError();
	    };
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, INTERNAL, debug) {
	    var util = __webpack_require__(15);
	    var TimeoutError = Promise.TimeoutError;

	    function HandleWrapper(handle) {
	        this.handle = handle;
	    }

	    HandleWrapper.prototype._resultCancelled = function () {
	        clearTimeout(this.handle);
	    };

	    var afterValue = function afterValue(value) {
	        return delay(+this).thenReturn(value);
	    };
	    var delay = Promise.delay = function (ms, value) {
	        var ret;
	        var handle;
	        if (value !== undefined) {
	            ret = Promise.resolve(value)._then(afterValue, null, null, ms, undefined);
	            if (debug.cancellation() && value instanceof Promise) {
	                ret._setOnCancel(value);
	            }
	        } else {
	            ret = new Promise(INTERNAL);
	            handle = setTimeout(function () {
	                ret._fulfill();
	            }, +ms);
	            if (debug.cancellation()) {
	                ret._setOnCancel(new HandleWrapper(handle));
	            }
	            ret._captureStackTrace();
	        }
	        ret._setAsyncGuaranteed();
	        return ret;
	    };

	    Promise.prototype.delay = function (ms) {
	        return delay(ms, this);
	    };

	    var afterTimeout = function afterTimeout(promise, message, parent) {
	        var err;
	        if (typeof message !== "string") {
	            if (message instanceof Error) {
	                err = message;
	            } else {
	                err = new TimeoutError("operation timed out");
	            }
	        } else {
	            err = new TimeoutError(message);
	        }
	        util.markAsOriginatingFromRejection(err);
	        promise._attachExtraTrace(err);
	        promise._reject(err);

	        if (parent != null) {
	            parent.cancel();
	        }
	    };

	    function successClear(value) {
	        clearTimeout(this.handle);
	        return value;
	    }

	    function failureClear(reason) {
	        clearTimeout(this.handle);
	        throw reason;
	    }

	    Promise.prototype.timeout = function (ms, message) {
	        ms = +ms;
	        var ret, parent;

	        var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
	            if (ret.isPending()) {
	                afterTimeout(ret, message, parent);
	            }
	        }, ms));

	        if (debug.cancellation()) {
	            parent = this.then();
	            ret = parent._then(successClear, failureClear, undefined, handleWrapper, undefined);
	            ret._setOnCancel(handleWrapper);
	        } else {
	            ret = this._then(successClear, failureClear, undefined, handleWrapper, undefined);
	        }

	        return ret;
	    };
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug) {
	    var errors = __webpack_require__(22);
	    var TypeError = errors.TypeError;
	    var util = __webpack_require__(15);
	    var errorObj = util.errorObj;
	    var tryCatch = util.tryCatch;
	    var yieldHandlers = [];

	    function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
	        for (var i = 0; i < yieldHandlers.length; ++i) {
	            traceParent._pushContext();
	            var result = tryCatch(yieldHandlers[i])(value);
	            traceParent._popContext();
	            if (result === errorObj) {
	                traceParent._pushContext();
	                var ret = Promise.reject(errorObj.e);
	                traceParent._popContext();
	                return ret;
	            }
	            var maybePromise = tryConvertToPromise(result, traceParent);
	            if (maybePromise instanceof Promise) return maybePromise;
	        }
	        return null;
	    }

	    function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
	        if (debug.cancellation()) {
	            var internal = new Promise(INTERNAL);
	            var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
	            this._promise = internal.lastly(function () {
	                return _finallyPromise;
	            });
	            internal._captureStackTrace();
	            internal._setOnCancel(this);
	        } else {
	            var promise = this._promise = new Promise(INTERNAL);
	            promise._captureStackTrace();
	        }
	        this._stack = stack;
	        this._generatorFunction = generatorFunction;
	        this._receiver = receiver;
	        this._generator = undefined;
	        this._yieldHandlers = typeof yieldHandler === "function" ? [yieldHandler].concat(yieldHandlers) : yieldHandlers;
	        this._yieldedPromise = null;
	        this._cancellationPhase = false;
	    }
	    util.inherits(PromiseSpawn, Proxyable);

	    PromiseSpawn.prototype._isResolved = function () {
	        return this._promise === null;
	    };

	    PromiseSpawn.prototype._cleanup = function () {
	        this._promise = this._generator = null;
	        if (debug.cancellation() && this._finallyPromise !== null) {
	            this._finallyPromise._fulfill();
	            this._finallyPromise = null;
	        }
	    };

	    PromiseSpawn.prototype._promiseCancelled = function () {
	        if (this._isResolved()) return;
	        var implementsReturn = typeof this._generator["return"] !== "undefined";

	        var result;
	        if (!implementsReturn) {
	            var reason = new Promise.CancellationError("generator .return() sentinel");
	            Promise.coroutine.returnSentinel = reason;
	            this._promise._attachExtraTrace(reason);
	            this._promise._pushContext();
	            result = tryCatch(this._generator["throw"]).call(this._generator, reason);
	            this._promise._popContext();
	        } else {
	            this._promise._pushContext();
	            result = tryCatch(this._generator["return"]).call(this._generator, undefined);
	            this._promise._popContext();
	        }
	        this._cancellationPhase = true;
	        this._yieldedPromise = null;
	        this._continue(result);
	    };

	    PromiseSpawn.prototype._promiseFulfilled = function (value) {
	        this._yieldedPromise = null;
	        this._promise._pushContext();
	        var result = tryCatch(this._generator.next).call(this._generator, value);
	        this._promise._popContext();
	        this._continue(result);
	    };

	    PromiseSpawn.prototype._promiseRejected = function (reason) {
	        this._yieldedPromise = null;
	        this._promise._attachExtraTrace(reason);
	        this._promise._pushContext();
	        var result = tryCatch(this._generator["throw"]).call(this._generator, reason);
	        this._promise._popContext();
	        this._continue(result);
	    };

	    PromiseSpawn.prototype._resultCancelled = function () {
	        if (this._yieldedPromise instanceof Promise) {
	            var promise = this._yieldedPromise;
	            this._yieldedPromise = null;
	            promise.cancel();
	        }
	    };

	    PromiseSpawn.prototype.promise = function () {
	        return this._promise;
	    };

	    PromiseSpawn.prototype._run = function () {
	        this._generator = this._generatorFunction.call(this._receiver);
	        this._receiver = this._generatorFunction = undefined;
	        this._promiseFulfilled(undefined);
	    };

	    PromiseSpawn.prototype._continue = function (result) {
	        var promise = this._promise;
	        if (result === errorObj) {
	            this._cleanup();
	            if (this._cancellationPhase) {
	                return promise.cancel();
	            } else {
	                return promise._rejectCallback(result.e, false);
	            }
	        }

	        var value = result.value;
	        if (result.done === true) {
	            this._cleanup();
	            if (this._cancellationPhase) {
	                return promise.cancel();
	            } else {
	                return promise._resolveCallback(value);
	            }
	        } else {
	            var maybePromise = tryConvertToPromise(value, this._promise);
	            if (!(maybePromise instanceof Promise)) {
	                maybePromise = promiseFromYieldHandler(maybePromise, this._yieldHandlers, this._promise);
	                if (maybePromise === null) {
	                    this._promiseRejected(new TypeError("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", String(value)) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")));
	                    return;
	                }
	            }
	            maybePromise = maybePromise._target();
	            var bitField = maybePromise._bitField;
	            ;
	            if ((bitField & 50397184) === 0) {
	                this._yieldedPromise = maybePromise;
	                maybePromise._proxy(this, null);
	            } else if ((bitField & 33554432) !== 0) {
	                Promise._async.invoke(this._promiseFulfilled, this, maybePromise._value());
	            } else if ((bitField & 16777216) !== 0) {
	                Promise._async.invoke(this._promiseRejected, this, maybePromise._reason());
	            } else {
	                this._promiseCancelled();
	            }
	        }
	    };

	    Promise.coroutine = function (generatorFunction, options) {
	        if (typeof generatorFunction !== "function") {
	            throw new TypeError("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
	        }
	        var yieldHandler = Object(options).yieldHandler;
	        var PromiseSpawn$ = PromiseSpawn;
	        var stack = new Error().stack;
	        return function () {
	            var generator = generatorFunction.apply(this, arguments);
	            var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler, stack);
	            var ret = spawn.promise();
	            spawn._generator = generator;
	            spawn._promiseFulfilled(undefined);
	            return ret;
	        };
	    };

	    Promise.coroutine.addYieldHandler = function (fn) {
	        if (typeof fn !== "function") {
	            throw new TypeError("expecting a function but got " + util.classString(fn));
	        }
	        yieldHandlers.push(fn);
	    };

	    Promise.spawn = function (generatorFunction) {
	        debug.deprecated("Promise.spawn()", "Promise.coroutine()");
	        if (typeof generatorFunction !== "function") {
	            return apiRejection("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
	        }
	        var spawn = new PromiseSpawn(generatorFunction, this);
	        var ret = spawn.promise();
	        spawn._run(Promise.spawn);
	        return ret;
	    };
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise) {
	    var util = __webpack_require__(15);
	    var async = Promise._async;
	    var tryCatch = util.tryCatch;
	    var errorObj = util.errorObj;

	    function spreadAdapter(val, nodeback) {
	        var promise = this;
	        if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
	        var ret = tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
	        if (ret === errorObj) {
	            async.throwLater(ret.e);
	        }
	    }

	    function successAdapter(val, nodeback) {
	        var promise = this;
	        var receiver = promise._boundValue();
	        var ret = val === undefined ? tryCatch(nodeback).call(receiver, null) : tryCatch(nodeback).call(receiver, null, val);
	        if (ret === errorObj) {
	            async.throwLater(ret.e);
	        }
	    }
	    function errorAdapter(reason, nodeback) {
	        var promise = this;
	        if (!reason) {
	            var newReason = new Error(reason + "");
	            newReason.cause = reason;
	            reason = newReason;
	        }
	        var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
	        if (ret === errorObj) {
	            async.throwLater(ret.e);
	        }
	    }

	    Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback, options) {
	        if (typeof nodeback == "function") {
	            var adapter = successAdapter;
	            if (options !== undefined && Object(options).spread) {
	                adapter = spreadAdapter;
	            }
	            this._then(adapter, errorAdapter, undefined, this, nodeback);
	        }
	        return this;
	    };
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	module.exports = function (Promise, INTERNAL) {
	    var THIS = {};
	    var util = __webpack_require__(15);
	    var nodebackForPromise = __webpack_require__(29);
	    var withAppended = util.withAppended;
	    var maybeWrapAsError = util.maybeWrapAsError;
	    var canEvaluate = util.canEvaluate;
	    var TypeError = __webpack_require__(22).TypeError;
	    var defaultSuffix = "Async";
	    var defaultPromisified = { __isPromisified__: true };
	    var noCopyProps = ["arity", "length", "name", "arguments", "caller", "callee", "prototype", "__isPromisified__"];
	    var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

	    var defaultFilter = function defaultFilter(name) {
	        return util.isIdentifier(name) && name.charAt(0) !== "_" && name !== "constructor";
	    };

	    function propsFilter(key) {
	        return !noCopyPropsPattern.test(key);
	    }

	    function isPromisified(fn) {
	        try {
	            return fn.__isPromisified__ === true;
	        } catch (e) {
	            return false;
	        }
	    }

	    function hasPromisified(obj, key, suffix) {
	        var val = util.getDataPropertyOrDefault(obj, key + suffix, defaultPromisified);
	        return val ? isPromisified(val) : false;
	    }
	    function checkValid(ret, suffix, suffixRegexp) {
	        for (var i = 0; i < ret.length; i += 2) {
	            var key = ret[i];
	            if (suffixRegexp.test(key)) {
	                var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
	                for (var j = 0; j < ret.length; j += 2) {
	                    if (ret[j] === keyWithoutAsyncSuffix) {
	                        throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", suffix));
	                    }
	                }
	            }
	        }
	    }

	    function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
	        var keys = util.inheritedDataKeys(obj);
	        var ret = [];
	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            var value = obj[key];
	            var passesDefaultFilter = filter === defaultFilter ? true : defaultFilter(key, value, obj);
	            if (typeof value === "function" && !isPromisified(value) && !hasPromisified(obj, key, suffix) && filter(key, value, obj, passesDefaultFilter)) {
	                ret.push(key, value);
	            }
	        }
	        checkValid(ret, suffix, suffixRegexp);
	        return ret;
	    }

	    var escapeIdentRegex = function escapeIdentRegex(str) {
	        return str.replace(/([$])/, "\\$");
	    };

	    var makeNodePromisifiedEval;
	    if (true) {
	        var switchCaseArgumentOrder = function switchCaseArgumentOrder(likelyArgumentCount) {
	            var ret = [likelyArgumentCount];
	            var min = Math.max(0, likelyArgumentCount - 1 - 3);
	            for (var i = likelyArgumentCount - 1; i >= min; --i) {
	                ret.push(i);
	            }
	            for (var i = likelyArgumentCount + 1; i <= 3; ++i) {
	                ret.push(i);
	            }
	            return ret;
	        };

	        var argumentSequence = function argumentSequence(argumentCount) {
	            return util.filledRange(argumentCount, "_arg", "");
	        };

	        var parameterDeclaration = function parameterDeclaration(parameterCount) {
	            return util.filledRange(Math.max(parameterCount, 3), "_arg", "");
	        };

	        var parameterCount = function parameterCount(fn) {
	            if (typeof fn.length === "number") {
	                return Math.max(Math.min(fn.length, 1023 + 1), 0);
	            }
	            return 0;
	        };

	        makeNodePromisifiedEval = function makeNodePromisifiedEval(callback, receiver, originalName, fn, _, multiArgs) {
	            var newParameterCount = Math.max(0, parameterCount(fn) - 1);
	            var argumentOrder = switchCaseArgumentOrder(newParameterCount);
	            var shouldProxyThis = typeof callback === "string" || receiver === THIS;

	            function generateCallForArgumentCount(count) {
	                var args = argumentSequence(count).join(", ");
	                var comma = count > 0 ? ", " : "";
	                var ret;
	                if (shouldProxyThis) {
	                    ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
	                } else {
	                    ret = receiver === undefined ? "ret = callback({{args}}, nodeback); break;\n" : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
	                }
	                return ret.replace("{{args}}", args).replace(", ", comma);
	            }

	            function generateArgumentSwitchCase() {
	                var ret = "";
	                for (var i = 0; i < argumentOrder.length; ++i) {
	                    ret += "case " + argumentOrder[i] + ":" + generateCallForArgumentCount(argumentOrder[i]);
	                }

	                ret += "                                                             \n\
	        default:                                                             \n\
	            var args = new Array(len + 1);                                   \n\
	            var i = 0;                                                       \n\
	            for (var i = 0; i < len; ++i) {                                  \n\
	               args[i] = arguments[i];                                       \n\
	            }                                                                \n\
	            args[i] = nodeback;                                              \n\
	            [CodeForCall]                                                    \n\
	            break;                                                           \n\
	        ".replace("[CodeForCall]", shouldProxyThis ? "ret = callback.apply(this, args);\n" : "ret = callback.apply(receiver, args);\n");
	                return ret;
	            }

	            var getFunctionCode = typeof callback === "string" ? "this != null ? this['" + callback + "'] : fn" : "fn";
	            var body = "'use strict';                                                \n\
	        var ret = function (Parameters) {                                    \n\
	            'use strict';                                                    \n\
	            var len = arguments.length;                                      \n\
	            var promise = new Promise(INTERNAL);                             \n\
	            promise._captureStackTrace();                                    \n\
	            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n\
	            var ret;                                                         \n\
	            var callback = tryCatch([GetFunctionCode]);                      \n\
	            switch(len) {                                                    \n\
	                [CodeForSwitchCase]                                          \n\
	            }                                                                \n\
	            if (ret === errorObj) {                                          \n\
	                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
	            }                                                                \n\
	            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
	            return promise;                                                  \n\
	        };                                                                   \n\
	        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
	        return ret;                                                          \n\
	    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase()).replace("[GetFunctionCode]", getFunctionCode);
	            body = body.replace("Parameters", parameterDeclaration(newParameterCount));
	            return new Function("Promise", "fn", "receiver", "withAppended", "maybeWrapAsError", "nodebackForPromise", "tryCatch", "errorObj", "notEnumerableProp", "INTERNAL", body)(Promise, fn, receiver, withAppended, maybeWrapAsError, nodebackForPromise, util.tryCatch, util.errorObj, util.notEnumerableProp, INTERNAL);
	        };
	    }

	    function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
	        var defaultThis = function () {
	            return this;
	        }();
	        var method = callback;
	        if (typeof method === "string") {
	            callback = fn;
	        }
	        function promisified() {
	            var _receiver = receiver;
	            if (receiver === THIS) _receiver = this;
	            var promise = new Promise(INTERNAL);
	            promise._captureStackTrace();
	            var cb = typeof method === "string" && this !== defaultThis ? this[method] : callback;
	            var fn = nodebackForPromise(promise, multiArgs);
	            try {
	                cb.apply(_receiver, withAppended(arguments, fn));
	            } catch (e) {
	                promise._rejectCallback(maybeWrapAsError(e), true, true);
	            }
	            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
	            return promise;
	        }
	        util.notEnumerableProp(promisified, "__isPromisified__", true);
	        return promisified;
	    }

	    var makeNodePromisified = canEvaluate ? makeNodePromisifiedEval : makeNodePromisifiedClosure;

	    function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
	        var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
	        var methods = promisifiableMethods(obj, suffix, suffixRegexp, filter);

	        for (var i = 0, len = methods.length; i < len; i += 2) {
	            var key = methods[i];
	            var fn = methods[i + 1];
	            var promisifiedKey = key + suffix;
	            if (promisifier === makeNodePromisified) {
	                obj[promisifiedKey] = makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
	            } else {
	                var promisified = promisifier(fn, function () {
	                    return makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
	                });
	                util.notEnumerableProp(promisified, "__isPromisified__", true);
	                obj[promisifiedKey] = promisified;
	            }
	        }
	        util.toFastProperties(obj);
	        return obj;
	    }

	    function promisify(callback, receiver, multiArgs) {
	        return makeNodePromisified(callback, receiver, undefined, callback, null, multiArgs);
	    }

	    Promise.promisify = function (fn, options) {
	        if (typeof fn !== "function") {
	            throw new TypeError("expecting a function but got " + util.classString(fn));
	        }
	        if (isPromisified(fn)) {
	            return fn;
	        }
	        options = Object(options);
	        var receiver = options.context === undefined ? THIS : options.context;
	        var multiArgs = !!options.multiArgs;
	        var ret = promisify(fn, receiver, multiArgs);
	        util.copyDescriptors(fn, ret, propsFilter);
	        return ret;
	    };

	    Promise.promisifyAll = function (target, options) {
	        if (typeof target !== "function" && (typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object") {
	            throw new TypeError("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
	        }
	        options = Object(options);
	        var multiArgs = !!options.multiArgs;
	        var suffix = options.suffix;
	        if (typeof suffix !== "string") suffix = defaultSuffix;
	        var filter = options.filter;
	        if (typeof filter !== "function") filter = defaultFilter;
	        var promisifier = options.promisifier;
	        if (typeof promisifier !== "function") promisifier = makeNodePromisified;

	        if (!util.isIdentifier(suffix)) {
	            throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");
	        }

	        var keys = util.inheritedDataKeys(target);
	        for (var i = 0; i < keys.length; ++i) {
	            var value = target[keys[i]];
	            if (keys[i] !== "constructor" && util.isClass(value)) {
	                promisifyAll(value.prototype, suffix, filter, promisifier, multiArgs);
	                promisifyAll(value, suffix, filter, promisifier, multiArgs);
	            }
	        }

	        return promisifyAll(target, suffix, filter, promisifier, multiArgs);
	    };
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, PromiseArray, tryConvertToPromise, apiRejection) {
	    var util = __webpack_require__(15);
	    var isObject = util.isObject;
	    var es5 = __webpack_require__(16);
	    var Es6Map;
	    if (typeof Map === "function") Es6Map = Map;

	    var mapToEntries = function () {
	        var index = 0;
	        var size = 0;

	        function extractEntry(value, key) {
	            this[index] = value;
	            this[index + size] = key;
	            index++;
	        }

	        return function mapToEntries(map) {
	            size = map.size;
	            index = 0;
	            var ret = new Array(map.size * 2);
	            map.forEach(extractEntry, ret);
	            return ret;
	        };
	    }();

	    var entriesToMap = function entriesToMap(entries) {
	        var ret = new Es6Map();
	        var length = entries.length / 2 | 0;
	        for (var i = 0; i < length; ++i) {
	            var key = entries[length + i];
	            var value = entries[i];
	            ret.set(key, value);
	        }
	        return ret;
	    };

	    function PropertiesPromiseArray(obj) {
	        var isMap = false;
	        var entries;
	        if (Es6Map !== undefined && obj instanceof Es6Map) {
	            entries = mapToEntries(obj);
	            isMap = true;
	        } else {
	            var keys = es5.keys(obj);
	            var len = keys.length;
	            entries = new Array(len * 2);
	            for (var i = 0; i < len; ++i) {
	                var key = keys[i];
	                entries[i] = obj[key];
	                entries[i + len] = key;
	            }
	        }
	        this.constructor$(entries);
	        this._isMap = isMap;
	        this._init$(undefined, isMap ? -6 : -3);
	    }
	    util.inherits(PropertiesPromiseArray, PromiseArray);

	    PropertiesPromiseArray.prototype._init = function () {};

	    PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
	        this._values[index] = value;
	        var totalResolved = ++this._totalResolved;
	        if (totalResolved >= this._length) {
	            var val;
	            if (this._isMap) {
	                val = entriesToMap(this._values);
	            } else {
	                val = {};
	                var keyOffset = this.length();
	                for (var i = 0, len = this.length(); i < len; ++i) {
	                    val[this._values[i + keyOffset]] = this._values[i];
	                }
	            }
	            this._resolve(val);
	            return true;
	        }
	        return false;
	    };

	    PropertiesPromiseArray.prototype.shouldCopyValues = function () {
	        return false;
	    };

	    PropertiesPromiseArray.prototype.getActualLength = function (len) {
	        return len >> 1;
	    };

	    function props(promises) {
	        var ret;
	        var castValue = tryConvertToPromise(promises);

	        if (!isObject(castValue)) {
	            return apiRejection("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
	        } else if (castValue instanceof Promise) {
	            ret = castValue._then(Promise.props, undefined, undefined, undefined, undefined);
	        } else {
	            ret = new PropertiesPromiseArray(castValue).promise();
	        }

	        if (castValue instanceof Promise) {
	            ret._propagateFrom(castValue, 2);
	        }
	        return ret;
	    }

	    Promise.prototype.props = function () {
	        return props(this);
	    };

	    Promise.props = function (promises) {
	        return props(promises);
	    };
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, INTERNAL, tryConvertToPromise, apiRejection) {
	    var util = __webpack_require__(15);

	    var raceLater = function raceLater(promise) {
	        return promise.then(function (array) {
	            return race(array, promise);
	        });
	    };

	    function race(promises, parent) {
	        var maybePromise = tryConvertToPromise(promises);

	        if (maybePromise instanceof Promise) {
	            return raceLater(maybePromise);
	        } else {
	            promises = util.asArray(promises);
	            if (promises === null) return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
	        }

	        var ret = new Promise(INTERNAL);
	        if (parent !== undefined) {
	            ret._propagateFrom(parent, 3);
	        }
	        var fulfill = ret._fulfill;
	        var reject = ret._reject;
	        for (var i = 0, len = promises.length; i < len; ++i) {
	            var val = promises[i];

	            if (val === undefined && !(i in promises)) {
	                continue;
	            }

	            Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
	        }
	        return ret;
	    }

	    Promise.race = function (promises) {
	        return race(promises, undefined);
	    };

	    Promise.prototype.race = function () {
	        return race(this, undefined);
	    };
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
	    var getDomain = Promise._getDomain;
	    var util = __webpack_require__(15);
	    var tryCatch = util.tryCatch;

	    function ReductionPromiseArray(promises, fn, initialValue, _each) {
	        this.constructor$(promises);
	        var domain = getDomain();
	        this._fn = domain === null ? fn : util.domainBind(domain, fn);
	        if (initialValue !== undefined) {
	            initialValue = Promise.resolve(initialValue);
	            initialValue._attachCancellationCallback(this);
	        }
	        this._initialValue = initialValue;
	        this._currentCancellable = null;
	        if (_each === INTERNAL) {
	            this._eachValues = Array(this._length);
	        } else if (_each === 0) {
	            this._eachValues = null;
	        } else {
	            this._eachValues = undefined;
	        }
	        this._promise._captureStackTrace();
	        this._init$(undefined, -5);
	    }
	    util.inherits(ReductionPromiseArray, PromiseArray);

	    ReductionPromiseArray.prototype._gotAccum = function (accum) {
	        if (this._eachValues !== undefined && this._eachValues !== null && accum !== INTERNAL) {
	            this._eachValues.push(accum);
	        }
	    };

	    ReductionPromiseArray.prototype._eachComplete = function (value) {
	        if (this._eachValues !== null) {
	            this._eachValues.push(value);
	        }
	        return this._eachValues;
	    };

	    ReductionPromiseArray.prototype._init = function () {};

	    ReductionPromiseArray.prototype._resolveEmptyArray = function () {
	        this._resolve(this._eachValues !== undefined ? this._eachValues : this._initialValue);
	    };

	    ReductionPromiseArray.prototype.shouldCopyValues = function () {
	        return false;
	    };

	    ReductionPromiseArray.prototype._resolve = function (value) {
	        this._promise._resolveCallback(value);
	        this._values = null;
	    };

	    ReductionPromiseArray.prototype._resultCancelled = function (sender) {
	        if (sender === this._initialValue) return this._cancel();
	        if (this._isResolved()) return;
	        this._resultCancelled$();
	        if (this._currentCancellable instanceof Promise) {
	            this._currentCancellable.cancel();
	        }
	        if (this._initialValue instanceof Promise) {
	            this._initialValue.cancel();
	        }
	    };

	    ReductionPromiseArray.prototype._iterate = function (values) {
	        this._values = values;
	        var value;
	        var i;
	        var length = values.length;
	        if (this._initialValue !== undefined) {
	            value = this._initialValue;
	            i = 0;
	        } else {
	            value = Promise.resolve(values[0]);
	            i = 1;
	        }

	        this._currentCancellable = value;

	        if (!value.isRejected()) {
	            for (; i < length; ++i) {
	                var ctx = {
	                    accum: null,
	                    value: values[i],
	                    index: i,
	                    length: length,
	                    array: this
	                };
	                value = value._then(gotAccum, undefined, undefined, ctx, undefined);
	            }
	        }

	        if (this._eachValues !== undefined) {
	            value = value._then(this._eachComplete, undefined, undefined, this, undefined);
	        }
	        value._then(completed, completed, undefined, value, this);
	    };

	    Promise.prototype.reduce = function (fn, initialValue) {
	        return reduce(this, fn, initialValue, null);
	    };

	    Promise.reduce = function (promises, fn, initialValue, _each) {
	        return reduce(promises, fn, initialValue, _each);
	    };

	    function completed(valueOrReason, array) {
	        if (this.isFulfilled()) {
	            array._resolve(valueOrReason);
	        } else {
	            array._reject(valueOrReason);
	        }
	    }

	    function reduce(promises, fn, initialValue, _each) {
	        if (typeof fn !== "function") {
	            return apiRejection("expecting a function but got " + util.classString(fn));
	        }
	        var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
	        return array.promise();
	    }

	    function gotAccum(accum) {
	        this.accum = accum;
	        this.array._gotAccum(accum);
	        var value = tryConvertToPromise(this.value, this.array._promise);
	        if (value instanceof Promise) {
	            this.array._currentCancellable = value;
	            return value._then(gotValue, undefined, undefined, this, undefined);
	        } else {
	            return gotValue.call(this, value);
	        }
	    }

	    function gotValue(value) {
	        var array = this.array;
	        var promise = array._promise;
	        var fn = tryCatch(array._fn);
	        promise._pushContext();
	        var ret;
	        if (array._eachValues !== undefined) {
	            ret = fn.call(promise._boundValue(), value, this.index, this.length);
	        } else {
	            ret = fn.call(promise._boundValue(), this.accum, value, this.index, this.length);
	        }
	        if (ret instanceof Promise) {
	            array._currentCancellable = ret;
	        }
	        var promiseCreated = promise._popContext();
	        debug.checkForgottenReturns(ret, promiseCreated, array._eachValues !== undefined ? "Promise.each" : "Promise.reduce", promise);
	        return ret;
	    }
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, PromiseArray, debug) {
	    var PromiseInspection = Promise.PromiseInspection;
	    var util = __webpack_require__(15);

	    function SettledPromiseArray(values) {
	        this.constructor$(values);
	    }
	    util.inherits(SettledPromiseArray, PromiseArray);

	    SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
	        this._values[index] = inspection;
	        var totalResolved = ++this._totalResolved;
	        if (totalResolved >= this._length) {
	            this._resolve(this._values);
	            return true;
	        }
	        return false;
	    };

	    SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
	        var ret = new PromiseInspection();
	        ret._bitField = 33554432;
	        ret._settledValueField = value;
	        return this._promiseResolved(index, ret);
	    };
	    SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
	        var ret = new PromiseInspection();
	        ret._bitField = 16777216;
	        ret._settledValueField = reason;
	        return this._promiseResolved(index, ret);
	    };

	    Promise.settle = function (promises) {
	        debug.deprecated(".settle()", ".reflect()");
	        return new SettledPromiseArray(promises).promise();
	    };

	    Promise.prototype.settle = function () {
	        return Promise.settle(this);
	    };
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (Promise, PromiseArray, apiRejection) {
	    var util = __webpack_require__(15);
	    var RangeError = __webpack_require__(22).RangeError;
	    var AggregateError = __webpack_require__(22).AggregateError;
	    var isArray = util.isArray;
	    var CANCELLATION = {};

	    function SomePromiseArray(values) {
	        this.constructor$(values);
	        this._howMany = 0;
	        this._unwrap = false;
	        this._initialized = false;
	    }
	    util.inherits(SomePromiseArray, PromiseArray);

	    SomePromiseArray.prototype._init = function () {
	        if (!this._initialized) {
	            return;
	        }
	        if (this._howMany === 0) {
	            this._resolve([]);
	            return;
	        }
	        this._init$(undefined, -5);
	        var isArrayResolved = isArray(this._values);
	        if (!this._isResolved() && isArrayResolved && this._howMany > this._canPossiblyFulfill()) {
	            this._reject(this._getRangeError(this.length()));
	        }
	    };

	    SomePromiseArray.prototype.init = function () {
	        this._initialized = true;
	        this._init();
	    };

	    SomePromiseArray.prototype.setUnwrap = function () {
	        this._unwrap = true;
	    };

	    SomePromiseArray.prototype.howMany = function () {
	        return this._howMany;
	    };

	    SomePromiseArray.prototype.setHowMany = function (count) {
	        this._howMany = count;
	    };

	    SomePromiseArray.prototype._promiseFulfilled = function (value) {
	        this._addFulfilled(value);
	        if (this._fulfilled() === this.howMany()) {
	            this._values.length = this.howMany();
	            if (this.howMany() === 1 && this._unwrap) {
	                this._resolve(this._values[0]);
	            } else {
	                this._resolve(this._values);
	            }
	            return true;
	        }
	        return false;
	    };
	    SomePromiseArray.prototype._promiseRejected = function (reason) {
	        this._addRejected(reason);
	        return this._checkOutcome();
	    };

	    SomePromiseArray.prototype._promiseCancelled = function () {
	        if (this._values instanceof Promise || this._values == null) {
	            return this._cancel();
	        }
	        this._addRejected(CANCELLATION);
	        return this._checkOutcome();
	    };

	    SomePromiseArray.prototype._checkOutcome = function () {
	        if (this.howMany() > this._canPossiblyFulfill()) {
	            var e = new AggregateError();
	            for (var i = this.length(); i < this._values.length; ++i) {
	                if (this._values[i] !== CANCELLATION) {
	                    e.push(this._values[i]);
	                }
	            }
	            if (e.length > 0) {
	                this._reject(e);
	            } else {
	                this._cancel();
	            }
	            return true;
	        }
	        return false;
	    };

	    SomePromiseArray.prototype._fulfilled = function () {
	        return this._totalResolved;
	    };

	    SomePromiseArray.prototype._rejected = function () {
	        return this._values.length - this.length();
	    };

	    SomePromiseArray.prototype._addRejected = function (reason) {
	        this._values.push(reason);
	    };

	    SomePromiseArray.prototype._addFulfilled = function (value) {
	        this._values[this._totalResolved++] = value;
	    };

	    SomePromiseArray.prototype._canPossiblyFulfill = function () {
	        return this.length() - this._rejected();
	    };

	    SomePromiseArray.prototype._getRangeError = function (count) {
	        var message = "Input array must contain at least " + this._howMany + " items but contains only " + count + " items";
	        return new RangeError(message);
	    };

	    SomePromiseArray.prototype._resolveEmptyArray = function () {
	        this._reject(this._getRangeError(0));
	    };

	    function some(promises, howMany) {
	        if ((howMany | 0) !== howMany || howMany < 0) {
	            return apiRejection("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
	        }
	        var ret = new SomePromiseArray(promises);
	        var promise = ret.promise();
	        ret.setHowMany(howMany);
	        ret.init();
	        return promise;
	    }

	    Promise.some = function (promises, howMany) {
	        return some(promises, howMany);
	    };

	    Promise.prototype.some = function (howMany) {
	        return some(this, howMany);
	    };

	    Promise._SomePromiseArray = SomePromiseArray;
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (Promise, INTERNAL) {
	    var PromiseMap = Promise.map;

	    Promise.prototype.filter = function (fn, options) {
	        return PromiseMap(this, fn, options, INTERNAL);
	    };

	    Promise.filter = function (promises, fn, options) {
	        return PromiseMap(promises, fn, options, INTERNAL);
	    };
	};

/***/ },
/* 49 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (Promise, INTERNAL) {
	    var PromiseReduce = Promise.reduce;
	    var PromiseAll = Promise.all;

	    function promiseAllThis() {
	        return PromiseAll(this);
	    }

	    function PromiseMapSeries(promises, fn) {
	        return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
	    }

	    Promise.prototype.each = function (fn) {
	        return PromiseReduce(this, fn, INTERNAL, 0)._then(promiseAllThis, undefined, undefined, this, undefined);
	    };

	    Promise.prototype.mapSeries = function (fn) {
	        return PromiseReduce(this, fn, INTERNAL, INTERNAL);
	    };

	    Promise.each = function (promises, fn) {
	        return PromiseReduce(promises, fn, INTERNAL, 0)._then(promiseAllThis, undefined, undefined, promises, undefined);
	    };

	    Promise.mapSeries = PromiseMapSeries;
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (Promise) {
	    var SomePromiseArray = Promise._SomePromiseArray;
	    function any(promises) {
	        var ret = new SomePromiseArray(promises);
	        var promise = ret.promise();
	        ret.setHowMany(1);
	        ret.setUnwrap();
	        ret.init();
	        return promise;
	    }

	    Promise.any = function (promises) {
	        return any(promises);
	    };

	    Promise.prototype.any = function () {
	        return any(this);
	    };
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
	    .replace(/---/g, '\u2014')
	    // en-dashes
	    .replace(/--/g, '\u2013')
	    // opening singles
	    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
	    // closing singles & apostrophes
	    .replace(/'/g, '\u2019')
	    // opening doubles
	    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201C')
	    // closing doubles
	    .replace(/"/g, '\u201D')
	    // ellipses
	    .replace(/\.{3}/g, '\u2026');
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
	    // explicitly match decimal, hex, and named HTML entities 
	    return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function (_, n) {
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

	  if (typeof module !== 'undefined' && ( false ? 'undefined' : _typeof(exports)) === 'object') {
	    module.exports = marked;
	  } else if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return marked;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else {
	    this.marked = marked;
	  }
	}).call(function () {
	  return this || (typeof window !== 'undefined' ? window : global);
	}());
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

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
	var mdConverters = __webpack_require__(53);
	var gfmConverters = __webpack_require__(54);
	var HtmlParser = __webpack_require__(55);
	var collapse = __webpack_require__(57);

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

	function htmlToDom(string) {
	  var tree = new HtmlParser().parseFromString(string, 'text/html');
	  collapse(tree.documentElement, isBlock);
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
	  if (!isVoid(node) && !/A|TH|TD/.test(node.nodeName) && /^\s*$/i.test(content)) {
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

/***/ },
/* 53 */
/***/ function(module, exports) {

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

/***/ },
/* 54 */
/***/ function(module, exports) {

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

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*
	 * Set up window for Node.js
	 */

	var _window = typeof window !== 'undefined' ? window : undefined;

	/*
	 * Parsing HTML strings
	 */

	function canParseHtmlNatively() {
	  var Parser = _window.DOMParser;
	  var canParse = false;

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

	  // For Node.js environments
	  if (typeof document === 'undefined') {
	    var jsdom = __webpack_require__(56);
	    Parser.prototype.parseFromString = function (string) {
	      return jsdom.jsdom(string, {
	        features: {
	          FetchExternalResources: [],
	          ProcessExternalResources: false
	        }
	      });
	    };
	  } else {
	    if (!shouldUseActiveX()) {
	      Parser.prototype.parseFromString = function (string) {
	        var doc = document.implementation.createHTMLDocument('');
	        doc.open();
	        doc.write(string);
	        doc.close();
	        return doc;
	      };
	    } else {
	      Parser.prototype.parseFromString = function (string) {
	        var doc = new ActiveXObject('htmlfile');
	        doc.designMode = 'on'; // disable on-page scripts
	        doc.open();
	        doc.write(string);
	        doc.close();
	        return doc;
	      };
	    }
	  }
	  return Parser;
	}

	function shouldUseActiveX() {
	  var useActiveX = false;

	  try {
	    document.implementation.createHTMLDocument('').open();
	  } catch (e) {
	    if (window.ActiveXObject) useActiveX = true;
	  }

	  return useActiveX;
	}

	module.exports = canParseHtmlNatively() ? _window.DOMParser : createHtmlParser();

/***/ },
/* 56 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var voidElements = __webpack_require__(58);
	Object.keys(voidElements).forEach(function (name) {
	  voidElements[name.toUpperCase()] = 1;
	});

	var blockElements = {};
	__webpack_require__(59).forEach(function (name) {
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

/***/ },
/* 58 */
/***/ function(module, exports) {

	"use strict";

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

/***/ },
/* 59 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * This file automatically generated from `build.js`.
	 * Do not manually edit.
	 */

	module.exports = ["address", "article", "aside", "audio", "blockquote", "canvas", "dd", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "main", "nav", "noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video"];

/***/ },
/* 60 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * A basic modal for displaying messages to the user
	 */

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var MessageModal = function (_View) {
	    _inherits(MessageModal, _View);

	    function MessageModal(params) {
	        _classCallCheck(this, MessageModal);

	        var _this = _possibleConstructorReturn(this, (MessageModal.__proto__ || Object.getPrototypeOf(MessageModal)).call(this, params));

	        var otherModals = ViewHelper.getAll('MessageModal');

	        for (var i in otherModals) {
	            if (otherModals[i] != _this) {
	                otherModals[i].hide();
	            }
	        }

	        _this.$element = _.div();

	        _this.fetch();
	        return _this;
	    }

	    _createClass(MessageModal, [{
	        key: 'hide',
	        value: function hide() {
	            this.$element.modal('hide');
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            this.$element.modal('show');
	        }
	    }, {
	        key: 'onClickOK',
	        value: function onClickOK() {
	            if (typeof this.model.onSubmit === 'function') {
	                if (this.model.onSubmit() == false) {
	                    return;
	                }
	            }

	            this.hide();
	        }
	    }, {
	        key: 'reload',
	        value: function reload() {
	            _.append(this.$element.find('.modal-title').empty(), this.renderTitle());
	            _.append(this.$element.find('.modal-body').empty(), this.renderBody());
	        }
	    }, {
	        key: 'renderTitle',
	        value: function renderTitle() {
	            return this.model.title;
	        }
	    }, {
	        key: 'renderBody',
	        value: function renderBody() {
	            return this.model.body;
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this2 = this;

	            var view = this;

	            this.$element = _.div({ class: 'modal fade ' + (this.model.class ? this.model.class : '') }, _.div({ class: 'modal-dialog' }, _.div({ class: 'modal-content' }, _.div({ class: 'modal-header' }, _.h4({ class: 'modal-title' }, this.renderTitle())), _.div({ class: 'modal-body' }, this.renderBody()), _.div({ class: 'modal-footer' }, _.if(this.buttons, _.each(this.buttons, function (i, button) {
	                var $button = _.button({ class: 'btn ' + button.class }, button.label).click(function () {
	                    if (button.callback) {
	                        if (button.callback() != false) {
	                            _this2.hide();
	                        }
	                    } else {
	                        _this2.hide();
	                    }
	                });

	                if (button.disabled) {
	                    $button.attr('disabled', true);
	                }

	                return $button;
	            })), _.if(!this.buttons && this.model.onSubmit != false, _.button({ class: 'btn btn-default' }, 'OK').click(function () {
	                _this2.onClickOK();
	            }))))));

	            // Callback was set to false, disable dismissing
	            if (this.model.onSubmit == false) {
	                this.$element.attr('data-backdrop', 'static');
	                this.$element.attr('data-keyboard', 'false');
	            }

	            $('body').append(this.$element);

	            this.$element.find('a').click(function () {
	                view.hide();
	            });

	            this.$element.modal('show');

	            this.$element.on('hidden.bs.modal', function () {
	                _this2.trigger('close');
	                _this2.remove();
	            });
	        }
	    }]);

	    return MessageModal;
	}(View);

	module.exports = MessageModal;

/***/ },
/* 61 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UIHelper = function () {
	    function UIHelper() {
	        _classCallCheck(this, UIHelper);
	    }

	    _createClass(UIHelper, null, [{
	        key: 'inputSwitch',

	        /**
	         * Creates a switch
	         *
	         * @param {Boolean} initialValue
	         * @param {Function} onChange
	         *
	         * @returns {HTMLElement} Switch element
	         */
	        value: function inputSwitch(initialValue, onChange) {
	            var id = 'switch-' + (10000 + Math.floor(Math.random() * 10000));
	            var $input = void 0;

	            var $element = _.div({ class: 'switch', 'data-checked': initialValue }, $input = _.input({
	                id: id,
	                class: 'form-control switch',
	                type: 'checkbox'
	            }).change(function () {
	                this.parentElement.dataset.checked = this.checked;

	                if (onChange) {
	                    onChange(this.checked);
	                }
	            }), _.label({ for: id }));

	            if (initialValue) {
	                $input.attr('checked', true);
	            }

	            return $element;
	        }

	        /**
	         * Creates a group of chips
	         *
	         * @param {Array} items
	         * @param {Array} dropdownItems
	         * @param {Function} onChange
	         * @param {Boolean} isDropdownUnique
	         *
	         * @returns {HtmlElement} Chip group element
	         */

	    }, {
	        key: 'inputChipGroup',
	        value: function inputChipGroup(items, dropdownItems, onChange, isDropdownUnique) {
	            var $element = _.div({ class: 'chip-group' });

	            if (!items) {
	                items = [];
	            }

	            function render() {
	                _.append($element.empty(),

	                // Render individual chips
	                _.each(items, function (itemIndex, item) {
	                    var $chip = _.div({ class: 'chip' },

	                    // Dropdown
	                    _.if(Array.isArray(dropdownItems), _.div({ class: 'chip-label dropdown' }, _.button({ class: 'dropdown-toggle', 'data-toggle': 'dropdown' }, item.label || item.name || item.title || item), _.if(onChange, _.ul({ class: 'dropdown-menu' }, _.each(dropdownItems, function (dropdownItemIndex, dropdownItem) {
	                        // Look for unique dropdown items
	                        if (isDropdownUnique) {
	                            var _iteratorNormalCompletion = true;
	                            var _didIteratorError = false;
	                            var _iteratorError = undefined;

	                            try {
	                                for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                                    var _item = _step.value;

	                                    if (_item == dropdownItem) {
	                                        return;
	                                    }
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
	                        }

	                        return _.li(_.a({ href: '#' }, dropdownItem.label || dropdownItem.name || dropdownItem.title || dropdownItem).click(function (e) {
	                            e.preventDefault();

	                            items[itemIndex] = dropdownItem;

	                            render();

	                            if (typeof onChange === 'function') {
	                                onChange(items);
	                            }
	                        }));
	                    }))))),

	                    // Regular string
	                    _.if(!Array.isArray(dropdownItems), _.if(!onChange, _.p({ class: 'chip-label' }, item)), _.if(onChange, _.input({ type: 'text', class: 'chip-label', value: item }).change(function (e) {
	                        items[itemIndex] = e.target.value;
	                    }))),

	                    // Remove button
	                    _.if(onChange, _.button({ class: 'btn chip-remove' }, _.span({ class: 'fa fa-remove' })).click(function () {
	                        items.splice(itemIndex, 1);

	                        render();

	                        if (typeof onChange === 'function') {
	                            onChange(items);
	                        }
	                    })));

	                    return $chip;
	                }),

	                // Add button
	                _.if(onChange, _.button({ class: 'btn chip-add' }, _.span({ class: 'fa fa-plus' })).click(function () {
	                    if (Array.isArray(dropdownItems)) {
	                        if (isDropdownUnique) {
	                            var _iteratorNormalCompletion2 = true;
	                            var _didIteratorError2 = false;
	                            var _iteratorError2 = undefined;

	                            try {
	                                for (var _iterator2 = dropdownItems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                                    var dropdownItem = _step2.value;

	                                    var isSelected = false;

	                                    var _iteratorNormalCompletion3 = true;
	                                    var _didIteratorError3 = false;
	                                    var _iteratorError3 = undefined;

	                                    try {
	                                        for (var _iterator3 = items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                                            var item = _step3.value;

	                                            if (item == dropdownItem) {
	                                                isSelected = true;
	                                                break;
	                                            }
	                                        }
	                                    } catch (err) {
	                                        _didIteratorError3 = true;
	                                        _iteratorError3 = err;
	                                    } finally {
	                                        try {
	                                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                                                _iterator3.return();
	                                            }
	                                        } finally {
	                                            if (_didIteratorError3) {
	                                                throw _iteratorError3;
	                                            }
	                                        }
	                                    }

	                                    if (!isSelected) {
	                                        items.push(dropdownItem);
	                                        break;
	                                    }
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
	                        } else {
	                            items.push(dropdownItems[0]);
	                        }
	                    } else if (typeof dropdownItems === 'string') {
	                        items.push(dropdownItems);
	                    } else {
	                        items.push('New item');
	                    }

	                    render();

	                    if (typeof onChange === 'function') {
	                        onChange(items);
	                    }
	                })));
	            };

	            render();

	            return $element;
	        }

	        /**
	         * Renders a dropdown
	         *
	         * @param {String|Number} defaultValue
	         * @param {Array|Number} options
	         * @param {Function} onChange
	         * @param {Boolean} useClearButton
	         * @param {Boolean} useSearch
	         *
	         * @returns {HtmlElement} Dropdown element
	         */

	    }, {
	        key: 'inputDropdown',
	        value: function inputDropdown(defaultValue, options, onChange, useClearButton) {
	            var $toggle = void 0;
	            var $clear = void 0;

	            // If "options" parameter is a number, convert to array
	            if (typeof options === 'number') {
	                var amount = options;

	                options = [];

	                for (var i = 0; i < amount; i++) {
	                    options[options.length] = { label: i.toString(), value: i };
	                }
	            }

	            // Change event
	            var onClick = function onClick(e, element) {
	                var $button = $(e.target);
	                var $li = $button.parents('li');

	                $li.addClass('active').siblings().removeClass('active');

	                $toggle.html($button.html());
	                $toggle.click();

	                onChange($li.attr('data-value'));
	            };

	            // Highlight selected value
	            var highlightSelectedValue = function highlightSelectedValue() {
	                $element.find('ul li').removeClass('active');
	                $toggle.html('(none)');

	                if (!defaultValue) {
	                    return;
	                }

	                var _iteratorNormalCompletion4 = true;
	                var _didIteratorError4 = false;
	                var _iteratorError4 = undefined;

	                try {
	                    for (var _iterator4 = options[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                        var option = _step4.value;

	                        if (option.value == defaultValue) {
	                            $toggle.html(option.label);
	                            $element.find('ul li[data-value="' + option.value + '"]').addClass('active');
	                            break;
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError4 = true;
	                    _iteratorError4 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                            _iterator4.return();
	                        }
	                    } finally {
	                        if (_didIteratorError4) {
	                            throw _iteratorError4;
	                        }
	                    }
	                }
	            };

	            // Clear event
	            var onClear = function onClear() {
	                defaultValue = onChange(null);

	                highlightSelectedValue();
	            };

	            var $element = _.div({ class: 'dropdown' }, $toggle = _.button({ class: 'btn btn-default dropdown-toggle', type: 'button', 'data-toggle': 'dropdown' }, '(none)'), _.if(useClearButton, $clear = _.button({ class: 'btn btn-default btn-small dropdown-clear' }, _.span({ class: 'fa fa-remove' })).on('click', onClear)), _.div({ class: 'dropdown-menu' }, _.ul({ class: 'dropdown-menu-items' }, _.each(options, function (i, option) {
	                var optionLabel = option.label || option.id || option.name || option.toString();
	                var isSelected = option.selected || option.value == defaultValue;

	                if (isSelected) {
	                    $toggle.html(optionLabel);
	                }

	                var $li = _.li({ 'data-value': option.value || optionLabel, class: isSelected ? 'active' : '' }, _.button(optionLabel).on('click', onClick));

	                return $li;
	            }))));

	            return $element;
	        }

	        /**
	         * Renders a dropdown with typeahead
	         *
	         * @param {String} label
	         * @param {Array|Number} options
	         * @param {Function} onClick
	         * @param {Boolean} useClearButton
	         *
	         * @returns {HtmlElement} Dropdown element
	         */

	    }, {
	        key: 'inputDropdownTypeAhead',
	        value: function inputDropdownTypeAhead(label, options, onClick, useClearButton) {
	            var $element = this.inputDropdown(label, options, onClick, useClearButton);
	            var inputTimeout = void 0;

	            // Change input event
	            var onChangeInput = function onChangeInput() {
	                if (inputTimeout) {
	                    clearTimeout(inputTimeout);
	                }

	                var query = ($element.find('.dropdown-typeahead input').val() || '').toLowerCase();
	                var isQueryEmpty = !query || query.length < 2;

	                inputTimeout = setTimeout(function () {
	                    $element.find('ul li button').each(function (i, button) {
	                        var $button = $(button);
	                        var label = ($button.html() || '').toLowerCase();
	                        var isMatch = label.indexOf(query) > -1;

	                        $button.toggle(isMatch || isQueryEmpty);
	                    });
	                }, 250);
	            };

	            // Clear input event
	            var onClearInput = function onClearInput(e) {
	                e.preventDefault();
	                e.stopPropagation();

	                $element.find('.dropdown-typeahead input').val('');

	                onChangeInput();
	            };

	            $element.addClass('typeahead');

	            $element.find('.dropdown-menu').prepend(_.div({ class: 'dropdown-typeahead' }, _.input({ class: 'form-control', placeholder: 'Search...' }).on('keyup paste change propertychange', onChangeInput), _.button({ class: 'dropdown-typeahead-btn-clear' }, _.span({ class: 'fa fa-remove' })).on('click', onClearInput)));

	            return $element;
	        }

	        /**
	         * Renders a carousel
	         *
	         * @param {Array} items
	         * @param {Boolean} useIndicators
	         * @param {Boolean} useControls
	         * @param {String} height
	         *
	         * @returns {HtmlElement} Carousel element
	         */

	    }, {
	        key: 'carousel',
	        value: function carousel(items, useIndicators, useControls, height) {
	            var id = 'carousel-' + (10000 + Math.floor(Math.random() * 10000));

	            return _.div({ class: 'carousel slide', id: id, 'data-ride': 'carousel', 'data-interval': 0 }, _.if(useIndicators, _.ol({ class: 'carousel-indicators' }, _.each(items, function (i, item) {
	                return _.li({ 'data-target': '#' + id, 'data-slide-to': i, class: i == 0 ? 'active' : '' });
	            }))), _.div({ class: 'carousel-inner', role: 'listbox' }, _.each(items, function (i, item) {
	                return _.div({ class: 'item' + (i == 0 ? ' active' : ''), style: 'height:' + (height || '500px') }, item);
	            })), _.if(useControls, _.a({ href: '#' + id, role: 'button', class: 'left carousel-control', 'data-slide': 'prev' }, _.span({ class: 'fa fa-arrow-left' })), _.a({ href: '#' + id, role: 'button', class: 'right carousel-control', 'data-slide': 'next' }, _.span({ class: 'fa fa-arrow-right' }))));
	        }

	        /**
	         * Brings up an error modal
	         *
	         * @param {String|Error} error
	         * @param {Function} onClickOK
	         */

	    }, {
	        key: 'errorModal',
	        value: function errorModal(error, onClickOK) {
	            if (!error) {
	                return;
	            }

	            if (error instanceof String) {
	                error = new Error(error);
	            } else if (error instanceof Object) {
	                if (error.responseText) {
	                    error = new Error(error.responseText);
	                }
	            } else if (error instanceof Error == false) {
	                error = new Error(error.toString());
	            }

	            var modal = messageModal('<span class="fa fa-warning"></span> Error', error.message + '<br /><br />Please check the JavaScript console for details', onClickOK);

	            modal.$element.toggleClass('error-modal', true);

	            throw error;
	        }

	        /**
	         * Brings up a message modal
	         *
	         * @param {String} title
	         * @param {String} body
	         */

	    }, {
	        key: 'messageModal',
	        value: function messageModal(title, body, onSubmit) {
	            return new MessageModal({
	                model: {
	                    title: title,
	                    body: body,
	                    onSubmit: onSubmit
	                }
	            });
	        }

	        /**
	         * Brings up an iframe modal
	         *
	         * @param {String} title
	         * @param {String} url
	         * @param {Function} onload
	         * @param {Function} onerror
	         */

	    }, {
	        key: 'iframeModal',
	        value: function iframeModal(title, url, onload, onerror) {
	            var $iframe = _.iframe({ src: url });

	            return new MessageModal({
	                model: {
	                    title: title,
	                    body: [_.span({ class: 'iframe-modal-error' }, 'If the preview didn\'t show up, please try the "reload" or "open" buttons'), $iframe],
	                    class: 'iframe-modal'
	                },
	                buttons: [{
	                    label: 'Reload',
	                    class: 'btn-primary',
	                    callback: function callback() {
	                        $iframe[0].src += '';

	                        return false;
	                    }
	                }, {
	                    label: 'Open',
	                    class: 'btn-primary',
	                    callback: function callback() {
	                        window.open($iframe[0].src);

	                        return false;
	                    }
	                }, {
	                    label: 'OK',
	                    class: 'btn-default'
	                }]
	            });
	        }

	        /**
	         * Brings up a confirm modal
	         *
	         * @param {String} type
	         * @param {String} title
	         * @param {String} body
	         * @param {Function} onSubmit
	         */

	    }, {
	        key: 'confirmModal',
	        value: function confirmModal(type, title, body, onSubmit, onCancel) {
	            var submitClass = 'btn-primary';

	            type = (type || '').toLowerCase();

	            switch (type) {
	                case 'delete':case 'remove':case 'discard':case 'clear':
	                    submitClass = 'btn-danger';
	                    break;
	            }

	            return new MessageModal({
	                model: {
	                    title: title,
	                    body: body,
	                    onSubmit: onSubmit,
	                    class: 'confirm-modal'
	                },
	                buttons: [{
	                    label: 'Cancel',
	                    class: 'btn-default',
	                    callback: onCancel
	                }, {
	                    label: type,
	                    class: submitClass,
	                    callback: onSubmit
	                }]
	            });
	        }
	    }]);

	    return UIHelper;
	}();

	window.errorModal = UIHelper.errorModal;
	window.messageModal = UIHelper.messageModal;
	window.confirmModal = UIHelper.confirmModal;

	module.exports = UIHelper;

/***/ },
/* 62 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * A helper class for managing projects
	 */

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ProjectHelper = function ProjectHelper() {
	  _classCallCheck(this, ProjectHelper);
	};

	module.exports = ProjectHelper;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var LanguageHelperCommon = __webpack_require__(64);

	var LanguageHelper = function (_LanguageHelperCommon) {
	    _inherits(LanguageHelper, _LanguageHelperCommon);

	    function LanguageHelper() {
	        _classCallCheck(this, LanguageHelper);

	        return _possibleConstructorReturn(this, (LanguageHelper.__proto__ || Object.getPrototypeOf(LanguageHelper)).apply(this, arguments));
	    }

	    return LanguageHelper;
	}(LanguageHelperCommon);

	module.exports = LanguageHelper;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LanguageHelper = function () {
	    function LanguageHelper() {
	        _classCallCheck(this, LanguageHelper);
	    }

	    _createClass(LanguageHelper, null, [{
	        key: 'getLanguages',

	        /**
	         * Gets all languages
	         *
	         * @returns {Array} List of language names
	         */
	        value: function getLanguages() {
	            return __webpack_require__(65);
	        }

	        /**
	         * Gets all selected languages
	         *
	         * @param {String} project
	         *
	         * @returns {Array} List of language names
	         */

	    }, {
	        key: 'getSelectedLanguages',
	        value: function getSelectedLanguages() {
	            var project = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('project');

	            return SettingsHelper.getSettings(project, null, 'language').then(function (settings) {
	                if (!settings) {
	                    settings = {};
	                }

	                if (!settings.selected || settings.selected.length < 1) {
	                    settings.selected = ['en'];
	                }

	                settings.selected.sort();

	                LanguageHelper.selectedLanguages = settings.selected;

	                return Promise.resolve(settings.selected);
	            });
	        }

	        /**
	         * Sets all languages
	         *
	         * @param {String} project
	         * @param {Array} languages
	         *
	         * @returns {Promise} promise
	         */

	    }, {
	        key: 'setLanguages',
	        value: function setLanguages() {
	            var project = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('project');
	            var languages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('languages');

	            return SettingsHelper.getSettings(project, null, 'language').then(function (settings) {
	                if (!(settings instanceof Object)) {
	                    settings = {};
	                }

	                if (!Array.isArray(languages)) {
	                    return Promise.reject(new Error('Language array cannot be of type "' + (typeof languages === 'undefined' ? 'undefined' : _typeof(languages)) + '"'));
	                }

	                settings.selected = languages;

	                return SettingsHelper.setSettings(project, null, 'language', settings);
	            });
	        }

	        /**
	         * Toggle a language
	         *
	         * @param {String} project
	         * @param {String} language
	         * @param {Boolean} state
	         *
	         * @returns {Promise} promise
	         */

	    }, {
	        key: 'toggleLanguage',
	        value: function toggleLanguage() {
	            var project = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('project');
	            var language = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('language');
	            var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : requiredParam('state');

	            return SettingsHelper.getSettings(project, 'language').then(function (settings) {
	                if (!(settings instanceof Object)) {
	                    settings = {};
	                }

	                if (!settings.selected || settings.selected.length < 1) {
	                    settings.selected = ['en'];
	                }

	                if (!state && settings.selected.indexOf(language) > -1) {
	                    settings.selected.splice(settings.selected.indexOf(language), 1);
	                } else if (state && settings.selected.indexOf(language) < 0) {
	                    settings.selected.push(language);
	                    settings.selected.sort();
	                }

	                return SettingsHelper.setSettings(project, null, 'language', settings);
	            });
	        }

	        /**
	         * Gets localised sets of properties for a Content object
	         *
	         * @param {String} project
	         * @param {String} environment
	         * @param {Content} content
	         *
	         * @return {Promise} Properties
	         */

	    }, {
	        key: 'getAllLocalizedPropertySets',
	        value: function getAllLocalizedPropertySets() {
	            var project = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('project');
	            var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('environment');
	            var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : requiredParam('content');

	            return LanguageHelper.getSelectedLanguages(project).then(function (languages) {
	                var sets = {};

	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;

	                try {
	                    for (var _iterator = languages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                        var language = _step.value;

	                        var properties = content.getLocalizedProperties(language);

	                        sets[language] = properties;
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

	                return Promise.resolve(sets);
	            });
	        }
	    }]);

	    return LanguageHelper;
	}();

	module.exports = LanguageHelper;

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = [
		"aa",
		"ab",
		"ae",
		"af",
		"ak",
		"am",
		"an",
		"ar",
		"as",
		"av",
		"ay",
		"az",
		"ba",
		"be",
		"bg",
		"bh",
		"bi",
		"bm",
		"bn",
		"bo",
		"br",
		"bs",
		"ca",
		"ce",
		"ch",
		"co",
		"cr",
		"cs",
		"cu",
		"cv",
		"cy",
		"da",
		"de",
		"dv",
		"dz",
		"ee",
		"el",
		"en",
		"eo",
		"es",
		"et",
		"eu",
		"fa",
		"ff",
		"fi",
		"fj",
		"fo",
		"fr",
		"fy",
		"ga",
		"gd",
		"gl",
		"gn",
		"gu",
		"gv",
		"ha",
		"he",
		"hi",
		"ho",
		"hr",
		"ht",
		"hu",
		"hy",
		"hz",
		"ia",
		"id",
		"ie",
		"ig",
		"ii",
		"ik",
		"io",
		"is",
		"it",
		"iu",
		"ja",
		"jv",
		"ka",
		"kg",
		"ki",
		"kj",
		"kk",
		"kl",
		"km",
		"kn",
		"ko",
		"kr",
		"ks",
		"ku",
		"kv",
		"kw",
		"ky",
		"la",
		"lb",
		"lg",
		"li",
		"ln",
		"lo",
		"lt",
		"lu",
		"lv",
		"mg",
		"mh",
		"mi",
		"mk",
		"ml",
		"mn",
		"mr",
		"ms",
		"mt",
		"my",
		"na",
		"nb",
		"nd",
		"ne",
		"ng",
		"nl",
		"nn",
		"no",
		"nr",
		"nv",
		"ny",
		"oc",
		"oj",
		"om",
		"or",
		"os",
		"pa",
		"pi",
		"pl",
		"ps",
		"pt",
		"qu",
		"rc",
		"rm",
		"rn",
		"ro",
		"ru",
		"rw",
		"sa",
		"sc",
		"sd",
		"se",
		"sg",
		"si",
		"sk",
		"sl",
		"sm",
		"sn",
		"so",
		"sq",
		"sr",
		"ss",
		"st",
		"su",
		"sv",
		"sw",
		"ta",
		"te",
		"tg",
		"th",
		"ti",
		"tk",
		"tl",
		"tn",
		"to",
		"tr",
		"ts",
		"tt",
		"tw",
		"ty",
		"ug",
		"uk",
		"ur",
		"uz",
		"ve",
		"vi",
		"vo",
		"wa",
		"wo",
		"xh",
		"yi",
		"yo",
		"za",
		"zh",
		"zu"
	];

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SettingsHelperCommon = __webpack_require__(67);

	var SettingsHelper = function (_SettingsHelperCommon) {
	    _inherits(SettingsHelper, _SettingsHelperCommon);

	    function SettingsHelper() {
	        _classCallCheck(this, SettingsHelper);

	        return _possibleConstructorReturn(this, (SettingsHelper.__proto__ || Object.getPrototypeOf(SettingsHelper)).apply(this, arguments));
	    }

	    _createClass(SettingsHelper, null, [{
	        key: 'getSettings',

	        /**
	         * Gets all settings
	         *
	         * @param {String} project
	         * @param {String} environment
	         * @param {String} section
	         *
	         * @return {Promise(Object)}  settings
	         */
	        value: function getSettings() {
	            var project = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('project');

	            var _this2 = this;

	            var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('environment');
	            var section = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : requiredParam('section');

	            var apiCall = void 0;

	            if (!environment || environment == '*') {
	                apiCall = customApiCall('get', '/api/' + project + '/settings/' + section);
	            } else {
	                apiCall = customApiCall('get', '/api/' + project + '/' + environment + '/settings/' + section);
	            }

	            return apiCall

	            // Cache settings client-side
	            .then(function (settings) {
	                _this2.updateCache(project, environment, section, settings);

	                return Promise.resolve(settings);
	            });
	        }

	        /**
	         * Cache update
	         *
	         * @param {String} project
	         * @param {String} environment
	         * @param {String} section
	         * @param {Object} settings
	         */

	    }, {
	        key: 'updateCache',
	        value: function updateCache() {
	            var project = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('project');
	            var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('environment');
	            var section = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : requiredParam('section');
	            var settings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : requiredParam('settings');

	            // Sanity check
	            this.cache = this.cache || {};
	            this.cache[project] = this.cache[project] || {};

	            if (environment) {
	                this.cache[project][environment] = this.cache[project][environment] || {};
	                this.cache[project][environment][section] = this.cache[project][environment][section] || {};
	                this.cache[project][environment][section] = settings;
	            } else {
	                this.cache[project][section] = this.cache[project][section] || {};
	                this.cache[project][section] = settings;
	            }
	        }

	        /**
	         * Gets cached settings
	         *
	         * @param {String} section
	         *
	         * @returns {Object} Settings
	         */

	    }, {
	        key: 'getCachedSettings',
	        value: function getCachedSettings() {
	            var section = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('section');

	            var project = ProjectHelper.currentProject;
	            var environment = ProjectHelper.currentEnvironment;

	            if (!this.cache) {
	                return {};
	            }
	            if (!this.cache[project]) {
	                return {};
	            }

	            if (environment) {
	                if (!this.cache[project][environment]) {
	                    return {};
	                }
	                if (!this.cache[project][environment][section]) {
	                    return {};
	                }

	                return this.cache[project][environment][section];
	            } else {
	                if (!this.cache[project][section]) {
	                    return {};
	                }

	                return this.cache[project][section];
	            }
	        }

	        /**
	         * Sets all settings
	         *
	         * @param {String} project
	         * @param {String} environment
	         * @param {String} section
	         * @param {Object} settings
	         *
	         * @return {Promise} promise
	         */

	    }, {
	        key: 'setSettings',
	        value: function setSettings() {
	            var project = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('project');
	            var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('environment');

	            var _this3 = this;

	            var section = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : requiredParam('section');
	            var settings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : requiredParam('settings');

	            var apiCall = void 0;

	            if (!environment || environment == '*') {
	                apiCall = customApiCall('post', '/api/' + project + '/settings/' + section, settings);
	            } else {
	                apiCall = customApiCall('post', '/api/' + project + '/' + environment + '/settings/' + section, settings);
	            }

	            return apiCall

	            // Cache new settings
	            .then(function () {
	                _this3.updateCache(project, environment, section, settings);

	                return Promise.resolve();
	            });
	        }
	    }]);

	    return SettingsHelper;
	}(SettingsHelperCommon);

	module.exports = SettingsHelper;

/***/ },
/* 67 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SettingsHelper = function () {
	    function SettingsHelper() {
	        _classCallCheck(this, SettingsHelper);
	    }

	    _createClass(SettingsHelper, null, [{
	        key: 'getSettings',

	        /**
	         * Gets all settings
	         *
	         * @param {String} project
	         * @param {String} environment
	         * @param {String} section
	         *
	         * @return {Promise(Object)}  settings
	         */
	        value: function getSettings() {
	            var project = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('project');
	            var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('environment');
	            var section = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : requiredParam('section');

	            return Promise.resolve({});
	        }

	        /**
	         * Sets all settings
	         *
	         * @param {String} project
	         * @param {String} environment
	         * @param {String} section
	         * @param {Object} settings
	         *
	         * @return {Promise} promise
	         */

	    }, {
	        key: 'setSettings',
	        value: function setSettings() {
	            var project = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('project');
	            var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('environment');
	            var section = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : requiredParam('section');
	            var settings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : requiredParam('settings');

	            return Promise.resolve();
	        }
	    }]);

	    return SettingsHelper;
	}();

	module.exports = SettingsHelper;

/***/ },
/* 68 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var VERBOSITY = 2;

	var DebugHelper = function () {
	    function DebugHelper() {
	        _classCallCheck(this, DebugHelper);
	    }

	    _createClass(DebugHelper, null, [{
	        key: 'onLog',

	        /**
	         * Event: Log
	         *
	         * @param {String} senderString
	         * @param {String} dateString
	         * @param {String} message
	         */
	        value: function onLog(senderString, dateString, message) {}

	        /**
	         * Gets the date string
	         *
	         * @returns {String} date
	         */

	    }, {
	        key: 'getDateString',
	        value: function getDateString() {
	            var date = new Date();

	            var monthString = date.getMonth() + 1;

	            if (monthString < 10) {
	                monthString = '0' + monthString;
	            }

	            var dateString = date.getDate();

	            if (dateString < 10) {
	                dateString = '0' + dateString;
	            }

	            var hoursString = date.getHours();

	            if (hoursString < 10) {
	                hoursString = '0' + hoursString;
	            }

	            var minutesString = date.getMinutes();

	            if (minutesString < 10) {
	                minutesString = '0' + minutesString;
	            }

	            var secondsString = date.getSeconds();

	            if (secondsString < 10) {
	                secondsString = '0' + secondsString;
	            }

	            var output = date.getFullYear() + '.' + monthString + '.' + dateString + ' ' + hoursString + ':' + minutesString + ':' + secondsString + ' |';

	            return output;
	        }

	        /**
	         * Parse sender
	         *
	         * @param {Object} sender
	         *
	         * @returns {String} name
	         */

	    }, {
	        key: 'parseSender',
	        value: function parseSender(sender, ignoreLast) {
	            var senderName = '';

	            if (sender) {
	                if (typeof sender === 'string') {
	                    senderName = sender;
	                } else if (typeof sender === 'function') {
	                    senderName = sender.name;
	                } else if (sender.constructor) {
	                    senderName = sender.constructor.name;
	                } else {
	                    senderName = sender.toString();
	                }
	            }

	            return senderName + ' |';
	        }

	        /**
	         * Logs a message
	         *
	         * @param {String} message
	         * @param {Object} sender
	         * @param {Number} verbosity
	         */

	    }, {
	        key: 'log',
	        value: function log(message, sender) {
	            var verbosity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

	            if (verbosity == 0) {
	                DebugHelper.error('Verbosity cannot be set to 0', this);
	            } else if (!verbosity) {
	                verbosity = 1;
	            }

	            if (VERBOSITY >= verbosity) {
	                var senderString = DebugHelper.parseSender(sender);
	                var dateString = DebugHelper.getDateString();

	                console.log(dateString, senderString, message);
	                DebugHelper.onLog(dateString, senderString, message);
	            }
	        }

	        /**
	         * Throws an error
	         *
	         * @param {String} message
	         * @param {Object} sender
	         */

	    }, {
	        key: 'error',
	        value: function error(message, sender) {
	            if (message instanceof Error) {
	                message = message.message || message.trace;
	            }

	            console.log(DebugHelper.getDateString(), DebugHelper.parseSender(sender), message);

	            throw new Error(message);
	        }

	        /**
	         * Shows a warning
	         */

	    }, {
	        key: 'warning',
	        value: function warning(message, sender) {
	            console.log(DebugHelper.getDateString(), DebugHelper.parseSender(sender), message);
	            console.trace();
	        }
	    }]);

	    return DebugHelper;
	}();

	module.exports = DebugHelper;

/***/ },
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var UserEditor = function (_View) {
	    _inherits(UserEditor, _View);

	    function UserEditor(params) {
	        _classCallCheck(this, UserEditor);

	        var _this = _possibleConstructorReturn(this, (UserEditor.__proto__ || Object.getPrototypeOf(UserEditor)).call(this, params));

	        _this.$element = _.div({ class: 'user-editor' });

	        _this.modal = UI.confirmModal('save', 'Settings for "' + _this.getLabel() + '"', _this.$element, function () {
	            _this.onClickSave();

	            return false;
	        });

	        _this.modal.$element.addClass('modal-user-editor');

	        customApiCall('get', '/api/server/projects').then(function (projects) {
	            _this.projects = projects;
	            _this.init();
	        });
	        return _this;
	    }

	    /**
	     * Gets the user label
	     *
	     * @returns {String} Label
	     */


	    _createClass(UserEditor, [{
	        key: 'getLabel',
	        value: function getLabel() {
	            return this.model.fullName || this.model.username || this.model.email || this.model.id;
	        }

	        /**
	         * Event: Click save.
	         */

	    }, {
	        key: 'onClickSave',
	        value: function onClickSave() {
	            var _this2 = this;

	            var newUserObject = this.model.getObject();

	            if (this.newPassword) {
	                newUserObject.password = this.newPassword;
	            }

	            apiCall('post', 'user/' + this.model.id, newUserObject).then(function () {
	                _this2.modal.hide();

	                _this2.trigger('save', _this2.model);
	            }).catch(errorModal);
	        }

	        /**
	         * Gets a list of available scopes
	         *
	         * @returns {Array} Array of scope strings
	         */

	    }, {
	        key: 'getScopes',
	        value: function getScopes() {
	            return ['connections', 'schemas', 'settings', 'templates', 'users'];
	        }

	        /**
	         * Renders the username editor
	         *
	         * @returns {HTMLElement} Element
	         */

	    }, {
	        key: 'renderUserNameEditor',
	        value: function renderUserNameEditor() {
	            var view = this;

	            function onInputChange() {
	                view.model.username = $(this).val();
	            }

	            var $element = _.div({ class: 'username-editor' }, _.input({
	                class: 'form-control',
	                type: 'text',
	                value: view.model.username,
	                placeholder: 'Input the username here'
	            }).on('change', onInputChange));

	            return $element;
	        }

	        /**
	         * Renders the scopes editor
	         *
	         * @param {String} project
	         *
	         * @returns {HTMLElement} Element
	         */

	    }, {
	        key: 'renderScopesEditor',
	        value: function renderScopesEditor(project) {
	            var _this3 = this;

	            return _.div({ class: 'scopes-editor' }, UI.inputChipGroup(this.model.getScopes(project), this.getScopes(), function (newValue) {
	                _this3.model.scopes[project] = newValue;

	                _this3.$element.find('.project[data-id="' + project + '"] .switch input')[0].checked = true;
	            }, true));
	        }

	        /**
	         * Renders the full name editor
	         *
	         * @return {HTMLElement} Element
	         */

	    }, {
	        key: 'renderFullNameEditor',
	        value: function renderFullNameEditor() {
	            var view = this;

	            function onChange() {
	                var fullName = $(this).val();

	                view.model.fullName = fullName;
	            }

	            return _.div({ class: 'full-name-editor' }, _.input({ class: 'form-control', type: 'text', value: this.model.fullName }).change(onChange));
	        }

	        /**
	         * Renders the email editor
	         *
	         * @return {HTMLElement} Element
	         */

	    }, {
	        key: 'renderEmailEditor',
	        value: function renderEmailEditor() {
	            var view = this;

	            function onChange() {
	                var email = $(this).val();

	                view.model.email = email;
	            }

	            return _.div({ class: 'full-name-editor' }, _.input({ class: 'form-control', type: 'email', value: this.model.email }).change(onChange));
	        }

	        /**
	         * Renders the password
	         *
	         * @return {HTMLElement} Element
	         */

	    }, {
	        key: 'renderPasswordEditor',
	        value: function renderPasswordEditor() {
	            var view = this;

	            var $invalidMessage = void 0;
	            var password1 = void 0;
	            var password2 = void 0;

	            function onChange() {
	                var isMatch = password1 == password2;
	                var isLongEnough = password1 && password1.length > 3;
	                var isValid = isMatch && isLongEnough;

	                $element.toggleClass('invalid', !isValid);

	                view.$element.find('.model-footer .btn-primary').toggleClass('disabled', !isValid);

	                if (isValid) {
	                    view.newPassword = password1;
	                } else {
	                    view.newPassword = null;

	                    if (!isMatch) {
	                        $invalidMessage.html('Passwords do not match');
	                    } else if (!isLongEnough) {
	                        $invalidMessage.html('Passwords are too short');
	                    }
	                }
	            }

	            function onChange1() {
	                password1 = $(this).val();

	                onChange();
	            }

	            function onChange2() {
	                password2 = $(this).val();

	                onChange();
	            }

	            var $element = _.div({ class: 'password-editor' }, $invalidMessage = _.span({ class: 'invalid-message' }, 'Passwords do not match'), _.input({ class: 'form-control', type: 'password', placeholder: 'Type new password' }).on('change propertychange keyup paste input', onChange1), _.input({ class: 'form-control', type: 'password', placeholder: 'Confirm new password' }).on('change propertychange keyup paste input', onChange2));

	            return $element;
	        }

	        /**
	         * Renders the admin editor
	         *
	         * @return {HTMLElement} Element
	         */

	    }, {
	        key: 'renderAdminEditor',
	        value: function renderAdminEditor() {
	            var _this4 = this;

	            return UI.inputSwitch(this.model.isAdmin == true, function (newValue) {
	                _this4.model.isAdmin = newValue;

	                _this4.render();
	            }).addClass('admin-editor');
	        }

	        /**
	         * Renders a single field
	         *
	         * @return {HTMLElement} Element
	         */

	    }, {
	        key: 'renderField',
	        value: function renderField(label, $content) {
	            return _.div({ class: 'field-container' }, _.div({ class: 'field-key' }, label), _.div({ class: 'field-value' }, $content));
	        }

	        /**
	         * Renders all fields
	         *
	         * @return {Object} element
	         */

	    }, {
	        key: 'renderFields',
	        value: function renderFields() {
	            var id = parseInt(this.model.id);

	            return $element;
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this5 = this;

	            _.append(this.$element.empty(), this.renderField('Username', this.renderUserNameEditor()), this.renderField('Full name', this.renderFullNameEditor()), this.renderField('Email', this.renderEmailEditor()), this.renderField('Password', this.renderPasswordEditor()), _.if(User.current.isAdmin && !this.hidePermissions, this.renderField('Is admin', this.renderAdminEditor()), _.if(!this.model.isAdmin, _.each(this.projects, function (i, project) {
	                return _.div({ class: 'project', 'data-id': project }, _.div({ class: 'project-header' }, UI.inputSwitch(_this5.model.hasScope(project), function (newValue) {
	                    if (newValue) {
	                        _this5.model.giveScope(project);
	                    } else {
	                        _this5.model.removeScope(project);

	                        _this5.$element.find('.project[data-id="' + project + '"] .chip-group .chip').remove();
	                    }
	                }), _.h4({ class: 'project-title' }, project)), _.div({ class: 'project-scopes' }, _.p('Scopes:'), _this5.renderScopesEditor(project)));
	            }))));
	        }
	    }]);

	    return UserEditor;
	}(View);

	module.exports = UserEditor;

/***/ },
/* 115 */,
/* 116 */,
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var crypto = __webpack_require__(118);

	/**
	 * The base class for everything
	 */

	var Entity = function () {
	    /**
	     * Constructs an entity
	     *
	     * @param {Object} properties
	     */
	    function Entity(properties) {
	        _classCallCheck(this, Entity);

	        this.structure();

	        Object.seal(this);

	        for (var k in properties) {
	            try {
	                if (typeof properties[k] !== 'undefined') {
	                    this[k] = properties[k];
	                }
	            } catch (e) {
	                debug.log(e.message, this);
	            }
	        }
	    }

	    /**
	     * Sets up a structure before sealing the object
	     */


	    _createClass(Entity, [{
	        key: 'structure',
	        value: function structure() {}

	        /**
	         * Generates a new random id
	         *
	         * @returns {String} id
	         */

	    }, {
	        key: 'getObject',


	        /**
	         * Gets a copy of every field in this object as a mutable object
	         *
	         * @returns {Object} object
	         */
	        value: function getObject() {
	            var fields = {};

	            for (var k in this) {
	                var v = this[k];

	                if (typeof v !== 'function') {
	                    fields[k] = v;
	                }
	            }

	            return fields;
	        }

	        /**
	         * Defines a type safe member variable
	         *
	         * @param {String} type
	         * @param {String} name
	         * @param {Anything} defaultValue
	         */

	    }, {
	        key: 'def',
	        value: function def(type, name, defaultValue) {
	            var _this = this;

	            if (typeof type !== 'function') {
	                throw new TypeError('Parameter \'type\' cannot be of type \'' + (typeof type === 'undefined' ? 'undefined' : _typeof(type)) + '\'.');
	            }

	            if (typeof name !== 'string') {
	                throw new TypeError('Parameter \'name\' cannot be of type \'' + (typeof name === 'undefined' ? 'undefined' : _typeof(name)) + '\'.');
	            }

	            if (typeof defaultValue === 'undefined') {
	                switch (type) {
	                    case String:
	                        defaultValue = '';
	                        break;

	                    case Number:
	                        defaultValue = 0;
	                        break;

	                    case Date:
	                        defaultValue = null;
	                        break;

	                    case Boolean:
	                        defaultValue = false;
	                        break;

	                    default:
	                        defaultValue = null;
	                        break;
	                }
	            }

	            var thisValue = defaultValue;
	            var thisType = type;

	            Object.defineProperty(this, name, {
	                enumerable: true,
	                get: function get() {
	                    return thisValue;
	                },
	                set: function set(thatValue) {
	                    // Auto cast for Booleans
	                    if (thisType == Boolean) {
	                        if (!thatValue) {
	                            thatValue = false;
	                        } else if (typeof thatValue === 'string') {
	                            if (thatValue === 'false') {
	                                thatValue = false;
	                            } else if (thatValue === 'true') {
	                                thatValue = true;
	                            }
	                        }
	                    }

	                    // Auto cast for numbers
	                    if (thisType == Number) {
	                        if (!thatValue) {
	                            thatValue = 0;
	                        } else if (thatValue.constructor == String && !isNaN(thatValue)) {
	                            thatValue = parseFloat(thatValue);
	                        }
	                    }

	                    // Auto cast for dates
	                    if (thisType == Date) {
	                        if (!thatValue) {
	                            thatValue = null;
	                        } else if (thatValue.constructor == String || thatValue.constructor == Number) {
	                            thatValue = new Date(thatValue);
	                        }
	                    }

	                    if (typeof thatValue !== 'undefined') {
	                        if (thatValue == null) {
	                            thisValue = thatValue;
	                            return;
	                        }

	                        var thatType = thatValue.constructor;

	                        if (thisType !== thatType) {
	                            throw new TypeError(_this.constructor.name + '.' + name + ' is of type \'' + thisType.name + '\' and cannot implicitly be converted to \'' + thatType.name + '\'.');
	                        } else {
	                            thisValue = thatValue;
	                        }
	                    } else {
	                        thisValue = defaultValue;
	                    }
	                }
	            });
	        }
	    }], [{
	        key: 'createId',
	        value: function createId() {
	            return crypto.randomBytes(20).toString('hex');
	        }
	    }]);

	    return Entity;
	}();

	module.exports = Entity;

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var rng = __webpack_require__(123);

	function error() {
	  var m = [].slice.call(arguments).join(' ');
	  throw new Error([m, 'we accept pull requests', 'http://github.com/dominictarr/crypto-browserify'].join('\n'));
	}

	exports.createHash = __webpack_require__(125);

	exports.createHmac = __webpack_require__(137);

	exports.randomBytes = function (size, callback) {
	  if (callback && callback.call) {
	    try {
	      callback.call(this, undefined, new Buffer(rng(size)));
	    } catch (err) {
	      callback(err);
	    }
	  } else {
	    return new Buffer(rng(size));
	  }
	};

	function each(a, f) {
	  for (var i in a) {
	    f(a[i], i);
	  }
	}

	exports.getHashes = function () {
	  return ['sha1', 'sha256', 'sha512', 'md5', 'rmd160'];
	};

	var p = __webpack_require__(138)(exports);
	exports.pbkdf2 = p.pbkdf2;
	exports.pbkdf2Sync = p.pbkdf2Sync;
	__webpack_require__(140)(exports, module.exports);

	// the least I can do is make error messages for the rest of the node.js/crypto api.
	each(['createCredentials', 'createSign', 'createVerify', 'createDiffieHellman'], function (name) {
	  exports[name] = function () {
	    error('sorry,', name, 'is not implemented yet');
	  };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict';

	var base64 = __webpack_require__(120);
	var ieee754 = __webpack_require__(121);
	var isArray = __webpack_require__(122);

	exports.Buffer = Buffer;
	exports.SlowBuffer = SlowBuffer;
	exports.INSPECT_MAX_BYTES = 50;

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength();

	function typedArraySupport() {
	  try {
	    var arr = new Uint8Array(1);
	    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
	        return 42;
	      } };
	    return arr.foo() === 42 && // typed array instances can be augmented
	    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
	  } catch (e) {
	    return false;
	  }
	}

	function kMaxLength() {
	  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
	}

	function createBuffer(that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length');
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length);
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length);
	    }
	    that.length = length;
	  }

	  return that;
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer(arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length);
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error('If encoding is specified then the first argument must be a string');
	    }
	    return allocUnsafe(this, arg);
	  }
	  return from(this, arg, encodingOrOffset, length);
	}

	Buffer.poolSize = 8192; // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype;
	  return arr;
	};

	function from(that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number');
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length);
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset);
	  }

	  return fromObject(that, value);
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length);
	};

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	  if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    });
	  }
	}

	function assertSize(size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number');
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative');
	  }
	}

	function alloc(that, size, fill, encoding) {
	  assertSize(size);
	  if (size <= 0) {
	    return createBuffer(that, size);
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
	  }
	  return createBuffer(that, size);
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding);
	};

	function allocUnsafe(that, size) {
	  assertSize(size);
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0;
	    }
	  }
	  return that;
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size);
	};
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size);
	};

	function fromString(that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8';
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding');
	  }

	  var length = byteLength(string, encoding) | 0;
	  that = createBuffer(that, length);

	  var actual = that.write(string, encoding);

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual);
	  }

	  return that;
	}

	function fromArrayLike(that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0;
	  that = createBuffer(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	function fromArrayBuffer(that, array, byteOffset, length) {
	  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds');
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds');
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array);
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset);
	  } else {
	    array = new Uint8Array(array, byteOffset, length);
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array;
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array);
	  }
	  return that;
	}

	function fromObject(that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0;
	    that = createBuffer(that, len);

	    if (that.length === 0) {
	      return that;
	    }

	    obj.copy(that, 0, 0, len);
	    return that;
	  }

	  if (obj) {
	    if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0);
	      }
	      return fromArrayLike(that, obj);
	    }

	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data);
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
	}

	function checked(length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
	  }
	  return length | 0;
	}

	function SlowBuffer(length) {
	  if (+length != length) {
	    // eslint-disable-line eqeqeq
	    length = 0;
	  }
	  return Buffer.alloc(+length);
	}

	Buffer.isBuffer = function isBuffer(b) {
	  return !!(b != null && b._isBuffer);
	};

	Buffer.compare = function compare(a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers');
	  }

	  if (a === b) return 0;

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break;
	    }
	  }

	  if (x < y) return -1;
	  if (y < x) return 1;
	  return 0;
	};

	Buffer.isEncoding = function isEncoding(encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true;
	    default:
	      return false;
	  }
	};

	Buffer.concat = function concat(list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers');
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0);
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length;
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length);
	  var pos = 0;
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i];
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers');
	    }
	    buf.copy(buffer, pos);
	    pos += buf.length;
	  }
	  return buffer;
	};

	function byteLength(string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length;
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength;
	  }
	  if (typeof string !== 'string') {
	    string = '' + string;
	  }

	  var len = string.length;
	  if (len === 0) return 0;

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len;
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length;
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2;
	      case 'hex':
	        return len >>> 1;
	      case 'base64':
	        return base64ToBytes(string).length;
	      default:
	        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	function slowToString(encoding, start, end) {
	  var loweredCase = false;

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0;
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return '';
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length;
	  }

	  if (end <= 0) {
	    return '';
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0;
	  start >>>= 0;

	  if (end <= start) {
	    return '';
	  }

	  if (!encoding) encoding = 'utf8';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end);

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end);

	      case 'ascii':
	        return asciiSlice(this, start, end);

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end);

	      case 'base64':
	        return base64Slice(this, start, end);

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end);

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true;

	function swap(b, n, m) {
	  var i = b[n];
	  b[n] = b[m];
	  b[m] = i;
	}

	Buffer.prototype.swap16 = function swap16() {
	  var len = this.length;
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits');
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1);
	  }
	  return this;
	};

	Buffer.prototype.swap32 = function swap32() {
	  var len = this.length;
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits');
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3);
	    swap(this, i + 1, i + 2);
	  }
	  return this;
	};

	Buffer.prototype.swap64 = function swap64() {
	  var len = this.length;
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits');
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7);
	    swap(this, i + 1, i + 6);
	    swap(this, i + 2, i + 5);
	    swap(this, i + 3, i + 4);
	  }
	  return this;
	};

	Buffer.prototype.toString = function toString() {
	  var length = this.length | 0;
	  if (length === 0) return '';
	  if (arguments.length === 0) return utf8Slice(this, 0, length);
	  return slowToString.apply(this, arguments);
	};

	Buffer.prototype.equals = function equals(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return true;
	  return Buffer.compare(this, b) === 0;
	};

	Buffer.prototype.inspect = function inspect() {
	  var str = '';
	  var max = exports.INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>';
	};

	Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer');
	  }

	  if (start === undefined) {
	    start = 0;
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0;
	  }
	  if (thisStart === undefined) {
	    thisStart = 0;
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length;
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index');
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0;
	  }
	  if (thisStart >= thisEnd) {
	    return -1;
	  }
	  if (start >= end) {
	    return 1;
	  }

	  start >>>= 0;
	  end >>>= 0;
	  thisStart >>>= 0;
	  thisEnd >>>= 0;

	  if (this === target) return 0;

	  var x = thisEnd - thisStart;
	  var y = end - start;
	  var len = Math.min(x, y);

	  var thisCopy = this.slice(thisStart, thisEnd);
	  var targetCopy = target.slice(start, end);

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i];
	      y = targetCopy[i];
	      break;
	    }
	  }

	  if (x < y) return -1;
	  if (y < x) return 1;
	  return 0;
	};

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1;

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset;
	    byteOffset = 0;
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff;
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000;
	  }
	  byteOffset = +byteOffset; // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : buffer.length - 1;
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1;else byteOffset = buffer.length - 1;
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0;else return -1;
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding);
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1;
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
	  } else if (typeof val === 'number') {
	    val = val & 0xFF; // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
	      }
	    }
	    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
	  }

	  throw new TypeError('val must be string, number or Buffer');
	}

	function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1;
	  var arrLength = arr.length;
	  var valLength = val.length;

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase();
	    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1;
	      }
	      indexSize = 2;
	      arrLength /= 2;
	      valLength /= 2;
	      byteOffset /= 2;
	    }
	  }

	  function read(buf, i) {
	    if (indexSize === 1) {
	      return buf[i];
	    } else {
	      return buf.readUInt16BE(i * indexSize);
	    }
	  }

	  var i;
	  if (dir) {
	    var foundIndex = -1;
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex;
	        foundIndex = -1;
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true;
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false;
	          break;
	        }
	      }
	      if (found) return i;
	    }
	  }

	  return -1;
	}

	Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1;
	};

	Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
	};

	Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
	};

	function hexWrite(buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) return i;
	    buf[offset + i] = parsed;
	  }
	  return i;
	}

	function utf8Write(buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
	}

	function asciiWrite(buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length);
	}

	function latin1Write(buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length);
	}

	function base64Write(buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length);
	}

	function ucs2Write(buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
	}

	Buffer.prototype.write = function write(string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	    // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0;
	    // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0;
	    if (isFinite(length)) {
	      length = length | 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	    // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
	  }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds');
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length);

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length);

	      case 'ascii':
	        return asciiWrite(this, string, offset, length);

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length);

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length);

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length);

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON() {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  };
	};

	function base64Slice(buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf);
	  } else {
	    return base64.fromByteArray(buf.slice(start, end));
	  }
	}

	function utf8Slice(buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break;
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res);
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray(codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
	  }
	  return res;
	}

	function asciiSlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret;
	}

	function latin1Slice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret;
	}

	function hexSlice(buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i]);
	  }
	  return out;
	}

	function utf16leSlice(buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res;
	}

	Buffer.prototype.slice = function slice(start, end) {
	  var len = this.length;
	  start = ~~start;
	  end = end === undefined ? len : ~~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end);
	    newBuf.__proto__ = Buffer.prototype;
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  return newBuf;
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset(offset, ext, length) {
	  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
	}

	Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val;
	};

	Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val;
	};

	Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset];
	};

	Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | this[offset + 1] << 8;
	};

	Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] << 8 | this[offset + 1];
	};

	Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
	};

	Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
	};

	Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val;
	};

	Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val;
	};

	Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return this[offset];
	  return (0xff - this[offset] + 1) * -1;
	};

	Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | this[offset + 1] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};

	Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | this[offset] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};

	Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
	};

	Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
	};

	Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, true, 23, 4);
	};

	Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, false, 23, 4);
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, true, 52, 8);
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, false, 52, 8);
	};

	function checkInt(buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('Index out of range');
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = value & 0xff;
	  return offset + 1;
	};

	function objectWriteUInt16(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};

	function objectWriteUInt32(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = value >>> 24;
	    this[offset + 2] = value >>> 16;
	    this[offset + 1] = value >>> 8;
	    this[offset] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = value & 0xff;
	  return offset + 1;
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	    this[offset + 2] = value >>> 16;
	    this[offset + 3] = value >>> 24;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};

	function checkIEEE754(buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range');
	  if (offset < 0) throw new RangeError('Index out of range');
	}

	function writeFloat(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4;
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert);
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert);
	};

	function writeDouble(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8;
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert);
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert);
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy(target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0;
	  if (target.length === 0 || this.length === 0) return 0;

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds');
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
	  if (end < 0) throw new RangeError('sourceEnd out of bounds');

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
	  }

	  return len;
	};

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill(val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start;
	      start = 0;
	      end = this.length;
	    } else if (typeof end === 'string') {
	      encoding = end;
	      end = this.length;
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0);
	      if (code < 256) {
	        val = code;
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string');
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding);
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255;
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index');
	  }

	  if (end <= start) {
	    return this;
	  }

	  start = start >>> 0;
	  end = end === undefined ? this.length : end >>> 0;

	  if (!val) val = 0;

	  var i;
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val;
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
	    var len = bytes.length;
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len];
	    }
	  }

	  return this;
	};

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean(str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return '';
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str;
	}

	function stringtrim(str) {
	  if (str.trim) return str.trim();
	  return str.replace(/^\s+|\s+$/g, '');
	}

	function toHex(n) {
	  if (n < 16) return '0' + n.toString(16);
	  return n.toString(16);
	}

	function utf8ToBytes(string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue;
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue;
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break;
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break;
	      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break;
	      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break;
	      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else {
	      throw new Error('Invalid code point');
	    }
	  }

	  return bytes;
	}

	function asciiToBytes(str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray;
	}

	function utf16leToBytes(str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break;

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray;
	}

	function base64ToBytes(str) {
	  return base64.toByteArray(base64clean(str));
	}

	function blitBuffer(src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if (i + offset >= dst.length || i >= src.length) break;
	    dst[i + offset] = src[i];
	  }
	  return i;
	}

	function isnan(val) {
	  return val !== val; // eslint-disable-line no-self-compare
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 120 */
/***/ function(module, exports) {

	'use strict';

	exports.byteLength = byteLength;
	exports.toByteArray = toByteArray;
	exports.fromByteArray = fromByteArray;

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i];
	  revLookup[code.charCodeAt(i)] = i;
	}

	revLookup['-'.charCodeAt(0)] = 62;
	revLookup['_'.charCodeAt(0)] = 63;

	function placeHoldersCount(b64) {
	  var len = b64.length;
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4');
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
	}

	function byteLength(b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return b64.length * 3 / 4 - placeHoldersCount(b64);
	}

	function toByteArray(b64) {
	  var i, j, l, tmp, placeHolders, arr;
	  var len = b64.length;
	  placeHolders = placeHoldersCount(b64);

	  arr = new Arr(len * 3 / 4 - placeHolders);

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len;

	  var L = 0;

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
	    arr[L++] = tmp >> 16 & 0xFF;
	    arr[L++] = tmp >> 8 & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  if (placeHolders === 2) {
	    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
	    arr[L++] = tmp & 0xFF;
	  } else if (placeHolders === 1) {
	    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
	    arr[L++] = tmp >> 8 & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  return arr;
	}

	function tripletToBase64(num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
	}

	function encodeChunk(uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('');
	}

	function fromByteArray(uint8) {
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var output = '';
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    output += lookup[tmp >> 2];
	    output += lookup[tmp << 4 & 0x3F];
	    output += '==';
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
	    output += lookup[tmp >> 10];
	    output += lookup[tmp >> 4 & 0x3F];
	    output += lookup[tmp << 2 & 0x3F];
	    output += '=';
	  }

	  parts.push(output);

	  return parts.join('');
	}

/***/ },
/* 121 */
/***/ function(module, exports) {

	"use strict";

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? nBytes - 1 : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & (1 << -nBits) - 1;
	  s >>= -nBits;
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : (s ? -1 : 1) * Infinity;
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
	  var i = isLE ? 0 : nBytes - 1;
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = e << mLen | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	};

/***/ },
/* 122 */
/***/ function(module, exports) {

	'use strict';

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {'use strict';

	(function () {
	  var g = ('undefined' === typeof window ? global : window) || {};
	  _crypto = g.crypto || g.msCrypto || __webpack_require__(124);
	  module.exports = function (size) {
	    // Modern Browsers
	    if (_crypto.getRandomValues) {
	      var bytes = new Buffer(size); //in browserify, this is an extended Uint8Array
	      /* This will not work in older browsers.
	       * See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
	       */

	      _crypto.getRandomValues(bytes);
	      return bytes;
	    } else if (_crypto.randomBytes) {
	      return _crypto.randomBytes(size);
	    } else throw new Error('secure random number generation not supported by this browser\n' + 'use chrome, FireFox or Internet Explorer 11');
	  };
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(119).Buffer))

/***/ },
/* 124 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var createHash = __webpack_require__(126);

	var md5 = toConstructor(__webpack_require__(134));
	var rmd160 = toConstructor(__webpack_require__(136));

	function toConstructor(fn) {
	  return function () {
	    var buffers = [];
	    var m = {
	      update: function update(data, enc) {
	        if (!Buffer.isBuffer(data)) data = new Buffer(data, enc);
	        buffers.push(data);
	        return this;
	      },
	      digest: function digest(enc) {
	        var buf = Buffer.concat(buffers);
	        var r = fn(buf);
	        buffers = null;
	        return enc ? r.toString(enc) : r;
	      }
	    };
	    return m;
	  };
	}

	module.exports = function (alg) {
	  if ('md5' === alg) return new md5();
	  if ('rmd160' === alg) return new rmd160();
	  return createHash(alg);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _exports = module.exports = function (alg) {
	  var Alg = _exports[alg];
	  if (!Alg) throw new Error(alg + ' is not supported (we accept pull requests)');
	  return new Alg();
	};

	var Buffer = __webpack_require__(119).Buffer;
	var Hash = __webpack_require__(127)(Buffer);

	_exports.sha1 = __webpack_require__(128)(Buffer, Hash);
	_exports.sha256 = __webpack_require__(132)(Buffer, Hash);
	_exports.sha512 = __webpack_require__(133)(Buffer, Hash);

/***/ },
/* 127 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (Buffer) {

	  //prototype class for hash functions
	  function Hash(blockSize, finalSize) {
	    this._block = new Buffer(blockSize); //new Uint32Array(blockSize/4)
	    this._finalSize = finalSize;
	    this._blockSize = blockSize;
	    this._len = 0;
	    this._s = 0;
	  }

	  Hash.prototype.init = function () {
	    this._s = 0;
	    this._len = 0;
	  };

	  Hash.prototype.update = function (data, enc) {
	    if ("string" === typeof data) {
	      enc = enc || "utf8";
	      data = new Buffer(data, enc);
	    }

	    var l = this._len += data.length;
	    var s = this._s = this._s || 0;
	    var f = 0;
	    var buffer = this._block;

	    while (s < l) {
	      var t = Math.min(data.length, f + this._blockSize - s % this._blockSize);
	      var ch = t - f;

	      for (var i = 0; i < ch; i++) {
	        buffer[s % this._blockSize + i] = data[i + f];
	      }

	      s += ch;
	      f += ch;

	      if (s % this._blockSize === 0) {
	        this._update(buffer);
	      }
	    }
	    this._s = s;

	    return this;
	  };

	  Hash.prototype.digest = function (enc) {
	    // Suppose the length of the message M, in bits, is l
	    var l = this._len * 8;

	    // Append the bit 1 to the end of the message
	    this._block[this._len % this._blockSize] = 0x80;

	    // and then k zero bits, where k is the smallest non-negative solution to the equation (l + 1 + k) === finalSize mod blockSize
	    this._block.fill(0, this._len % this._blockSize + 1);

	    if (l % (this._blockSize * 8) >= this._finalSize * 8) {
	      this._update(this._block);
	      this._block.fill(0);
	    }

	    // to this append the block which is equal to the number l written in binary
	    // TODO: handle case where l is > Math.pow(2, 29)
	    this._block.writeInt32BE(l, this._blockSize - 4);

	    var hash = this._update(this._block) || this._hash();

	    return enc ? hash.toString(enc) : hash;
	  };

	  Hash.prototype._update = function () {
	    throw new Error('_update must be implemented by subclass');
	  };

	  return Hash;
	};

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS PUB 180-1
	 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for details.
	 */

	var inherits = __webpack_require__(129).inherits;

	module.exports = function (Buffer, Hash) {

	  var A = 0 | 0;
	  var B = 4 | 0;
	  var C = 8 | 0;
	  var D = 12 | 0;
	  var E = 16 | 0;

	  var W = new (typeof Int32Array === 'undefined' ? Array : Int32Array)(80);

	  var POOL = [];

	  function Sha1() {
	    if (POOL.length) return POOL.pop().init();

	    if (!(this instanceof Sha1)) return new Sha1();
	    this._w = W;
	    Hash.call(this, 16 * 4, 14 * 4);

	    this._h = null;
	    this.init();
	  }

	  inherits(Sha1, Hash);

	  Sha1.prototype.init = function () {
	    this._a = 0x67452301;
	    this._b = 0xefcdab89;
	    this._c = 0x98badcfe;
	    this._d = 0x10325476;
	    this._e = 0xc3d2e1f0;

	    Hash.prototype.init.call(this);
	    return this;
	  };

	  Sha1.prototype._POOL = POOL;
	  Sha1.prototype._update = function (X) {

	    var a, b, c, d, e, _a, _b, _c, _d, _e;

	    a = _a = this._a;
	    b = _b = this._b;
	    c = _c = this._c;
	    d = _d = this._d;
	    e = _e = this._e;

	    var w = this._w;

	    for (var j = 0; j < 80; j++) {
	      var W = w[j] = j < 16 ? X.readInt32BE(j * 4) : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);

	      var t = add(add(rol(a, 5), sha1_ft(j, b, c, d)), add(add(e, W), sha1_kt(j)));

	      e = d;
	      d = c;
	      c = rol(b, 30);
	      b = a;
	      a = t;
	    }

	    this._a = add(a, _a);
	    this._b = add(b, _b);
	    this._c = add(c, _c);
	    this._d = add(d, _d);
	    this._e = add(e, _e);
	  };

	  Sha1.prototype._hash = function () {
	    if (POOL.length < 100) POOL.push(this);
	    var H = new Buffer(20);
	    //console.log(this._a|0, this._b|0, this._c|0, this._d|0, this._e|0)
	    H.writeInt32BE(this._a | 0, A);
	    H.writeInt32BE(this._b | 0, B);
	    H.writeInt32BE(this._c | 0, C);
	    H.writeInt32BE(this._d | 0, D);
	    H.writeInt32BE(this._e | 0, E);
	    return H;
	  };

	  /*
	   * Perform the appropriate triplet combination function for the current
	   * iteration
	   */
	  function sha1_ft(t, b, c, d) {
	    if (t < 20) return b & c | ~b & d;
	    if (t < 40) return b ^ c ^ d;
	    if (t < 60) return b & c | b & d | c & d;
	    return b ^ c ^ d;
	  }

	  /*
	   * Determine the appropriate additive constant for the current iteration
	   */
	  function sha1_kt(t) {
	    return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
	  }

	  /*
	   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	   * to work around bugs in some JS interpreters.
	   * //dominictarr: this is 10 years old, so maybe this can be dropped?)
	   *
	   */
	  function add(x, y) {
	    return x + y | 0;
	    //lets see how this goes on testling.
	    //  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	    //  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	    //  return (msw << 16) | (lsw & 0xFFFF);
	  }

	  /*
	   * Bitwise rotate a 32-bit number to the left.
	   */
	  function rol(num, cnt) {
	    return num << cnt | num >>> 32 - cnt;
	  }

	  return Sha1;
	};

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function (f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function (x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s':
	        return String(args[i++]);
	      case '%d':
	        return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};

	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function (fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function () {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};

	var debugs = {};
	var debugEnviron;
	exports.debuglog = function (set) {
	  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function () {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function () {};
	    }
	  }
	  return debugs[set];
	};

	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;

	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold': [1, 22],
	  'italic': [3, 23],
	  'underline': [4, 24],
	  'inverse': [7, 27],
	  'white': [37, 39],
	  'grey': [90, 39],
	  'black': [30, 39],
	  'blue': [34, 39],
	  'cyan': [36, 39],
	  'green': [32, 39],
	  'magenta': [35, 39],
	  'red': [31, 39],
	  'yellow': [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};

	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\x1B[' + inspect.colors[style][0] + 'm' + str + '\x1B[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}

	function stylizeNoColor(str, styleType) {
	  return str;
	}

	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function (val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}

	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect && value && isFunction(value.inspect) &&
	  // Filter out the util module, it's inspect function is special
	  value.inspect !== exports.inspect &&
	  // Also filter out any prototype objects using the circular check.
	  !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '',
	      array = false,
	      braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function (key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}

	function formatPrimitive(ctx, value) {
	  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value)) return ctx.stylize('' + value, 'number');
	  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value)) return ctx.stylize('null', 'null');
	}

	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}

	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function (key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
	    }
	  });
	  return output;
	}

	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function (line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function (line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}

	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function (prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}

	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol' || // ES6 symbol
	  typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(130);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}

	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}

	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function () {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};

	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(131);

	exports._extend = function (origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(14)))

/***/ },
/* 130 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	module.exports = function isBuffer(arg) {
	  return arg && (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
	};

/***/ },
/* 131 */
/***/ function(module, exports) {

	'use strict';

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function TempCtor() {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
	 * in FIPS 180-2
	 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 *
	 */

	var inherits = __webpack_require__(129).inherits;

	module.exports = function (Buffer, Hash) {

	  var K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];

	  var W = new Array(64);

	  function Sha256() {
	    this.init();

	    this._w = W; //new Array(64)

	    Hash.call(this, 16 * 4, 14 * 4);
	  }

	  inherits(Sha256, Hash);

	  Sha256.prototype.init = function () {

	    this._a = 0x6a09e667 | 0;
	    this._b = 0xbb67ae85 | 0;
	    this._c = 0x3c6ef372 | 0;
	    this._d = 0xa54ff53a | 0;
	    this._e = 0x510e527f | 0;
	    this._f = 0x9b05688c | 0;
	    this._g = 0x1f83d9ab | 0;
	    this._h = 0x5be0cd19 | 0;

	    this._len = this._s = 0;

	    return this;
	  };

	  function S(X, n) {
	    return X >>> n | X << 32 - n;
	  }

	  function R(X, n) {
	    return X >>> n;
	  }

	  function Ch(x, y, z) {
	    return x & y ^ ~x & z;
	  }

	  function Maj(x, y, z) {
	    return x & y ^ x & z ^ y & z;
	  }

	  function Sigma0256(x) {
	    return S(x, 2) ^ S(x, 13) ^ S(x, 22);
	  }

	  function Sigma1256(x) {
	    return S(x, 6) ^ S(x, 11) ^ S(x, 25);
	  }

	  function Gamma0256(x) {
	    return S(x, 7) ^ S(x, 18) ^ R(x, 3);
	  }

	  function Gamma1256(x) {
	    return S(x, 17) ^ S(x, 19) ^ R(x, 10);
	  }

	  Sha256.prototype._update = function (M) {

	    var W = this._w;
	    var a, b, c, d, e, f, g, h;
	    var T1, T2;

	    a = this._a | 0;
	    b = this._b | 0;
	    c = this._c | 0;
	    d = this._d | 0;
	    e = this._e | 0;
	    f = this._f | 0;
	    g = this._g | 0;
	    h = this._h | 0;

	    for (var j = 0; j < 64; j++) {
	      var w = W[j] = j < 16 ? M.readInt32BE(j * 4) : Gamma1256(W[j - 2]) + W[j - 7] + Gamma0256(W[j - 15]) + W[j - 16];

	      T1 = h + Sigma1256(e) + Ch(e, f, g) + K[j] + w;

	      T2 = Sigma0256(a) + Maj(a, b, c);
	      h = g;g = f;f = e;e = d + T1;d = c;c = b;b = a;a = T1 + T2;
	    }

	    this._a = a + this._a | 0;
	    this._b = b + this._b | 0;
	    this._c = c + this._c | 0;
	    this._d = d + this._d | 0;
	    this._e = e + this._e | 0;
	    this._f = f + this._f | 0;
	    this._g = g + this._g | 0;
	    this._h = h + this._h | 0;
	  };

	  Sha256.prototype._hash = function () {
	    var H = new Buffer(32);

	    H.writeInt32BE(this._a, 0);
	    H.writeInt32BE(this._b, 4);
	    H.writeInt32BE(this._c, 8);
	    H.writeInt32BE(this._d, 12);
	    H.writeInt32BE(this._e, 16);
	    H.writeInt32BE(this._f, 20);
	    H.writeInt32BE(this._g, 24);
	    H.writeInt32BE(this._h, 28);

	    return H;
	  };

	  return Sha256;
	};

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(129).inherits;

	module.exports = function (Buffer, Hash) {
	  var K = [0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd, 0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc, 0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019, 0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118, 0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe, 0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2, 0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1, 0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694, 0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3, 0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65, 0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483, 0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5, 0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210, 0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4, 0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725, 0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70, 0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926, 0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df, 0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8, 0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b, 0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001, 0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30, 0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910, 0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8, 0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53, 0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8, 0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb, 0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3, 0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60, 0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec, 0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9, 0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b, 0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207, 0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178, 0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6, 0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b, 0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493, 0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c, 0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a, 0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817];

	  var W = new Array(160);

	  function Sha512() {
	    this.init();
	    this._w = W;

	    Hash.call(this, 128, 112);
	  }

	  inherits(Sha512, Hash);

	  Sha512.prototype.init = function () {

	    this._a = 0x6a09e667 | 0;
	    this._b = 0xbb67ae85 | 0;
	    this._c = 0x3c6ef372 | 0;
	    this._d = 0xa54ff53a | 0;
	    this._e = 0x510e527f | 0;
	    this._f = 0x9b05688c | 0;
	    this._g = 0x1f83d9ab | 0;
	    this._h = 0x5be0cd19 | 0;

	    this._al = 0xf3bcc908 | 0;
	    this._bl = 0x84caa73b | 0;
	    this._cl = 0xfe94f82b | 0;
	    this._dl = 0x5f1d36f1 | 0;
	    this._el = 0xade682d1 | 0;
	    this._fl = 0x2b3e6c1f | 0;
	    this._gl = 0xfb41bd6b | 0;
	    this._hl = 0x137e2179 | 0;

	    this._len = this._s = 0;

	    return this;
	  };

	  function S(X, Xl, n) {
	    return X >>> n | Xl << 32 - n;
	  }

	  function Ch(x, y, z) {
	    return x & y ^ ~x & z;
	  }

	  function Maj(x, y, z) {
	    return x & y ^ x & z ^ y & z;
	  }

	  Sha512.prototype._update = function (M) {

	    var W = this._w;
	    var a, b, c, d, e, f, g, h;
	    var al, bl, cl, dl, el, fl, gl, hl;

	    a = this._a | 0;
	    b = this._b | 0;
	    c = this._c | 0;
	    d = this._d | 0;
	    e = this._e | 0;
	    f = this._f | 0;
	    g = this._g | 0;
	    h = this._h | 0;

	    al = this._al | 0;
	    bl = this._bl | 0;
	    cl = this._cl | 0;
	    dl = this._dl | 0;
	    el = this._el | 0;
	    fl = this._fl | 0;
	    gl = this._gl | 0;
	    hl = this._hl | 0;

	    for (var i = 0; i < 80; i++) {
	      var j = i * 2;

	      var Wi, Wil;

	      if (i < 16) {
	        Wi = W[j] = M.readInt32BE(j * 4);
	        Wil = W[j + 1] = M.readInt32BE(j * 4 + 4);
	      } else {
	        var x = W[j - 15 * 2];
	        var xl = W[j - 15 * 2 + 1];
	        var gamma0 = S(x, xl, 1) ^ S(x, xl, 8) ^ x >>> 7;
	        var gamma0l = S(xl, x, 1) ^ S(xl, x, 8) ^ S(xl, x, 7);

	        x = W[j - 2 * 2];
	        xl = W[j - 2 * 2 + 1];
	        var gamma1 = S(x, xl, 19) ^ S(xl, x, 29) ^ x >>> 6;
	        var gamma1l = S(xl, x, 19) ^ S(x, xl, 29) ^ S(xl, x, 6);

	        // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
	        var Wi7 = W[j - 7 * 2];
	        var Wi7l = W[j - 7 * 2 + 1];

	        var Wi16 = W[j - 16 * 2];
	        var Wi16l = W[j - 16 * 2 + 1];

	        Wil = gamma0l + Wi7l;
	        Wi = gamma0 + Wi7 + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
	        Wil = Wil + gamma1l;
	        Wi = Wi + gamma1 + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
	        Wil = Wil + Wi16l;
	        Wi = Wi + Wi16 + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);

	        W[j] = Wi;
	        W[j + 1] = Wil;
	      }

	      var maj = Maj(a, b, c);
	      var majl = Maj(al, bl, cl);

	      var sigma0h = S(a, al, 28) ^ S(al, a, 2) ^ S(al, a, 7);
	      var sigma0l = S(al, a, 28) ^ S(a, al, 2) ^ S(a, al, 7);
	      var sigma1h = S(e, el, 14) ^ S(e, el, 18) ^ S(el, e, 9);
	      var sigma1l = S(el, e, 14) ^ S(el, e, 18) ^ S(e, el, 9);

	      // t1 = h + sigma1 + ch + K[i] + W[i]
	      var Ki = K[j];
	      var Kil = K[j + 1];

	      var ch = Ch(e, f, g);
	      var chl = Ch(el, fl, gl);

	      var t1l = hl + sigma1l;
	      var t1 = h + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
	      t1l = t1l + chl;
	      t1 = t1 + ch + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
	      t1l = t1l + Kil;
	      t1 = t1 + Ki + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
	      t1l = t1l + Wil;
	      t1 = t1 + Wi + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);

	      // t2 = sigma0 + maj
	      var t2l = sigma0l + majl;
	      var t2 = sigma0h + maj + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);

	      h = g;
	      hl = gl;
	      g = f;
	      gl = fl;
	      f = e;
	      fl = el;
	      el = dl + t1l | 0;
	      e = d + t1 + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
	      d = c;
	      dl = cl;
	      c = b;
	      cl = bl;
	      b = a;
	      bl = al;
	      al = t1l + t2l | 0;
	      a = t1 + t2 + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
	    }

	    this._al = this._al + al | 0;
	    this._bl = this._bl + bl | 0;
	    this._cl = this._cl + cl | 0;
	    this._dl = this._dl + dl | 0;
	    this._el = this._el + el | 0;
	    this._fl = this._fl + fl | 0;
	    this._gl = this._gl + gl | 0;
	    this._hl = this._hl + hl | 0;

	    this._a = this._a + a + (this._al >>> 0 < al >>> 0 ? 1 : 0) | 0;
	    this._b = this._b + b + (this._bl >>> 0 < bl >>> 0 ? 1 : 0) | 0;
	    this._c = this._c + c + (this._cl >>> 0 < cl >>> 0 ? 1 : 0) | 0;
	    this._d = this._d + d + (this._dl >>> 0 < dl >>> 0 ? 1 : 0) | 0;
	    this._e = this._e + e + (this._el >>> 0 < el >>> 0 ? 1 : 0) | 0;
	    this._f = this._f + f + (this._fl >>> 0 < fl >>> 0 ? 1 : 0) | 0;
	    this._g = this._g + g + (this._gl >>> 0 < gl >>> 0 ? 1 : 0) | 0;
	    this._h = this._h + h + (this._hl >>> 0 < hl >>> 0 ? 1 : 0) | 0;
	  };

	  Sha512.prototype._hash = function () {
	    var H = new Buffer(64);

	    function writeInt64BE(h, l, offset) {
	      H.writeInt32BE(h, offset);
	      H.writeInt32BE(l, offset + 4);
	    }

	    writeInt64BE(this._a, this._al, 0);
	    writeInt64BE(this._b, this._bl, 8);
	    writeInt64BE(this._c, this._cl, 16);
	    writeInt64BE(this._d, this._dl, 24);
	    writeInt64BE(this._e, this._el, 32);
	    writeInt64BE(this._f, this._fl, 40);
	    writeInt64BE(this._g, this._gl, 48);
	    writeInt64BE(this._h, this._hl, 56);

	    return H;
	  };

	  return Sha512;
	};

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */

	var helpers = __webpack_require__(135);

	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length
	 */
	function core_md5(x, len) {
	  /* append padding */
	  x[len >> 5] |= 0x80 << len % 32;
	  x[(len + 64 >>> 9 << 4) + 14] = len;

	  var a = 1732584193;
	  var b = -271733879;
	  var c = -1732584194;
	  var d = 271733878;

	  for (var i = 0; i < x.length; i += 16) {
	    var olda = a;
	    var oldb = b;
	    var oldc = c;
	    var oldd = d;

	    a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
	    d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
	    c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
	    b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
	    a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
	    d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
	    c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
	    b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
	    a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
	    d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
	    c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
	    b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
	    a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
	    d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
	    c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
	    b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

	    a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
	    d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
	    c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
	    b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
	    a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
	    d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
	    c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
	    b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
	    a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
	    d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
	    c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
	    b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
	    a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
	    d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
	    c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
	    b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

	    a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
	    d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
	    c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
	    b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
	    a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
	    d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
	    c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
	    b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
	    a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
	    d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
	    c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
	    b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
	    a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
	    d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
	    c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
	    b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

	    a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
	    d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
	    c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
	    b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
	    a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
	    d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
	    c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
	    b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
	    a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
	    d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
	    c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
	    b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
	    a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
	    d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
	    c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
	    b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

	    a = safe_add(a, olda);
	    b = safe_add(b, oldb);
	    c = safe_add(c, oldc);
	    d = safe_add(d, oldd);
	  }
	  return Array(a, b, c, d);
	}

	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	function md5_cmn(q, a, b, x, s, t) {
	  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
	}
	function md5_ff(a, b, c, d, x, s, t) {
	  return md5_cmn(b & c | ~b & d, a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t) {
	  return md5_cmn(b & d | c & ~d, a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t) {
	  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t) {
	  return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
	}

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y) {
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return msw << 16 | lsw & 0xFFFF;
	}

	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt) {
	  return num << cnt | num >>> 32 - cnt;
	}

	module.exports = function md5(buf) {
	  return helpers.hash(buf, core_md5, 16);
	};

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {"use strict";

	var intSize = 4;
	var zeroBuffer = new Buffer(intSize);zeroBuffer.fill(0);
	var chrsz = 8;

	function toArray(buf, bigEndian) {
	  if (buf.length % intSize !== 0) {
	    var len = buf.length + (intSize - buf.length % intSize);
	    buf = Buffer.concat([buf, zeroBuffer], len);
	  }

	  var arr = [];
	  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
	  for (var i = 0; i < buf.length; i += intSize) {
	    arr.push(fn.call(buf, i));
	  }
	  return arr;
	}

	function toBuffer(arr, size, bigEndian) {
	  var buf = new Buffer(size);
	  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
	  for (var i = 0; i < arr.length; i++) {
	    fn.call(buf, arr[i], i * 4, true);
	  }
	  return buf;
	}

	function hash(buf, fn, hashSize, bigEndian) {
	  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
	  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
	  return toBuffer(arr, hashSize, bigEndian);
	}

	module.exports = { hash: hash };
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	module.exports = ripemd160;

	/*
	CryptoJS v3.1.2
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	/** @preserve
	(c) 2012 by Cédric Mesnil. All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	// Constants table
	var zl = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13];
	var zr = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11];
	var sl = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6];
	var sr = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];

	var hl = [0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E];
	var hr = [0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000];

	var bytesToWords = function bytesToWords(bytes) {
	  var words = [];
	  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
	    words[b >>> 5] |= bytes[i] << 24 - b % 32;
	  }
	  return words;
	};

	var wordsToBytes = function wordsToBytes(words) {
	  var bytes = [];
	  for (var b = 0; b < words.length * 32; b += 8) {
	    bytes.push(words[b >>> 5] >>> 24 - b % 32 & 0xFF);
	  }
	  return bytes;
	};

	var processBlock = function processBlock(H, M, offset) {

	  // Swap endian
	  for (var i = 0; i < 16; i++) {
	    var offset_i = offset + i;
	    var M_offset_i = M[offset_i];

	    // Swap
	    M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 0x00ff00ff | (M_offset_i << 24 | M_offset_i >>> 8) & 0xff00ff00;
	  }

	  // Working variables
	  var al, bl, cl, dl, el;
	  var ar, br, cr, dr, er;

	  ar = al = H[0];
	  br = bl = H[1];
	  cr = cl = H[2];
	  dr = dl = H[3];
	  er = el = H[4];
	  // Computation
	  var t;
	  for (var i = 0; i < 80; i += 1) {
	    t = al + M[offset + zl[i]] | 0;
	    if (i < 16) {
	      t += f1(bl, cl, dl) + hl[0];
	    } else if (i < 32) {
	      t += f2(bl, cl, dl) + hl[1];
	    } else if (i < 48) {
	      t += f3(bl, cl, dl) + hl[2];
	    } else if (i < 64) {
	      t += f4(bl, cl, dl) + hl[3];
	    } else {
	      // if (i<80) {
	      t += f5(bl, cl, dl) + hl[4];
	    }
	    t = t | 0;
	    t = rotl(t, sl[i]);
	    t = t + el | 0;
	    al = el;
	    el = dl;
	    dl = rotl(cl, 10);
	    cl = bl;
	    bl = t;

	    t = ar + M[offset + zr[i]] | 0;
	    if (i < 16) {
	      t += f5(br, cr, dr) + hr[0];
	    } else if (i < 32) {
	      t += f4(br, cr, dr) + hr[1];
	    } else if (i < 48) {
	      t += f3(br, cr, dr) + hr[2];
	    } else if (i < 64) {
	      t += f2(br, cr, dr) + hr[3];
	    } else {
	      // if (i<80) {
	      t += f1(br, cr, dr) + hr[4];
	    }
	    t = t | 0;
	    t = rotl(t, sr[i]);
	    t = t + er | 0;
	    ar = er;
	    er = dr;
	    dr = rotl(cr, 10);
	    cr = br;
	    br = t;
	  }
	  // Intermediate hash value
	  t = H[1] + cl + dr | 0;
	  H[1] = H[2] + dl + er | 0;
	  H[2] = H[3] + el + ar | 0;
	  H[3] = H[4] + al + br | 0;
	  H[4] = H[0] + bl + cr | 0;
	  H[0] = t;
	};

	function f1(x, y, z) {
	  return x ^ y ^ z;
	}

	function f2(x, y, z) {
	  return x & y | ~x & z;
	}

	function f3(x, y, z) {
	  return (x | ~y) ^ z;
	}

	function f4(x, y, z) {
	  return x & z | y & ~z;
	}

	function f5(x, y, z) {
	  return x ^ (y | ~z);
	}

	function rotl(x, n) {
	  return x << n | x >>> 32 - n;
	}

	function ripemd160(message) {
	  var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];

	  if (typeof message == 'string') message = new Buffer(message, 'utf8');

	  var m = bytesToWords(message);

	  var nBitsLeft = message.length * 8;
	  var nBitsTotal = message.length * 8;

	  // Add padding
	  m[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
	  m[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 0x00ff00ff | (nBitsTotal << 24 | nBitsTotal >>> 8) & 0xff00ff00;

	  for (var i = 0; i < m.length; i += 16) {
	    processBlock(H, m, i);
	  }

	  // Swap endian
	  for (var i = 0; i < 5; i++) {
	    // Shortcut
	    var H_i = H[i];

	    // Swap
	    H[i] = (H_i << 8 | H_i >>> 24) & 0x00ff00ff | (H_i << 24 | H_i >>> 8) & 0xff00ff00;
	  }

	  var digestbytes = wordsToBytes(H);
	  return new Buffer(digestbytes);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var createHash = __webpack_require__(125);

	var zeroBuffer = new Buffer(128);
	zeroBuffer.fill(0);

	module.exports = Hmac;

	function Hmac(alg, key) {
	  if (!(this instanceof Hmac)) return new Hmac(alg, key);
	  this._opad = opad;
	  this._alg = alg;

	  var blocksize = alg === 'sha512' ? 128 : 64;

	  key = this._key = !Buffer.isBuffer(key) ? new Buffer(key) : key;

	  if (key.length > blocksize) {
	    key = createHash(alg).update(key).digest();
	  } else if (key.length < blocksize) {
	    key = Buffer.concat([key, zeroBuffer], blocksize);
	  }

	  var ipad = this._ipad = new Buffer(blocksize);
	  var opad = this._opad = new Buffer(blocksize);

	  for (var i = 0; i < blocksize; i++) {
	    ipad[i] = key[i] ^ 0x36;
	    opad[i] = key[i] ^ 0x5C;
	  }

	  this._hash = createHash(alg).update(ipad);
	}

	Hmac.prototype.update = function (data, enc) {
	  this._hash.update(data, enc);
	  return this;
	};

	Hmac.prototype.digest = function (enc) {
	  var h = this._hash.digest();
	  return createHash(this._alg).update(this._opad).update(h).digest(enc);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var pbkdf2Export = __webpack_require__(139);

	module.exports = function (crypto, exports) {
	  exports = exports || {};

	  var exported = pbkdf2Export(crypto);

	  exports.pbkdf2 = exported.pbkdf2;
	  exports.pbkdf2Sync = exported.pbkdf2Sync;

	  return exports;
	};

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	module.exports = function (crypto) {
	  function pbkdf2(password, salt, iterations, keylen, digest, callback) {
	    if ('function' === typeof digest) {
	      callback = digest;
	      digest = undefined;
	    }

	    if ('function' !== typeof callback) throw new Error('No callback provided to pbkdf2');

	    setTimeout(function () {
	      var result;

	      try {
	        result = pbkdf2Sync(password, salt, iterations, keylen, digest);
	      } catch (e) {
	        return callback(e);
	      }

	      callback(undefined, result);
	    });
	  }

	  function pbkdf2Sync(password, salt, iterations, keylen, digest) {
	    if ('number' !== typeof iterations) throw new TypeError('Iterations not a number');

	    if (iterations < 0) throw new TypeError('Bad iterations');

	    if ('number' !== typeof keylen) throw new TypeError('Key length not a number');

	    if (keylen < 0) throw new TypeError('Bad key length');

	    digest = digest || 'sha1';

	    if (!Buffer.isBuffer(password)) password = new Buffer(password);
	    if (!Buffer.isBuffer(salt)) salt = new Buffer(salt);

	    var hLen,
	        l = 1,
	        r,
	        T;
	    var DK = new Buffer(keylen);
	    var block1 = new Buffer(salt.length + 4);
	    salt.copy(block1, 0, 0, salt.length);

	    for (var i = 1; i <= l; i++) {
	      block1.writeUInt32BE(i, salt.length);

	      var U = crypto.createHmac(digest, password).update(block1).digest();

	      if (!hLen) {
	        hLen = U.length;
	        T = new Buffer(hLen);
	        l = Math.ceil(keylen / hLen);
	        r = keylen - (l - 1) * hLen;

	        if (keylen > (Math.pow(2, 32) - 1) * hLen) throw new TypeError('keylen exceeds maximum length');
	      }

	      U.copy(T, 0, 0, hLen);

	      for (var j = 1; j < iterations; j++) {
	        U = crypto.createHmac(digest, password).update(U).digest();

	        for (var k = 0; k < hLen; k++) {
	          T[k] ^= U[k];
	        }
	      }

	      var destPos = (i - 1) * hLen;
	      var len = i == l ? r : hLen;
	      T.copy(DK, destPos, 0, len);
	    }

	    return DK;
	  }

	  return {
	    pbkdf2: pbkdf2,
	    pbkdf2Sync: pbkdf2Sync
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (crypto, exports) {
	  exports = exports || {};
	  var ciphers = __webpack_require__(141)(crypto);
	  exports.createCipher = ciphers.createCipher;
	  exports.createCipheriv = ciphers.createCipheriv;
	  var deciphers = __webpack_require__(173)(crypto);
	  exports.createDecipher = deciphers.createDecipher;
	  exports.createDecipheriv = deciphers.createDecipheriv;
	  var modes = __webpack_require__(164);
	  function listCiphers() {
	    return Object.keys(modes);
	  }
	  exports.listCiphers = listCiphers;
	};

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var aes = __webpack_require__(142);
	var Transform = __webpack_require__(143);
	var inherits = __webpack_require__(146);
	var modes = __webpack_require__(164);
	var ebtk = __webpack_require__(165);
	var StreamCipher = __webpack_require__(166);
	inherits(Cipher, Transform);
	function Cipher(mode, key, iv) {
	  if (!(this instanceof Cipher)) {
	    return new Cipher(mode, key, iv);
	  }
	  Transform.call(this);
	  this._cache = new Splitter();
	  this._cipher = new aes.AES(key);
	  this._prev = new Buffer(iv.length);
	  iv.copy(this._prev);
	  this._mode = mode;
	}
	Cipher.prototype._transform = function (data, _, next) {
	  this._cache.add(data);
	  var chunk;
	  var thing;
	  while (chunk = this._cache.get()) {
	    thing = this._mode.encrypt(this, chunk);
	    this.push(thing);
	  }
	  next();
	};
	Cipher.prototype._flush = function (next) {
	  var chunk = this._cache.flush();
	  this.push(this._mode.encrypt(this, chunk));
	  this._cipher.scrub();
	  next();
	};

	function Splitter() {
	  if (!(this instanceof Splitter)) {
	    return new Splitter();
	  }
	  this.cache = new Buffer('');
	}
	Splitter.prototype.add = function (data) {
	  this.cache = Buffer.concat([this.cache, data]);
	};

	Splitter.prototype.get = function () {
	  if (this.cache.length > 15) {
	    var out = this.cache.slice(0, 16);
	    this.cache = this.cache.slice(16);
	    return out;
	  }
	  return null;
	};
	Splitter.prototype.flush = function () {
	  var len = 16 - this.cache.length;
	  var padBuff = new Buffer(len);

	  var i = -1;
	  while (++i < len) {
	    padBuff.writeUInt8(len, i);
	  }
	  var out = Buffer.concat([this.cache, padBuff]);
	  return out;
	};
	var modelist = {
	  ECB: __webpack_require__(167),
	  CBC: __webpack_require__(168),
	  CFB: __webpack_require__(170),
	  OFB: __webpack_require__(171),
	  CTR: __webpack_require__(172)
	};
	module.exports = function (crypto) {
	  function createCipheriv(suite, password, iv) {
	    var config = modes[suite];
	    if (!config) {
	      throw new TypeError('invalid suite type');
	    }
	    if (typeof iv === 'string') {
	      iv = new Buffer(iv);
	    }
	    if (typeof password === 'string') {
	      password = new Buffer(password);
	    }
	    if (password.length !== config.key / 8) {
	      throw new TypeError('invalid key length ' + password.length);
	    }
	    if (iv.length !== config.iv) {
	      throw new TypeError('invalid iv length ' + iv.length);
	    }
	    if (config.type === 'stream') {
	      return new StreamCipher(modelist[config.mode], password, iv);
	    }
	    return new Cipher(modelist[config.mode], password, iv);
	  }
	  function createCipher(suite, password) {
	    var config = modes[suite];
	    if (!config) {
	      throw new TypeError('invalid suite type');
	    }
	    var keys = ebtk(crypto, password, config.key, config.iv);
	    return createCipheriv(suite, keys.key, keys.iv);
	  }
	  return {
	    createCipher: createCipher,
	    createCipheriv: createCipheriv
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {"use strict";

	var uint_max = Math.pow(2, 32);
	function fixup_uint32(x) {
	  var ret, x_pos;
	  ret = x > uint_max || x < 0 ? (x_pos = Math.abs(x) % uint_max, x < 0 ? uint_max - x_pos : x_pos) : x;
	  return ret;
	}
	function scrub_vec(v) {
	  var i, _i, _ref;
	  for (i = _i = 0, _ref = v.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
	    v[i] = 0;
	  }
	  return false;
	}

	function Global() {
	  var i;
	  this.SBOX = [];
	  this.INV_SBOX = [];
	  this.SUB_MIX = function () {
	    var _i, _results;
	    _results = [];
	    for (i = _i = 0; _i < 4; i = ++_i) {
	      _results.push([]);
	    }
	    return _results;
	  }();
	  this.INV_SUB_MIX = function () {
	    var _i, _results;
	    _results = [];
	    for (i = _i = 0; _i < 4; i = ++_i) {
	      _results.push([]);
	    }
	    return _results;
	  }();
	  this.init();
	  this.RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
	}

	Global.prototype.init = function () {
	  var d, i, sx, t, x, x2, x4, x8, xi, _i;
	  d = function () {
	    var _i, _results;
	    _results = [];
	    for (i = _i = 0; _i < 256; i = ++_i) {
	      if (i < 128) {
	        _results.push(i << 1);
	      } else {
	        _results.push(i << 1 ^ 0x11b);
	      }
	    }
	    return _results;
	  }();
	  x = 0;
	  xi = 0;
	  for (i = _i = 0; _i < 256; i = ++_i) {
	    sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
	    sx = sx >>> 8 ^ sx & 0xff ^ 0x63;
	    this.SBOX[x] = sx;
	    this.INV_SBOX[sx] = x;
	    x2 = d[x];
	    x4 = d[x2];
	    x8 = d[x4];
	    t = d[sx] * 0x101 ^ sx * 0x1010100;
	    this.SUB_MIX[0][x] = t << 24 | t >>> 8;
	    this.SUB_MIX[1][x] = t << 16 | t >>> 16;
	    this.SUB_MIX[2][x] = t << 8 | t >>> 24;
	    this.SUB_MIX[3][x] = t;
	    t = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
	    this.INV_SUB_MIX[0][sx] = t << 24 | t >>> 8;
	    this.INV_SUB_MIX[1][sx] = t << 16 | t >>> 16;
	    this.INV_SUB_MIX[2][sx] = t << 8 | t >>> 24;
	    this.INV_SUB_MIX[3][sx] = t;
	    if (x === 0) {
	      x = xi = 1;
	    } else {
	      x = x2 ^ d[d[d[x8 ^ x2]]];
	      xi ^= d[d[xi]];
	    }
	  }
	  return true;
	};

	var G = new Global();

	AES.blockSize = 4 * 4;

	AES.prototype.blockSize = AES.blockSize;

	AES.keySize = 256 / 8;

	AES.prototype.keySize = AES.keySize;

	AES.ivSize = AES.blockSize;

	AES.prototype.ivSize = AES.ivSize;

	function bufferToArray(buf) {
	  var len = buf.length / 4;
	  var out = new Array(len);
	  var i = -1;
	  while (++i < len) {
	    out[i] = buf.readUInt32BE(i * 4);
	  }
	  return out;
	}
	function AES(key) {
	  this._key = bufferToArray(key);
	  this._doReset();
	}

	AES.prototype._doReset = function () {
	  var invKsRow, keySize, keyWords, ksRow, ksRows, t, _i, _j;
	  keyWords = this._key;
	  keySize = keyWords.length;
	  this._nRounds = keySize + 6;
	  ksRows = (this._nRounds + 1) * 4;
	  this._keySchedule = [];
	  for (ksRow = _i = 0; 0 <= ksRows ? _i < ksRows : _i > ksRows; ksRow = 0 <= ksRows ? ++_i : --_i) {
	    this._keySchedule[ksRow] = ksRow < keySize ? keyWords[ksRow] : (t = this._keySchedule[ksRow - 1], ksRow % keySize === 0 ? (t = t << 8 | t >>> 24, t = G.SBOX[t >>> 24] << 24 | G.SBOX[t >>> 16 & 0xff] << 16 | G.SBOX[t >>> 8 & 0xff] << 8 | G.SBOX[t & 0xff], t ^= G.RCON[ksRow / keySize | 0] << 24) : keySize > 6 && ksRow % keySize === 4 ? t = G.SBOX[t >>> 24] << 24 | G.SBOX[t >>> 16 & 0xff] << 16 | G.SBOX[t >>> 8 & 0xff] << 8 | G.SBOX[t & 0xff] : void 0, this._keySchedule[ksRow - keySize] ^ t);
	  }
	  this._invKeySchedule = [];
	  for (invKsRow = _j = 0; 0 <= ksRows ? _j < ksRows : _j > ksRows; invKsRow = 0 <= ksRows ? ++_j : --_j) {
	    ksRow = ksRows - invKsRow;
	    t = this._keySchedule[ksRow - (invKsRow % 4 ? 0 : 4)];
	    this._invKeySchedule[invKsRow] = invKsRow < 4 || ksRow <= 4 ? t : G.INV_SUB_MIX[0][G.SBOX[t >>> 24]] ^ G.INV_SUB_MIX[1][G.SBOX[t >>> 16 & 0xff]] ^ G.INV_SUB_MIX[2][G.SBOX[t >>> 8 & 0xff]] ^ G.INV_SUB_MIX[3][G.SBOX[t & 0xff]];
	  }
	  return true;
	};

	AES.prototype.encryptBlock = function (M) {
	  M = bufferToArray(new Buffer(M));
	  var out = this._doCryptBlock(M, this._keySchedule, G.SUB_MIX, G.SBOX);
	  var buf = new Buffer(16);
	  buf.writeUInt32BE(out[0], 0);
	  buf.writeUInt32BE(out[1], 4);
	  buf.writeUInt32BE(out[2], 8);
	  buf.writeUInt32BE(out[3], 12);
	  return buf;
	};

	AES.prototype.decryptBlock = function (M) {
	  M = bufferToArray(new Buffer(M));
	  var temp = [M[3], M[1]];
	  M[1] = temp[0];
	  M[3] = temp[1];
	  var out = this._doCryptBlock(M, this._invKeySchedule, G.INV_SUB_MIX, G.INV_SBOX);
	  var buf = new Buffer(16);
	  buf.writeUInt32BE(out[0], 0);
	  buf.writeUInt32BE(out[3], 4);
	  buf.writeUInt32BE(out[2], 8);
	  buf.writeUInt32BE(out[1], 12);
	  return buf;
	};

	AES.prototype.scrub = function () {
	  scrub_vec(this._keySchedule);
	  scrub_vec(this._invKeySchedule);
	  scrub_vec(this._key);
	};

	AES.prototype._doCryptBlock = function (M, keySchedule, SUB_MIX, SBOX) {
	  var ksRow, round, s0, s1, s2, s3, t0, t1, t2, t3, _i, _ref;

	  s0 = M[0] ^ keySchedule[0];
	  s1 = M[1] ^ keySchedule[1];
	  s2 = M[2] ^ keySchedule[2];
	  s3 = M[3] ^ keySchedule[3];
	  ksRow = 4;
	  for (round = _i = 1, _ref = this._nRounds; 1 <= _ref ? _i < _ref : _i > _ref; round = 1 <= _ref ? ++_i : --_i) {
	    t0 = SUB_MIX[0][s0 >>> 24] ^ SUB_MIX[1][s1 >>> 16 & 0xff] ^ SUB_MIX[2][s2 >>> 8 & 0xff] ^ SUB_MIX[3][s3 & 0xff] ^ keySchedule[ksRow++];
	    t1 = SUB_MIX[0][s1 >>> 24] ^ SUB_MIX[1][s2 >>> 16 & 0xff] ^ SUB_MIX[2][s3 >>> 8 & 0xff] ^ SUB_MIX[3][s0 & 0xff] ^ keySchedule[ksRow++];
	    t2 = SUB_MIX[0][s2 >>> 24] ^ SUB_MIX[1][s3 >>> 16 & 0xff] ^ SUB_MIX[2][s0 >>> 8 & 0xff] ^ SUB_MIX[3][s1 & 0xff] ^ keySchedule[ksRow++];
	    t3 = SUB_MIX[0][s3 >>> 24] ^ SUB_MIX[1][s0 >>> 16 & 0xff] ^ SUB_MIX[2][s1 >>> 8 & 0xff] ^ SUB_MIX[3][s2 & 0xff] ^ keySchedule[ksRow++];
	    s0 = t0;
	    s1 = t1;
	    s2 = t2;
	    s3 = t3;
	  }
	  t0 = (SBOX[s0 >>> 24] << 24 | SBOX[s1 >>> 16 & 0xff] << 16 | SBOX[s2 >>> 8 & 0xff] << 8 | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
	  t1 = (SBOX[s1 >>> 24] << 24 | SBOX[s2 >>> 16 & 0xff] << 16 | SBOX[s3 >>> 8 & 0xff] << 8 | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
	  t2 = (SBOX[s2 >>> 24] << 24 | SBOX[s3 >>> 16 & 0xff] << 16 | SBOX[s0 >>> 8 & 0xff] << 8 | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
	  t3 = (SBOX[s3 >>> 24] << 24 | SBOX[s0 >>> 16 & 0xff] << 16 | SBOX[s1 >>> 8 & 0xff] << 8 | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];
	  return [fixup_uint32(t0), fixup_uint32(t1), fixup_uint32(t2), fixup_uint32(t3)];
	};

	exports.AES = AES;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var Transform = __webpack_require__(144).Transform;
	var inherits = __webpack_require__(146);

	module.exports = CipherBase;
	inherits(CipherBase, Transform);
	function CipherBase() {
	  Transform.call(this);
	}
	CipherBase.prototype.update = function (data, inputEnd, outputEnc) {
	  this.write(data, inputEnd);
	  var outData = new Buffer('');
	  var chunk;
	  while (chunk = this.read()) {
	    outData = Buffer.concat([outData, chunk]);
	  }
	  if (outputEnc) {
	    outData = outData.toString(outputEnc);
	  }
	  return outData;
	};
	CipherBase.prototype.final = function (outputEnc) {
	  this.end();
	  var outData = new Buffer('');
	  var chunk;
	  while (chunk = this.read()) {
	    outData = Buffer.concat([outData, chunk]);
	  }
	  if (outputEnc) {
	    outData = outData.toString(outputEnc);
	  }
	  return outData;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	module.exports = Stream;

	var EE = __webpack_require__(145).EventEmitter;
	var inherits = __webpack_require__(146);

	inherits(Stream, EE);
	Stream.Readable = __webpack_require__(147);
	Stream.Writable = __webpack_require__(160);
	Stream.Duplex = __webpack_require__(161);
	Stream.Transform = __webpack_require__(162);
	Stream.PassThrough = __webpack_require__(163);

	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;

	// old-style streams.  Note that the pipe method (the only relevant
	// part of this class) is overridden in the Readable class.

	function Stream() {
	  EE.call(this);
	}

	Stream.prototype.pipe = function (dest, options) {
	  var source = this;

	  function ondata(chunk) {
	    if (dest.writable) {
	      if (false === dest.write(chunk) && source.pause) {
	        source.pause();
	      }
	    }
	  }

	  source.on('data', ondata);

	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }

	  dest.on('drain', ondrain);

	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    source.on('end', onend);
	    source.on('close', onclose);
	  }

	  var didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    dest.end();
	  }

	  function onclose() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    if (typeof dest.destroy === 'function') dest.destroy();
	  }

	  // don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (EE.listenerCount(this, 'error') === 0) {
	      throw er; // Unhandled stream error in pipe.
	    }
	  }

	  source.on('error', onerror);
	  dest.on('error', onerror);

	  // remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);

	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);

	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);

	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);

	    dest.removeListener('close', cleanup);
	  }

	  source.on('end', cleanup);
	  source.on('close', cleanup);

	  dest.on('close', cleanup);

	  dest.emit('pipe', source);

	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest;
	};

/***/ },
/* 145 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function (n) {
	  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function (type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events) this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler)) return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++) {
	      listeners[i].apply(this, args);
	    }
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function (type, listener) {
	  var m;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events) this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function (type, listener) {
	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function (type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type]) return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener || isFunction(list.listener) && list.listener === listener) {
	    delete this._events[type];
	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0) return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function (type) {
	  var key, listeners;

	  if (!this._events) return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length) {
	      this.removeListener(type, listeners[listeners.length - 1]);
	    }
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function (type) {
	  var ret;
	  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function (type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function (emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

/***/ },
/* 146 */
/***/ function(module, exports) {

	'use strict';

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function TempCtor() {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var Stream = function () {
	  try {
	    return __webpack_require__(144); // hack to fix a circular dependency issue when used with browserify
	  } catch (_) {}
	}();
	exports = module.exports = __webpack_require__(148);
	exports.Stream = Stream || exports;
	exports.Readable = exports;
	exports.Writable = __webpack_require__(155);
	exports.Duplex = __webpack_require__(154);
	exports.Transform = __webpack_require__(158);
	exports.PassThrough = __webpack_require__(159);

	if (!process.browser && process.env.READABLE_STREAM === 'disable' && Stream) {
	  module.exports = Stream;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	module.exports = Readable;

	/*<replacement>*/
	var processNextTick = __webpack_require__(149);
	/*</replacement>*/

	/*<replacement>*/
	var isArray = __webpack_require__(122);
	/*</replacement>*/

	Readable.ReadableState = ReadableState;

	/*<replacement>*/
	var EE = __webpack_require__(145).EventEmitter;

	var EElistenerCount = function EElistenerCount(emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/

	/*<replacement>*/
	var Stream;
	(function () {
	  try {
	    Stream = __webpack_require__(144);
	  } catch (_) {} finally {
	    if (!Stream) Stream = __webpack_require__(145).EventEmitter;
	  }
	})();
	/*</replacement>*/

	var Buffer = __webpack_require__(119).Buffer;
	/*<replacement>*/
	var bufferShim = __webpack_require__(150);
	/*</replacement>*/

	/*<replacement>*/
	var util = __webpack_require__(151);
	util.inherits = __webpack_require__(146);
	/*</replacement>*/

	/*<replacement>*/
	var debugUtil = __webpack_require__(152);
	var debug = void 0;
	if (debugUtil && debugUtil.debuglog) {
	  debug = debugUtil.debuglog('stream');
	} else {
	  debug = function debug() {};
	}
	/*</replacement>*/

	var BufferList = __webpack_require__(153);
	var StringDecoder;

	util.inherits(Readable, Stream);

	function prependListener(emitter, event, fn) {
	  if (typeof emitter.prependListener === 'function') {
	    return emitter.prependListener(event, fn);
	  } else {
	    // This is a hack to make sure that our error handler is attached before any
	    // userland ones.  NEVER DO THIS. This is here only because this code needs
	    // to continue to work with older versions of Node.js that do not include
	    // the prependListener() method. The goal is to eventually remove this hack.
	    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
	  }
	}

	var Duplex;
	function ReadableState(options, stream) {
	  Duplex = Duplex || __webpack_require__(154);

	  options = options || {};

	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  // A linked list is used to store data chunks instead of an array because the
	  // linked list can remove elements from the beginning faster than
	  // array.shift()
	  this.buffer = new BufferList();
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;
	  this.resumeScheduled = false;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;

	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;

	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;

	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    if (!StringDecoder) StringDecoder = __webpack_require__(157).StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}

	var Duplex;
	function Readable(options) {
	  Duplex = Duplex || __webpack_require__(154);

	  if (!(this instanceof Readable)) return new Readable(options);

	  this._readableState = new ReadableState(options, this);

	  // legacy
	  this.readable = true;

	  if (options && typeof options.read === 'function') this._read = options.read;

	  Stream.call(this);
	}

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function (chunk, encoding) {
	  var state = this._readableState;

	  if (!state.objectMode && typeof chunk === 'string') {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = bufferShim.from(chunk, encoding);
	      encoding = '';
	    }
	  }

	  return readableAddChunk(this, state, chunk, encoding, false);
	};

	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function (chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};

	Readable.prototype.isPaused = function () {
	  return this._readableState.flowing === false;
	};

	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (chunk === null) {
	    state.reading = false;
	    onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var _e = new Error('stream.unshift() after end event');
	      stream.emit('error', _e);
	    } else {
	      var skipAdd;
	      if (state.decoder && !addToFront && !encoding) {
	        chunk = state.decoder.write(chunk);
	        skipAdd = !state.objectMode && chunk.length === 0;
	      }

	      if (!addToFront) state.reading = false;

	      // Don't add to the buffer if we've decoded to an empty string chunk and
	      // we're not in object mode
	      if (!skipAdd) {
	        // if we want the data now, just emit it.
	        if (state.flowing && state.length === 0 && !state.sync) {
	          stream.emit('data', chunk);
	          stream.read(0);
	        } else {
	          // update the buffer info.
	          state.length += state.objectMode ? 1 : chunk.length;
	          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

	          if (state.needReadable) emitReadable(stream);
	        }
	      }

	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }

	  return needMoreData(state);
	}

	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
	}

	// backwards compatibility.
	Readable.prototype.setEncoding = function (enc) {
	  if (!StringDecoder) StringDecoder = __webpack_require__(157).StringDecoder;
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	  return this;
	};

	// Don't raise the hwm > 8MB
	var MAX_HWM = 0x800000;
	function computeNewHighWaterMark(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2 to prevent increasing hwm excessively in
	    // tiny amounts
	    n--;
	    n |= n >>> 1;
	    n |= n >>> 2;
	    n |= n >>> 4;
	    n |= n >>> 8;
	    n |= n >>> 16;
	    n++;
	  }
	  return n;
	}

	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function howMuchToRead(n, state) {
	  if (n <= 0 || state.length === 0 && state.ended) return 0;
	  if (state.objectMode) return 1;
	  if (n !== n) {
	    // Only flow one buffer at a time
	    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
	  }
	  // If we're asking for more than the current hwm, then raise the hwm.
	  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
	  if (n <= state.length) return n;
	  // Don't have enough
	  if (!state.ended) {
	    state.needReadable = true;
	    return 0;
	  }
	  return state.length;
	}

	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function (n) {
	  debug('read', n);
	  n = parseInt(n, 10);
	  var state = this._readableState;
	  var nOrig = n;

	  if (n !== 0) state.emittedReadable = false;

	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
	    debug('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
	    return null;
	  }

	  n = howMuchToRead(n, state);

	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0) endReadable(this);
	    return null;
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug('need readable', doRead);

	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug('length less than watermark', doRead);
	  }

	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug('reading or ended', doRead);
	  } else if (doRead) {
	    debug('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0) state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	    // If _read pushed data synchronously, then `reading` will be false,
	    // and we need to re-evaluate how much data we can return to the user.
	    if (!state.reading) n = howMuchToRead(nOrig, state);
	  }

	  var ret;
	  if (n > 0) ret = fromList(n, state);else ret = null;

	  if (ret === null) {
	    state.needReadable = true;
	    n = 0;
	  } else {
	    state.length -= n;
	  }

	  if (state.length === 0) {
	    // If we have nothing in the buffer, then we want to know
	    // as soon as we *do* get something into the buffer.
	    if (!state.ended) state.needReadable = true;

	    // If we tried to read() past the EOF, then emit end on the next tick.
	    if (nOrig !== n && state.ended) endReadable(this);
	  }

	  if (ret !== null) this.emit('data', ret);

	  return ret;
	};

	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}

	function onEofChunk(stream, state) {
	  if (state.ended) return;
	  if (state.decoder) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;

	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
	  }
	}

	function emitReadable_(stream) {
	  debug('emit readable');
	  stream.emit('readable');
	  flow(stream);
	}

	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    processNextTick(maybeReadMore_, stream, state);
	  }
	}

	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;else len = state.length;
	  }
	  state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function (n) {
	  this.emit('error', new Error('not implemented'));
	};

	Readable.prototype.pipe = function (dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;

	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

	  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    debug('onunpipe');
	    if (readable === src) {
	      cleanup();
	    }
	  }

	  function onend() {
	    debug('onend');
	    dest.end();
	  }

	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);

	  var cleanedUp = false;
	  function cleanup() {
	    debug('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);
	    src.removeListener('data', ondata);

	    cleanedUp = true;

	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
	  }

	  // If the user pushes more data while we're writing to dest then we'll end up
	  // in ondata again. However, we only want to increase awaitDrain once because
	  // dest will only emit one 'drain' event for the multiple writes.
	  // => Introduce a guard on increasing awaitDrain.
	  var increasedAwaitDrain = false;
	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug('ondata');
	    increasedAwaitDrain = false;
	    var ret = dest.write(chunk);
	    if (false === ret && !increasedAwaitDrain) {
	      // If the user unpiped during `dest.write()`, it is possible
	      // to get stuck in a permanently paused state if that write
	      // also returned false.
	      // => Check whether `dest` is still a piping destination.
	      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
	        debug('false write response, pause', src._readableState.awaitDrain);
	        src._readableState.awaitDrain++;
	        increasedAwaitDrain = true;
	      }
	      src.pause();
	    }
	  }

	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
	  }

	  // Make sure our error handler is attached before userland ones.
	  prependListener(dest, 'error', onerror);

	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);

	  function unpipe() {
	    debug('unpipe');
	    src.unpipe(dest);
	  }

	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);

	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug('pipe resume');
	    src.resume();
	  }

	  return dest;
	};

	function pipeOnDrain(src) {
	  return function () {
	    var state = src._readableState;
	    debug('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain) state.awaitDrain--;
	    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
	      state.flowing = true;
	      flow(src);
	    }
	  };
	}

	Readable.prototype.unpipe = function (dest) {
	  var state = this._readableState;

	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0) return this;

	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes) return this;

	    if (!dest) dest = state.pipes;

	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest) dest.emit('unpipe', this);
	    return this;
	  }

	  // slow case. multiple pipe destinations.

	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;

	    for (var _i = 0; _i < len; _i++) {
	      dests[_i].emit('unpipe', this);
	    }return this;
	  }

	  // try to find the right one.
	  var i = indexOf(state.pipes, dest);
	  if (i === -1) return this;

	  state.pipes.splice(i, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1) state.pipes = state.pipes[0];

	  dest.emit('unpipe', this);

	  return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function (ev, fn) {
	  var res = Stream.prototype.on.call(this, ev, fn);

	  if (ev === 'data') {
	    // Start flowing on next tick if stream isn't explicitly paused
	    if (this._readableState.flowing !== false) this.resume();
	  } else if (ev === 'readable') {
	    var state = this._readableState;
	    if (!state.endEmitted && !state.readableListening) {
	      state.readableListening = state.needReadable = true;
	      state.emittedReadable = false;
	      if (!state.reading) {
	        processNextTick(nReadingNextTick, this);
	      } else if (state.length) {
	        emitReadable(this, state);
	      }
	    }
	  }

	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;

	function nReadingNextTick(self) {
	  debug('readable nexttick read 0');
	  self.read(0);
	}

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function () {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug('resume');
	    state.flowing = true;
	    resume(this, state);
	  }
	  return this;
	};

	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    processNextTick(resume_, stream, state);
	  }
	}

	function resume_(stream, state) {
	  if (!state.reading) {
	    debug('resume read 0');
	    stream.read(0);
	  }

	  state.resumeScheduled = false;
	  state.awaitDrain = 0;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading) stream.read(0);
	}

	Readable.prototype.pause = function () {
	  debug('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};

	function flow(stream) {
	  var state = stream._readableState;
	  debug('flow', state.flowing);
	  while (state.flowing && stream.read() !== null) {}
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function (stream) {
	  var state = this._readableState;
	  var paused = false;

	  var self = this;
	  stream.on('end', function () {
	    debug('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length) self.push(chunk);
	    }

	    self.push(null);
	  });

	  stream.on('data', function (chunk) {
	    debug('wrapped data');
	    if (state.decoder) chunk = state.decoder.write(chunk);

	    // don't skip over falsy values in objectMode
	    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });

	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (this[i] === undefined && typeof stream[i] === 'function') {
	      this[i] = function (method) {
	        return function () {
	          return stream[method].apply(stream, arguments);
	        };
	      }(i);
	    }
	  }

	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach(events, function (ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });

	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function (n) {
	    debug('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  return self;
	};

	// exposed for testing purposes only.
	Readable._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromList(n, state) {
	  // nothing buffered
	  if (state.length === 0) return null;

	  var ret;
	  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
	    // read it all, truncate the list
	    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
	    state.buffer.clear();
	  } else {
	    // read part of list
	    ret = fromListPartial(n, state.buffer, state.decoder);
	  }

	  return ret;
	}

	// Extracts only enough buffered data to satisfy the amount requested.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromListPartial(n, list, hasStrings) {
	  var ret;
	  if (n < list.head.data.length) {
	    // slice is the same for buffers and strings
	    ret = list.head.data.slice(0, n);
	    list.head.data = list.head.data.slice(n);
	  } else if (n === list.head.data.length) {
	    // first chunk is a perfect match
	    ret = list.shift();
	  } else {
	    // result spans more than one buffer
	    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
	  }
	  return ret;
	}

	// Copies a specified amount of characters from the list of buffered data
	// chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBufferString(n, list) {
	  var p = list.head;
	  var c = 1;
	  var ret = p.data;
	  n -= ret.length;
	  while (p = p.next) {
	    var str = p.data;
	    var nb = n > str.length ? str.length : n;
	    if (nb === str.length) ret += str;else ret += str.slice(0, n);
	    n -= nb;
	    if (n === 0) {
	      if (nb === str.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = str.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	// Copies a specified amount of bytes from the list of buffered data chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBuffer(n, list) {
	  var ret = bufferShim.allocUnsafe(n);
	  var p = list.head;
	  var c = 1;
	  p.data.copy(ret);
	  n -= p.data.length;
	  while (p = p.next) {
	    var buf = p.data;
	    var nb = n > buf.length ? buf.length : n;
	    buf.copy(ret, ret.length - n, 0, nb);
	    n -= nb;
	    if (n === 0) {
	      if (nb === buf.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = buf.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	function endReadable(stream) {
	  var state = stream._readableState;

	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

	  if (!state.endEmitted) {
	    state.ended = true;
	    processNextTick(endReadableNT, state, stream);
	  }
	}

	function endReadableNT(state, stream) {
	  // Check that we didn't get one last unshift.
	  if (!state.endEmitted && state.length === 0) {
	    state.endEmitted = true;
	    stream.readable = false;
	    stream.emit('end');
	  }
	}

	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	function indexOf(xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	if (!process.version || process.version.indexOf('v0.') === 0 || process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
	  module.exports = nextTick;
	} else {
	  module.exports = process.nextTick;
	}

	function nextTick(fn, arg1, arg2, arg3) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('"callback" argument must be a function');
	  }
	  var len = arguments.length;
	  var args, i;
	  switch (len) {
	    case 0:
	    case 1:
	      return process.nextTick(fn);
	    case 2:
	      return process.nextTick(function afterTickOne() {
	        fn.call(null, arg1);
	      });
	    case 3:
	      return process.nextTick(function afterTickTwo() {
	        fn.call(null, arg1, arg2);
	      });
	    case 4:
	      return process.nextTick(function afterTickThree() {
	        fn.call(null, arg1, arg2, arg3);
	      });
	    default:
	      args = new Array(len - 1);
	      i = 0;
	      while (i < args.length) {
	        args[i++] = arguments[i];
	      }
	      return process.nextTick(function afterTick() {
	        fn.apply(null, args);
	      });
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var buffer = __webpack_require__(119);
	var Buffer = buffer.Buffer;
	var SlowBuffer = buffer.SlowBuffer;
	var MAX_LEN = buffer.kMaxLength || 2147483647;
	exports.alloc = function alloc(size, fill, encoding) {
	  if (typeof Buffer.alloc === 'function') {
	    return Buffer.alloc(size, fill, encoding);
	  }
	  if (typeof encoding === 'number') {
	    throw new TypeError('encoding must not be number');
	  }
	  if (typeof size !== 'number') {
	    throw new TypeError('size must be a number');
	  }
	  if (size > MAX_LEN) {
	    throw new RangeError('size is too large');
	  }
	  var enc = encoding;
	  var _fill = fill;
	  if (_fill === undefined) {
	    enc = undefined;
	    _fill = 0;
	  }
	  var buf = new Buffer(size);
	  if (typeof _fill === 'string') {
	    var fillBuf = new Buffer(_fill, enc);
	    var flen = fillBuf.length;
	    var i = -1;
	    while (++i < size) {
	      buf[i] = fillBuf[i % flen];
	    }
	  } else {
	    buf.fill(_fill);
	  }
	  return buf;
	};
	exports.allocUnsafe = function allocUnsafe(size) {
	  if (typeof Buffer.allocUnsafe === 'function') {
	    return Buffer.allocUnsafe(size);
	  }
	  if (typeof size !== 'number') {
	    throw new TypeError('size must be a number');
	  }
	  if (size > MAX_LEN) {
	    throw new RangeError('size is too large');
	  }
	  return new Buffer(size);
	};
	exports.from = function from(value, encodingOrOffset, length) {
	  if (typeof Buffer.from === 'function' && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
	    return Buffer.from(value, encodingOrOffset, length);
	  }
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number');
	  }
	  if (typeof value === 'string') {
	    return new Buffer(value, encodingOrOffset);
	  }
	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    var offset = encodingOrOffset;
	    if (arguments.length === 1) {
	      return new Buffer(value);
	    }
	    if (typeof offset === 'undefined') {
	      offset = 0;
	    }
	    var len = length;
	    if (typeof len === 'undefined') {
	      len = value.byteLength - offset;
	    }
	    if (offset >= value.byteLength) {
	      throw new RangeError('\'offset\' is out of bounds');
	    }
	    if (len > value.byteLength - offset) {
	      throw new RangeError('\'length\' is out of bounds');
	    }
	    return new Buffer(value.slice(offset, offset + len));
	  }
	  if (Buffer.isBuffer(value)) {
	    var out = new Buffer(value.length);
	    value.copy(out, 0, 0, value.length);
	    return out;
	  }
	  if (value) {
	    if (Array.isArray(value) || typeof ArrayBuffer !== 'undefined' && value.buffer instanceof ArrayBuffer || 'length' in value) {
	      return new Buffer(value);
	    }
	    if (value.type === 'Buffer' && Array.isArray(value.data)) {
	      return new Buffer(value.data);
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ' + 'ArrayBuffer, Array, or array-like object.');
	};
	exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
	  if (typeof Buffer.allocUnsafeSlow === 'function') {
	    return Buffer.allocUnsafeSlow(size);
	  }
	  if (typeof size !== 'number') {
	    throw new TypeError('size must be a number');
	  }
	  if (size >= MAX_LEN) {
	    throw new RangeError('size is too large');
	  }
	  return new SlowBuffer(size);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.

	function isArray(arg) {
	  if (Array.isArray) {
	    return Array.isArray(arg);
	  }
	  return objectToString(arg) === '[object Array]';
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return objectToString(e) === '[object Error]' || e instanceof Error;
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol' || // ES6 symbol
	  typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = Buffer.isBuffer;

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 152 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Buffer = __webpack_require__(119).Buffer;
	/*<replacement>*/
	var bufferShim = __webpack_require__(150);
	/*</replacement>*/

	module.exports = BufferList;

	function BufferList() {
	  this.head = null;
	  this.tail = null;
	  this.length = 0;
	}

	BufferList.prototype.push = function (v) {
	  var entry = { data: v, next: null };
	  if (this.length > 0) this.tail.next = entry;else this.head = entry;
	  this.tail = entry;
	  ++this.length;
	};

	BufferList.prototype.unshift = function (v) {
	  var entry = { data: v, next: this.head };
	  if (this.length === 0) this.tail = entry;
	  this.head = entry;
	  ++this.length;
	};

	BufferList.prototype.shift = function () {
	  if (this.length === 0) return;
	  var ret = this.head.data;
	  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
	  --this.length;
	  return ret;
	};

	BufferList.prototype.clear = function () {
	  this.head = this.tail = null;
	  this.length = 0;
	};

	BufferList.prototype.join = function (s) {
	  if (this.length === 0) return '';
	  var p = this.head;
	  var ret = '' + p.data;
	  while (p = p.next) {
	    ret += s + p.data;
	  }return ret;
	};

	BufferList.prototype.concat = function (n) {
	  if (this.length === 0) return bufferShim.alloc(0);
	  if (this.length === 1) return this.head.data;
	  var ret = bufferShim.allocUnsafe(n >>> 0);
	  var p = this.head;
	  var i = 0;
	  while (p) {
	    p.data.copy(ret, i);
	    i += p.data.length;
	    p = p.next;
	  }
	  return ret;
	};

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.

	'use strict';

	/*<replacement>*/

	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    keys.push(key);
	  }return keys;
	};
	/*</replacement>*/

	module.exports = Duplex;

	/*<replacement>*/
	var processNextTick = __webpack_require__(149);
	/*</replacement>*/

	/*<replacement>*/
	var util = __webpack_require__(151);
	util.inherits = __webpack_require__(146);
	/*</replacement>*/

	var Readable = __webpack_require__(148);
	var Writable = __webpack_require__(155);

	util.inherits(Duplex, Readable);

	var keys = objectKeys(Writable.prototype);
	for (var v = 0; v < keys.length; v++) {
	  var method = keys[v];
	  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
	}

	function Duplex(options) {
	  if (!(this instanceof Duplex)) return new Duplex(options);

	  Readable.call(this, options);
	  Writable.call(this, options);

	  if (options && options.readable === false) this.readable = false;

	  if (options && options.writable === false) this.writable = false;

	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

	  this.once('end', onend);
	}

	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended) return;

	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  processNextTick(onEndNT, this);
	}

	function onEndNT(self) {
	  self.end();
	}

	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// A bit simpler than readable streams.
	// Implement an async ._write(chunk, encoding, cb), and it'll handle all
	// the drain event emission and buffering.

	'use strict';

	module.exports = Writable;

	/*<replacement>*/
	var processNextTick = __webpack_require__(149);
	/*</replacement>*/

	/*<replacement>*/
	var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
	/*</replacement>*/

	Writable.WritableState = WritableState;

	/*<replacement>*/
	var util = __webpack_require__(151);
	util.inherits = __webpack_require__(146);
	/*</replacement>*/

	/*<replacement>*/
	var internalUtil = {
	  deprecate: __webpack_require__(156)
	};
	/*</replacement>*/

	/*<replacement>*/
	var Stream;
	(function () {
	  try {
	    Stream = __webpack_require__(144);
	  } catch (_) {} finally {
	    if (!Stream) Stream = __webpack_require__(145).EventEmitter;
	  }
	})();
	/*</replacement>*/

	var Buffer = __webpack_require__(119).Buffer;
	/*<replacement>*/
	var bufferShim = __webpack_require__(150);
	/*</replacement>*/

	util.inherits(Writable, Stream);

	function nop() {}

	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	  this.next = null;
	}

	var Duplex;
	function WritableState(options, stream) {
	  Duplex = Duplex || __webpack_require__(154);

	  options = options || {};

	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;

	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // a flag to see when we're in the middle of a write.
	  this.writing = false;

	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function (er) {
	    onwrite(stream, er);
	  };

	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;

	  // the amount that is being written when _write is called.
	  this.writelen = 0;

	  this.bufferedRequest = null;
	  this.lastBufferedRequest = null;

	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;

	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;

	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;

	  // count buffered requests
	  this.bufferedRequestCount = 0;

	  // allocate the first CorkedRequest, there is always
	  // one allocated and free to use, and we maintain at most two
	  this.corkedRequestsFree = new CorkedRequest(this);
	}

	WritableState.prototype.getBuffer = function writableStateGetBuffer() {
	  var current = this.bufferedRequest;
	  var out = [];
	  while (current) {
	    out.push(current);
	    current = current.next;
	  }
	  return out;
	};

	(function () {
	  try {
	    Object.defineProperty(WritableState.prototype, 'buffer', {
	      get: internalUtil.deprecate(function () {
	        return this.getBuffer();
	      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
	    });
	  } catch (_) {}
	})();

	var Duplex;
	function Writable(options) {
	  Duplex = Duplex || __webpack_require__(154);

	  // Writable ctor is applied to Duplexes, though they're not
	  // instanceof Writable, they're instanceof Readable.
	  if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);

	  this._writableState = new WritableState(options, this);

	  // legacy.
	  this.writable = true;

	  if (options) {
	    if (typeof options.write === 'function') this._write = options.write;

	    if (typeof options.writev === 'function') this._writev = options.writev;
	  }

	  Stream.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function () {
	  this.emit('error', new Error('Cannot pipe, not readable'));
	};

	function writeAfterEnd(stream, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  processNextTick(cb, er);
	}

	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  var er = false;
	  // Always throw error if a null is written
	  // if we are not in object mode then throw
	  // if it is not a buffer, string, or undefined.
	  if (chunk === null) {
	    er = new TypeError('May not write null values to stream');
	  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  if (er) {
	    stream.emit('error', er);
	    processNextTick(cb, er);
	    valid = false;
	  }
	  return valid;
	}

	Writable.prototype.write = function (chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;

	  if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

	  if (typeof cb !== 'function') cb = nop;

	  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);
	  }

	  return ret;
	};

	Writable.prototype.cork = function () {
	  var state = this._writableState;

	  state.corked++;
	};

	Writable.prototype.uncork = function () {
	  var state = this._writableState;

	  if (state.corked) {
	    state.corked--;

	    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
	  }
	};

	Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
	  // node::ParseEncoding() requires lower case.
	  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
	  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
	  this._writableState.defaultEncoding = encoding;
	  return this;
	};

	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
	    chunk = bufferShim.from(chunk, encoding);
	  }
	  return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);

	  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;

	  state.length += len;

	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret) state.needDrain = true;

	  if (state.writing || state.corked) {
	    var last = state.lastBufferedRequest;
	    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
	    if (last) {
	      last.next = state.lastBufferedRequest;
	    } else {
	      state.bufferedRequest = state.lastBufferedRequest;
	    }
	    state.bufferedRequestCount += 1;
	  } else {
	    doWrite(stream, state, false, len, chunk, encoding, cb);
	  }

	  return ret;
	}

	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}

	function onwriteError(stream, state, sync, er, cb) {
	  --state.pendingcb;
	  if (sync) processNextTick(cb, er);else cb(er);

	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}

	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}

	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;

	  onwriteStateUpdate(state);

	  if (er) onwriteError(stream, state, sync, er, cb);else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(state);

	    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
	      clearBuffer(stream, state);
	    }

	    if (sync) {
	      /*<replacement>*/
	      asyncWrite(afterWrite, stream, state, finished, cb);
	      /*</replacement>*/
	    } else {
	      afterWrite(stream, state, finished, cb);
	    }
	  }
	}

	function afterWrite(stream, state, finished, cb) {
	  if (!finished) onwriteDrain(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}

	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;
	  var entry = state.bufferedRequest;

	  if (stream._writev && entry && entry.next) {
	    // Fast case, write everything using _writev()
	    var l = state.bufferedRequestCount;
	    var buffer = new Array(l);
	    var holder = state.corkedRequestsFree;
	    holder.entry = entry;

	    var count = 0;
	    while (entry) {
	      buffer[count] = entry;
	      entry = entry.next;
	      count += 1;
	    }

	    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

	    // doWrite is almost always async, defer these to save a bit of time
	    // as the hot path ends with doWrite
	    state.pendingcb++;
	    state.lastBufferedRequest = null;
	    if (holder.next) {
	      state.corkedRequestsFree = holder.next;
	      holder.next = null;
	    } else {
	      state.corkedRequestsFree = new CorkedRequest(state);
	    }
	  } else {
	    // Slow case, write chunks one-by-one
	    while (entry) {
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;

	      doWrite(stream, state, false, len, chunk, encoding, cb);
	      entry = entry.next;
	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        break;
	      }
	    }

	    if (entry === null) state.lastBufferedRequest = null;
	  }

	  state.bufferedRequestCount = 0;
	  state.bufferedRequest = entry;
	  state.bufferProcessing = false;
	}

	Writable.prototype._write = function (chunk, encoding, cb) {
	  cb(new Error('not implemented'));
	};

	Writable.prototype._writev = null;

	Writable.prototype.end = function (chunk, encoding, cb) {
	  var state = this._writableState;

	  if (typeof chunk === 'function') {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }

	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished) endWritable(this, state, cb);
	};

	function needFinish(state) {
	  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
	}

	function prefinish(stream, state) {
	  if (!state.prefinished) {
	    state.prefinished = true;
	    stream.emit('prefinish');
	  }
	}

	function finishMaybe(stream, state) {
	  var need = needFinish(state);
	  if (need) {
	    if (state.pendingcb === 0) {
	      prefinish(stream, state);
	      state.finished = true;
	      stream.emit('finish');
	    } else {
	      prefinish(stream, state);
	    }
	  }
	  return need;
	}

	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
	  }
	  state.ended = true;
	  stream.writable = false;
	}

	// It seems a linked list but it is not
	// there will be only 2 of these for each stream
	function CorkedRequest(state) {
	  var _this = this;

	  this.next = null;
	  this.entry = null;

	  this.finish = function (err) {
	    var entry = _this.entry;
	    _this.entry = null;
	    while (entry) {
	      var cb = entry.callback;
	      state.pendingcb--;
	      cb(err);
	      entry = entry.next;
	    }
	    if (state.corkedRequestsFree) {
	      state.corkedRequestsFree.next = _this;
	    } else {
	      state.corkedRequestsFree = _this;
	    }
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), __webpack_require__(19).setImmediate))

/***/ },
/* 156 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	/**
	 * Module exports.
	 */

	module.exports = deprecate;

	/**
	 * Mark that a method should not be used.
	 * Returns a modified function which warns once by default.
	 *
	 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
	 *
	 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
	 * will throw an Error when invoked.
	 *
	 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
	 * will invoke `console.trace()` instead of `console.error()`.
	 *
	 * @param {Function} fn - the function to deprecate
	 * @param {String} msg - the string to print to the console when `fn` is invoked
	 * @returns {Function} a new "deprecated" version of `fn`
	 * @api public
	 */

	function deprecate(fn, msg) {
	  if (config('noDeprecation')) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (config('throwDeprecation')) {
	        throw new Error(msg);
	      } else if (config('traceDeprecation')) {
	        console.trace(msg);
	      } else {
	        console.warn(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	}

	/**
	 * Checks `localStorage` for boolean values for the given `name`.
	 *
	 * @param {String} name
	 * @returns {Boolean}
	 * @api private
	 */

	function config(name) {
	  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
	  try {
	    if (!global.localStorage) return false;
	  } catch (_) {
	    return false;
	  }
	  var val = global.localStorage[name];
	  if (null == val) return false;
	  return String(val).toLowerCase() === 'true';
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var Buffer = __webpack_require__(119).Buffer;

	var isBufferEncoding = Buffer.isEncoding || function (encoding) {
	  switch (encoding && encoding.toLowerCase()) {
	    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
	      return true;
	    default:
	      return false;
	  }
	};

	function assertEncoding(encoding) {
	  if (encoding && !isBufferEncoding(encoding)) {
	    throw new Error('Unknown encoding: ' + encoding);
	  }
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters. CESU-8 is handled as part of the UTF-8 encoding.
	//
	// @TODO Handling all encodings inside a single object makes it very difficult
	// to reason about this code, so it should be split up in the future.
	// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
	// points as used by CESU-8.
	var StringDecoder = exports.StringDecoder = function (encoding) {
	  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
	  assertEncoding(encoding);
	  switch (this.encoding) {
	    case 'utf8':
	      // CESU-8 represents each of Surrogate Pair by 3-bytes
	      this.surrogateSize = 3;
	      break;
	    case 'ucs2':
	    case 'utf16le':
	      // UTF-16 represents each of Surrogate Pair by 2-bytes
	      this.surrogateSize = 2;
	      this.detectIncompleteChar = utf16DetectIncompleteChar;
	      break;
	    case 'base64':
	      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
	      this.surrogateSize = 3;
	      this.detectIncompleteChar = base64DetectIncompleteChar;
	      break;
	    default:
	      this.write = passThroughWrite;
	      return;
	  }

	  // Enough space to store all bytes of a single character. UTF-8 needs 4
	  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
	  this.charBuffer = new Buffer(6);
	  // Number of bytes received for the current incomplete multi-byte character.
	  this.charReceived = 0;
	  // Number of bytes expected for the current incomplete multi-byte character.
	  this.charLength = 0;
	};

	// write decodes the given buffer and returns it as JS string that is
	// guaranteed to not contain any partial multi-byte characters. Any partial
	// character found at the end of the buffer is buffered up, and will be
	// returned when calling write again with the remaining bytes.
	//
	// Note: Converting a Buffer containing an orphan surrogate to a String
	// currently works, but converting a String to a Buffer (via `new Buffer`, or
	// Buffer#write) will replace incomplete surrogates with the unicode
	// replacement character. See https://codereview.chromium.org/121173009/ .
	StringDecoder.prototype.write = function (buffer) {
	  var charStr = '';
	  // if our last write ended with an incomplete multibyte character
	  while (this.charLength) {
	    // determine how many remaining bytes this buffer has to offer for this char
	    var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;

	    // add the new bytes to the char buffer
	    buffer.copy(this.charBuffer, this.charReceived, 0, available);
	    this.charReceived += available;

	    if (this.charReceived < this.charLength) {
	      // still not enough chars in this buffer? wait for more ...
	      return '';
	    }

	    // remove bytes belonging to the current character from the buffer
	    buffer = buffer.slice(available, buffer.length);

	    // get the character that was split
	    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

	    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	    var charCode = charStr.charCodeAt(charStr.length - 1);
	    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	      this.charLength += this.surrogateSize;
	      charStr = '';
	      continue;
	    }
	    this.charReceived = this.charLength = 0;

	    // if there are no more bytes in this buffer, just emit our char
	    if (buffer.length === 0) {
	      return charStr;
	    }
	    break;
	  }

	  // determine and set charLength / charReceived
	  this.detectIncompleteChar(buffer);

	  var end = buffer.length;
	  if (this.charLength) {
	    // buffer the incomplete character bytes we got
	    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
	    end -= this.charReceived;
	  }

	  charStr += buffer.toString(this.encoding, 0, end);

	  var end = charStr.length - 1;
	  var charCode = charStr.charCodeAt(end);
	  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	    var size = this.surrogateSize;
	    this.charLength += size;
	    this.charReceived += size;
	    this.charBuffer.copy(this.charBuffer, size, 0, size);
	    buffer.copy(this.charBuffer, 0, 0, size);
	    return charStr.substring(0, end);
	  }

	  // or just emit the charStr
	  return charStr;
	};

	// detectIncompleteChar determines if there is an incomplete UTF-8 character at
	// the end of the given buffer. If so, it sets this.charLength to the byte
	// length that character, and sets this.charReceived to the number of bytes
	// that are available for this character.
	StringDecoder.prototype.detectIncompleteChar = function (buffer) {
	  // determine how many bytes we have to check at the end of this buffer
	  var i = buffer.length >= 3 ? 3 : buffer.length;

	  // Figure out if one of the last i bytes of our buffer announces an
	  // incomplete char.
	  for (; i > 0; i--) {
	    var c = buffer[buffer.length - i];

	    // See http://en.wikipedia.org/wiki/UTF-8#Description

	    // 110XXXXX
	    if (i == 1 && c >> 5 == 0x06) {
	      this.charLength = 2;
	      break;
	    }

	    // 1110XXXX
	    if (i <= 2 && c >> 4 == 0x0E) {
	      this.charLength = 3;
	      break;
	    }

	    // 11110XXX
	    if (i <= 3 && c >> 3 == 0x1E) {
	      this.charLength = 4;
	      break;
	    }
	  }
	  this.charReceived = i;
	};

	StringDecoder.prototype.end = function (buffer) {
	  var res = '';
	  if (buffer && buffer.length) res = this.write(buffer);

	  if (this.charReceived) {
	    var cr = this.charReceived;
	    var buf = this.charBuffer;
	    var enc = this.encoding;
	    res += buf.slice(0, cr).toString(enc);
	  }

	  return res;
	};

	function passThroughWrite(buffer) {
	  return buffer.toString(this.encoding);
	}

	function utf16DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 2;
	  this.charLength = this.charReceived ? 2 : 0;
	}

	function base64DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 3;
	  this.charLength = this.charReceived ? 3 : 0;
	}

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.

	'use strict';

	module.exports = Transform;

	var Duplex = __webpack_require__(154);

	/*<replacement>*/
	var util = __webpack_require__(151);
	util.inherits = __webpack_require__(146);
	/*</replacement>*/

	util.inherits(Transform, Duplex);

	function TransformState(stream) {
	  this.afterTransform = function (er, data) {
	    return afterTransform(stream, er, data);
	  };

	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	  this.writeencoding = null;
	}

	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;

	  var cb = ts.writecb;

	  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

	  ts.writechunk = null;
	  ts.writecb = null;

	  if (data !== null && data !== undefined) stream.push(data);

	  cb(er);

	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}

	function Transform(options) {
	  if (!(this instanceof Transform)) return new Transform(options);

	  Duplex.call(this, options);

	  this._transformState = new TransformState(this);

	  // when the writable side finishes, then flush out anything remaining.
	  var stream = this;

	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;

	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;

	  if (options) {
	    if (typeof options.transform === 'function') this._transform = options.transform;

	    if (typeof options.flush === 'function') this._flush = options.flush;
	  }

	  this.once('prefinish', function () {
	    if (typeof this._flush === 'function') this._flush(function (er) {
	      done(stream, er);
	    });else done(stream);
	  });
	}

	Transform.prototype.push = function (chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};

	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function (chunk, encoding, cb) {
	  throw new Error('Not implemented');
	};

	Transform.prototype._write = function (chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
	  }
	};

	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function (n) {
	  var ts = this._transformState;

	  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};

	function done(stream, er) {
	  if (er) return stream.emit('error', er);

	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;

	  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

	  if (ts.transforming) throw new Error('Calling transform done when still transforming');

	  return stream.push(null);
	}

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	// a passthrough stream.
	// basically just the most minimal sort of Transform stream.
	// Every written chunk gets output as-is.

	'use strict';

	module.exports = PassThrough;

	var Transform = __webpack_require__(158);

	/*<replacement>*/
	var util = __webpack_require__(151);
	util.inherits = __webpack_require__(146);
	/*</replacement>*/

	util.inherits(PassThrough, Transform);

	function PassThrough(options) {
	  if (!(this instanceof PassThrough)) return new PassThrough(options);

	  Transform.call(this, options);
	}

	PassThrough.prototype._transform = function (chunk, encoding, cb) {
	  cb(null, chunk);
	};

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = __webpack_require__(155);

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = __webpack_require__(154);

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = __webpack_require__(158);

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = __webpack_require__(159);

/***/ },
/* 164 */
/***/ function(module, exports) {

	'use strict';

	exports['aes-128-ecb'] = {
	  cipher: 'AES',
	  key: 128,
	  iv: 0,
	  mode: 'ECB',
	  type: 'block'
	};
	exports['aes-192-ecb'] = {
	  cipher: 'AES',
	  key: 192,
	  iv: 0,
	  mode: 'ECB',
	  type: 'block'
	};
	exports['aes-256-ecb'] = {
	  cipher: 'AES',
	  key: 256,
	  iv: 0,
	  mode: 'ECB',
	  type: 'block'
	};
	exports['aes-128-cbc'] = {
	  cipher: 'AES',
	  key: 128,
	  iv: 16,
	  mode: 'CBC',
	  type: 'block'
	};
	exports['aes-192-cbc'] = {
	  cipher: 'AES',
	  key: 192,
	  iv: 16,
	  mode: 'CBC',
	  type: 'block'
	};
	exports['aes-256-cbc'] = {
	  cipher: 'AES',
	  key: 256,
	  iv: 16,
	  mode: 'CBC',
	  type: 'block'
	};
	exports['aes128'] = exports['aes-128-cbc'];
	exports['aes192'] = exports['aes-192-cbc'];
	exports['aes256'] = exports['aes-256-cbc'];
	exports['aes-128-cfb'] = {
	  cipher: 'AES',
	  key: 128,
	  iv: 16,
	  mode: 'CFB',
	  type: 'stream'
	};
	exports['aes-192-cfb'] = {
	  cipher: 'AES',
	  key: 192,
	  iv: 16,
	  mode: 'CFB',
	  type: 'stream'
	};
	exports['aes-256-cfb'] = {
	  cipher: 'AES',
	  key: 256,
	  iv: 16,
	  mode: 'CFB',
	  type: 'stream'
	};
	exports['aes-128-ofb'] = {
	  cipher: 'AES',
	  key: 128,
	  iv: 16,
	  mode: 'OFB',
	  type: 'stream'
	};
	exports['aes-192-ofb'] = {
	  cipher: 'AES',
	  key: 192,
	  iv: 16,
	  mode: 'OFB',
	  type: 'stream'
	};
	exports['aes-256-ofb'] = {
	  cipher: 'AES',
	  key: 256,
	  iv: 16,
	  mode: 'OFB',
	  type: 'stream'
	};
	exports['aes-128-ctr'] = {
	  cipher: 'AES',
	  key: 128,
	  iv: 16,
	  mode: 'CTR',
	  type: 'stream'
	};
	exports['aes-192-ctr'] = {
	  cipher: 'AES',
	  key: 192,
	  iv: 16,
	  mode: 'CTR',
	  type: 'stream'
	};
	exports['aes-256-ctr'] = {
	  cipher: 'AES',
	  key: 256,
	  iv: 16,
	  mode: 'CTR',
	  type: 'stream'
	};

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	module.exports = function (crypto, password, keyLen, ivLen) {
	  keyLen = keyLen / 8;
	  ivLen = ivLen || 0;
	  var ki = 0;
	  var ii = 0;
	  var key = new Buffer(keyLen);
	  var iv = new Buffer(ivLen);
	  var addmd = 0;
	  var md, md_buf;
	  var i;
	  while (true) {
	    md = crypto.createHash('md5');
	    if (addmd++ > 0) {
	      md.update(md_buf);
	    }
	    md.update(password);
	    md_buf = md.digest();
	    i = 0;
	    if (keyLen > 0) {
	      while (true) {
	        if (keyLen === 0) {
	          break;
	        }
	        if (i === md_buf.length) {
	          break;
	        }
	        key[ki++] = md_buf[i];
	        keyLen--;
	        i++;
	      }
	    }
	    if (ivLen > 0 && i !== md_buf.length) {
	      while (true) {
	        if (ivLen === 0) {
	          break;
	        }
	        if (i === md_buf.length) {
	          break;
	        }
	        iv[ii++] = md_buf[i];
	        ivLen--;
	        i++;
	      }
	    }
	    if (keyLen === 0 && ivLen === 0) {
	      break;
	    }
	  }
	  for (i = 0; i < md_buf.length; i++) {
	    md_buf[i] = 0;
	  }
	  return {
	    key: key,
	    iv: iv
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var aes = __webpack_require__(142);
	var Transform = __webpack_require__(143);
	var inherits = __webpack_require__(146);

	inherits(StreamCipher, Transform);
	module.exports = StreamCipher;
	function StreamCipher(mode, key, iv, decrypt) {
	  if (!(this instanceof StreamCipher)) {
	    return new StreamCipher(mode, key, iv);
	  }
	  Transform.call(this);
	  this._cipher = new aes.AES(key);
	  this._prev = new Buffer(iv.length);
	  this._cache = new Buffer('');
	  this._secCache = new Buffer('');
	  this._decrypt = decrypt;
	  iv.copy(this._prev);
	  this._mode = mode;
	}
	StreamCipher.prototype._transform = function (chunk, _, next) {
	  next(null, this._mode.encrypt(this, chunk, this._decrypt));
	};
	StreamCipher.prototype._flush = function (next) {
	  this._cipher.scrub();
	  next();
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 167 */
/***/ function(module, exports) {

	"use strict";

	exports.encrypt = function (self, block) {
	  return self._cipher.encryptBlock(block);
	};
	exports.decrypt = function (self, block) {
	  return self._cipher.decryptBlock(block);
	};

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var xor = __webpack_require__(169);
	exports.encrypt = function (self, block) {
	  var data = xor(block, self._prev);
	  self._prev = self._cipher.encryptBlock(data);
	  return self._prev;
	};
	exports.decrypt = function (self, block) {
	  var pad = self._prev;
	  self._prev = block;
	  var out = self._cipher.decryptBlock(block);
	  return xor(out, pad);
	};

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {"use strict";

	module.exports = xor;
	function xor(a, b) {
	  var len = Math.min(a.length, b.length);
	  var out = new Buffer(len);
	  var i = -1;
	  while (++i < len) {
	    out.writeUInt8(a[i] ^ b[i], i);
	  }
	  return out;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var xor = __webpack_require__(169);
	exports.encrypt = function (self, data, decrypt) {
	  var out = new Buffer('');
	  var len;
	  while (data.length) {
	    if (self._cache.length === 0) {
	      self._cache = self._cipher.encryptBlock(self._prev);
	      self._prev = new Buffer('');
	    }
	    if (self._cache.length <= data.length) {
	      len = self._cache.length;
	      out = Buffer.concat([out, encryptStart(self, data.slice(0, len), decrypt)]);
	      data = data.slice(len);
	    } else {
	      out = Buffer.concat([out, encryptStart(self, data, decrypt)]);
	      break;
	    }
	  }
	  return out;
	};
	function encryptStart(self, data, decrypt) {
	  var len = data.length;
	  var out = xor(data, self._cache);
	  self._cache = self._cache.slice(len);
	  self._prev = Buffer.concat([self._prev, decrypt ? data : out]);
	  return out;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var xor = __webpack_require__(169);
	function getBlock(self) {
	  self._prev = self._cipher.encryptBlock(self._prev);
	  return self._prev;
	}
	exports.encrypt = function (self, chunk) {
	  while (self._cache.length < chunk.length) {
	    self._cache = Buffer.concat([self._cache, getBlock(self)]);
	  }
	  var pad = self._cache.slice(0, chunk.length);
	  self._cache = self._cache.slice(chunk.length);
	  return xor(chunk, pad);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var xor = __webpack_require__(169);
	function getBlock(self) {
	  var out = self._cipher.encryptBlock(self._prev);
	  incr32(self._prev);
	  return out;
	}
	exports.encrypt = function (self, chunk) {
	  while (self._cache.length < chunk.length) {
	    self._cache = Buffer.concat([self._cache, getBlock(self)]);
	  }
	  var pad = self._cache.slice(0, chunk.length);
	  self._cache = self._cache.slice(chunk.length);
	  return xor(chunk, pad);
	};
	function incr32(iv) {
	  var len = iv.length;
	  var item;
	  while (len--) {
	    item = iv.readUInt8(len);
	    if (item === 255) {
	      iv.writeUInt8(0, len);
	    } else {
	      item++;
	      iv.writeUInt8(item, len);
	      break;
	    }
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var aes = __webpack_require__(142);
	var Transform = __webpack_require__(143);
	var inherits = __webpack_require__(146);
	var modes = __webpack_require__(164);
	var StreamCipher = __webpack_require__(166);
	var ebtk = __webpack_require__(165);

	inherits(Decipher, Transform);
	function Decipher(mode, key, iv) {
	  if (!(this instanceof Decipher)) {
	    return new Decipher(mode, key, iv);
	  }
	  Transform.call(this);
	  this._cache = new Splitter();
	  this._last = void 0;
	  this._cipher = new aes.AES(key);
	  this._prev = new Buffer(iv.length);
	  iv.copy(this._prev);
	  this._mode = mode;
	}
	Decipher.prototype._transform = function (data, _, next) {
	  this._cache.add(data);
	  var chunk;
	  var thing;
	  while (chunk = this._cache.get()) {
	    thing = this._mode.decrypt(this, chunk);
	    this.push(thing);
	  }
	  next();
	};
	Decipher.prototype._flush = function (next) {
	  var chunk = this._cache.flush();
	  if (!chunk) {
	    return next;
	  }

	  this.push(unpad(this._mode.decrypt(this, chunk)));

	  next();
	};

	function Splitter() {
	  if (!(this instanceof Splitter)) {
	    return new Splitter();
	  }
	  this.cache = new Buffer('');
	}
	Splitter.prototype.add = function (data) {
	  this.cache = Buffer.concat([this.cache, data]);
	};

	Splitter.prototype.get = function () {
	  if (this.cache.length > 16) {
	    var out = this.cache.slice(0, 16);
	    this.cache = this.cache.slice(16);
	    return out;
	  }
	  return null;
	};
	Splitter.prototype.flush = function () {
	  if (this.cache.length) {
	    return this.cache;
	  }
	};
	function unpad(last) {
	  var padded = last[15];
	  if (padded === 16) {
	    return;
	  }
	  return last.slice(0, 16 - padded);
	}

	var modelist = {
	  ECB: __webpack_require__(167),
	  CBC: __webpack_require__(168),
	  CFB: __webpack_require__(170),
	  OFB: __webpack_require__(171),
	  CTR: __webpack_require__(172)
	};

	module.exports = function (crypto) {
	  function createDecipheriv(suite, password, iv) {
	    var config = modes[suite];
	    if (!config) {
	      throw new TypeError('invalid suite type');
	    }
	    if (typeof iv === 'string') {
	      iv = new Buffer(iv);
	    }
	    if (typeof password === 'string') {
	      password = new Buffer(password);
	    }
	    if (password.length !== config.key / 8) {
	      throw new TypeError('invalid key length ' + password.length);
	    }
	    if (iv.length !== config.iv) {
	      throw new TypeError('invalid iv length ' + iv.length);
	    }
	    if (config.type === 'stream') {
	      return new StreamCipher(modelist[config.mode], password, iv, true);
	    }
	    return new Decipher(modelist[config.mode], password, iv);
	  }

	  function createDecipher(suite, password) {
	    var config = modes[suite];
	    if (!config) {
	      throw new TypeError('invalid suite type');
	    }
	    var keys = ebtk(crypto, password, config.key, config.iv);
	    return createDecipheriv(suite, keys.key, keys.iv);
	  }
	  return {
	    createDecipher: createDecipher,
	    createDecipheriv: createDecipheriv
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ },
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Entity = __webpack_require__(117);

	var Password = function (_Entity) {
	    _inherits(Password, _Entity);

	    function Password() {
	        _classCallCheck(this, Password);

	        return _possibleConstructorReturn(this, (Password.__proto__ || Object.getPrototypeOf(Password)).apply(this, arguments));
	    }

	    _createClass(Password, [{
	        key: 'structure',
	        value: function structure() {
	            this.def(String, 'hash');
	            this.def(String, 'salt');
	        }
	    }]);

	    return Password;
	}(Entity);

	var User = function (_Entity2) {
	    _inherits(User, _Entity2);

	    function User(params) {
	        _classCallCheck(this, User);

	        return _possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).call(this, params));
	    }

	    _createClass(User, [{
	        key: 'structure',
	        value: function structure() {
	            this.def(String, 'id');
	            this.def(Boolean, 'isAdmin', false);
	            this.def(Boolean, 'isCurrent', false);
	            this.def(String, 'username');
	            this.def(String, 'fullName');
	            this.def(String, 'email');
	            this.def(Object, 'scopes', {});
	        }

	        /**
	         * Gets all project scopes
	         *
	         * @param {String} project
	         * @param {Boolean} upsert
	         *
	         * @returns {Array} scopes
	         */

	    }, {
	        key: 'getScopes',
	        value: function getScopes(project, upsert) {
	            if (!this.scopes) {
	                this.scopes = {};
	            }

	            if (!this.scopes[project] && upsert) {
	                this.scopes[project] = [];
	            }

	            return this.scopes[project];
	        }

	        /**
	         * Checks if a user has a project scope
	         *
	         * @param {String} project
	         * @param {String} scope
	         *
	         * @returns {Boolean} hasScope
	         */

	    }, {
	        key: 'hasScope',
	        value: function hasScope(project, scope) {
	            if (this.isAdmin) {
	                return true;
	            }

	            if (!project) {
	                return false;
	            }
	            if (!scope && !this.scopes[project]) {
	                return false;
	            }

	            if (!Array.isArray(this.scopes[project])) {
	                this.scopes[project] = [];
	            }

	            if (!scope) {
	                return true;
	            }

	            return this.scopes[project].indexOf(scope) > -1;
	        }

	        /**
	         * Removes a scope
	         *
	         * @param {String} project
	         * @param {String|Boolean} scope
	         */

	    }, {
	        key: 'removeScope',
	        value: function removeScope(project, scope) {
	            if (!project) {
	                return;
	            }
	            if (!this.scopes) {
	                return;
	            }
	            if (!this.scopes[project]) {
	                return;
	            }

	            if (scope) {
	                var scopeIndex = this.scopes[project].indexOf(scope);

	                this.scopes[project].splice(scopeIndex, 1);
	            } else {
	                delete this.scopes[project];
	            }
	        }

	        /**
	         * Grants a user a scope
	         *
	         * @param {String} project
	         * @param {String} scope
	         */

	    }, {
	        key: 'giveScope',
	        value: function giveScope(project, scope) {
	            if (!project) {
	                return;
	            }

	            if (!this.scopes) {
	                this.scopes = {};
	            }

	            if (!this.scopes[project]) {
	                this.scopes[project] = [];
	            }

	            if (!scope) {
	                return;
	            }
	            if (this.scopes[project].indexOf(scope) > -1) {
	                return;
	            }

	            this.scopes[project].push(scope);
	        }
	    }]);

	    return User;
	}(Entity);

	module.exports = User;

/***/ },
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Entity = __webpack_require__(117);

	/**
	 * The base class for all Connection types
	 */

	var Connection = function (_Entity) {
	    _inherits(Connection, _Entity);

	    function Connection(params) {
	        _classCallCheck(this, Connection);

	        var _this = _possibleConstructorReturn(this, (Connection.__proto__ || Object.getPrototypeOf(Connection)).call(this, params));

	        if (!_this.url) {
	            _this.url = _this.getRemoteUrl();
	        }
	        return _this;
	    }

	    _createClass(Connection, [{
	        key: 'structure',
	        value: function structure() {
	            // Fundamental fields
	            this.def(String, 'id');
	            this.def(String, 'title');
	            this.def(String, 'type');
	            this.def(String, 'url');

	            // Sync
	            this.def(Boolean, 'locked');
	            this.def(Boolean, 'remote');
	            this.def(Boolean, 'local');

	            // Extensible settings
	            this.def(Object, 'settings', {});
	        }

	        /**
	         * Creates a new Connection object
	         *
	         * @return {Connection} connection
	         */

	    }, {
	        key: 'getTemplates',


	        /**
	         * Gets templates
	         *
	         * @returns {Promise} Array of Templates
	         */
	        value: function getTemplates() {
	            return Promise.resolve([]);
	        }

	        /**
	         * Gets the remote URL
	         *
	         * @param {Boolean} withSlash
	         *
	         * @returns {String} URL
	         */

	    }, {
	        key: 'getRemoteUrl',
	        value: function getRemoteUrl() {
	            var withSlash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	            var url = this.url;

	            if (!withSlash && url[url.length - 1] == '/') {
	                url = url.substring(0, url.length - 1);
	            } else if (withSlash && url[url.length - 1] != '/') {
	                url += '/';
	            }

	            return url;
	        }

	        /**
	         * Gets the media path
	         *
	         * @returns {String} path
	         */

	    }, {
	        key: 'getMediaPath',
	        value: function getMediaPath() {
	            return '';
	        }

	        /**
	         * Gets all Media objects
	         *
	         * @returns {Promise(Array)} media
	         */

	    }, {
	        key: 'getAllMedia',
	        value: function getAllMedia() {
	            return Promise.resolve([]);
	        }

	        /**
	         * Gets a Media object
	         *
	         * @param {String} id
	         *
	         * @returns {Promise(Media)} media
	         */

	    }, {
	        key: 'getMedia',
	        value: function getMedia(id) {
	            return Promise.resolve(null);
	        }

	        /**
	         * Sets media
	         *
	         * @param {String} id
	         * @param {Object} file
	         *
	         * @returns {Promise(Array)} media
	         */

	    }, {
	        key: 'setMedia',
	        value: function setMedia(id, file) {
	            return Promise.resolve();
	        }

	        /**
	         * Removes media
	         *
	         * @param {String} id
	         *
	         * @returns {Promise(Array)} media
	         */

	    }, {
	        key: 'removeMedia',
	        value: function removeMedia(id) {
	            return Promise.resolve();
	        }

	        /**
	         *  Unpublishes content
	         *
	         * @param {String} project
	         * @param {String} environment
	         * @param {Content} content
	         *
	         * @returns {Promise} Promise
	         */

	    }, {
	        key: 'unpublishContent',
	        value: function unpublishContent() {
	            var project = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('project');
	            var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('environment');
	            var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : requiredParam('content');

	            var connection = this;

	            debug.log('Unpublishing all localised property sets...', this);

	            return connection.removePreview(project, environment, content).then(function () {
	                return LanguageHelper.getSelectedLanguages(project);
	            }).then(function (languages) {
	                function next(i) {
	                    var language = languages[i];

	                    return connection.deleteContentProperties(content.id, language).then(function () {
	                        i++;

	                        if (i < languages.length) {
	                            return next(i);
	                        } else {
	                            debug.log('Unpublished all localised property sets successfully!', connection);

	                            return Promise.resolve();
	                        }
	                    });
	                }

	                return next(0);
	            });
	        }

	        /**
	         * Removes a Content preview
	         *
	         * @params {Content} content
	         *
	         * @param {String} project
	         * @param {String} environment
	         * @param {Content} content
	         *
	         * @returns {Promise} Preview URL
	         */

	    }, {
	        key: 'removePreview',
	        value: function removePreview() {
	            var project = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('project');

	            var _this2 = this;

	            var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('environment');
	            var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : requiredParam('content');

	            if (!content.hasPreview) {
	                return Promise.resolve();
	            }

	            content.hasPreview = false;

	            return ContentHelper.updateContent(project, environment, content).then(function () {
	                return LanguageHelper.getSelectedLanguages(project);
	            }).then(function (languages) {
	                var next = function next() {
	                    var language = languages.pop();

	                    if (!language) {
	                        return Promise.resolve();
	                    }

	                    return _this2.deleteContentProperties(content.id + '_preview', language).then(function () {
	                        return next();
	                    });
	                };

	                return next();
	            });
	        }

	        /**
	         * Generates a Content preview
	         *
	         * @param {String} project
	         * @param {String} environment
	         * @param {Content} content
	         * @param {String} language
	         *
	         * @returns {Promise} Preview URL
	         */

	    }, {
	        key: 'generatePreview',
	        value: function generatePreview() {
	            var project = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('project');
	            var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('environment');

	            var _this3 = this;

	            var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : requiredParam('content');
	            var language = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : requiredParam('language');

	            content.hasPreview = true;

	            return ContentHelper.updateContent(project, environment, content).then(function () {
	                return LanguageHelper.getAllLocalizedPropertySets(project, environment, content);
	            }).then(function (sets) {
	                var properties = sets[language];

	                var url = '/preview/' + content.id;

	                properties.url = url;

	                return _this3.postContentProperties(properties, content.id + '_preview', language, content.getMeta()).then(function () {
	                    return Promise.resolve(_this3.url + url);
	                });
	            });
	        }

	        /**
	         * Publishes content
	         *
	         * @param {String} project
	         * @param {String} environment
	         * @param {Content} content
	         *
	         * @returns {Promise} Promise
	         */

	    }, {
	        key: 'publishContent',
	        value: function publishContent() {
	            var project = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('project');
	            var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('environment');
	            var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : requiredParam('content');

	            var connection = this;

	            debug.log('Publishing all localised property sets...', this);

	            return connection.removePreview(project, environment, content).then(function () {
	                return LanguageHelper.getAllLocalizedPropertySets(project, environment, content);
	            }).then(function (sets) {
	                var languages = Object.keys(sets);

	                function next(i) {
	                    var language = languages[i];
	                    var properties = sets[language];

	                    return connection.postContentProperties(properties, content.id, language, content.getMeta()).then(function () {
	                        i++;

	                        if (i < languages.length) {
	                            return next(i);
	                        } else {
	                            debug.log('Published all localised property sets successfully!', connection);

	                            return Promise.resolve();
	                        }
	                    });
	                }

	                return next(0);
	            });
	        }

	        /**
	         * Deletes content properties from the remote target
	         *
	         * @param {String} id
	         * @param {String} language
	         *
	         * @returns {Promise} promise
	         */

	    }, {
	        key: 'deleteContentProperties',
	        value: function deleteContentProperties(id, language) {
	            return Promise.callback();
	        }

	        /**
	         * Posts content properties to the remote target
	         *
	         * @param {Object} properties
	         * @param {String} id
	         * @param {String} language
	         *
	         * @returns {Promise} promise
	         */

	    }, {
	        key: 'postContentProperties',
	        value: function postContentProperties(properties, id, language) {
	            return Promise.callback();
	        }
	    }], [{
	        key: 'create',
	        value: function create() {
	            var connection = new Connection({
	                id: Entity.createId(),
	                title: 'New connection',
	                settings: {}
	            });

	            return connection;
	        }
	    }]);

	    return Connection;
	}(Entity);

	module.exports = Connection;

/***/ },
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */
/***/ function(module, exports) {

	module.exports = {
		"name": "hashbrown-cms",
		"repository": "https://github.com/Putaitu/hashbrown-cms.git",
		"version": "0.7.2",
		"description": "The pluggable CMS",
		"main": "hashbrown.js",
		"scripts": {
			"test": "echo \"Error: no test specified\" && exit 1"
		},
		"author": "Putaitu Productions",
		"license": "MIT",
		"dependencies": {
			"bluebird": "^3.3.3",
			"body-parser": "^1.14.1",
			"cookie-parser": "^1.4.3",
			"exomon": "^1.1.0",
			"express": "^4.13.3",
			"glob": "^7.0.3",
			"greenlock": "^2.1.12",
			"js-beautify": "^1.6.2",
			"le-acme-core": "^2.0.9",
			"le-challenge-fs": "^2.0.8",
			"le-sni-auto": "^2.1.0",
			"le-store-certbot": "^2.0.3",
			"marked": "^0.3.5",
			"mongodb": "^2.1.7",
			"multer": "^1.1.0",
			"nodemailer": "^2.6.1",
			"path-to-regexp": "^1.2.1",
			"pug": "^2.0.0-beta11",
			"restler": "^3.4.0",
			"rimraf": "^2.5.2",
			"to-markdown": "^2.0.1",
			"xoauth2": "^1.2.0"
		},
		"devDependencies": {
			"babel-core": "^6.18.0",
			"babel-loader": "^6.2.7",
			"babel-preset-es2015": "^6.18.0",
			"babel-preset-es2015-node5": "^1.2.0",
			"css-loader": "^0.26.1",
			"extract-text-webpack-plugin": "^1.0.1",
			"json-loader": "^0.5.4",
			"node-sass": "^3.10.1",
			"sass-loader": "^4.1.0",
			"sass-material-colors": "0.0.5",
			"style-loader": "^0.13.1",
			"webpack": "^1.14.0"
		}
	};

/***/ },
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * The editor for projects as seen on the dashboard
	 */

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ProjectEditor = function (_View) {
	    _inherits(ProjectEditor, _View);

	    function ProjectEditor(params) {
	        _classCallCheck(this, ProjectEditor);

	        var _this = _possibleConstructorReturn(this, (ProjectEditor.__proto__ || Object.getPrototypeOf(ProjectEditor)).call(this, params));

	        _this.$element = _.div({ class: 'raised project-editor in' });

	        _this.init();
	        return _this;
	    }

	    /**
	     * Event: Click remove button
	     */


	    _createClass(ProjectEditor, [{
	        key: 'onClickRemove',
	        value: function onClickRemove() {
	            var _this2 = this;

	            if (!User.current.isAdmin) {
	                return;
	            }

	            var modal = new MessageModal({
	                model: {
	                    title: 'Delete project',
	                    body: _.div(_.p('Please type in the project name to confirm'), _.input({ class: 'form-control', type: 'text', placeholder: 'Project name' }).on('change propertychange input keyup paste', function (e) {
	                        var $btn = modal.$element.find('.btn-danger');
	                        var isMatch = $(e.target).val() == _this2.model.settings.info.name;

	                        $btn.attr('disabled', !isMatch);
	                        $btn.toggleClass('disabled', !isMatch);
	                    }))
	                },
	                buttons: [{
	                    label: 'Cancel',
	                    class: 'btn-default'
	                }, {
	                    label: 'Delete',
	                    class: 'btn-danger disabled',
	                    disabled: true,
	                    callback: function callback() {
	                        apiCall('delete', 'server/projects/' + _this2.model.id).then(function () {
	                            location.reload();
	                        }).catch(UI.errorModal);
	                    }
	                }]
	            });
	        }

	        /**
	         * Event: Click remove environment
	         *
	         * @param {String} environmentName
	         */

	    }, {
	        key: 'onClickRemoveEnvironment',
	        value: function onClickRemoveEnvironment(environmentName) {
	            var _this3 = this;

	            var modal = UI.confirmModal('Remove', 'Remove environment "' + environmentName + '"', 'Are you sure want to remove the environment "' + environmentName + '" from the project "' + (this.model.title || this.model.id) + '"?', function () {
	                apiCall('delete', 'server/projects/' + _this3.model.id + '/' + environmentName).then(function () {
	                    location.reload();
	                }).catch(UI.errorModal);
	            });
	        }

	        /**
	         * Event: Click info button */

	    }, {
	        key: 'onClickInfo',
	        value: function onClickInfo() {
	            var _this4 = this;

	            if (!User.current.isAdmin) {
	                return;
	            }

	            var infoEditor = new InfoEditor({ projectId: this.model.id });

	            infoEditor.on('change', function (newInfo) {
	                _this4.model.settings.info = newInfo;

	                _this4.fetch();
	            });
	        }

	        /**
	         * Event: Click languages button
	         */

	    }, {
	        key: 'onClickLanguages',
	        value: function onClickLanguages() {
	            var _this5 = this;

	            if (!User.current.isAdmin) {
	                return;
	            }

	            var languageEditor = new LanguageEditor({ projectId: this.model.id });

	            languageEditor.on('change', function (newLanguages) {
	                _this5.model.settings.language.selected = newLanguages;

	                _this5.fetch();
	            });
	        }

	        /**
	         * Event: Click backups button
	         */

	    }, {
	        key: 'onClickBackups',
	        value: function onClickBackups() {
	            if (!User.current.isAdmin) {
	                return;
	            }

	            new BackupEditor({ model: this.model });
	        }

	        /**
	         * Event: Click migration button
	         */

	    }, {
	        key: 'onClickMigrate',
	        value: function onClickMigrate() {
	            if (!User.current.isAdmin) {
	                return;
	            }

	            new MigrationEditor({ model: this.model });
	        }

	        /**
	         * Event: Click add environment button
	         */

	    }, {
	        key: 'onClickAddEnvironment',
	        value: function onClickAddEnvironment() {
	            var _this6 = this;

	            var modal = new MessageModal({
	                model: {
	                    title: 'New environment for "' + this.model.id + '"',
	                    body: _.input({ class: 'form-control', type: 'text', placeholder: 'Type environment name here' })
	                },
	                buttons: [{
	                    label: 'Create',
	                    class: 'btn-primary',
	                    callback: function callback() {
	                        var newName = modal.$element.find('input').val();

	                        _this6.model.settings.environments.names.push(newName);

	                        apiCall('post', 'server/settings/' + _this6.model.id + '/environments', _this6.model.settings.environments).then(function () {
	                            UI.messageModal('Succes', 'The new environment "' + newName + '" was created successfully', function () {
	                                location.reload();
	                            });
	                        }).catch(UI.errorModal);

	                        return false;
	                    }
	                }]
	            });
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this7 = this;

	            var languageCount = this.model.settings.language.selected.length;
	            var userCount = this.model.users.length;

	            this.$element.toggleClass('in', true);

	            _.append(this.$element.empty(), _.div({ class: 'body' }, _.if(User.current.isAdmin, _.div({ class: 'admin dropdown' }, _.button({ class: 'dropdown-toggle', 'data-toggle': 'dropdown' }, _.span({ class: 'fa fa-ellipsis-v' })), _.ul({ class: 'dropdown-menu' }, _.li(_.a({ href: '#', class: 'dropdown-item' }, 'Info').click(function (e) {
	                e.preventDefault();_this7.onClickInfo();
	            })), _.li(_.a({ href: '#', class: 'dropdown-item' }, 'Languages').click(function (e) {
	                e.preventDefault();_this7.onClickLanguages();
	            })), _.li(_.a({ href: '#', class: 'dropdown-item' }, 'Backups').click(function (e) {
	                e.preventDefault();_this7.onClickBackups();
	            })), _.if(this.model.settings.environments.names.length > 1, _.li(_.a({ href: '#', class: 'dropdown-item' }, 'Migrate').click(function (e) {
	                e.preventDefault();_this7.onClickMigrate();
	            }))), _.li(_.a({ href: '#', class: 'dropdown-item' }, 'Delete').click(function (e) {
	                e.preventDefault();_this7.onClickRemove();
	            }))))), _.div({ class: 'info' }, _.h4(this.model.settings.info.name || this.model.id), _.p(userCount + ' user' + (userCount != 1 ? 's' : '')), _.p(languageCount + ' language' + (languageCount != 1 ? 's' : '') + ' (' + this.model.settings.language.selected.join(', ') + ')')), _.div({ class: 'environments' }, _.each(this.model.settings.environments.names, function (i, environment) {
	                return _.div({ class: 'environment' }, _.div({ class: 'btn-group' }, _.a({ title: 'Go to "' + environment + '" CMS', href: '/' + _this7.model.id + '/' + environment, class: 'environment-title btn btn-default' }, environment), _.if(User.current.isAdmin, _.div({ class: 'dropdown' }, _.button({ class: 'dropdown-toggle', 'data-toggle': 'dropdown' }, _.span({ class: 'fa fa-ellipsis-v' })), _.ul({ class: 'dropdown-menu' }, _.li(_.a({ href: '#', class: 'dropdown-item' }, 'Delete').click(function (e) {
	                    e.preventDefault();_this7.onClickRemoveEnvironment(environment);
	                })))))));
	            }), _.if(User.current.isAdmin, _.button({ title: 'Add environment', class: 'btn btn-primary btn-add btn-raised btn-round' }, _.span({ class: 'fa fa-plus' })).click(function () {
	                _this7.onClickAddEnvironment();
	            })))));

	            setTimeout(function () {
	                _this7.$element.toggleClass('in', false);
	            }, 50);
	        }
	    }]);

	    return ProjectEditor;
	}(View);

	module.exports = ProjectEditor;

/***/ },
/* 201 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BackupEditor = function (_View) {
	    _inherits(BackupEditor, _View);

	    function BackupEditor(params) {
	        _classCallCheck(this, BackupEditor);

	        var _this = _possibleConstructorReturn(this, (BackupEditor.__proto__ || Object.getPrototypeOf(BackupEditor)).call(this, params));

	        _this.modal = new MessageModal({
	            model: {
	                class: 'modal-project-admin',
	                title: _this.model.id + ' backups',
	                body: _.div(
	                // List existing backups
	                _.h4('Backups'), _.each(_this.model.backups, function (i, backup) {
	                    var label = backup;
	                    var date = new Date(parseInt(backup));

	                    if (!isNaN(date.getTime())) {
	                        label = date.toString();
	                    }

	                    return _.div({ class: 'project-backup' }, _.p({ class: 'project-backup-name' }, label), _.div({ class: 'dropdown' }, _.button({ class: 'dropdown-toggle', 'data-toggle': 'dropdown' }, _.span({ class: 'fa fa-ellipsis-v' })), _.ul({ class: 'dropdown-menu' }, _.li(
	                    // Restore backup
	                    _.a({ href: '#', class: 'dropdown-item' }, 'Restore').click(function (e) {
	                        e.preventDefault();_this.onClickRestoreBackup(backup);
	                    })), _.li(
	                    // Download backup
	                    _.a({ class: 'dropdown-item', href: apiUrl('server/backups/' + _this.model.id + '/' + backup + '.hba') }, 'Download')), _.li(
	                    // Delete backup
	                    _.a({ href: '#', class: 'dropdown-item' }, 'Delete').click(function (e) {
	                        e.preventDefault();_this.onClickDeleteBackup(backup);
	                    })))));
	                }),

	                // Create backup
	                _.div({ class: 'btn-round-group' }, _.button({ class: 'btn btn-round btn-raised btn-default btn-group-addon btn-upload-backup' }, _.span({ class: 'fa fa-upload' }), _.label('Upload')).click(function () {
	                    _this.onClickUploadBackup();
	                }), _.button({ class: 'btn btn-round btn-raised btn-primary btn-create-backup' }, _.span({ class: 'btn-icon-initial' }, _.span({ class: 'fa fa-plus' })), _.span({ class: 'btn-icon-display fa fa-save' }), _.label('Create')).click(function () {
	                    _this.onClickCreateBackup();
	                })))
	            }
	        });

	        _this.$element = _this.modal.$element;

	        _this.fetch();
	        return _this;
	    }

	    /**
	     * Event: Click upload button
	     */


	    _createClass(BackupEditor, [{
	        key: 'onClickUploadBackup',
	        value: function onClickUploadBackup() {
	            var view = this;

	            function onChangeFile() {
	                var input = $(this);
	                var numFiles = this.files ? this.files.length : 1;

	                if (numFiles > 0) {
	                    var file = this.files[0];

	                    console.log(file);

	                    debug.log('Reading data of file type ' + file.type + '...', view);
	                }
	            }

	            function onClickUpload() {
	                uploadModal.$element.find('form').submit();

	                return false;
	            }

	            function onSubmit(e) {
	                e.preventDefault();

	                var apiPath = 'server/backups/' + view.model.id + '/upload';

	                $.ajax({
	                    url: apiUrl(apiPath),
	                    type: 'POST',
	                    data: new FormData(this),
	                    processData: false,
	                    contentType: false,
	                    success: function success(id) {
	                        new MessageModal({
	                            model: {
	                                title: 'Success',
	                                body: 'Backup uploaded successfully',
	                                onSubmit: function onSubmit() {
	                                    location.reload();
	                                }
	                            }
	                        });
	                    }
	                });
	            }

	            var uploadModal = new MessageModal({
	                model: {
	                    title: 'Upload a backup file',
	                    body: _.form(_.input({ class: 'form-control', type: 'file', name: 'backup' }).change(onChangeFile)).submit(onSubmit)
	                },
	                buttons: [{
	                    label: 'Cancel',
	                    class: 'btn-default'
	                }, {
	                    label: 'OK',
	                    class: 'btn-primary',
	                    callback: onClickUpload
	                }]
	            });
	        }

	        /**
	         * Event: Click backup button
	         */

	    }, {
	        key: 'onClickCreateBackup',
	        value: function onClickCreateBackup() {
	            var _this2 = this;

	            if (!User.current.isAdmin) {
	                return;
	            }

	            apiCall('post', 'server/backups/' + this.model.id + '/new').then(function (data) {
	                new MessageModal({
	                    model: {
	                        title: 'Success',
	                        body: 'Project "' + _this2.model.id + '" was backed up successfully'
	                    },
	                    buttons: [{
	                        callback: function callback() {
	                            location.reload();
	                        },
	                        label: 'OK',
	                        class: 'btn-primary'
	                    }]
	                });
	            }).catch(UI.errorModal);
	        }

	        /**
	         * Event: Click restore backup button
	         *
	         * @param {String} timestamp
	         */

	    }, {
	        key: 'onClickRestoreBackup',
	        value: function onClickRestoreBackup(timestamp) {
	            var _this3 = this;

	            if (!User.current.isAdmin) {
	                return;
	            }

	            var label = '"' + timestamp + '"';
	            var date = new Date(parseInt(timestamp));

	            if (!isNaN(date.getTime())) {
	                label = date.toString();
	            }

	            var modal = new MessageModal({
	                model: {
	                    title: 'Restore backup',
	                    body: 'Are you sure you want to restore the backup ' + label + '? Current content will be replaced.'
	                },
	                buttons: [{
	                    label: 'Cancel',
	                    class: 'btn-default'
	                }, {
	                    label: 'Restore',
	                    class: 'btn-danger',
	                    callback: function callback() {
	                        apiCall('post', 'server/backups/' + _this3.model.id + '/' + timestamp + '/restore').then(function () {
	                            new MessageModal({
	                                model: {
	                                    title: 'Success',
	                                    body: 'Project "' + _this3.model.id + '" was restored successfully to ' + label
	                                },
	                                buttons: [{
	                                    callback: function callback() {
	                                        location.reload();
	                                    },
	                                    label: 'OK',
	                                    class: 'btn-primary'
	                                }]
	                            });
	                        }).catch(UI.errorModal);
	                    }
	                }]
	            });
	        }

	        /**
	         * Event: Click delete backup button
	         */

	    }, {
	        key: 'onClickDeleteBackup',
	        value: function onClickDeleteBackup(timestamp) {
	            var _this4 = this;

	            if (!User.current.isAdmin) {
	                return;
	            }

	            var label = timestamp;
	            var date = new Date(parseInt(timestamp));

	            if (!isNaN(date.getTime())) {
	                label = date.toString();
	            }

	            var modal = new MessageModal({
	                model: {
	                    title: 'Delete backup',
	                    body: 'Are you sure you want to delete the backup "' + label + '"?'
	                },
	                buttons: [{
	                    label: 'Cancel',
	                    class: 'btn-default'
	                }, {
	                    label: 'Delete',
	                    class: 'btn-danger',
	                    callback: function callback() {
	                        apiCall('delete', 'server/backups/' + _this4.model.id + '/' + timestamp).then(function () {
	                            location.reload();
	                        }).catch(UI.errorModal);
	                    }
	                }]
	            });
	        }
	    }]);

	    return BackupEditor;
	}(View);

	module.exports = BackupEditor;

/***/ },
/* 202 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var MigrationEditor = function (_View) {
	    _inherits(MigrationEditor, _View);

	    function MigrationEditor(params) {
	        _classCallCheck(this, MigrationEditor);

	        var _this = _possibleConstructorReturn(this, (MigrationEditor.__proto__ || Object.getPrototypeOf(MigrationEditor)).call(this, params));

	        _this.data = {
	            from: '',
	            to: '',
	            settings: {
	                schemas: true,
	                replace: true
	            }
	        };

	        _this.modal = new MessageModal({
	            model: {
	                class: 'modal-migrate-content settings-modal',
	                title: 'Migrate content',
	                body: [_.div({ class: 'migration-message' }, _.span({ class: 'fa fa-warning' }), _.span('It might be a good idea to make a project backup before you proceed')), _.div({ class: 'migration-operation' }, _.select({ class: 'form-control environment-from' }, _.each(_this.model.settings.environments.names, function (i, environment) {
	                    return _.option({ value: environment }, environment);
	                })).change(function () {
	                    _this.updateOptions();
	                }), _.span({ class: 'fa fa-arrow-right' }), _.select({ class: 'form-control environment-to' })), _.div({ class: 'migration-settings' }, _.each({
	                    replace: 'Overwrite on target',
	                    schemas: 'Schemas',
	                    content: 'Content',
	                    forms: 'Forms',
	                    media: 'Media',
	                    connections: 'Connections',
	                    settings: 'Settings'
	                }, function (key, label) {
	                    return _.div({ class: 'input-group' }, _.span(label), _.div({ class: 'input-group-addon' }, UI.inputSwitch(_this.data.settings[key], function (newValue) {
	                        _this.data.settings[key] = newValue;
	                    })));
	                }))]
	            },
	            buttons: [{
	                label: 'Cancel',
	                class: 'btn-default'
	            }, {
	                label: 'Migrate',
	                class: 'btn-primary',
	                callback: function callback() {
	                    _this.onSubmit();

	                    return false;
	                }
	            }]
	        });

	        _this.$element = _this.modal.$element;

	        _this.fetch();

	        _this.updateOptions();
	        return _this;
	    }

	    /**
	     * Updates the displayed options
	     */


	    _createClass(MigrationEditor, [{
	        key: 'updateOptions',
	        value: function updateOptions() {
	            var _this2 = this;

	            _.append(this.modal.$element.find('.environment-to').empty(), _.each(this.model.settings.environments.names, function (i, environment) {
	                // Filter out "from" environment
	                if (environment != _this2.modal.$element.find('.environment-from').val()) {
	                    return _.option({ value: environment }, environment);
	                }
	            }));
	        }

	        /**
	         * Event: Clicked submit
	         */

	    }, {
	        key: 'onSubmit',
	        value: function onSubmit() {
	            var _this3 = this;

	            this.data.from = this.modal.$element.find('.environment-from').val();
	            this.data.to = this.modal.$element.find('.environment-to').val();

	            apiCall('post', 'server/migrate/' + this.model.id, this.data).then(function () {
	                UI.messageModal('Success', 'Successfully migrated content from "' + _this3.data.from + '" to "' + _this3.data.to + '"');
	            }).catch(UI.errorModal);
	        }
	    }]);

	    return MigrationEditor;
	}(View);

	module.exports = MigrationEditor;

/***/ },
/* 203 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * The info settings editor
	 *
	 * @class View InfoEditor
	 */

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var InfoEditor = function (_View) {
	    _inherits(InfoEditor, _View);

	    function InfoEditor(params) {
	        _classCallCheck(this, InfoEditor);

	        var _this = _possibleConstructorReturn(this, (InfoEditor.__proto__ || Object.getPrototypeOf(InfoEditor)).call(this, params));

	        _this.modal = new MessageModal({
	            model: {
	                class: 'info-settings settings-modal',
	                title: 'Project info'
	            },
	            buttons: [{
	                label: 'Cancel',
	                class: 'btn-default'
	            }, {
	                label: 'Save',
	                class: 'btn-primary',
	                callback: function callback() {
	                    _this.onClickSave();

	                    return false;
	                }
	            }]
	        });

	        _this.$element = _this.modal.$element;

	        _this.fetch();
	        return _this;
	    }

	    /**
	     * Event: Click save. Posts the model to the modelUrl
	     */


	    _createClass(InfoEditor, [{
	        key: 'onClickSave',
	        value: function onClickSave() {
	            var _this2 = this;

	            SettingsHelper.setSettings(this.projectId, null, 'info', this.model).then(function () {
	                _this2.modal.hide();

	                _this2.trigger('change', _this2.model);
	            }).catch(UI.errorModal);
	        }

	        /**
	         * Renders the project name editor
	         *
	         * @returns {HTMLElement} Element
	         */

	    }, {
	        key: 'renderProjectNameEditor',
	        value: function renderProjectNameEditor() {
	            var view = this;

	            function onInputChange() {
	                view.model.name = $(this).val();
	            }

	            var $element = _.div({ class: 'project-name-editor' }, _.input({ class: 'form-control', type: 'text', value: view.model.name, placeholder: 'Input the project name here' }).on('change', onInputChange));

	            return $element;
	        }

	        /**
	         * Renders a single field
	         *
	         * @param {String} label
	         * @param {HTMLElement} content
	         *
	         * @return {HTMLElement} Editor element
	         */

	    }, {
	        key: 'renderField',
	        value: function renderField(label, $content) {
	            return _.div({ class: 'input-group' }, _.span(label), _.div({ class: 'input-group-addon' }, $content));
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this3 = this;

	            SettingsHelper.getSettings(this.projectId, null, 'info').then(function (infoSettings) {
	                _this3.model = infoSettings || {};

	                _.append(_this3.$element.find('.modal-body').empty(), _this3.renderField('Project name', _this3.renderProjectNameEditor()));
	            });
	        }
	    }]);

	    return InfoEditor;
	}(View);

	module.exports = InfoEditor;

/***/ },
/* 204 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * The language settings editor
	 *
	 * @class View LanguageEditor
	 */

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var LanguageEditor = function (_View) {
	    _inherits(LanguageEditor, _View);

	    function LanguageEditor(params) {
	        _classCallCheck(this, LanguageEditor);

	        var _this = _possibleConstructorReturn(this, (LanguageEditor.__proto__ || Object.getPrototypeOf(LanguageEditor)).call(this, params));

	        _this.modal = new MessageModal({
	            model: {
	                class: 'language-settings settings-modal',
	                title: 'Languages'
	            },
	            buttons: [{
	                label: 'Cancel',
	                class: 'btn-default'
	            }, {
	                label: 'Save',
	                class: 'btn-primary',
	                callback: function callback() {
	                    _this.onClickSave();

	                    return false;
	                }
	            }]
	        });

	        _this.$element = _this.modal.$element;

	        LanguageHelper.getSelectedLanguages(_this.projectId).then(function (selectedLanguages) {
	            _this.model = selectedLanguages;

	            _this.fetch();
	        });
	        return _this;
	    }

	    /**
	     * Event: Click save
	     */


	    _createClass(LanguageEditor, [{
	        key: 'onClickSave',
	        value: function onClickSave() {
	            var _this2 = this;

	            LanguageHelper.setLanguages(this.projectId, this.model).then(function () {
	                _this2.modal.hide();

	                _this2.trigger('change', _this2.model);
	            }).catch(UI.errorModal);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            _.append(this.$element.find('.modal-body').empty(), UI.inputChipGroup(this.model, LanguageHelper.getLanguages(this.projectId), true));
	        }
	    }]);

	    return LanguageEditor;
	}(View);

	module.exports = LanguageEditor;

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Entity = __webpack_require__(117);
	var Connection = __webpack_require__(183);

	var Project = function (_Entity) {
	    _inherits(Project, _Entity);

	    function Project() {
	        _classCallCheck(this, Project);

	        return _possibleConstructorReturn(this, (Project.__proto__ || Object.getPrototypeOf(Project)).apply(this, arguments));
	    }

	    _createClass(Project, [{
	        key: 'structure',
	        value: function structure() {
	            this.def(String, 'id');
	            this.def(Array, 'users', []);
	            this.def(Object, 'settings', {});
	            this.def(Boolean, 'useAutoBackup');
	            this.def(Array, 'backups', []);
	            this.def(String, 'backupStorage', 'local');
	        }
	    }], [{
	        key: 'create',
	        value: function create(name) {
	            var project = new Project();

	            var id = name.toLowerCase();
	            id = id.replace('.', '_');
	            id = id.replace(/[^a-z_]/g, '');

	            project.id = id;

	            project.settings.info = {
	                section: 'info',
	                name: name
	            };

	            return project;
	        }
	    }]);

	    return Project;
	}(Entity);

	module.exports = Project;

/***/ }
/******/ ]);