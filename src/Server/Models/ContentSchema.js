'use strict';

const ContentSchemaCommon = require('Common/Models/ContentSchema');

/**
 * Schema for content nodes
 *
 * @memberof HashBrown.Server.Models
 */
class ContentSchema extends ContentSchemaCommon {
    constructor(properties) {
        super(properties);
    }
}

module.exports = ContentSchema;
