'use strict';

/**
 * @namespace HashBrown.Client.Entity.Resource
 */
namespace('Entity.Resource')
    .add(require('./ResourceBase'))
    .add(require('./Content'))
    .add(require('./Media'))
    .add(require('./SchemaBase'))
    .add(require('Common/Entity/Resource/FieldSchema'))
    .add(require('Common/Entity/Resource/ContentSchema'))
    .add(require('./Publication'));
