(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window._ = require('./core/Templating');
window.View = require('./core/View');

window.env = {
    json: null,
    sha: null,

    get: function(callback) {
        if(env.json) {
            callback(env.json);
        } else {
            api.file.get('env.json', function(contents) {
                var json = atob(contents.content);

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

    set: function(json, callback) {
        json = json || env.json;

        var contents = {
            content: btoa(JSON.stringify(json)),
            sha: env.sha,
            comment: 'Updating env.json'
        };

        api.file.set(contents, 'env.json', function() { 
            env.json = json;

            if(callback) {
                callback();
            }
        });
    }
};

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
    call: function(url, callback, data) {
        data = data || {};
        
        data.token = localStorage.getItem('gh-oauth-token');

        $.post(url, data, function(res) {
            if(res.err) {
                console.log(res.err);
                alert('(' + res.mode + ') ' + res.url + ': ' + res.err.json.message);

            } else if(callback) {
                callback(res);
            
            }
        });
    },

    repos: function(callback) {
        api.call('/api/' + req.params.user + '/repos/', callback);
    },

    compare: function(base, head, callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/compare/' + base + '/' + head, callback);
    },

    merge: function(base, head, callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/merge', callback, { base: base, head: head });
    },
    
    file: {
        get: function(path, callback) {
            api.call('/api/' + req.params.user + '/' + req.params.repo + '/file/get/' + path, callback);
        },
        
        update: function(data, path, callback) {
            api.call('/api/' + req.params.user + '/' + req.params.repo + '/file/update/' + path, callback, data);
        },
    
        set: function(data, path, callback) {
            api.call('/api/' + req.params.user + '/' + req.params.repo + '/file/set/' + path, callback, data);
        }
    },

    issues: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/issues', callback);
    },
    
    labels: {
        get: function(callback) {
            api.call('/api/' + req.params.user + '/' + req.params.repo + '/labels/get', callback);
        },

        set: function(data, callback) {
            api.call('/api/' + req.params.user + '/' + req.params.repo + '/labels/set', callback, data);
        }
    },
    
    issueColumns: function(callback) {
        env.get(function(json) {
            var columns = json.putaitu.issues.columns;

            columns.unshift('backlog');
            columns.push('done');
                
            callback(columns);
        });
    },

    milestones: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/milestones', callback);
    },

    collaborators: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/collaborators', callback);
    },

    repo: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo, callback);
    },

    branches: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/branches/', function(branches) {
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

},{"./core/Templating":2,"./core/View":3}],2:[function(require,module,exports){
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
/**
 *  jQuery extension
 */
(function($){
  $.event.special.destroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler()
      }
    }
  }
})(jQuery)

/**
 * Instantiating
 */
var instances = [];

var View = function(constructor, extensions) {
    var self = this;

    var name = constructor.toString();
    name = name.substring('function '.length);
    name = name.substring(0, name.indexOf('('));

    self.name = name;
    self.constructor = constructor;

    if(extensions) {
        for(var k in extensions) {
            self[k] = extensions[k];
        }
    }
}

View.extend = function(constructor, extensions) {
    if(constructor) {
        constructor.prototype = new View(constructor, extensions);
        
        return constructor;
    }
};

/**
 * Getting
 */
View.getAll = function(type) {
    var results = [];

    if(type) {
        for(var i in instances) {
            var instance = instances[i];
            var name = instance.constructor.name;

            if(name == type) {
                results.push(instance);
            }
        }
    } else {
        results = instances;
    }

    return results;
};

View.get = function(type) {
    var results = View.getAll(type);

    return results.length > 0 ? results[0] : null;
};


/**
 * Removing
 */
View.removeAll = View.clear = function(type) {
    for(var guid in instances) {
        var instance = instances[guid];
        var name = instance.constructor.name;
        
        if(!type || name == type) {
            instance.remove();
        }
    }
}

View.prototype.remove = function(timeout) {
    var self = this;

    setTimeout(function() {
        self.trigger('remove');

        if(self.$element && self.$element.length > 0) {
            self.$element.remove();
        }

        delete instances[self.guid];
    }, timeout || 0 );
};

/**
 * Reloading
 * TODO: This doesn't quite work. Might need restructuring
 */
View.prototype.reload = function() {
    var self = this;

    self.constructor();

    return self;
};

/**
 * Rendering
 */
View.prototype.preRender;
View.prototype.render;
View.prototype.postRender;

/**
 * Init
 */
View.prototype.register = function() {
    var self = this;

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    self.guid = guid();

    instances[self.guid] = self;

    return self;
};

