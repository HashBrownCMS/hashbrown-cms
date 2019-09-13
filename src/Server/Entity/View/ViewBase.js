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
}

module.exports = ViewBase;
