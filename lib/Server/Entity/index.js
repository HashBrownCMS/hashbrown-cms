'use strict';

/**
 * @namespace HashBrown.Server.Entity
 */
namespace('Entity')
.add(require('Common/Entity/EntityBase'))
.add(require('Common/Entity/Project'))
.add(require('./Task'))

require('./Deployer');
require('./Processor');
require('./Resource');
