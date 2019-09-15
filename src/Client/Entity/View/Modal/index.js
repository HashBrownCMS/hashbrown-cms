'use strict';

/**
 * @namespace HashBrown.Client.Entity.View.Modal
 */
namespace('Entity.View.Modal')
.add(require('./ModalBase'))
.add(require('./CreateProject'))
.add(require('./DeleteProject'))
.add(require('./MigrateResources'))
.add(require('./ProjectSettings'))
.add(require('./ProjectBackups'));
