'use strict';

module.exports = class LanguageHelper {
    /**
     * Gets all languages
     *
     * @returns {Array} List of language names
     */
    static getLanguages() {
        return require('../data/languages.json');
    }

    /**
     * Gets all selected languages
     *
     * @param {String} project
     *
     * @returns {Array} List of language names
     */
    static getSelectedLanguages(
        project = requiredParam('project')
    ) {
        return HashBrown.Helpers.SettingsHelper.getSettings(project, null, 'languages')
        .then((selected) => {
            if(!selected || !Array.isArray(selected)) {
                selected = ['en'];
            }

            selected.sort();

            LanguageHelper.selectedLanguages = selected;

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

        return HashBrown.Helpers.SettingsHelper.setSettings(project, null, 'languages', languages);
    }

    /**
     * Gets localised sets of properties for a Content object
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     *
     * @return {Promise} Properties
     */
    static getAllLocalizedPropertySets(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        content = requiredParam('content')
    ) {
        return LanguageHelper.getSelectedLanguages(project)
        .then((languages) => {
            let sets = {};

            for(let language of languages) {
                let properties = content.getLocalizedProperties(language);
                
                sets[language] = properties;
            }

            return Promise.resolve(sets);
        });
    }
}
