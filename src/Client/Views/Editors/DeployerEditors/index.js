'use strict';

/**
 * @namespace HashBrown.Client.Views.Editors.DeployerEditors
 */
namespace('Views.Editors.DeployerEditors')
.add(require('./ApiDeployerEditor'))
.add(require('./FileSystemDeployerEditor'))
.add(require('./GitDeployerEditor'));
