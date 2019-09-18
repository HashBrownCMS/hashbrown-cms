'use strict';

/**
 * A list editor widget
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class List extends HashBrown.Entity.View.Widget.WidgetBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/widget/list');
   
        this.sanityCheck();
    }

    /**
     * Performs a sanity check on the value
     */
    sanityCheck() {
        if(this.model.keys && (!this.model.value || this.model.value.constructor !== Object)) {
            this.model.value = {};
        }

        if(!this.model.keys && (!this.model.value || this.model.value.constructor !== Array)) {
            this.model.value = [];
        }
    }

    /**
     * Event: Change item key
     */
    onChangeItemKey(oldKey, newKey) {
        this.sanityCheck();

        let newValue = this.model.keys ? [] : {};

        for(let key in this.model.value) {
            let value = this.model.value[key];

            if(key === oldKey) { key = newKey; }

            newValue[key] = value;
        }

        this.model.value = newValue;

        this.onChange();
    }

    /**
     * Event: Change item value
     */
    onChangeItemValue(key, newValue) {
        this.sanityCheck();

        this.model.value[key] = newValue;

        this.onChange();
    }

    /**
     * Event: Remove item
     */
    onClickRemoveItem(key) {
        this.sanityCheck();

        if(this.model.keys) {
            delete this.model.value[key];
        } else {
            this.model.value.splice(key, 1);
        }

        this.render();
        this.onChange();
    }

    /**
     * Event: Click add item
     */
    onClickAddItem() {
        this.sanityCheck();

        if(this.model.keys) {
            this.model.value['newField'] = 'New field';
        } else {
            this.model.value.push(null);
        }

        this.render();
        this.onChange();
    }
}

module.exports = List;
