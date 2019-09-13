'use strict';

/**
 * @namespace HashBrown.Client.Entity
 */
namespace('Entity')
.add(require('Common/Entity/EntityBase'))
.add(require('Common/Entity/Project'))

require('Common/Entity/Deployer');
require('Common/Entity/Processor');
require('./Resource');
require('./View');
