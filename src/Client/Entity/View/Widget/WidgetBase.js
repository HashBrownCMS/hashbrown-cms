'use strict';

/**
 * The base class for widgets
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class WidgetBase extends HashBrown.Entity.View.ViewBase {
    /**
     * Event: Value changed
     *
     * @param {*} newValue
     */
    onChange(newValue) {
        if(newValue !== undefined) {
            this.model = newValue;
        }

        if(typeof this.state.onchange === 'function') {
            this.state.onchange(this.model);
        }
    }
}

module.exports = WidgetBase;
