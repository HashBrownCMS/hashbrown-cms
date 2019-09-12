'use strict';

/**
 * @namespace HashBrown.Server.Entity.Processor
 */
namespace('Entity.Processor')
.add(require('Common/Entity/Processor/ProcessorBase'))
.add(require('./JsonProcessor'))
.add(require('./UISchemaProcessor'));
