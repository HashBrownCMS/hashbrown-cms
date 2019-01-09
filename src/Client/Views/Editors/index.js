'use strict';

/**
 * @namespace HashBrown.Client.Views.Editors
 */
namespace('Views.Editors')
.add(require('./ConnectionEditor'))
.add(require('./ContentEditor'))
.add(require('./FormEditor'))
.add(require('./JSONEditor'))
.add(require('./MediaViewer'))
.add(require('./UserEditor'))
.add(require('./SchemaEditor'))
.add(require('./ContentSchemaEditor'))
.add(require('./FieldSchemaEditor'))

namespace('Views.Editors.DeployerEditors');
namespace('Views.Editors.ProcessorEditors');

require('./FieldEditors')
