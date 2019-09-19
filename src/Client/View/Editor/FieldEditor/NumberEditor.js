'use strict';

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
 * @memberof HashBrown.Client.View.Editor.FieldEditor
 */
class NumberEditor extends HashBrown.View.Editor.FieldEditor.FieldEditor {
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
            this.field(
                'Step',
                new HashBrown.Entity.View.Widget.Number({
                    model: {
                        step: 'any',
                        tooltip: 'The division by which the input number is allowed (0 is any division)',
                        value: config.step === 'any' ? 0 : config.step,
                        onchange: (newValue) => {
                            if(newValue == 0) { newValue = 'any'; }

                            config.step = newValue;
                        }
                    }
                }).element
            ),
            this.field(
                'Min value',
                new HashBrown.Entity.View.Widget.Number({
                    model: {
                        tooltip: 'The minimum required value',
                        step: 'any',
                        value: config.min || 0,
                        onchange: (newValue) => {
                            config.min = newValue;
                        }
                    }
                }).element
            ),
            this.field(
                'Max value',
                new HashBrown.Entity.View.Widget.Number({
                    model: {
                        tooltip: 'The maximum allowed value (0 is infinite)',
                        step: 'any',
                        value: config.max || 0,
                        onchange: (newValue) => {
                            config.max = newValue;
                        }
                    }
                }).element
            ),
            this.field(
                'Is slider',
                new HashBrown.Entity.View.Widget.Checkbox({
                    model: {
                        tooltip: 'Whether or not this number should be edited as a range slider',
                        value: config.isSlider || false,
                        onchange: (newValue) => {
                            config.isSlider = newValue;
                        }
                    }
                }).element
            )
        ];
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--number'},
            new HashBrown.Entity.View.Widget.Number({
                model: {
                    value: this.value,
                    range: this.config.isSlider,
                    step: this.config.step || 'any',
                    min: this.config.min,
                    max: this.config.max,
                    onchange: (newValue) => {
                        this.value = parseFloat(newValue);

                        this.trigger('change', this.value);
                    }
                }
            }).element
        );
    }
}

module.exports = NumberEditor;