View.prototype.init = function() {
    var self = this;
    
    if(self.preRender) {
        self.preRender();
    }

    if(self.render) {
        self.render();
    }
    
    if(self.postRender) {
        self.postRender();
    }
    
    if(self.$element) {
        self.element = self.$element[0];
        self.$element.data('view', self);
        self.$element.bind('destroyed', function() {
           self.remove();
        });
    }

    return self;
};

/**
 * Events
 */
// Trigger an event
View.prototype.trigger = function(e, obj) {
    var self = this;

    if(!self.events) {
        self.events = {
            destroy: [
                function () {
                    self.$element.remove();
                    delete self;
                }
            ]
        };
    }

    if(self.events[e]) {
        for(var i in self.events[e]) {
            if(self.events[e][i]) {
                self.events[e][i](obj);
            }
        }
    }

    return self;
};

// Bind an event
View.prototype.on = function (e, callback) {
    var self = this;
    
    if(!self.events) {
        self.events = {
            destroy: [
                function () {
                    self.$element.remove();
                    delete self;
                }
            ]
        };
    }
    
    if(!self.events[e]) {
        self.events[e] = [];
    }

    self.events[e].push(callback);

    return self;
}; 

// Check if event exists
View.prototype.hasEvent = function(name) {
    for(var k in this.events) {
        if(k == name) {
            return true;
        }
    }

    return false;
};

// Predefined events
View.prototype.ready = function(callback) {
    this.on('ready', callback);

    return this;
};

/**
 * Common methods
 */
// Adopt values
View.prototype.adopt = function(args) {
    for(var k in args) {
        this[k] = args[k];
    }

    return this;
};

// Trigger ready or init
View.prototype.readyOrInit = function() {
    if(this.hasEvent('ready')) {
        this.trigger('ready');
    } else {
        this.init();
    }
};

/**
 * Fetch
 */
View.prototype.fetch = function() {
    var self = this;

    function getModel() {
        // Get model from URL
        if(!self.model && typeof self.modelUrl === 'string') {
            $.getJSON(self.modelUrl, function(data) {
                self.model = data;
                
                self.readyOrInit();
            });
        
        // Get model with function
        } else if(!self.model && typeof self.modelFunction === 'function') {
            self.modelFunction(function(data) {
                self.model = data;

                self.readyOrInit();
            });

        // Just perform the initialisation
        } else {
            self.readyOrInit();
        }
    }

    // Get rendered content from URL
    if(typeof self.renderUrl === 'string') {
        $.ajax({
            url: self.renderUrl,
            type: 'get',
            success: function(html) {

                if(self.$element) {
                    self.$element.append(html);
                } else {
                    self.$element = $(html);
                }

                // And then get the model
                getModel();
            }
        });

    // Just get the model
    } else {
        getModel();    
    
    }

    return self;
};

