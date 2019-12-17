'use strict';

/**
 * An simple boolean toggle
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class Checkbox extends HashBrown.Entity.View.Widget.WidgetBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/widget/checkbox');
    }
}

module.exports = Checkbox;
