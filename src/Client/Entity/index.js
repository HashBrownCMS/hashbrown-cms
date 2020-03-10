'use strict';

/**
 * @namespace HashBrown.Client.Entity
 */
namespace('Entity')
.add(require('Common/Entity/EntityBase'))
.add(require('./Project'))
.add(require('./User'));

require('Common/Entity/Deployer');
require('Common/Entity/Processor');
require('./Resource');
require('./View');
