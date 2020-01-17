'use strict';

/**
 * @namespace HashBrown.Server.Service
 */
namespace('Service')
.add(require('./AppService'))
.add(require('./BackupService'))
.add(require('./CacheService'))
.add(require('./ConfigService'))
.add(require('./ConnectionService'))
.add(require('./ContentService'))
.add(require('./DatabaseService'))
.add(require('./DebugService'))
.add(require('./FileService'))
.add(require('./FormService'))
.add(require('./LanguageService'))
.add(require('../../Common/Service/MarkdownService'))
.add(require('./MediaService'))
.add(require('./PluginService'))
.add(require('./ProjectService'))
.add(require('./RequestService'))
.add(require('./ScheduleService'))
.add(require('./SchemaService'))
.add(require('./SettingsService'))
.add(require('./SyncService'))
.add(require('./TestService'))
.add(require('./UpdateService'))
.add(require('./UserService'))
.add(require('../../Common/Service/EventService'));

