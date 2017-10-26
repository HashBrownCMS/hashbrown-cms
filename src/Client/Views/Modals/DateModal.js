'use strict';

const Modal = require('./Modal');

/**
 * A modal for picking dates
 *
 * @memberof HashBrown.Client.Views.Modals
 */
class DateModal extends Modal {
    /**
     * Constructor
     */
    constructor(params) {
        params.className = 'date';

        super(params);
    }
    
    /**
     * Pre render
     */
    prerender() {
        this.days = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];
        this.months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
        this.hours = [ '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23' ];
        this.minutes = [ '00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55' ];

        // Sanity check
        this.value = this.value ? new Date(this.value) : new Date();

        if(isNaN(this.value.getDate())) {
            this.value = new Date();
        }
    }

    /**
     * Gets days in current month and year
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
     * Render header
     */
    renderHeader() {
        return [
            _.div({class: 'modal--date__header__year'}, this.value.getFullYear().toString()),
            _.div({class: 'modal--date__header__day'}, this.days[this.value.getDay()] + ', ' + this.months[this.value.getMonth()] + ' ' + this.value.getDate()),
            _.button({class: 'modal__close fa fa-close'})
                .click(() => { this.close(); })
        ];
    }
    
    /**
     * Renders the modal footer
     *
     * @returns {HTMLElement} Footer
     */
    renderFooter() {
        return _.button({class: 'widget widget--button'}, 'OK')
            .click(() => {
                this.trigger('change', this.value);

                this.close();
            });
    }

    /**
     * Render body
     */
    renderBody() {
        return [
            _.div({class: 'modal--date__body__nav'},
                _.button({class: 'modal--date__body__nav__left fa fa-arrow-left'})
                    .click(() => {
                        this.value.setMonth(this.value.getMonth() - 1);
                        
                        this.fetch();
                    }),
                _.div({class: 'modal--date__body__nav__month-year'},
                    this.months[this.value.getMonth()] + ' ' + this.value.getFullYear()
                ),
                _.button({class: 'modal--date__body__nav__left fa fa-arrow-right'})
                    .click(() => {
                        this.value.setMonth(this.value.getMonth() + 1);
                        
                        this.fetch();
                    })
            ),
            _.div({class: 'modal--date__body__weekdays'},
                _.span({class: 'modal--date__body__weekday'}, 'M'),
                _.span({class: 'modal--date__body__weekday'}, 'T'),
                _.span({class: 'modal--date__body__weekday'}, 'W'),
                _.span({class: 'modal--date__body__weekday'}, 'T'),
                _.span({class: 'modal--date__body__weekday'}, 'F'),
                _.span({class: 'modal--date__body__weekday'}, 'S'),
                _.span({class: 'modal--date__body__weekday'}, 'S')
            ),
            _.div({class: 'modal--date__body__days'},
                _.each(this.getDays(this.value.getFullYear(), this.value.getMonth() + 1), (i, day) => {
                    let thisDate = new Date(this.value.getTime());
                    let now = new Date();

                    let isCurrent =
                        now.getFullYear() == this.value.getFullYear() &&
                        now.getMonth() == this.value.getMonth() &&
                        now.getDate() == day;
                    
                    let isActive = this.value.getDate() == day;

                    thisDate.setDate(day);

                    return _.button({class: 'modal--date__body__day' + (isCurrent ? ' current' : '') + (isActive ? ' active' : '')}, day)
                        .click(() => {
                            this.value.setDate(day);

                            this.fetch();
                        });
                })
            ),
            _.div({class: 'modal--date__body__time'},
                _.input({class: 'modal--date__body__time__number', type: 'number', min: 0, max: 23, value: this.value.getHours()})
                    .on('change', (e) => {
                        this.value.setHours(e.currentTarget.value);
                    }),
                _.div({class: 'modal--date__body__time__separator'}, ':'),
                _.input({class: 'modal--date__body__time__number', type: 'number', min: 0, max: 59, value: this.value.getMinutes()})
                    .on('change', (e) => {
                        this.value.setMinutes(e.currentTarget.value);
                    })
            )
        ];
    }
}

module.exports = DateModal;
