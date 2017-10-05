'use strict';

const FieldEditor = require('./FieldEditor');

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
class TagsEditor extends FieldEditor {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor__field__value'},
            new HashBrown.Views.Widgets.Chips({
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
