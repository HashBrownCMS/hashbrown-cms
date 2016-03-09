'use strict';

let Content = require('./Content');

/**
 * The base type for all Pages
 */
class Page extends Content {
    constructor(data) {
        super(data);
    }
}

module.exports = Page;
