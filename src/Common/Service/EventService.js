'use strict';

/**
 * A helper class for triggering and registering EVENTS
 *
 * @memberof HashBrown.Common.Service
 */
class EventService {
    /**
     * Bind an event
     *
     * @param {String} type
     * @param {String} id
     * @param {Function} callback
     */
    static on(type, id, callback) {
        checkParam(type, 'type', String);
        checkParam(id, 'id', String);
        checkParam(callback, 'callback', Function);

        if(!this.events) { this.events = {}; }
        if(!this.events[type]) { this.events[type] = {}; }

        this.events[type][id] = callback;
    }

    /**
     * Unbind an event
     *
     * @param {String} type
     * @param {String} id
     */
    static off(type, id) {
        checkParam(type, 'type', String);
        checkParam(id, 'id', String);

        if(!this.events || !this.events[type]) { return; }

        delete this.events[type][id];
    }

    /**
     * Triggers an event type
     *
     * @param {String} type
     * @param {*} value
     */
    static trigger(type, value) {
        checkParam(type, 'type', String);

        if(!this.events || !this.events[type]) { return; }

        for(let id in this.events[type]) {
            if(typeof this.events[type][id] !== 'function') { continue; }

            this.events[type][id](value);
        }
    }
    
    /**
     * Triggers a specific event
     *
     * @param {String} type
     * @param {String} id
     * @param {*} value
     */
    static triggerById(type, id, value) {
        checkParam(type, 'type', String);
        
        if(!this.events || !this.events[type] || typeof this.events[type][id] !== 'function') { return; }

        this.events[type][id](value);
    }
}

module.exports = EventService;
