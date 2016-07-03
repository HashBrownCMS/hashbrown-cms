'use strict';

let MediaHelperCommon = require('../../../common/helpers/MediaHelper');

class MediaHelper extends MediaHelperCommon {
    /**
     * Gets the Media tree
     *
     * @returns {Promise(Object)} tree
     */
    static getTree() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiUrl('media/tree'),
                type: 'GET',
                success: (tree) => {
                    resolve(tree);
                },
                error: () => {
                    reject();
                }
            });
        });
    }

    /**
     * Sets a Media tree item
     *
     * @param {String} id
     * @param {Object} item
     *
     * @returns {Promise} promise
     */
    static setTreeItem(id, item) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiUrl('media/tree/' + id),
                data: item,
                type: 'POST',
                success: () => {
                    resolve();
                },
                error: () => {
                    reject();
                }
            });
        });
    }
}

module.exports = MediaHelper;
