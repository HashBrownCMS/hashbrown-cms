'use strict';

/**
 * @namespace HashBrown.Server.Entity.Deployer
 */
namespace('Entity.Deployer')
.add(require('./DeployerBase'))
.add(require('./ApiDeployer'))
.add(require('./FileSystemDeployer'))
.add(require('./GitDeployer'));
