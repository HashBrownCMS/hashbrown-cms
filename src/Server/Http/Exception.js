'use strict';

/**
 * A throwable HTTP exception
 *
 * @memberof HashBrown.Server.Http
 */
class Exception extends Error {
    constructor(message, code, headers) {
        super(message);

        this.code = code || 500;
        this.headers = headers || {};
    }
}

module.exports = Exception;
