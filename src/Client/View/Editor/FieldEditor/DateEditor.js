'use strict';

/**
 * An editor for date values
 *
 * @description Example:
 * <pre>
 * {
 *     "myDate": {
 *         "label": "My date",
 *         "schemaId": "date",
 *         "tabId": "content"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.View.Editor.FieldEditor
 */
class DateEditor extends HashBrown.View.Editor.FieldEditor.FieldEditor {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Event: On click remove
     */
    onClickRemove() {
        this.value = null;

        this.trigger('change', this.value);

        this.fetch();
    }

    /**
     * Event: Click open
     */
    onChange(newValue) {
        if(newValue) {
            this.value = newValue.toISOString();
        } else {
            this.value = null;
        }

        this.trigger('change', this.value);

        this.fetch();
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--date'},
            new HashBrown.Entity.View.Widget.DateTime({
                model: {
                    value: this.value,
                    disabled: this.disabled,
                    onchange: (newValue) => { this.onChange(newValue); }
                }
            }).element
        );
    }
}

module.exports = DateEditor;
