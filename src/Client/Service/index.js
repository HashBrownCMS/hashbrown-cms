'use strict';

/**
 * @namespace HashBrown.Client.Service
 */
namespace('Service')
.add(require('./DebugService'))
.add(require('../../Common/Service/LocaleService'))
.add(require('../../Common/Service/MarkdownService'))
.add(require('../../Common/Service/LibraryService'))
.add(require('./RequestService'))
.add(require('./UIService'))
.add(require('../../Common/Service/EventService'));
