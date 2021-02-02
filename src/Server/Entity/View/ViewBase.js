'use strict';

/**
 * The base view for server side pages
 *
 * @memberof HashBrown.Server.Entity.View
 */
class ViewBase extends require('Common/Entity/View/ViewBase') {
    /**
     * Gets the context
     *
     * @return {HashBrown.Entity.Context} Context
     */
    get context() {
        if(!this.model || !this.model.context) { return null; }
        
        return this.model.context;
    }
    
    /**
     * Scope
     *
     * @return {Object} Scope
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
            },
            t: (string) => {
                if(!this.context || !this.context.user) { return string; }

                return this.context.translate(string);
            }
        };
    }
}

module.exports = ViewBase;
