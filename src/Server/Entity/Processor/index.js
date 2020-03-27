'use strict';

/**
 * @namespace HashBrown.Server.Entity.Processor
 */
namespace('Entity.Processor')
.add(require('./ProcessorBase'))
.add(require('./JsonProcessor'))
.add(require('./UISchemaProcessor'));
