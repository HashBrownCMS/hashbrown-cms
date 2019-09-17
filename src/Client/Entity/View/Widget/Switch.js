'use strict';

/**
 * An simple boolean switch
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class Switch extends HashBrown.Entity.View.Widget.WidgetBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/widget/switch');
    }
}

module.exports = Switch;
