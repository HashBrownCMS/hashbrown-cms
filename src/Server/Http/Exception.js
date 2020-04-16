'use strict';

/**
 * A throwable HTTP exception
 */
class Exception extends Error {
    constructor(message, code, headers) {
        super(message);

        this.code = code || 500;
        this.headers = headers || {};
    }
}

module.exports = Exception;
