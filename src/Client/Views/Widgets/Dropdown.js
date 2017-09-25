'use strict';

const Widget = require('./Widget');

/**
 * A generic dropdown
 *
 * @memberof HashBrown.Client.Views.Widgets
 */
class Dropdown extends Widget {
    /**
     * Template
     */
    template() {
        let options = {};

        for(let key in this.options) {
            let value = this.options[key];

            let optionLabel = this.labelKey ? value[this.labelKey] : key;
            let optionValue = this.valueKey ? value[this.valueKey] : value;
            
            options[optionValue] = optionLabel;
        }

        return _.div({title: this.tooltip, class: 'widget widget--dropdown dropdown' + (this.useTypeAhead ? ' typeahead' : '')},
            _.if(this.useTypeAhead,
                _.input({class: 'widget--dropdown__input', type: 'text'})
                    .on('input', (e) => {
                        let query = e.currentTarget.value.toLowerCase();
                        let $select = $(e.currentTarget).parent().find('select');

                        $select.find('option').each((i, option) => {
                            let isMatch = query.length < 3 || option.innerHTML.toLowerCase().indexOf(query) > -1;

                            $(option).attr('disabled', !isMatch);
                            $(option).toggle(isMatch);
                        });
                    })
            ),
            _.select({class: 'widget--dropdown__select', value: this.value || '(none)'},
                _.each(options, (optionValue, optionLabel) => {
                    return _.option({class: 'widget--dropdown__item', value: optionValue}, optionLabel);
                })
            ).change((e) => {
                this.value = e.currentTarget.value;
                
                if(typeof this.onChange !== 'function') { return; }

                this.onChange(this.value);
            })
        );
    }
}

module.exports = Dropdown;
