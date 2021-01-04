'use strict';

/**
 * @namespace HashBrown.Client.Entity.View.DeployerEditor
 */
namespace('Entity.View.DeployerEditor')
    .add(require('./DeployerEditorBase.js'))
    .add(require('./ApiDeployerEditor.js'))
    .add(require('./FileSystemDeployerEditor.js'))
    .add(require('./GitDeployerEditor.js'));
