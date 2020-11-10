'use strict';

/**
 * A search field with clear and submit buttons
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class Search extends HashBrown.Entity.View.Widget.WidgetBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/widget/search');
    }

    /**
     * Event: Focus
     */
    onFocus() {
        HashBrown.Service.EventService.on('escape', 'search', () => {
            this.onClickClear();
        });
    }
    
    /**
     * Event: Blur
     */
    onBlur() {
        HashBrown.Service.EventService.off('escape', 'search');
    }

    /**
     * Event: Submit
     */
    onSubmit(e) {
        e.preventDefault();

        if(typeof this.model.onsearch === 'function') {
            this.model.onsearch(this.namedElements.input.value);
        }
    }

    /**
     * Event: Click clear
     */
    onClickClear() {
        this.namedElements.input.value = '';

        if(typeof this.model.onclear === 'function') {
            this.model.onclear();
        }
    }
}

module.exports = Search;
