'use strict';

const icons = require('../../icons.json').icons;

const Modal = require('./Modal');

/**
 * A modal for picking icons
 *
 * @memberof HashBrown.Client.Views.Modals
 */
class IconModal extends Modal {
    /**
     * Constructor
     */
    constructor(params) {
        params = params || {};
        params.title = params.title || 'Pick an icon';

        super(params);
    }

    /**
     * Post render
     */
    postrender() {
        this.element.classList.toggle('modal--icon', true);
    }

    /**
     * Event: Search
     *
     * @param {String} query
     */
    onSearch(query) {
        let icons = this.element.querySelectorAll('.modal--icon__icon');

        if(!icons) { return; }

        for(let i = 0; i < icons.length; i++) {
            if(query.length < 3 || icons[i].title.indexOf(query) > -1) {
                icons[i].style.display = 'block';
            } else {
                icons[i].style.display = 'none';
            }
        }
    }

    /**
     * Renders the modal body
     *
     * @returns {HTMLElement} Body
     */
    renderBody() {
        return [
            _.input({type: 'text', class: 'widget widget--input text modal--icon__search', placeholder: 'Search for icons'})
                .on('input', (e) => {
                    this.onSearch(e.currentTarget.value);
                }),
            _.div({class: 'modal--icon__icons'},
                _.each(icons, (i, icon) => {
                    return _.button({class: 'modal--icon__icon widget widget--button fa fa-' + icon, title: icon})
                    .click(() => {
                        this.trigger('change', icon); 

                        this.close();
                    });
                })
            )
        ];
    }
}

module.exports = IconModal;
