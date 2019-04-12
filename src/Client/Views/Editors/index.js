'use strict';

/**
 * @namespace HashBrown.Client.Views.Editors
 */
namespace('Views.Editors')
.add(require('./Editor'))
.add(require('./ConnectionEditor'))
.add(require('./ContentEditor'))
.add(require('./FormEditor'))
.add(require('./JSONEditor'))
.add(require('./MediaViewer'))
.add(require('./UserEditor'))
.add(require('./SchemaEditor'))
.add(require('./ContentSchemaEditor'))
.add(require('./FieldSchemaEditor'))
.add(require('./WYSIWYGEditor'))

namespace('Views.Editors.DeployerEditors');
namespace('Views.Editors.ProcessorEditors');

require('./FieldEditors')
