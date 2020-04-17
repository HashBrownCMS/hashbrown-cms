'use strict';

const FileSystem = require('fs');
const HTTP = require('http');

/**
 * A generic HTTP response
 *
 * @memberof HashBrown.Server.Http
 */
class Response extends HTTP.ServerResponse {
    /**
     * Adopts another response into this one
     *
     * @param {*} data
     * @param {Number} statusCode
     * @param {Object} headers
     */
    constructor(data, statusCode = 200, headers = {}) {
        checkParam(statusCode, 'statusCode', Number);
        checkParam(headers, 'headers', Object);
    
        super({ method: data && data.method ? data.method : 'GET' });

        this.adopt(data, statusCode, headers);
    }

    /**
     * Alias to statusCode
     */
    get code() { return this.statusCode; }
    set code(statusCode) { this.statusCode = statusCode; }

    /**
     * Returns all headers
     *
     * @return {Object} Headers
     */
    getHeaders() {
        let originalHeaders = super.getHeaders() || {};

        let headers = {};

        for(let name in originalHeaders) {
            headers[name] = originalHeaders[name];
        }

        return headers;
    }

    /**
     * Adopts another response into this one
     *
     * @param {*} data
     * @param {Number} statusCode
     * @param {Object} headers
     */
    adopt(data, statusCode = 200, headers = {}) {
        checkParam(statusCode, 'statusCode', Number);
        checkParam(headers, 'headers', Object);

        this.data = data || '';
        this.statusCode = statusCode || 200;

        if(typeof headers === 'object') {
            for(let name in headers) {
                this.setHeader(name, headers[name]);
            }
        }

        // Serialise entities
        if(this.data instanceof HashBrown.Entity.EntityBase) {
            this.data = this.data.getObject();
        
        } else if(Array.isArray(this.data)) {
            for(let i in this.data) {
                if(this.data[i] instanceof HashBrown.Entity.EntityBase) {
                    this.data[i] = this.data[i].getObject();
                }
            }
        }
       
        // Set content type
        if(this.data && (this.data.constructor === Object || this.data.constructor === Array)) {
            this.setHeader('Content-Type', 'application/json');
            this.data = JSON.stringify(this.data);
        }

        if(!this.getHeader('Content-Type')) {
            this.setHeader('Content-Type', 'text/plain');
        }
    }

    /**
     * Sends the data to the client
     */
    send() {
        if(this.data instanceof FileSystem.ReadStream) {
            this.data.on('open', () => {
                this.data.pipe(this);
            });
            
            this.data.on('error', (e) => {
                if(isNaN(e.code) || e.code < 400) {
                    e.code = 404;
                }

                this.statusCode = e.code;
                this.setHeader('Content-Type', 'text/plain');

                super.end(e.message);
            });
            
        } else {
            super.end(this.data);
        
        }
    }
    
    /**
     * Gets the ETag
     *
     * @return {String} ETag
     */
    getETag() {
        return this.getHeader('ETag') || this.getHeader('etag');
    }
}

module.exports = Response;
