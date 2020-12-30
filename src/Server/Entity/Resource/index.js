'use strict';

/**
 * @namespace HashBrown.Server.Entity.Resource
 */
namespace('Entity.Resource')
.add(require('./ResourceBase'))
.add(require('./Content'))
.add(require('./Media'))
.add(require('./SchemaBase'))
.add(require('./ContentSchema'))
.add(require('./FieldSchema'))
.add(require('./Publication'));
