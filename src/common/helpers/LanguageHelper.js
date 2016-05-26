'use strict';

class LanguageHelper {
    /**
     * Gets all languages
     *
     * @returns {Array} languages
     */
    static getLanguages() {
        return new Promise((callback) => {
            let languages = ['en', 'da'];

            callback(languages);        
        });
    }
}

module.exports = LanguageHelper;
