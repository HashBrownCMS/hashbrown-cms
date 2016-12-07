'use strict';

class UIHelper {
    /**
     * Creates a switch
     *
     * @param {Boolean} initialValue
     *
     * @returns {HTMLElement} Switch element
     */
    static renderSwitch(initialValue) {
        let id = 'switch' + (10000 + Math.floor(Math.random() * 10000));

        return _.div({class: 'switch', 'data-checked': initialValue},
            _.input({
                id: id,
                class: 'form-control switch',
                type: 'checkbox',
                checked: initialValue
            }).change(function() {
                this.parentElement.dataset = this.checked;
            }),
            _.label({for: id})
        );
    }
}

module.exports = UIHelper;
