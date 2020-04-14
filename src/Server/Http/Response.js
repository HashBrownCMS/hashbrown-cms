'use strict';

const FileSystem = require('fs');
const HTTP = require('http');

/**
 * A generic HTTP response
 *
 * TODO: Make this inherit HTTP.ServerResponse
 *
 * @memberof HashBrown.Server.Http
 */
class Response {
    constructor(data, code, headers) {
        this.data = data || '';
        this.code = isNaN(code) ? 200 : code;
        this.headers = typeof headers === 'object' ? headers || {} : {};
        this.time = new Date();

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
        
        if(this.data && (this.data.constructor === Object || this.data.constructor === Array)) {
            this.headers['Content-Type'] = 'application/json';
            this.data = JSON.stringify(this.data);
        }

        if(!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'text/plain';
        }
    }

    /**
     * Handles the request
     *
     * @param {HTTP.ServerResponse} request
     */
    end(response) {
        checkParam(response, 'response', HTTP.ServerResponse, true);
  
        if(this.data instanceof FileSystem.ReadStream) {
            this.data.on('open', () => {
                response.writeHead(this.code, this.headers);
                this.data.pipe(response);
            });
            
            this.data.on('error', (e) => {
                if(isNaN(e.code) || e.code < 400) {
                    e.code = 404;
                }

                response.writeHead(e.code, { 'Content-Type': 'text/plain' });
                response.end(e.message);
            });
            
        } else {
            response.writeHead(this.code, this.headers);
            response.end(this.data);
        
        }
    }
}

module.exports = Response;
