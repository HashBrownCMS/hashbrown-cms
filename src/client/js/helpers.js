let Promise = require('bluebird');

// Views
let MessageModal = require('./views/MessageModal');

// Models
window.Content = require('../../server/models/Content');

let onReadyCallbacks = {};
let isReady = {};

/**
 * Brings up a message modal
 *
 * @param {String} title
 * @param {String} body
 */
window.messageModal = function messageModal(title, body, onSubmit) {
    return new MessageModal({
        model: {
            title: title,
            body: body,
            onSubmit: onSubmit
        }
    });
}

/**
 * Gets a schema with parent included recursively
 *
 * @param {Number} id
 *
 * @return {Object} schema
 */
window.getSchemaWithParents = function getSchemaWithParents(id) {
    let schema = $.extend(true, {}, resources.schemas[id]);

    if(schema) {
        // Merge parent with current schema
        // Since the child schema should override any duplicate content,
        // the parent is transformed first, then returned as the resulting schema
        if(schema.parentSchemaId) {
            let parentSchema = window.getSchemaWithParents(schema.parentSchemaId);

            for(let k in schema.properties) {
               parentSchema.properties[k] = schema.properties[k];
            }
            
            for(let k in schema.tabs) {
               parentSchema.tabs[k] = schema.tabs[k];
            }

            parentSchema.defaultTabId = schema.defaultTabId;
            parentSchema.icon = schema.icon;

            schema = parentSchema;
        }

    } else {
        console.log('No schema with id "' + id + '" available in resources');
    
    }

    return schema;
}

/**
 * Reloads a resource
 */
window.reloadResource = function reloadResource(name) {
    return new Promise(function(callback) {
        $.getJSON('/api/' + name, function(result) {
            window.resources[name] = result;

            callback(result);
        });
    });
};

/**
 * Reloads all resources
 */
window.reloadAllResources = function reloadAllResources() {
    return new Promise(function(callback) {
        let queue = ['content', 'schemas', 'media', 'connections', 'settings'];

        function processQueue(name) {
            window.reloadResource(name)
            .then(function() {
                queue.pop();

                if(queue.length < 1) {
                    callback();
                }
            });
        }

        for(let name of queue) {
            processQueue(name);
        }
    });
};

/**
 * Adds a ready callback to the queue or executes it if given key is already triggered
 */
window.onReady = function onReady(name, callback) {
    if(isReady[name]) {
        callback();
    
    } else {
        if(!onReadyCallbacks[name]) {
            onReadyCallbacks[name] = [];
        }

        onReadyCallbacks[name].push(callback);
    
    }
}

/**
 * Triggers a key
 */
window.triggerReady = function triggerReady(name) {
    isReady[name] = true;

    if(onReadyCallbacks[name]) {
        for(let callback of onReadyCallbacks[name]) {
            callback();
        }
    }
}
