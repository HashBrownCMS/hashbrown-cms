'use strict';

/**
 * @namespace HashBrown.Client.View.Editor.DeployerEditor
 */
namespace('View.Editor.DeployerEditor')
.add(require('./ApiDeployerEditor'))
.add(require('./FileSystemDeployerEditor'))
.add(require('./GitDeployerEditor'));
