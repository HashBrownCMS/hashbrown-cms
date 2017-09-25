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
        return _.input({placeholder: this.placeholder, title: this.tooltip, class: 'widget widget--input', type: this.type || 'text', value: this.value})
            .on('input', (e) => {
                this.value = e.currentTarget.value;

                if(typeof this.onChange !== 'function') { return; }

                this.onChange(this.value);
            });
    }
}

module.exports = Input;
