'use strict';

class LanguageHelper {
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
        return SettingsHelper.getSettings(project, null, 'language')
        .then((settings) => {
            if(!settings) {
                settings = {};
            }

            if(!settings.selected || settings.selected.length < 1) {
                settings.selected = ['en'];
            }
      
            settings.selected.sort();

            LanguageHelper.selectedLanguages = settings.selected;

            return Promise.resolve(settings.selected);
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
        return SettingsHelper.getSettings(project, null, 'language')
        .then((settings) => {
            if(!(settings instanceof Object)) {
                settings = {};
            }

            if(!Array.isArray(languages)) {
                return Promise.reject(new Error('Language array cannot be of type "' + typeof languages + '"'));
            }

            settings.selected = languages;

            return SettingsHelper.setSettings(project, null, 'language', settings);
        });  
    }

    /**
     * Toggle a language
     *
     * @param {String} project
     * @param {String} language
     * @param {Boolean} state
     *
     * @returns {Promise} promise
     */
    static toggleLanguage(
        project = requiredParam('project'),
        language = requiredParam('language'),
        state = requiredParam('state')
    ) {
        return SettingsHelper.getSettings(project, 'language')
        .then((settings) => {
            if(!(settings instanceof Object)) {
                settings = {};
            }

            if(!settings.selected || settings.selected.length < 1) {
                settings.selected = ['en'];
            }
        
            if(!state && settings.selected.indexOf(language) > -1) {
                settings.selected.splice(settings.selected.indexOf(language), 1);

            } else if(state && settings.selected.indexOf(language) < 0) {
                settings.selected.push(language);
                settings.selected.sort();

            }

            return SettingsHelper.setSettings(project, null, 'language', settings);
        });  
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

module.exports = LanguageHelper;
