'use strict';

/**
 * A simple date/time picker
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class DateTime extends HashBrown.Entity.View.Widget.WidgetBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/widget/dateTime');

        this.sanityCheck();
        this.updateState();
    }

    /**
     * Event: Change year
     *
     * @param {HTMLInputElement} input
     */
    onChangeYear(input) {
        this.sanityCheck(true);

        this.model.value.setFullYear(parseInt(input.value));
    
        this.updateState();
        this.render();

        this.onChange();
    }

    /**
     * Event: Change month
     *
     * @param {HTMLInputElement} input
     */
    onChangeMonth(input) {
        this.sanityCheck(true);
        
        if(parseInt(input.value) > 12) {
            input.value = 12;
        }
  
        this.model.value.setMonth(parseInt(input.value) - 1);

        this.updateState();
        this.render();

        this.onChange();
    }
    
    /**
     * Event: Change date
     *
     * @param {HTMLInputElement} input
     */
    onChangeDate(input) {
        this.sanityCheck(true);
        
        if(parseInt(input.value) > this.state.maxDate) {
            input.value = this.state.maxDate;
        }
   
        this.model.value.setDate(parseInt(input.value));

        this.onChange();
    }

    /**
     * Event: Change hour
     *
     * @param {HTMLInputElement} input
     */
    onChangeHour(input) {
        this.sanityCheck(true);
        
        if(parseInt(input.value) > 23) {
            input.value = 23;
        }
   
        this.model.value.setHours(parseInt(input.value));

        this.onChange();
    }
    
    /**
     * Event: Change minute
     *
     * @param {HTMLInputElement} input
     */
    onChangeMinute(input) {
        this.sanityCheck(true);
        
        if(parseInt(input.value) > 59) {
            input.value = 59;
        }
   
        this.model.value.setMinutes(parseInt(input.value));

        this.onChange();
    }
    
    /**
     * Event: Change second
     *
     * @param {HTMLInputElement} input
     */
    onChangeSecond(input) {
        this.sanityCheck(true);

        if(parseInt(input.value) > 59) {
            input.value = 59;
        }

        this.model.value.setSeconds(parseInt(input.value));

        this.onChange();
    }

    /**
     * Event: Clear value
     */
    onClickClear() {
        this.model.value = null;

        this.updateState();
        this.render();

        this.onChange();
    }

    /**
     * Makes sure the value is a good format
     *
     * @param {Boolean} notNull Make sure the value is not null
     */
    sanityCheck(notNull = false) {
        if(!this.model.value) {
            if(!notNull) { return; }
                
            this.model.value = new Date();
        }

        if(this.model.value && this.model.value instanceof Date === false) {
            this.model.value = new Date(this.model.value);
        }
    }

    /**
     * Updates the state dictionary with date/time values
     */
    updateState() {
        if(!this.model.value || this.model.value instanceof Date === false) {
            this.state = {};
        
        } else {
            this.state.year = this.model.value.getFullYear() || new Date().getFullYear();
            this.state.month = (this.model.value.getMonth() || 0) + 1;
            this.state.date = this.model.value.getDate() || 1;
            this.state.hour = this.model.value.getHours() || 0;
            this.state.minute = this.model.value.getMinutes() || 0;
            this.state.second = this.model.value.getSeconds() || 0;

            this.state.output = [
                `${this.state.year}/`,
                `${(this.state.month < 10 ? '0' : '') + this.state.month}/`,
                `${(this.state.date < 10 ? '0' : '') + this.state.date}`,
                ` - `,
                `${(this.state.hour < 10 ? '0' : '') + this.state.hour}:`,
                `${(this.state.minute < 10 ? '0' : '') + this.state.minute}:`,
                `${(this.state.second < 10 ? '0' : '') + this.state.second}`
            ].join('');

            this.state.maxDate = new Date(this.state.year, this.state.month, 0).getDate();
        }
    }
}

module.exports = DateTime;
