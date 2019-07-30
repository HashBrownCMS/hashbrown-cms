'use strict';

/**
 * @namespace HashBrown.Client.Models
 */
namespace('Models')
.add(require('Common/Models/Entity'))
.add(require('Common/Models/Resource'))
.add(require('./Content'))
.add(require('./Connection'))
.add(require('Common/Models/ContentSchema'))
.add(require('Common/Models/Deployer'))
.add(require('Common/Models/FieldSchema'))
.add(require('Common/Models/Form'))
.add(require('Common/Models/Media'))
.add(require('Common/Models/Processor'))
.add(require('Common/Models/Project'))
.add(require('Common/Models/Schema'))
.add(require('Common/Models/User'));
