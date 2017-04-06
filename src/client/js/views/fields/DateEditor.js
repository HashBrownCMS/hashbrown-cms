'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * An editor for date values
 */
class DateEditor extends FieldEditor {
    constructor(params) {
        super(params);

        // Ensure correct type
        if(typeof params.value === 'string' && !isNaN(params.value)) {
            this.value = new Date(parseInt(params.value));

        } else if(params.value) {
            this.value = new Date(params.value);
        
        }

        // Sanity check
        if(!this.value || !params.value || this.value.getFullYear() == 1970 || isNaN(this.value.getTime())) {
            this.value = null;

            this.onChange();
        }

        this.init();
    }

    /**
     * Event: Change value
     */
    onChange() {
        this.trigger('change', this.value);
    }

    /**
     * Event: On click remove
     */
    onClickRemove() {
        this.value = null;

        this.$element.find('.btn-edit').html(this.formatDate(this.value));

        this.onChange();
    }

    /**
     * Event: Click open
     */
    onClickOpen() {
        let date = this.value ? new Date(this.value) : new Date();

        if(isNaN(date.getDate())) {
            date = new Date();
        }

        // Make sure minutes are rounded to nearest multiple of 5
        date.setMinutes(Math.floor(date.getMinutes()/5)*5);
        
        let days = [
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
            'Sun'
        ];

        let months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

        let hours = [ '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23' ];
        let minutes = [ '00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55' ];

        let messageModal = new MessageModal({
            model: {
                class: 'date-picker'   
            },
            renderTitle: () => {
                return [
                    _.span(date.getFullYear().toString()),
                    _.h2({class: 'date-picker-title'}, days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate())
                ]
            },
            renderBody: () => {
                return [
                    _.div({class: 'date-picker-top-nav'},
                        _.button({class: 'btn btn-embedded'},
                            _.span({class: 'fa fa-angle-left'})
                        ).click(() => {
                            date.setMonth(date.getMonth() - 1);

                            messageModal.reload();
                        }),
                        _.span(months[date.getMonth()] + ' ' + date.getFullYear()),
                        _.button({class: 'btn btn-embedded'},
                            _.span({class: 'fa fa-angle-right'})
                        ).click(() => {
                            date.setMonth(date.getMonth() + 1);
                            
                            messageModal.reload();
                        })
                    ),
                    _.div({class: 'date-picker-weekdays'},
                        _.span('M'),
                        _.span('T'),
                        _.span('W'),
                        _.span('T'),
                        _.span('F'),
                        _.span('S'),
                        _.span('S')
                    ),
                    _.div({class: 'date-picker-days'},
                        _.each(this.getDays(date.getFullYear(), date.getMonth() + 1), (i, day) => {
                            let thisDate = new Date(date.getTime());
                            let now = new Date();

                            let isCurrent =
                                now.getFullYear() == date.getFullYear() &&
                                now.getMonth() == date.getMonth() &&
                                now.getDate() == day;
                            
                            let isActive = date.getDate() == day;

                            thisDate.setDate(day);

                            let $button = _.button({class: 'btn btn-embedded' + (isCurrent ? ' current' : '') + (isActive ? ' active' : '')}, day)
                                .click(() => {
                                    date.setDate(day);
                                    
                                    $button.siblings().removeClass('active');  
                                    $button.addClass('active');

                                    messageModal.$element.find('.date-picker-title').html(days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate());
                                });

                            return $button;
                        })
                    ),
                    _.div({class: 'date-picker-time'},
                        UI.inputDropdown(date.getHours() < 10 ? '0' + date.getHours() : date.getHours().toString(), hours, (hour) => {
                            date.setHours(parseInt(hour));
                        }),
                        _.div({class: 'date-picker-time-separator'}, ':'),
                        UI.inputDropdown(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString(), minutes, (minute) => {
                            date.setMinutes(parseInt(minute));
                        })
                    )
                ];
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default'
                },
                {
                    label: 'OK',
                    class: 'btn-primary',
                    callback: () => {
                        this.value = date;

                        this.$element.find('.btn-edit').html(this.formatDate(date));

                        this.onChange();
                    }
                }
            ]
        });
    }

    /**
     * Renders day buttons
     *
     * @param {Number} year
     * @param {Number} month
     *
     * @returns {Array} Days
     */
    getDays(year, month) {
        let max = new Date(year, month, 0).getDate();
        let days = [];

        while(days.length < max) {
            days[days.length] = days.length + 1;
        }

        return days;
    }

    /**
     * Format a date string
     *
     * @param {String} input
     *
     * @returns {String} Formatted date string
     */
    formatDate(input) {
        let output = '(none)';
        let date = new Date(input);

        if(input && !isNaN(date.getTime())) {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let hours = date.getHours();
            let minutes = date.getMinutes();

            if(day < 10) {
                day = '0' + day;
            }

            if(month < 10) {
                month = '0' + month;
            }
            
            if(hours < 10) {
                hours = '0' + hours;
            }
            
            if(minutes < 10) {
                minutes = '0' + minutes;
            }

            output = date.getFullYear() + '.' + month + '.' + day + ' - ' + hours + ':' + minutes;
        } 

        return output;
    }

    render() {
        this.$element = _.div({class: 'field-editor date-editor input-group'},
            // Render preview
            this.renderPreview(),

            _.if(this.disabled,
                _.p({}, this.formatDate(this.value))
            ),
            _.if(!this.disabled,
                _.button({class: 'form-control btn btn-edit'}, 
                    this.formatDate(this.value)
                ).click(() => { this.onClickOpen(); }),
                _.div({class: 'input-group-btn'},
                    _.button({class: 'btn btn-small btn-default'}, 
                        _.span({class: 'fa fa-remove'})
                    ).click(() => { this.onClickRemove(); })
                )
            )
        );
    }
}

module.exports = DateEditor;
