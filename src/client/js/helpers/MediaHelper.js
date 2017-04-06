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
     * Gets Media object by id synchronously
     *
     * @param {String} id
     *
     * @return {Media} Media object
     */
    static getMediaByIdSync(id) {
        for(let i = 0; i < resources.media.length; i++) {
            let media = resources.media[i];

            if(media.id == id) {
                return media;
            }
        }

        return null;
    }

    /**
     * Gets the Media Url
     */
    static getMediaUrl(id) {
        return '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + id;
    } 

    /**
     * Gets Media object by id
     *
     * @param {String} id
     *
     * @return {Promise(Media)}
     */
    static getMediaById(id) {
        return new Promise((resolve, reject) => {
            for(let i = 0; i < resources.media.length; i++) {
                let media = resources.media[i];

                if(media.id == id) {
                    resolve(media);
                    return;
                }
            }

            reject(new Error('Media with id "' + id + '" not found'));
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
