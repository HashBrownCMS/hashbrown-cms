'use strict';

/**
 * @namespace HashBrown.Server.Controller
 */
namespace('Controller')
    .add(require('./ControllerBase'))
    .add(require('./InputController'))
    .add(require('./AssetController'))
    .add(require('./ResourceController'))
    .add(require('./ContentController'))
    .add(require('./DeployerController'))
    .add(require('./MediaController'))
    .add(require('./SchemaController'))
    .add(require('./ServerController'))
    .add(require('./ProjectController'))
    .add(require('./ProcessorController'))
    .add(require('./PublicationController'))
    .add(require('./UserController'))
    .add(require('./ViewController'));
