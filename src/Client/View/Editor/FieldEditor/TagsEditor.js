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
 * @memberof HashBrown.Client.View.Editor.FieldEditor
 */
class TagsEditor extends HashBrown.View.Editor.FieldEditor.FieldEditor {
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
            new HashBrown.View.Widget.Chips({
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
