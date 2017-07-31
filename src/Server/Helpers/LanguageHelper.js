'use strict';

const SettingsHelper = require('Server/Helpers/SettingsHelper');
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
    static getLanguages(
        project = requiredParam('project')
    ) {
        return SettingsHelper.getSettings(project, null, 'languages')
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
    static setLanguages(
        project = requiredParam('project'),
        languages = requiredParam('languages')
    ) {
        if(!Array.isArray(languages)) {
            return Promise.reject(new Error('Language array cannot be of type "' + typeof languages + '"'));
        }

        return setSettings(project, null, 'languages', languages);
    }
}

module.exports = LanguageHelper;
