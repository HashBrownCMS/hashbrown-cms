'use strict';

const Widget = require('./Widget');

/**
 * A versatile input widget
 *
 * @memberof HashBrown.Client.Views.Widgets
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
            value: this.value,
            name: this.name
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
                    _.if(config.placeholder,
                        _.label({for: 'checkbox-' + this.guid, class: 'widget--input__checkbox-label'}, config.placeholder)
                    ),
                    _.input({id: 'checkbox-' + this.guid, class: 'widget--input__checkbox-input', type: 'checkbox', checked: this.value})
                        .on('change', (e) => {
                            this.onChangeInternal(e.currentTarget.checked);
                        }),
                    _.div({class: 'widget--input__checkbox-background'}),
                    _.div({class: 'widget--input__checkbox-switch'})
                );
      
            case 'file':
                return _.form({class: config.class + (typeof this.onSubmit === 'function' ? ' widget-group' : ''), title: config.title},
                    _.label({for: 'file-' + this.guid, class: 'widget--input__file-browse widget widget--button low expanded'}, this.placeholder || 'Browse...'), 
                    _.input({id: 'file-' + this.guid, class: 'widget--input__file-input', type: 'file', name: this.name || 'file', multiple: this.useMultiple, directory: this.useDirectory})
                        .on('change', (e) => {
                            let names = [];
                            let files = e.currentTarget.files;

                            let btnBrowse = e.currentTarget.parentElement.querySelector('.widget--input__file-browse');
                            let btnSubmit = e.currentTarget.parentElement.querySelector('.widget--input__file-submit');

                            if(btnSubmit) {
                                btnSubmit.classList.toggle('disabled', !files || files.length < 1);
                            }

                            this.onChangeInternal(files);

                            if(files && files.length > 0) {
                                for(let i = 0; i < files.length; i++) {
                                    names.push(files[i].name + ' (' + Math.round(files[i].size / 1000) + 'kb)');
                                }
                            }

                            if(names.length > 0) {
                                btnBrowse.innerHTML = names.join(', ');

                            } else {
                                btnBrowse.innerHTML = this.placeholder || 'Browse...';
                            }
                        }),
                    _.if(typeof this.onSubmit === 'function',
                        _.button({class: 'widget widget--button widget--input__file-submit disabled small fa fa-upload', type: 'submit', title: 'Upload file'})
                    )
                ).on('submit', (e) => {
                    e.preventDefault();

                    let input = e.currentTarget.querySelector('.widget--input__file-input');

                    if(!input || !input.files || input.files.length < 1) { return; }

                    if(typeof this.onSubmit !== 'function') { return; }

                    this.onSubmit(new FormData(e.currentTarget), input.files);
                });

            default:
                return _.input(config)
                    .on('input', (e) => {
                        this.onChangeInternal(e.currentTarget.value);
                    });
        }
    }
}

module.exports = Input;
