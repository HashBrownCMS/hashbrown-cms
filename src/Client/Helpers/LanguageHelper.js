'use strict';

const SettingsHelper = require('Client/Helpers/SettingsHelper');
const LanguageHelperCommon = require('Common/Helpers/LanguageHelper');

/**
 * The client side language helper
 *
 * @memberof HashBrown.Client.Helpers
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

            this.selectedLanguages = selected;

            return Promise.resolve(selected);
        });
    }
    
    /**
     * Sets all languages
     *
     * @param {String} project
     * @param {Array} languages
     *
     * @returns {Promise} promise
     */
    static setLanguages(
        project = requiredParam('project'),
        languages = requiredParam('languages')
    ) {
        if(!Array.isArray(languages)) {
            return Promise.reject(new Error('Language array cannot be of type "' + typeof languages + '"'));
        }

        return SettingsHelper.setSettings(project, null, 'languages', languages);
    }
}

module.exports = LanguageHelper;
