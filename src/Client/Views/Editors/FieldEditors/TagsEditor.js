'use strict';

/**
 * A CSV string editor
 *
 * @description Example:
 * <pre>
 * {
 *     "myTags": {
 *         "label": "My tags",
 *         "tabId": "content",
 *         "schemaId": "tags"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class TagsEditor extends HashBrown.Views.Editors.FieldEditors.FieldEditor {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--tags'},
            new HashBrown.Views.Widgets.Chips({
                tooltip: this.description || '',
                value: (this.value || '').split(','),
                onChange: (newValue) => {
                    this.value = newValue.join(',');

                    this.trigger('change', this.value);
                }
            }).$element
        );
    }
}

module.exports = TagsEditor;
