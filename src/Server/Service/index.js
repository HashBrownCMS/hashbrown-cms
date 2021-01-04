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
    .add(require('../../Common/Service/LocaleService'))
    .add(require('../../Common/Service/MarkdownService'))
    .add(require('./MigrationService'))
    .add(require('../../Common/Service/LibraryService'))
    .add(require('./PluginService'))
    .add(require('./RequestService'))
    .add(require('./ScheduleService'))
    .add(require('../../Common/Service/EventService'));
