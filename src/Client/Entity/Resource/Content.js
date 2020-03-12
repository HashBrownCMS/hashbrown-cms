'use strict';

/**
 * The client-side content model
 *
 * @memberof HashBrown.Client.Entity.Resource
 */
class Content extends require('Common/Entity/Resource/Content') {
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
     * Gets parent content
     *
     * @returns {HashBrown.Entity.Resource.Content} Parent
     */
    async getParent() {
        if(!this.parentId) { return null; }

        return await this.constructor.get(this.parentId);
    }
}

module.exports = Content;
