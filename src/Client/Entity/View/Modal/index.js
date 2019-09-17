'use strict';

/**
 * @namespace HashBrown.Client.Entity.View.Modal
 */
namespace('Entity.View.Modal')
.add(require('./ModalBase'))
.add(require('./AddEnvironment'))
.add(require('./CreateProject'))
.add(require('./CreateUser'))
.add(require('./DeleteProject'))
.add(require('./MigrateResources'))
.add(require('./PickIcon'))
.add(require('./ProjectSettings'))
.add(require('./ProjectBackups'))
.add(require('./UserEditor'));
