'use strict';

class LanguageHelper {
    /**
     * Gets all languages
     *
     * @returns {String[]} languages
     */
    static getLanguages() {
        return require('../data/languages.json');
    }

    /**
     * Gets all selected languages
     *
     * @returns {String[]} languages
     */
    static getSelectedLanguages() {
        return new Promise((callback) => {
            SettingsHelper.getSettings('language')
            .then((settings) => {
                if(!settings) {
                    settings = {};
                }

                if(!settings.selected || settings.selected.length < 1) {
                    settings.selected = ['en'];
                }
          
                settings.selected.sort();

                callback(settings.selected);
            });  
        });
    }

    /**
     * Toggle a language
     *
     * @param {String} language
     * @param {Boolean} state
     *
     * @returns {Promise} promise
     */
    static toggleLanguage(language, state) {
        return new Promise((callback) => {
            SettingsHelper.getSettings('language')
            .then((settings) => {
                if(!settings.selected || settings.selected.length < 1) {
                    settings.selected = ['en'];
                }
            
                if(!state && settings.selected.indexOf(language) > -1) {
                    settings.selected.splice(settings.selected.indexOf(language), 1);

                } else if(state && settings.selected.indexOf(language) < 0) {
                    settings.selected.push(language);
                    settings.selected.sort();

                }

                SettingsHelper.setSettings('language', settings)
                .then(() => {
                    callback()
                });
            });  
        });
    }

    /**
     * Gets localised sets of properties for a Content object
     *
     * @param {String} language
     * @param {Content} content
     *
     * @return {Promise(Object[])} properties
     */
    static getAllLocalizedPropertySets(content) {
        return new Promise((callback) => {
            LanguageHelper.getSelectedLanguages()
            .then((languages) => {
                let sets = {};

                for(let language of languages) {
                    let properties = content.getLocalizedProperties(language);
                    
                    sets[language] = properties;
                }

                callback(sets);
            });
        });
    }
}

module.exports = LanguageHelper;
