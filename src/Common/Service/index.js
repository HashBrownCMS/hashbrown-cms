'use strict';

/**
 * @namespace HashBrown.Common.Service
 */
namespace('Service')
.add(require('./ConnectionService'))
.add(require('./ContentService'))
.add(require('./DebugService'))
.add(require('./LanguageService'))
.add(require('./MediaService'))
.add(require('./SchemaService'))
.add(require('./SettingsService'));