module.exports = View;

},{}],4:[function(require,module,exports){
require('../client');
require('./partials/navbar');

env.get(function(config) {
    api.labels.get(function(labels) {
        function render() {
            function onClickAddLabel() {
                var label = {
                    name: 'new label',
                    color: 'cccccc'
                };

                var occurrences = 0;

                for(var i in labels) {
                    occurrences += labels[i].name == 'new label' ? 1 : 0;
                }

                if(occurrences < 1) {
                    labels.push(label);

                    render();
                }
            }

            function onClickSave() {
                var $btn = $(self);
                $btn.toggleClass('disabled', true);
                $btn.html('Saving...');

                env.set(config, function() {
                    $btn.toggleClass('disabled', false);
                    $btn.html([
                        'Save ',
                        _.span({class: 'glyphicon glyphicon-floppy-disk'})
                    ]);
                });
/*
                if(labels.length > 0) {
                    var processed = 0;

                    function process() {
                        api.labels.set(labels[processed], function(res) {
                            processed++;

                            if(processed < labels.length - 1) {
                                process();
                            } else {
                                $btn.toggleClass('disabled', false);
                                $btn.html([
                                    'Save ',
                                    _.span({class: 'glyphicon glyphicon-floppy-disk'})
                                ]);
                            } 
                        });
                    }

                    process();
                }
  */          }

            $('.page-content').html(
                _.div({class: 'container'},[
                    _.button({class: 'btn btn-success pull-right'}, [
                        'Save ',
                        _.span({class: 'glyphicon glyphicon-floppy-disk'})
                    ]).click(onClickSave),
                    _.ul({class: 'nav nav-tabs', role:'tablist'}, [
                        _.li({role: 'presentation', class: 'active'},
                            _.a({href:'#issues', 'aria-controls': 'home', role: 'tab', 'data-toggle': 'tab'},
                                'Issues'
                            )
                        )
                    ]),
                    _.div({class: 'tab-content'}, [
                        _.div({role: 'tabpanel', class: 'tab-pane active', id: 'issues'}, [
                            _.div({class: 'row'}, [
                                _.div({class: 'col-xs-6'}, [
                                    _.h4('Columns'),
                                    _.ul({class: 'list-group'}, [
                                        _.li({class: 'list-group-item'}, 'backlog'),
                                        _.each(config.putaitu.issues.columns,
                                            function(i, column) {
                                                var $li = _.li({class: 'list-group-item', 'data-name': column}, [
                                                    _.span({class: 'name'},
                                                        column
                                                    ),
                                                    _.button({class: 'btn close'},
                                                        _.span({class: 'glyphicon glyphicon-remove'})
                                                    ).click(onClickRemove)
                                                ]);

                                                function onClickRemove() {
                                                    config.putaitu.issues.columns.splice(i, 1);
                                                    $li.remove();
                                                }

                                                return $li;
                                            }
                                        ),
                                        _.li({class: 'list-group-item'}, 'done')
                                    ])
                                ]),
                                _.div({class: 'col-xs-6'}, [
                                    _.h4('Labels'),
                                    _.ul({class: 'list-group'}, [
                                        _.each(labels,
                                            function(i, label) {
                                                var $li = _.li({class: 'list-group-item'},
                                                    _.div({class: 'input-group'}, [
                                                        _.div({class: 'input-group-btn'},
                                                            _.button({class: 'btn btn-primary'},
                                                                _.span({class: 'glyphicon glyphicon-arrow-left'})
                                                            ).click(onClickAdd)
                                                        ),
                                                        _.input({type: 'text', class: 'form-control', value: label.name}).bind('change keyup propertychange paste', onChangeName),
                                                        _.div({class: 'input-group-btn'}, [
                                                            _.input({type: 'color', class: 'btn btn-default', value: '#' + label.color}).bind('change keyup propertychange paste', onChangeColor),
                                                            _.button({class: 'btn btn-danger'},
                                                                _.span({class: 'glyphicon glyphicon-remove'})
                                                            ).click(onClickRemove)
                                                        ])
                                                    ])
                                                );
                                              
                                                function onChangeColor() {
                                                    label.color = $(this).val().replace('#', '');
                                                }

                                                function onChangeName() {
                                                    var oldName = label.name;
                                                    var newName = $(this).val();
                                                    var index = config.putaitu.issues.columns.indexOf(oldName);

                                                    label.name = newName;

                                                    if(index > -1) {
                                                        config.putaitu.issues.columns[index] = newName;
                                                    
                                                        $('li[data-name="' + oldName + '"]').each(function(i) {
                                                            $(this).attr('data-name', newName);
                                                            $(this).children('.name').html(newName);
                                                        });
                                                    }
                                                }

                                                function onClickAdd() {
                                                    var index = config.putaitu.issues.columns.indexOf(label.name);

                                                    if(index < 0) {
                                                        config.putaitu.issues.columns.push(label.name);
                                                        render();
                                                    }
                                                }

                                                function onClickRemove() {
                                                    labels.splice(i, 1);
                                                    
                                                    var index = config.putaitu.issues.columns.indexOf(label.name);

                                                    if(index > -1) {
                                                        config.putaitu.issues.columns.splice(index, 1);
                                                    }

                                                    render();
                                                }

                                                return $li;
                                            }
                                        ),
                                        _.li({class: 'list-group-item'},
                                            _.button({class: 'btn btn-primary center-block'}, [
                                                'Add label ',
                                                _.span({class: 'glyphicon glyphicon-plus'})
                                            ]).click(onClickAddLabel)
                                        )
                                    ])
                                ])
                            ])
                        ])
                    ])
                ])
            );
        }

        render();
    });
});

},{"../client":1,"./partials/navbar":5}],5:[function(require,module,exports){
api.repo(function(repo) {
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
                        _.a({href: '/repos/' + req.params.user + '/' + req.params.repo + '/issues/'}, [
                            _.span({class: 'glyphicon glyphicon-exclamation-sign'}),
                            ' Issues'
                        ])
                    ),
                    _.li(
                        _.a({href: '/repos/' + req.params.user + '/' + req.params.repo + '/settings/'}, [
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

                                element.attr('value', repo.cloneUrl); 
                                
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
});

},{}]},{},[4])