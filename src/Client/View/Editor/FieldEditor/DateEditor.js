'use strict';

/**
 * An editor for date values
 *
 * @description Example:
 * <pre>
 * {
 *     "myDate": {
 *         "label": "My date",
 *         "schemaId": "date",
 *         "tabId": "content"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.View.Editor.FieldEditor
 */
class DateEditor extends HashBrown.View.Editor.FieldEditor.FieldEditor {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Event: On click remove
     */
    onClickRemove() {
        this.value = null;

        this.trigger('change', this.value);

        this.fetch();
    }

    /**
     * Event: Click open
     */
    onClickOpen() {
        let modal = new HashBrown.View.Modal.DateModal({
            value: this.value
        });

        modal.on('change', (newValue) => {
            this.value = newValue.toISOString();

            this.trigger('change', this.value);

            this.fetch();
        });
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

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--date'},
            _.do(() => {
                if(this.disabled) {
                    return this.formatDate(this.value);
                }
                
                return _.div({class: 'widget widget-group'},
                    _.button({class: 'widget widget--button low'}, this.formatDate(this.value))
                        .click(() => { this.onClickOpen(); }),
                    _.div({class: 'widget widget--button small fa fa-remove'})
                        .click(() => { this.onClickRemove(); })
                );
            })
        );
    }
}

module.exports = DateEditor;
