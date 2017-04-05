'use strict';

let ContentCommon = require('../../../common/models/Content');

/**
 * The client-side content model
 */
class Content extends ContentCommon {
    /**
     * Gets settings
     *
     * @param {String} key
     *
     * @returns {Promise} Settings
     */
    getSettings(key) {
        return super.getSettings(ProjectHelper.currentProject, ProjectHelper.currentEnvironment, key);
    }

    /**
     * Gets parent Content
     *
     * @returns {Promise} Parent
     */
    getParent() {
        if(this.parentId) {
            return ContentHelper.getContentById(this.parentId)
            .then((parentContent) => {
                return Promise.resolve(parentContent);
            })
            .catch((e) => {
                return Promise.resolve(null);
            });
        } else {
            return Promise.resolve(null);
        }
    }
}

module.exports = Content;
