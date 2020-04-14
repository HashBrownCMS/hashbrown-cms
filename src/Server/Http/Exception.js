'use strict';

/**
 * A throwable HTTP exception
 */
class Exception extends Error {
    constructor(message, code, stack) {
        super(message);

        this.code = code || 500;

        if(stack) {
            this.stack = stack;
        }
    }
}

module.exports = Exception;
