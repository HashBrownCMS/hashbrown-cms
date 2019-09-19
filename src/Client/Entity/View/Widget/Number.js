'use strict';

/**
 * A number input widget
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class Number extends HashBrown.Entity.View.Widget.WidgetBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/widget/number');
    }

    /**
     * Event: Value changed
     */
    onChange(newValue) {
        if(isNaN(newValue)) { 
            newValue = 0;
        }

        newValue = parseFloat(newValue);

        if(!isNaN(this.model.min) && newValue < this.model.min) {
            newValue = this.model.min;
        
        } else if(!isNaN(this.model.max) && newValue > this.model.max) {
            newValue = this.model.max;
        }
     
        if(this.model.step > 0) {
            newValue = Math.round(newValue * (this.model.step * 100)) / (this.model.step * 100);
        }

        this.element.querySelector('input').value = newValue;

        super.onChange(newValue);
    }

    /**
     * Event: Input
     */
    onInput(newValue) {
        super.onInput(newValue);
        
        let indicator = this.element.querySelector('.widget--number__indicator');

        if(indicator) {
            indicator.innerHTML = Math.round(this.model.value * 100) / 100;
        }
    }

    /**
     * Gets the current value relatively to the min/max thresholds
     *
     * @return {Number} Delta
     */
    getDelta() {
        if(isNaN(this.model.min)) { this.model.min = 0; }
        if(isNaN(this.model.max)) { this.model.max = 0; }
        if(isNaN(this.model.value)) { this.model.value = 0; }

        if(this.model.value == 0) { return 0; }

        return (this.model.value - this.model.min) * (this.model.max - this.model.min) / 100;
    }
}

module.exports = Number;
