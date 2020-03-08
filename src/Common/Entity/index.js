'use strict';

/**
 * @namespace HashBrown.Common.Entity
 */
namespace('Entity')
.add(require('./EntityBase'))
.add(require('./Project'))
.add(require('./User'));

require('./Deployer');
require('./Processor');
require('./Resource');
