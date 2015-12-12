'use strict';

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
 * GUID
 */
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

/**
 * Helper
 */
let instances = [];

class ViewHelper {
    static getAll(type) {
        let results = [];

        if(type) {
            for(let i in instances) {
                let instance = instances[i];
                let name = instance.constructor.name;

                if(name == type) {
                    results.push(instance);
                }
            }
        } else {
            results = instances;
        }

        return results;
    }

    static get(type) {
        let results = ViewHelper.getAll(type);

        return results.length > 0 ? results[0] : null;
    }

    static clear(type) {
        for(let guid in instances) {
            let instance = instances[guid];
            let name = instance.constructor.name;
            
            if(!type || name == type) {
                instance.remove();
            }
        }
    }

    static remove(timeout) {
        let view = this;

        setTimeout(function() {
            view.trigger('remove');

            if(view.$element && view.$element.length > 0) {
                view.$element.remove();
            }

            delete instances[view.guid];
        }, timeout || 0 );
    }
}

window.ViewHelper = ViewHelper;

/**
 * Class
 */
class View {
    /**
     * Init
     */
    constructor(args) {
        this.name = this.getName();
        this.guid = guid();
        this.events = {};

        this.adopt(args);

        instances[this.guid] = this;
    }

    getName() {
        let name = constructor.toString();
        name = name.substring('function '.length);
        name = name.substring(0, name.indexOf('('));

        return name;
    }

    init() {
        this.prerender();
        this.render();
        this.postrender();
        
        if(this.$element) {
            this.element = this.$element[0];
            this.$element.data('view', this);
            this.$element.bind('destroyed', function() {
               $(this).data('view').remove();
            });
        }
    }


    // Adopt values
    adopt(args) {
        for(let k in args) {
            this[k] = args[k];
        }

        return this;
    }

    /**
     * Rendering
     */
    prerender() {

    }

    fetch() {

    }

    render() {

    }

    postrender() {

    }

    /**
     * Events
     */
    // Destroy
    destroy() {
        if(this.$element) {
            this.$element.remove();
        }

        instances.splice(this.guid, 1);

        delete this;
    }

    // Call an event (for internal use)
    call(callback, data, ui) {
        callback(data, ui, this);
    }

    // Trigger an event
    trigger(e, obj) {
        if(this.events[e]) {
            if(this.events[e].length) {
                for(let i in this.events[e]) {
                    if(this.events[e][i]) {
                        this.events[e][i](obj);
                    }
                }
            } else {
                this.events[e](obj);
            }
        }
    }

    // Bind an event
    on(e, callback) {
        let view = this;

        // No events registered, register this as the only event
        if(!this.events[e]) {
            this.events[e] = function(data) { view.call(callback, data, this); };
        
        // Events have already been registered, add to callback array
        } else {
            // Only one event is registered, so convert from a single reference to an array
            if(!this.events[e].length) {
                this.events[e] = [
                    this.events[e]
                ];
            }
           
            // Insert the event call into the array 
            this.events[e].push(function(data) { view.call(callback, data, this); });
        }
    }

    // Check if event exists
    hasEvent(name) {
        for(let k in this.events) {
            if(k == name) {
                return true;
            }
        }

        return false;
    }

    /**
     * Fetch
     */
    fetch() {
        let view = this;

        function getModel() {
            // Get model from URL
            if(!view.model && typeof view.modelUrl === 'string') {
                $.getJSON(view.modelUrl, function(data) {
                    view.model = data;
                    
                    view.readyOrInit();
                });
            
            // Get model with function
            } else if(!view.model && typeof view.modelFunction === 'function') {
                view.modelFunction(function(data) {
                    view.model = data;

                    view.readyOrInit();
                });

            // Just perform the initialisation
            } else {
                view.readyOrInit();
            }
        }

        // Get rendered content from URL
        if(typeof view.renderUrl === 'string') {
            $.ajax({
                url: view.renderUrl,
                type: 'get',
                success: function(html) {

                    if(view.$element) {
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
}

window.View = View;
