'use strict';

/**
 * @namespace HashBrown.Server.Entity.Resource
 */
namespace('Entity.Resource')
.add(require('Common/Entity/Resource/ResourceBase'))
.add(require('./Connection'))
.add(require('./Content'))
.add(require('Common/Entity/Resource/Form'))
.add(require('Common/Entity/Resource/Media'))
.add(require('./User'));

require('Common/Entity/Resource/Schema');
