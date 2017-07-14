'use strict';

let ContentSchemaCommon = require('../../common/Models/ContentSchema');

/**
 * Schema for content nodes
 */
class ContentSchema extends ContentSchemaCommon {
    constructor(properties) {
        super(properties);
    }
}

module.exports = ContentSchema;
