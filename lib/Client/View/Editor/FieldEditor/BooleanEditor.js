'use strict';

/**
 * A simple boolean editor
 *
 * @description Example:
 * <pre>
 * {
 *     "myBoolean": {
 *         "label": "My boolean",
 *         "tabId": "content",
 *         "schemaId": "boolean"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.View.Editor.FieldEditor
 */
class BooleanEditor extends HashBrown.View.Editor.FieldEditor.FieldEditor {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        // Sanity check
        if(typeof this.value === 'undefined') {
            this.value = false;
        
        } else if(typeof this.value === 'string') {
            this.value = this.value == 'true';

        } else if(typeof this.value !== 'boolean') {
            this.value = false

        }

        // Just to make sure the model has the right type of value
        setTimeout(() => {
            this.trigger('silentchange', this.value);
        }, 20);
        
        this.fetch();
    }

    /**
     * Render this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--boolean'},
            new HashBrown.View.Widget.Input({
                type: 'checkbox',
                value: this.value,
                onChange: (newValue) => {
                    this.value = newValue;
                    
                    this.trigger('change', this.value);
                }
            }).$element
        );
    }
}

module.exports = BooleanEditor;
