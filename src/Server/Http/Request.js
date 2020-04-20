'use strict';

const HTTP = require('http');

/**
 * A server request
 */
class Request extends HTTP.IncomingMessage {
    /**
     * Gets the value of a header
     *
     * @param {String} name
     *
     * @param {String} value
     */
    getHeader(name) {
        if(!this.headers) { return null; }

        return this.headers[name];
    }

    /**
     * Gets the ETag
     *
     * @return {String} ETag
     */
    getETag() {
        return this.getHeader('If-None-Match') || this.getHeader('if-none-match');
    }
}

module.exports = Request;
