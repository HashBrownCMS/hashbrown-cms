(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window._ = require('./core/Templating');

window.helper = {
    formatDate: function(input) {
        var date = new Date(input);
        var output =
            date.getFullYear() +
            '-' +
            date.getMonth() +
            '-' +
            date.getDate() +
            ' ' +
            date.getHours() +
            ':' +
            date.getMinutes() +
            ':' +
            date.getSeconds();

        return output;
    }
};

window.api = {
    call: function(url, callback) {
        $.post(url, { token: localStorage.getItem('gh-oauth-token') }, function(res) {
            if(res.err) {
                console.log(res.err);
                alert(res.err.json.message);
            } else {
                callback(res);
            }
        });
    },

    repos: function(user, callback) {
        api.call('/api/' + user + '/repos/', callback);
    },

    compare: function(user, repo, base, head, callback) {
        api.call('/api/' + user + '/' + repo + '/compare/' + base + '/' + head, callback);
    },

    merge: function(user, repo, base, head, callback) {
        api.call('/api/' + user + '/' + repo + '/merge/' + base + '/' + head, callback);
    },

    collaborators: function(user, repo, callback) {
        api.call('/api/' + user + '/' + repo + '/collaborators', callback);
    },

    repo: function(user, repo, callback) {
        api.call('/api/' + user + '/' + repo, callback);
    },

    branches: function(user, repo, callback) {
        api.call('/api/' + user + '/' + repo + '/branches/', function(branches) {
            branches.sort(function(a, b) {
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

},{"./core/Templating":2}],2:[function(require,module,exports){
var Templating = {};

function append(el, content) {
    if(Object.prototype.toString.call(content) === '[object Array]') {
        for(var i in content) {
            append(el, content[i]);
        }

    } else if(content) {
        el.append(content);
    
    }
}

function create(tag, attr, content) {
    var el = $('<' + tag + '></' + tag + '>')
       
    // If the attribute parameter fails, it's probably an element or a string
    try {
        for(var k in attr) {
            el.attr(k, attr[k]);
        }
    } catch(err) {
        content = attr;
    }

    append(el, content);

    return el;
}

function declareMethod(type) {
    Templating[type] = function(attr, content) {
        return create(type, attr, content);
    };
}

function declareBootstrapMethod(type) {
    var tagName = 'div';
  
    if(type.indexOf('|') > -1) {
        tagName = type.split('|')[1];
        type = type.split('|')[0];
    }
    
    var functionName = type.replace(/-/g,'_');

    Templating[functionName] = function(attr, content) {
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
    'form', 'input'
];

var bootstrapTypes = [
    'row', 'col',
    
    'col-xs-1', 'col-xs-2', 'col-xs-3', 'col-xs-4', 'col-xs-5', 'col-xs-6', 'col-xs-7', 'col-xs-8', 'col-xs-9', 'col-xs-10', 'col-xs-11', 'col-xs-12',
    'col-sm-1', 'col-sm-2', 'col-sm-3', 'col-sm-4', 'col-sm-5', 'col-sm-6', 'col-sm-7', 'col-sm-8', 'col-sm-9', 'col-sm-10', 'col-sm-11', 'col-sm-12',
    'col-md-1', 'col-md-2', 'col-md-3', 'col-md-4', 'col-md-5', 'col-md-6', 'col-md-7', 'col-md-8', 'col-md-9', 'col-md-10', 'col-md-11', 'col-md-12',
    'col-lg-1', 'col-lg-2', 'col-lg-3', 'col-lg-4', 'col-lg-5', 'col-lg-6', 'col-lg-7', 'col-lg-8', 'col-lg-9', 'col-lg-10', 'col-lg-11', 'col-lg-12',

    'jumbotron',
    'container',
    
    'panel',
    'panel-heading',
    'panel-footer',
    'panel-collapse',
    'panel-body',
    
    'navbar|nav',
    'navbar-nav|ul',

    'collapse',

    'glyphicon|span',

    'btn|button',
    'btn-group',

    'list-group', 'list-group-item',
    'input-group', 'input-group-btn|span', 'input-group-addon|span', 'form-control|input'
];

for(var i in elementTypes) {
    declareMethod(elementTypes[i]);
}

for(var i in bootstrapTypes) {
    declareBootstrapMethod(bootstrapTypes[i]);
}
 
Templating.each = function(array, callback) {
    var elements = [];

    for(var i in array) {
        var element = callback(i, array[i]);

        if(element) {
            elements.push(element);
        }
    }
     
    return elements;
};

module.exports = Templating;

},{}],3:[function(require,module,exports){
require('../client');
require('./partials/navbar');

$('.page-content').html(
    _.div({class: 'container'})
);

},{"../client":1,"./partials/navbar":4}],4:[function(require,module,exports){
$('.navbar-content').html(
    _.div({class: 'navbar navbar-default'},
        _.div({class: 'container'}, [
            _.ul({class: 'nav navbar-nav'}, [
                _.li(
                    _.a({href: '/repos/' + req.params.user}, [
                        _.span({class: 'glyphicon glyphicon-arrow-left'}),
                        ' Repos'
                    ])
                ),
                _.li(
                    _.a({href: '/repos/' + req.params.user + '/' + req.params.repo + '/deployment/'}, [
                        _.span({class: 'glyphicon glyphicon-upload'}),
                        ' Deployment'
                    ])
                ),
                _.li(
                    _.a({href: '/repos/' + req.params.user + '/' + req.params.repo + '/collaborators/'}, [
                        _.span({class: 'glyphicon glyphicon-user'}),
                        ' Collaborators'
                    ])
                ),
                _.li(
                    _.a({href: '/repos/' + req.params.repo + '/issues/'}, [
                        _.span({class: 'glyphicon glyphicon-th-list'}),
                        ' Issues'
                    ])
                ),
                _.li(
                    _.a({href: '/repos/' + req.params.repo + '/settings/'}, [
                        _.span({class: 'glyphicon glyphicon-cog'}),
                        ' Settings'
                    ])
                )
            ]),
            _.ul({class: 'nav navbar-nav navbar-right'},
                _.li({class: 'navbar-btn'},
                    _.div({class: 'input-group'}, [
                        _.span({class: 'input-group-addon'},
                            'git'
                        ),
                        function() {
                            var element = _.input({class: 'form-control', type: 'text', value: ''});

                            api.repo(req.params.user, req.params.repo, function(repo) {
                                element.attr('value', repo.cloneUrl); 
                            });

                            return element;
                        }
                    ])
                )
            )
        ])
    )
);

// Set active navigation button
$('.navbar-content .navbar-nav li').each(function(i) {
    var a = $(this).children('a');
    var isActive = location.pathname == a.attr('href') || location.pathname + '/' == a.attr('href');

    $(this).toggleClass('active', isActive);
});

},{}]},{},[3])