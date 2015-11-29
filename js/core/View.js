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
