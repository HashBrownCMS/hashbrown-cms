'use strict';

/**
 * @namespace HashBrown.Server.Service
 */
namespace('Service')
.add(require('./AppService'))
.add(require('./ConfigService'))
.add(require('./DatabaseService'))
.add(require('./DebugService'))
.add(require('./FileService'))
.add(require('../../Common/Service/LanguageService'))
.add(require('../../Common/Service/MarkdownService'))
.add(require('./PluginService'))
.add(require('./RequestService'))
.add(require('./ScheduleService'))
.add(require('./SyncService'))
.add(require('../../Common/Service/EventService'));

