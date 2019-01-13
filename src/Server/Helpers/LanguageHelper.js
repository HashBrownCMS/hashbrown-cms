'use strict';

const LanguageHelperCommon = require('Common/Helpers/LanguageHelper');

/**
 * The helper class for languages
 *
 * @memberof HashBrown.Server.Helpers
 */
class LanguageHelper extends LanguageHelperCommon {
    /**
     * Gets all selected languages
     *
     * @param {String} project
     *
     * @returns {Array} List of language names
     */
    static getLanguages(project) {
        checkParam(project, 'project', String);

        return HashBrown.Helpers.SettingsHelper.getSettings(project, null, 'languages')
        .then((selected) => {
            if(!selected || !Array.isArray(selected)) {
                selected = ['en'];
            }

            selected.sort();

            return Promise.resolve(selected);
        });
    }
    
    /**
     * Sets all languages
     *
     * @param {String} project
     * @param {Array} languages
     *
     * @returns {Promise}
     */
    static setLanguages(project, languages) {
        checkParam(project, 'project', String);
        checkParam(languages, 'languages', Array);

        // Check format
        if(!Array.isArray(languages)) {
            return Promise.reject(new Error('Language array cannot be of type "' + typeof languages + '"'));
        }
        
        // Check is project is synced first
        return this.getProject(project)
        .then((project) => {
            if(project.settings.sync.enabled) {
                return Promise.reject(new Error('Cannot change languages of a synced project'));
            }

            return setSettings(project, null, 'languages', languages);
        });
    }
}

module.exports = LanguageHelper;
