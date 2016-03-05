'use strict';

let Struct = require('./struct');

class PageStruct extends Struct {
    /**
     * Constructor
     * Uses the standard page struct model per default
     */
    constructor() {
        let base = require('../../../structs/page.json');

        super(base);
    }
}

module.exports = PageStruct;
