'use strict';

/**
 * A modal for picking icons
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class PickIcon extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.state.icons = require('Client/icons.json').icons;

        this.template = require('template/modal/pickIcon');
    }

    /**
     * Event: Search
     *
     * @param {String} query
     */
    onSearch(query) {
        let icons = this.element.querySelectorAll('.modal--pick-icon__icon');

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
     * Event: Clicked icon
     */
    onClickIcon(icon) {
        this.trigger('change', icon);

        this.close();
    }
}

module.exports = PickIcon;
