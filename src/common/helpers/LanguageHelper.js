'use strict';

class LanguageHelper {
    /**
     * Gets all languages
     *
     * @returns {String[]} languages
     */
    static getLanguages() {
        return new Promise((callback) => {
            let languages = ['en', 'da'];

            callback(languages);        
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
            LanguageHelper.getLanguages()
            .then((languages) => {
                let sets = [];

                for(let language of languages) {
                    let properties = content.getProperties(language);
                
                    sets.push(properties);
                }

                callback(sets);
            });
        });
    }
}

module.exports = LanguageHelper;
