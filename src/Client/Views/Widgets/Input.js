'use strict';

const Widget = require('./Widget');

/**
 * A versatile input widget
 */
class Input extends Widget {
    /**
     * Template
     */
    template() {
        let config = {
            placeholder: this.placeholder,
            title: this.tooltip,
            type: this.type || 'text',
            class: 'widget widget--input'
        };

        if(this.type === 'number') {
            config.step = this.step || 'any';
            config.min = this.min;
            config.max = this.max;
        }

        return _.input(config)
            .on('input', (e) => {
                this.value = e.currentTarget.value;

                if(typeof this.onChange !== 'function') { return; }

                this.onChange(this.value);
            });
    }
}

module.exports = Input;
