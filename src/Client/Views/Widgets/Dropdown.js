'use strict';

const Widget = require('./Widget');

/**
 * A multi purpose dropdown
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
           
            if(typeof optionValue !== 'string') { 
                optionValue = optionValue ? optionValue.toString() : '';
            }
            
            if(typeof optionLabel !== 'string') { 
                optionLabel = optionLabel ? optionLabel.toString() : '';
            }

            // Check for disabled options
            let isDisabled = false;

            if(this.disabledOptions && Array.isArray(this.disabledOptions)) {
                for(let disabledKey in this.disabledOptions) {
                    let disabledValue = this.disabledOptions[disabledKey];
                    let disabledOptionValue = this.valueKey ? disabledValue[this.valueKey] : disabledValue;
                   
                    if(typeof disabledOptionValue !== 'string') { 
                        disabledOptionValue = disabledOptionValue.toString();
                    }
               
                    if(optionValue === disabledOptionValue) {
                        isDisabled = true;
                        break;
                    }
                }
            }

            if(isDisabled) { continue; }

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
        this.sanityCheck();
       
        if(this.icon) {
            return '<span class="fa fa-' + this.icon + '"></span>';
        }

        let label = this.placeholder || '(none)';
        let options = this.getFlattenedOptions();

        if(this.useMultiple) {
            let labels = [];

            for(let key in options) {
                let value = options[key];

                if(this.value.indexOf(key) > -1) {
                    labels.push(value);
                }
            }

            label = labels.join(', ');

        } else {
            label = options[this.value] === 0 ? '0' : options[this.value] || label;
        
        }

        return label;
    }

    /**
     * Performs a sanity check of the value
     */
    sanityCheck() {
        if(this.useMultiple && !Array.isArray(this.value)) {
            this.value = [];
        } else if(!this.useMultiple && Array.isArray(this.value)) {
            this.value = null;
        }
    }

    /**
     * Updates all selected classes
     */
    updateSelectedClasses() {
        let btnOptions = this.element.querySelectorAll('.widget--dropdown__option');

        if(!btnOptions) { return; }
        
        for(let i = 0; i < btnOptions.length; i++) {
            let value = btnOptions[i].dataset.value;
            let hasValue = Array.isArray(this.value) ? this.value.indexOf(value) > -1 : this.value === value;

            btnOptions[i].classList.toggle('selected', hasValue);
        }
    }

    /**
     * Updates all position classes
     */
    updatePositionClasses() {
        setTimeout(() => {
            let toggle = this.element.querySelector('.widget--dropdown__toggle');
            let isChecked = toggle.checked;
            
            toggle.checked = true;

            let bounds = this.element.querySelector('.widget--dropdown__options').getBoundingClientRect();
            
            toggle.checked = isChecked;

            let isAtRight = bounds.right >= window.innerWidth - 10;
            let isAtBottom = bounds.bottom >= window.innerHeight - 10;

            this.element.classList.toggle('right', isAtRight);
            this.element.classList.toggle('bottom', isAtBottom);
        }, 1);
    }

    /**
     * Event: Change value
     *
     * @param {Object} newValue
     */
    onChangeInternal(newValue) {
        this.sanityCheck();

        // Change multiple value
        if(this.useMultiple) {
            // First check if value was already selected, remove if found
            let foundValue = false;
            
            for(let i in this.value) {
                if(this.value[i] === newValue) {
                    this.value.splice(i, 1);
                    foundValue = true;
                    break;
                }
            }

            // If value was not selected, add it
            if(!foundValue) {
                if(!newValue) {
                    this.value = [];
                } else {
                    this.value.push(newValue);
                }
            }

        // Change single value
        } else {
            this.value = newValue;
        }

        // Update classes
        this.updateSelectedClasses();
       
        // Update value label
        let divValue = this.element.querySelector('.widget--dropdown__value');

        if(divValue) {
            divValue.innerHTML = this.getValueLabel();
        }

        // Cancel
        this.toggle(false);

        // The value is a function, execute it and return
        if(typeof this.value === 'function') {
            this.value();
            return;
        }

        // Change event
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
        let btnOptions = this.element.querySelectorAll('.widget--dropdown__option');

        if(!btnOptions) { return; }
        
        query = (query || '').toLowerCase();

        for(let i = 0; i < btnOptions.length; i++) {
            let value = btnOptions[i].innerHTML.toLowerCase();
            let isMatch = query.length < 2 || value.indexOf(query) > -1;

            btnOptions[i].classList.toggle('hidden', !isMatch);
        }
    }

    /**
     * Toggles open/closed
     *
     * @param {Boolean} isOpen
     */
    toggle(isOpen) {
        let toggle = this.element.querySelector('.widget--dropdown__toggle');
        
        if(typeof isOpen === 'undefined') {
            isOpen = !toggle.checked;
        }

        toggle.checked = isOpen;

        if(!isOpen) {
            this.trigger('cancel');
        }
        
        this.updatePositionClasses();
        this.updateSelectedClasses();
    }

    /**
     * Template
     */
    template() {
        return _.div({title: this.tooltip, class: 'widget widget--dropdown dropdown' + (this.icon ? ' has-icon' : '')},
            // Value
            _.div({class: 'widget--dropdown__value'}, this.getValueLabel()),
            
            // Toggle
            _.input({class: 'widget--dropdown__toggle', type: 'checkbox'})
                .click((e) => {
                    this.toggle(e.currentTarget.checked);     
                }),
            
            // Typeahead input
            _.if(this.useTypeAhead,
                _.span({class: 'widget--dropdown__typeahead__icon fa fa-search'}),
                _.input({class: 'widget--dropdown__typeahead', type: 'text'})
                    .on('input', (e) => { this.onTypeahead(e.currentTarget.value); })
            ),

            // Dropdown options
            _.div({class: 'widget--dropdown__options'},
                _.each(this.getFlattenedOptions(), (optionValue, optionLabel) => {
                    // Reverse keys option
                    if(this.reverseKeys) {
                        let key = optionLabel;
                        let value = optionValue;

                        optionValue = key;
                        optionLabel = value;
                    }

                    if(!optionValue || optionValue === '---') {
                        return _.div({class: 'widget--dropdown__separator'}, optionLabel);
                    }

                    return _.button({class: 'widget--dropdown__option', 'data-value': optionValue}, 
                        optionLabel
                    ).click((e) => {
                        this.onChangeInternal(optionValue);
                    });
                })
            ),

            // Clear button
            _.if(this.useClearButton,
                _.button({class: 'widget--dropdown__clear fa fa-remove', title: 'Clear selection'})
                    .click((e) => {
                    this.onChangeInternal(null);
                })
            )
        );
    }
}

module.exports = Dropdown;
