'use strict';

let FieldEditor = require('./field');

class DatePicker extends FieldEditor {
    constructor(args) {
        super(args);

        this.fetch();
    }

    renderField(value) {
        let date;
        let view = this;

        if(value) {
            date = new Date(value);
        } else {
            date = new Date();
        }

        function update() {
            // Max/min levels
            $el.children('.date-picker-year')
                .attr('min', 0)
                .attr('max', 3000);
            
            $el.children('.date-picker-month')
                .attr('min', 1)
                .attr('max', 12);
            
            $el.children('.date-picker-day')
                .attr('min', 1)
                .attr('max', 31);
            
            $el.children('.date-picker-hour')
                .attr('min', 0)
                .attr('max', 23);
            
            $el.children('.date-picker-minute')
                .attr('min', 0)
                .attr('max', 59);
            
            $el.children('.date-picker-second')
                .attr('min', 0)
                .attr('max', 59);

            // Update data
            $el.attr('data-date', date.toString());
            $el.children('date-picker-preview').html(date.toString());
            view.events.changeDateValue(date);
        }

        function onChangeYear() {
            date.setFullYear($(this).val());
            update();
        }
        
        function onChangeMonth() {
            date.setMonth($(this).val());
            update();
        }
        
        function onChangeDay() {
            date.setDate($(this).val());
            update();
        }
        
        function onChangeHour() {
            date.setHours($(this).val());
            update();
        }
        
        function onChangeMinute() {
            date.setMinutes($(this).val());
            update();
        }
        
        function onChangeSecond() {
            date.setSeconds($(this).val());
            update();
        }

        let $el = _.div({class: 'input-group date-picker'}, [
            _.input({class: 'form-control date-picker-year', type: 'number', value: date.getFullYear()}).bind('change paste propertychange keyup', onChangeYear),
            _.input({class: 'form-control date-picker-month', type: 'number', value: date.getMonth()}).bind('change paste propertychange keyup', onChangeMonth),
            _.input({class: 'form-control date-picker-day', type: 'number', value: date.getDate()}).bind('change paste propertychange keyup', onChangeDay),
            _.input({class: 'form-control date-picker-hour', type: 'number', value: date.getHours()}).bind('change paste propertychange keyup', onChangeHour),
            _.input({class: 'form-control date-picker-minute', type: 'number', value: date.getMinutes()}).bind('change paste propertychange keyup', onChangeMinute),
            _.input({class: 'form-control date-picker-second', type: 'number', value: date.getSeconds()}).bind('change paste propertychange keyup', onChangeSecond),
            _.div({class: 'date-picker-preview'},
                date.toString()
            )
        ]);

        return $el;
    }
}

module.exports = DatePicker;
