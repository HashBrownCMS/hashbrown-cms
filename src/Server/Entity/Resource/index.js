'use strict';

/**
 * @namespace HashBrown.Server.Entity.Resource
 */
namespace('Entity.Resource')
.add(require('./ResourceBase'))
.add(require('./Connection'))
.add(require('./Content'))
.add(require('Common/Entity/Resource/Form'))
.add(require('Common/Entity/Resource/Media'))
.add(require('./SchemaBase'));
.add(require('./ContentSchema'));
.add(require('./FieldSchema'));
.add(require('./User'));
