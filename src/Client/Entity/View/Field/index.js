'use strict';

/**
 * @namespace HashBrown.Client.Entity.View.Field
 */
namespace('Entity.View.Field')
.add(require('./FieldBase'))
.add(require('./ArrayEditor'))
.add(require('./BooleanEditor'))
.add(require('./ContentReferenceEditor'))
.add(require('./ContentSchemaReferenceEditor'))
.add(require('./DateEditor'))
.add(require('./DropdownEditor'))
.add(require('./LocaleEditor'))
.add(require('./MediaReferenceEditor'))
.add(require('./NumberEditor'))
.add(require('./RichTextEditor'))
.add(require('./StringEditor'))
.add(require('./StructEditor'))
.add(require('./TagsEditor'))
.add(require('./UrlEditor'));
