'use strict';

/**
 * The base view class
 */
class ViewBase extends HashBrown.Entity.EntityBase {
    /**
     * Structure
     */
    structure() {
        this.def(Object, 'model', {});
        this.def(Function, 'template' , null);
    }

    /**
     * Returns a colleciton of helper functions
     *
     * @return {Object} Helpers
     */
    scope() {
        return {
            if: (statement, content)  => {
                if(!statement) { return ''; }

                return content;
            },
            each: (items, callback) => {
                let content = '';

                for(let key in items) {
                    if(!isNaN(key)) {
                        key = parseFloat(key);
                    }

                    content += callback(key, items[key]);
                }

                return content;
            },
            include: (template, model) => {
                if(typeof template !== 'function') { return ''; }

                return template(this.scope(), model || this.model);
            }
        }
    }

    /**
     * Renders the template
     *
     * @return {String} HTML
     */
    render() {
        if(typeof this.template !== 'function') { return ''; }

        return this.template(this.scope(), this.model);
    }
}

module.exports = ViewBase;
