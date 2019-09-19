'use strict';

/**
 * A text input widget
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class Text extends HashBrown.Entity.View.Widget.WidgetBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/widget/text');
    }
}

module.exports = Text;
