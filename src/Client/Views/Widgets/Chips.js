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
        
        // CHeck for empty values or duplicates in disabled value
        for(let i = this.disabledValue.length - 1; i >= 0; i--) {
            if(!this.disabledValue[i] || this.value.indexOf(this.disabledValue[i]) > -1) {
                this.disabledValue.splice(i, 1);
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
                    _.input({class: 'widget--chips__chip__input', type: 'text', value: item})
                        .on('input', (e) => {
                            this.value[i] = e.currentTarget.value || '';
                   
                            this.onChangeInternal();
                        }),
                    _.button({class: 'widget--chips__chip__remove fa fa-remove'})
                        .click(() => {
                            this.value.splice(i, 1);

                            this.onChangeInternal();

                            this.init();
                        })
                );
            }),
            _.button({class: 'widget widget--button round widget--chips__add'},
                _.span({class: 'fa fa-plus'})
            ).click(() => {
                this.value.push(this.placeholder || '(new item)');

                this.onChangeInternal();

                this.init();
            })
        );
    }
}

module.exports = Chips;
