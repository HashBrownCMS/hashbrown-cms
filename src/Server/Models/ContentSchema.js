'use strict';

const ContentSchemaCommon = require('Common/Models/ContentSchema');

/**
 * Schema for content nodes
 */
class ContentSchema extends ContentSchemaCommon {
    constructor(properties) {
        super(properties);
    }
}

module.exports = ContentSchema;
