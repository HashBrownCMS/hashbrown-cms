'use strict';

/**
 * @namespace HashBrown.Client.Entity.Resource
 */
namespace('Entity.Resource')
.add(require('Common/Entity/Resource/ResourceBase'))
.add(require('./Connection'))
.add(require('./Content'))
.add(require('Common/Entity/Resource/Form'))
.add(require('Common/Entity/Resource/Media'))
.add(require('Common/Entity/Resource/User'));

require('Common/Entity/Resource/Schema');
