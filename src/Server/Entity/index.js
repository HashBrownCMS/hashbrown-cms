'use strict';

/**
 * @namespace HashBrown.Server.Entity
 */
namespace('Entity')
.add(require('Common/Entity/EntityBase'))
.add(require('./Project'))
.add(require('./Task'))
.add(require('./User'));

require('./Deployer');
require('./Processor');
require('./Resource');
require('./View');
