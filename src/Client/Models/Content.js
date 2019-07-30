'use strict';

const ContentCommon = require('Common/Models/Content');

/**
 * The client-side content model
 *
 * @memberof HashBrown.Client.Models
 */
class Content extends ContentCommon {
    /**
     * Gets settings
     *
     * @param {String} key
     *
     * @returns {Object} Settings
     */
    async getSettings(key) {
        let parentContent = await this.getParent();

        // Loop through parents to find governing setting
        while(parentContent != null) {
            parentContent.settingsSanityCheck(key);

            // We found a governing parent, return those settings
            if(parentContent.settings[key].applyToChildren) {
                let settings = parentContent.settings;

                // Make clone as to avoid interference with inherent values
                settings = JSON.parse(JSON.stringify(settings));
                settings[key].governedBy = parentContent.id;

                return settings[key];
            }

            parentContent = await parentContent.getParent();
        }
    
        this.settingsSanityCheck(key);

        return this.settings[key];
    }

    /**
     * Gets parent Content
     *
     * @returns {Content} Parent
     */
    async getParent() {
        if(!this.parentId) { return null; }

        return await HashBrown.Helpers.ContentHelper.getContentById(this.parentId);
    }
}

module.exports = Content;
