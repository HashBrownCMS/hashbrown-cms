'use strict';

const Widget = require('./Widget');

/**
 * A generic dropdown
 *
 * @memberof HashBrown.Client.Views.Widgets
 */
class Dropdown extends Widget {
    /**
     * Converts options into a flattened structure
     *
     * @returns {Object} Options
     */
    getFlattenedOptions() {
        if(!this.labelKey && !this.valueKey && this.options && !Array.isArray(this.options)) { return this.options; }
        
        let options = {};

        for(let key in this.options) {
            let value = this.options[key];

            let optionLabel = this.labelKey ? value[this.labelKey] : value;
            let optionValue = this.valueKey ? value[this.valueKey] : value;
            
            options[optionValue] = optionLabel;
        }

        return options;
    }

    /**
     * Gets the current value label
     *
     * @returns {String} Value label
     */
    getValueLabel() {
        return this.getFlattenedOptions()[this.value] || this.placeholder || '(none)';
    }

    /**
     * Event: Change value
     */
    onChangeInternal() {
        let value = this.element.querySelector('.widget--dropdown__value');

        if(value) {
            value.innerHTML = this.getFlattenedOptions()[this.value] || this.placeholder || '(none)';
        }

        this.onCancel();

        if(typeof this.onChange === 'function') {
            this.onChange(this.value);
        }
    }

    /**
     * Event: Typeahead
     *
     * @param {String} query
     */
    onTypeahead(query) {

    }

    /**
     * Event: Cancel
     */
    onCancel() {
        let toggle = this.element.querySelector('.widget--dropdown__toggle');

        if(toggle) {
            toggle.checked = false;
        }
    }

    /**
     * Template
     */
    template() {
        return _.div({title: this.tooltip, class: 'widget widget--dropdown dropdown'},
            // Value
            _.div({class: 'widget--dropdown__value'}, this.getValueLabel()),
            
            // Toggle
            _.input({class: 'widget--dropdown__toggle', type: 'checkbox'}),
            
            // Typeahead input
            _.if(this.useTypeAhead,
                _.input({class: 'widget--dropdown__typeahead', type: 'text'})
                    .on('input', (e) => { this.onTypeahead(e.currentTarget.value); })
            ),

            // Dropdown options
            _.div({class: 'widget--dropdown__options'},
                _.each(this.getFlattenedOptions(), (optionValue, optionLabel) => {
                    return _.button({class: 'widget--dropdown__option'}, 
                        optionLabel
                    ).click((e) => {
                        this.value = optionValue;
                        this.onChangeInternal();
                    });
                })
            ),

            // Clear button
            _.if(this.useClearButton,
                _.button({class: 'widget--dropdown__clear'},
                    _.span({class: 'fa fa-remove'})
                ).click((e) => {
                    this.value = null;
                    this.onChangeInternal();
                })
            ),

            // Obscure
            _.div({class: 'widget--dropdown__obscure'},
                _.div({class: 'widget--dropdown__obscure__inner'})
                    .click((e) => { this.onCancel(); })
            )
        );
    }
}

module.exports = Dropdown;
