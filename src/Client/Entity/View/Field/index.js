'use strict';

/**
 * @namespace HashBrown.Client.Entity.View.Field
 */
namespace('Entity.View.Field')
.add(require('./FieldBase'))
.add(require('./LanguageEditor'))
.add(require('./NumberEditor'))
.add(require('./StringEditor'))
.add(require('./TagsEditor'))
.add(require('./UrlEditor'));
