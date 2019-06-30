'use strict';

/**
 * @namespace HashBrown.Server.Models
 */
namespace('Models')
.add(require('Common/Models/Entity'))
.add(require('Common/Models/Resource'))
.add(require('./Connection'))
.add(require('./Content'))
.add(require('./ContentSchema'))
.add(require('./Deployer'))
.add(require('./FieldSchema'))
.add(require('Common/Models/Form'))
.add(require('./Media'))
.add(require('Common/Models/Processor'))
.add(require('Common/Models/Project'))
.add(require('Common/Models/Schema'))
.add(require('./Task'))
.add(require('./User'));
