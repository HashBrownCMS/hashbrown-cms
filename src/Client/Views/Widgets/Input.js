'use strict';

const Widget = require('./Widget');

/**
 * A versatile input widget
 */
class Input extends Widget {
    /**
     * Event: Change value
     *
     * @param {Anything} newValue
     */
    onChangeInternal(newValue) {
        this.value = newValue;

        if(typeof this.onChange !== 'function') { return; }

        this.onChange(this.value);
    }

    /**
     * Template
     */
    template() {
        let config = {
            placeholder: this.placeholder,
            title: this.tooltip,
            type: this.type || 'text',
            class: 'widget widget--input ' + (this.type || 'text'),
            value: this.value
        };

        if(this.type === 'number' || this.type === 'range') {
            config.step = this.step || 'any';
            config.min = this.min;
            config.max = this.max;
        }

        switch(this.type) {
            case 'range':
                return _.div({class: config.class, title: config.title},
                    _.input({class: 'widget--input__range-input', type: 'range', value: this.value, min: config.min, max: config.max, step: config.step})
                        .on('input', (e) => {
                            this.onChangeInternal(e.currentTarget.value);

                            e.currentTarget.nextElementSibling.innerHTML = e.currentTarget.value;
                        }),
                    _.div({class: 'widget--input__range-extra'}, this.value)
                );

            case 'checkbox':
                return _.div({class: config.class, title: config.title},
                    _.input({class: 'widget--input__checkbox-input', type: 'checkbox', checked: this.value})
                        .on('change', (e) => {
                            this.onChangeInternal(e.currentTarget.checked);
                        }),
                    _.div({class: 'widget--input__checkbox-extra fa fa-check'})
                );
       
            default:
                return _.input(config)
                    .on('input', (e) => {
                        this.onChangeInternal(e.currentTarget.value);
                    });
        }
    }
}

module.exports = Input;
