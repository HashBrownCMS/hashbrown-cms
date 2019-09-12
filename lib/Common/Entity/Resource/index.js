'use strict';

/**
 * @namespace HashBrown.Common.Entity.Resource
 */
namespace('Entity.Resource')
.add(require('./ResourceBase'))
.add(require('./Connection'))
.add(require('./Content'))
.add(require('./Form'))
.add(require('./Media'))
.add(require('./User'));

require('./Schema');
