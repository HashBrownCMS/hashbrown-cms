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

        this.fetch();
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

        return [
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Step'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Input({
                        type: 'number',
                        step: 'any',
                        tooltip: 'The division by which the input number is allowed (0 is any division)',
                        value: config.step === 'any' ? 0 : config.step,
                        onChange: (newValue) => {
                            if(newValue == 0) { newValue = 'any'; }

                            config.step = newValue;
                        }
                    }).$element
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Min value'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Input({
                        tooltip: 'The minimum required value',
                        type: 'number',
                        step: 'any',
                        value: config.min || 0,
                        onChange: (newValue) => {
                            config.min = newValue;
                        }
                    }).$element
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Max value'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Input({
                        tooltip: 'The maximum allowed value (0 is infinite)',
                        type: 'number',
                        step: 'any',
                        value: config.max || 0,
                        onChange: (newValue) => {
                            config.max = newValue;
                        }
                    }).$element
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Is slider'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Input({
                        tooltip: 'Whether or not this number should be edited as a range slider',
                        type: 'checkbox',
                        value: config.isSlider || false,
                        onChange: (newValue) => {
                            config.isSlider = newValue;
                        }
                    }).$element
                )
            )
        ];
    }

    /**
     * Renders this editor
     */
    template() {
        return new HashBrown.Views.Widgets.Input({
            value: this.value,
            type: this.config.isSlider ? 'range' : 'number',
            step: this.config.step || 'any',
            min: this.config.min || '0',
            max: this.config.max || '0',
            onChange: (newValue) => {
                this.value = parseFloat(newValue);

                this.trigger('change', this.value);
            }
        }).$element;
    }
}

module.exports = NumberEditor;
