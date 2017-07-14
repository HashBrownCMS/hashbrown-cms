'use strict';

const ContentCommon = require('../../../common/Models/Content');

/**
 * The client-side content model
 */
module.exports = class Content extends ContentCommon {
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
