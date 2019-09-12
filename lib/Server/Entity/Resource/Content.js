'use strict';

/**
 * The server-side content model
 *
 * @memberof HashBrown.Server.Entity.Resource
 */
class Content extends require('Common/Entity/Resource/Content') {
    /**
     * Gets settings
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} key
     *
     * @returns {Promise} settings
     */
    getSettings(project, environment, key) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(key, 'key', String);

        this.settingsSanityCheck(key);

        // Loop through all parent content to find a governing setting
        return this.getParents(project, environment)
        .then((parents) => {
            for(let parentContent of parents) {
                let settings = parentContent.settings[key] || {};

                if(settings.applyToChildren) {
                    // Make clone as to avoid interference with inherent values
                    settings = JSON.parse(JSON.stringify(settings));
                    settings.governedBy = parentContent.id;

                    return Promise.resolve(settings);
                }
            }

            // No parent nodes with governing settings found, return own settings
            return Promise.resolve(this.settings[key]);
        });
    }

}

module.exports = Content;
