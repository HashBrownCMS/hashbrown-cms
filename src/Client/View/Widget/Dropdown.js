'use strict';

/**
 * A multi purpose dropdown
 *
 * @memberof HashBrown.Client.View.Widget
 */
class Dropdown extends HashBrown.View.Widget.Widget {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
    }
  
    /**
     * Fetches the model
     */
    async fetch() {
        try {
            if(this.options && typeof this.options.then === 'function') {
                this.options = await this.options;
            
            } else if(this.optionsUrl) {
                this.isAsync = true;
                
                this.options = await HashBrown.Service.RequestService.request('get', this.optionsUrl);
            }
                    
            super.fetch();

        } catch(e) {
            UI.errorModal(e);

        }
    }

    /**
     * Sets the value silently
     *
     * @param {String} value
     */
    setValueSilently(newValue) {
        this.sanityCheck();

        this.value = newValue;

        // Update classes
        this.updateSelectedClasses();
       
        // Update value label
        let divValue = this.element.querySelector('.widget--dropdown__value');

        if(divValue) {
            divValue.innerHTML = this.getValueLabel();
        }
    }

    /**
     * Gets option icon
     *
     * @param {String} label
     *
     * @returns {String} Icon
     */
    getOptionIcon(label) {
        if(!this.iconKey || !this.labelKey || !this.options) { return ''; }
        
        for(let key in this.options) {
            let value = this.options[key];

            let optionLabel = this.labelKey ? value[this.labelKey] : value;
           
            if(typeof optionLabel !== 'string') { 
                optionLabel = optionLabel ? optionLabel.toString() : '';
            }
        
            if(optionLabel === label) {
                return value[this.iconKey] || '';
            }
        }

        return '';
    }

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

            options[optionLabel] = optionValue;
        }

        // Sort options alphabetically
        let sortedOptions = {};

        for(let label of Object.keys(options).sort()) {
            sortedOptions[options[label]] = label;
        }

        return sortedOptions;
    }

    /**
     * Gets the current value label
     *
     * @returns {String} Value label
     */
    getValueLabel() {
        this.sanityCheck();
       
        if(this.icon) {
            return '<span class="widget--dropdown__value__tool-icon fa fa-' + this.icon + '"></span>';
        }

        let label = this.placeholder || '(none)';
        let options = this.getFlattenedOptions();

        if(this.useMultiple) {
            let labels = [];

            for(let key in options) {
                let value = options[key];

                if(value && this.value.indexOf(key) > -1) {
                    labels.push(value);
                }
            }

            if(labels.length > 0) {
                label = labels.join(', ');
            }

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
    updatePositionStyling() {
        let toggle = this.element.querySelector('.widget--dropdown__toggle');
        let options = this.element.querySelector('.widget--dropdown__options');
        let margin = parseFloat(getComputedStyle(document.documentElement).fontSize);
        let isChecked = toggle.checked;
        let isContext = this.element.classList.contains('context-menu');

        toggle.checked = true;

        options.removeAttribute('style');
    
        let bounds = this.element.getBoundingClientRect();
        let left = bounds.left;
        let top = bounds.bottom;
        let width = options.offsetWidth;
        let height = options.offsetHeight;

        toggle.checked = isChecked;

        if(left < margin) {
            left = margin;
        }
        
        if(left + width > window.innerWidth - margin) {
            left -= width;
        }
       
        if(isContext) {
            if(top + height > window.innerHeight - margin) {
                top -= (top + height) - (window.innerHeight - margin);
            }
            
            if(top < margin) {
                top = margin;
            }
        }
      
        if(top + height > window.innerHeight - margin) {
            height = window.innerHeight - top - margin;
        }
     
        options.style.position = 'fixed';
        options.style.width = width + 'px';
        options.style.left = left + 'px';
        options.style.top = top + 'px';
        options.style.height = height + 'px';
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

        if(!isOpen) {
            this.trigger('cancel');
        } else {
            if(this.useTypeAhead) {
                this.element.querySelector('.widget--dropdown__typeahead').focus();
            }
        }
        
        this.updatePositionStyling();
        this.updateSelectedClasses();
        
        setTimeout(() => {
            toggle.checked = isOpen;
        }, 2);
    }

    /**
     * Template
     */
    template() {
        return _.div({title: this.tooltip, class: 'widget widget--dropdown dropdown' + (this.icon ? ' small has-icon' : '')},
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
                    let optionIcon = this.getOptionIcon(optionLabel);

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
                        _.if(optionIcon, 
                            _.span({class: 'widget--dropdown__option__icon fa fa-' + optionIcon})
                        ),
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
