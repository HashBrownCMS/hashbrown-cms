'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * A simple number editor
 *
 * @description Example:
 * <pre>
 * {
 *     "myNumber": {
 *         "label": "My number",
 *         "tabId": "content",
 *         "schemaId": "number",
 *         "config": {
 *             "step": 0.5
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class NumberEditor extends FieldEditor {
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Event: Change
     */
    onChange() {
        this.value = parseFloat(this.$input.val());

        this.trigger('change', this.value);
    }
   
    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */
    static renderConfigEditor(config)
    {
        config.step = config.step || 'any';

        return _.div({class: 'field-container'},
            _.div({class: 'field-key'}, 'Step'),
            _.div({class: 'field-value'},
                _.input({class: 'form-control', type: 'text', value: config.step})
                    .change((e) => {
                        config.step = e.currentTarget.value;
                    })
            )
        );
    }

    /**
     * Renders this editor
     */
    render() {
        var editor = this;

        // Main element
        this.$element = _.div({class: 'field-editor string-editor'},
            // Render preview
            this.renderPreview(),

            _.if(this.disabled,
                _.p(this.value || '(none)')
            ),
            _.if(!this.disabled,
                this.$input = _.input({class: 'form-control', value: this.value, type: 'number', step: this.config.step || 'any'})
                    .on('change propertychange paste keyup', function() { editor.onChange(); })
            )
        );
    }
}

module.exports = NumberEditor;
