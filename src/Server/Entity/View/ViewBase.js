'use strict';

/**
 * The base view for server side pages
 */
class ViewBase extends require('Common/Entity/View/ViewBase') {
    /**
     * Acts as a view engine handler
     *
     * @param {String} filePath
     * @param {Object} options
     * @param {Function} callback
     */
    static engine(filePath, options, callback) {
        try {
            let view = new ViewBase({
                template: require(filePath),
                model: options
            });
        
            callback(null, view.render());

        } catch(e) {
            callback(null, e.stack || e.message);

        }
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
            }
        };
    }
}

module.exports = ViewBase;
