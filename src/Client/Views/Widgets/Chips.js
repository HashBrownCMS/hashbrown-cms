'use strict';

const Widget = require('./Widget');

/**
 * A group of chips
 */
class Chips extends Widget {
    /**
     * Event: Change
     */
    onChangeInternal() {
        if(typeof this.onChange !== 'function') { return; }

        this.onChange(this.value);
    }
    
    /**
     * Pre render
     */
    prerender() {
        // Array check
        // NOTE: Array is the default mode for this widget
        if(this.useArray === true || typeof this.useArray === 'undefined') {
            // Check format
            if(!this.value || !Array.isArray(this.value)) {
                this.value = [];
            }
            
            if(!this.disabledValue || !Array.isArray(this.disabledValue)) {
                this.disabledValue = [];
            }

            // Check empty values
            for(let i = this.value.length - 1; i >= 0; i--) {
                if(!this.value[i]) {
                    this.value.splice(i, 1);
                }
            }
            
            // Check for empty values or duplicates in disabled value
            for(let i = this.disabledValue.length - 1; i >= 0; i--) {
                if(!this.disabledValue[i] || this.value.indexOf(this.disabledValue[i]) > -1) {
                    this.disabledValue.splice(i, 1);
                }
            }

        // Object check
        } else if(this.useArray === false || this.useObject === true) {
            // Check format
            if(!this.value || Array.isArray(this.value) || typeof this.value !== 'object') {
                this.value = {};
            }

            if(!this.disabledValue || Array.isArray(this.disabledValue) || typeof this.disabledValue !== 'object') {
                this.disabledValue = {};
            }

            // Check empty values
            for(let k in this.value) {
                if(!k || !this.value[k]) {
                    delete this.value[k];
                }
            }
            
            // Check for empty values or duplicates in disabled value
            for(let k in this.disabledValue) {
                if(!k || !this.disabledValue[k] || this.value[k]) {
                    delete this.value[k];
                }
            }
        }
    }
    
    /**
     * Template
     */
    template() {
        return _.div({class: 'widget widget--chips'},
            _.each(this.disabledValue, (i, item) => {
                return _.div({class: 'widget--chips__chip'},
                    _.input({class: 'widget--chips__chip__input', disabled: true, value: item})
                );
            }),
            _.each(this.value, (i, item) => {
                return _.div({class: 'widget--chips__chip'},
                    _.if(this.useObject === true || this.useArray === false || this.valueKey,
                        _.input({class: 'widget--chips__chip__input', title: 'The key', type: 'text', value: item[this.valueKey] || i, pattern: '.{1,}'})
                            .on('input', (e) => {
                                if(this.valueKey) {
                                    item[this.valueKey] = e.currentTarget.value || '';

                                } else {
                                    i = e.currentTarget.value || '';

                                    this.value[i] = item;
                                }
                       
                                this.onChangeInternal();
                            }),
                    ),
                    _.input({class: 'widget--chips__chip__input', title: 'The label', type: 'text', value: this.labelKey ? item[this.labelKey] : item, pattern: '.{1,}'})
                        .on('input', (e) => {
                            if(this.labelKey) {
                                item[this.labelKey] = e.currentTarget.value || '';
                            } else {
                                this.value[i] = e.currentTarget.value || '';
                            }
                   
                            this.onChangeInternal();
                        }),
                    _.button({class: 'widget--chips__chip__remove fa fa-remove', title: 'Remove item'})
                        .click(() => {
                            this.value.splice(i, 1);

                            this.onChangeInternal();

                            this.fetch();
                        })
                );
            }),
            _.button({class: 'widget widget--button round widget--chips__add', title: 'Add item'},
                _.span({class: 'fa fa-plus'})
            ).click(() => {
                let newValue = this.placeholder || 'New item';
                let newKey = newValue.toLowerCase().replace(/[^a-zA-Z]/g, '');


                if(this.useObject === true || this.useArray === false) {
                    this.value[newKey] = newValue;
                
                } else if (this.valueKey && this.labelKey) {
                    let newObject = {};

                    newObject[this.valueKey] = newKey;
                    newObject[this.labelKey] = newValue;
                    
                    this.value.push(newObject);
                
                } else {
                    this.value.push(newValue);
                
                }

                this.onChangeInternal();

                this.fetch();
            })
        );
    }
}

module.exports = Chips;
