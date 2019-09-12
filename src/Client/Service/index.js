'use strict';

/**
 * @namespace HashBrown.Client.Service
 */
namespace('Service')
.add(require('./ConnectionService'))
.add(require('./ContentService'))
.add(require('./FormService'))
.add(require('./DebugService'))
.add(require('./LanguageService'))
.add(require('../../Common/Service/MarkdownService'))
.add(require('./MediaService'))
.add(require('./ProjectService'))
.add(require('./RequestService'))
.add(require('./ResourceService'))
.add(require('./SchemaService'))
.add(require('./SettingsService'))
.add(require('./UIService'))
.add(require('./EventService'));
