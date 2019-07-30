'use strict';

const LanguageHelperCommon = require('Common/Helpers/LanguageHelper');

let selectedLanguages = {};

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
    static getLanguages(project) {
        project = project || HashBrown.Helpers.ProjectHelper.currentProject;

        return HashBrown.Helpers.SettingsHelper.getSettings(project, null, 'languages')
        .then((selected) => {
            if(!selected || !Array.isArray(selected)) {
                selected = ['en'];
            }

            selected.sort();

            selectedLanguages[project] = selected;

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
    static setLanguages(project, languages) {
        checkParam(project, 'project', String);
        checkParam(languages, 'languages', Array);

        if(!Array.isArray(languages)) {
            return Promise.reject(new Error('Language array cannot be of type "' + typeof languages + '"'));
        }

        return HashBrown.Helpers.SettingsHelper.setSettings(project, null, 'languages', languages);
    }
}

module.exports = LanguageHelper;
