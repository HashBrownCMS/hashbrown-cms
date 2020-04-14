'use strict';

/**
 * @namespace HashBrown.Client.Entity
 */
namespace('Entity')
.add(require('Common/Entity/EntityBase'))
.add(require('Common/Entity/Context'))
.add(require('./Project'))
.add(require('./User'));

require('./Resource');
require('./View');
