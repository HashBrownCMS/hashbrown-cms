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
        if(!this.model.value) {
            if(this.model.keys) {
                this.model.value = {};
            } else {
                this.model.value = [];
            }
        }
    }

    /**
     * Event: Drag start
     */
    onDragStart(e) {
        let index = Array.from(this.element.querySelectorAll('.widget--list__item')).indexOf(e.currentTarget);

        e.dataTransfer.setData('index', index); // Set some data in transfer, or Firefox will ignore the drag event
        this.state.dragIndex = index; // <- The index in data transfer gets lost in Chrome, so we'll actually be using this one
    }

    /**
     * Event: Drag over
     */
    onDragOver(e) {
        e.preventDefault();

        for(let item of Array.from(this.element.querySelectorAll('.widget--list__item'))) {
            delete item.dataset.dragOver;
        }

        let item = e.currentTarget;
        let bounds = item.getBoundingClientRect();
        let margin = bounds.height / 2;
        let delta = e.pageY - bounds.top;

        if(delta < margin) {
            item.dataset.dragOver = 'above';
        } else if(delta > bounds.height - margin) {
            item.dataset.dragOver = 'below';
        }
    }

    /**
     * Event: Drag end
     */
    onDragEnd(e) {
        this.sanityCheck();
        
        let oldIndex = this.state.dragIndex;
        let newIndex = 0;

        let items = Array.from(this.element.querySelectorAll('.widget--list__item'));

        for(let i = 0; i < items.length; i++) {
            let item = items[i];

            if(item.dataset.dragOver === 'above') {
                newIndex = i;
                break;
            }
            
            if(item.dataset.dragOver === 'below') {
                newIndex = i + 1;
                break;
            }
        }
            
        if(newIndex > oldIndex) { newIndex--; }
           
        if(this.model.value.constructor === Object) {
            let keys = Object.keys(this.model.value);
            let key = keys.splice(oldIndex, 1)[0];

            if(newIndex < 0) {
                keys.splice(0, 0, key);
            } else if(newIndex >= keys.length) {
                keys.push(key);
            } else {
                keys.splice(newIndex, 0, key)
            }

            let newValue = {};

            for(let key of keys) {
                newValue[key] = this.model.value[key];
            }

            this.model.value = newValue;

        } else if(this.model.value.constructor === Array) {
            let item = this.model.value.splice(oldIndex, 1)[0];

            if(newIndex < 0) {
                this.model.value.splice(0, 0, item);
            } else if(newIndex >= this.model.value.length) {
                this.model.value.push(item);
            } else {
                this.model.value.splice(newIndex, 0, item)
            }
        }

        this.render();
        this.onChange(); 
    }

    /**
     * Event: Change item key
     */
    onChangeItemKey(oldKey, newKey) {
        this.sanityCheck();

        let newValue = this.model.value.constructor === Object ? {} : [];

        for(let key in this.model.value) {
            let value = this.model.value[key];

            if(key === oldKey) { key = newKey; }

            newValue[key] = value;
        }

        this.model.value = newValue;

        this.render();
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

        if(this.model.value.constructor === Object) {
            delete this.model.value[key];
        
        } else if(this.model.value.constructor === Array) {
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

        if(this.model.value.constructor === Object) {
            this.model.value[`new${this.model.placeholder || 'item'}`] = `New ${this.model.placeholder || 'item'}`;

        } else if(this.model.value.constructor === Array) {
            this.model.value.push(null);
       
        }

        this.render();
        this.onChange();
    }
}

module.exports = List;
