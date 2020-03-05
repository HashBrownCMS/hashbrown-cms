'use strict';

let selectedLanguages = {};

/**
 * The client side language helper
 *
 * @memberof HashBrown.Client.Service
 */
class LanguageService extends require('Common/Service/LanguageService') {
    /**
     * Gets all selected languages
     *
     * @param {String} project
     *
     * @returns {Array} List of language names
     */
    static getLanguages(project) {
        project = project || HashBrown.Service.ProjectService.currentProject;

        return HashBrown.Service.SettingsService.getSettings(project, 'languages')
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

        return HashBrown.Service.SettingsService.setSettings(project, 'languages', languages);
    }
}

module.exports = LanguageService;
