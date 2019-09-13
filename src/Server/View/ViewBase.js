'use strict';

/**
 * The base view class
 */
class ViewBase {
    /**
     * Renders the template
     */
    static render(filePath, options, callback) {
        let helpers = {
            if: (statement, content) => {
                if(!statement) { return ''; }

                return content;
            },

            each: (items, callback) => {
                let content = '';

                for(let key in items) {
                    if(!isNaN(key)) {
                        key = parseInt(key);
                    }

                    content += callback(key, items[key]);
                }

                return content;
            },
        };

        try {
            let template = require(filePath);
            let html = template(helpers, options);

            callback(null, html);

        } catch(e) {
            callback(null, e.message + ' ' + e.stack);

        }
    }
}

module.exports = ViewBase;
