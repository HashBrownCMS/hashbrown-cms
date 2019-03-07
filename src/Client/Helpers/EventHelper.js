'use strict';

const EVENTS = {};

/**
 * A helper class for triggering and registering EVENTS
 *
 * @memberof HashBrown.Client.Helpers
 */
class EventHelper {
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

        if(!EVENTS[type]) { EVENTS[type] = {}; }

        EVENTS[type][id] = callback;
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

        if(!EVENTS[type]) { return; }

        delete EVENTS[type][id];
    }

    /**
     * Triggers an event type
     *
     * @param {String} type
     * @param {*} value
     */
    static trigger(type, value) {
        if(!EVENTS[type]) { return; }

        for(let id in EVENTS[type]) {
            if(typeof EVENTS[type][id] !== 'function') { continue; }

            EVENTS[type][id](value);
        }
    }
}

module.exports = EventHelper;
