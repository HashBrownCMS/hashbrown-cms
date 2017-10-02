'use strict';

/**
 * A standard widget
 *
 * @memberof HashBrown.Client.Views.Widgets
 */
class Widget extends Crisp.View {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
    }
}

module.exports = Widget;
