'use strict';

/**
 * @namespace HashBrown.Server.Controllers
 */
namespace('Controllers')
.add(require('./Controller'))
.add(require('./ApiController'))
.add(require('./ConfigController'))
.add(require('./ConnectionController'))
.add(require('./ContentController'))
.add(require('./FormsController'))
.add(require('./MediaController'))
.add(require('./PluginController'))
.add(require('./ScheduleController'))
.add(require('./SchemaController'))
.add(require('./ServerController'))
.add(require('./SettingsController'))
.add(require('./SyncController'))
.add(require('./TestController'))
.add(require('./UserController'))
.add(require('./ViewController'));
