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
    static getSelectedLanguages(
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

        return setSettings(project, null, 'languages', languages);
    }
    
    /**
     * Toggle a language
     *
     * @param {String} project
     * @param {String} language
     * @param {Boolean} state
     *
     * @returns {Promise} Promise
     */
    static toggleLanguage(
        project = requiredParam('project'),
        language = requiredParam('language'),
        state = requiredParam('state')
    ) {
        return SettingsHelper.getSettings(project, null, 'language')
        .then((settings) => {
            if(!settings) {
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
}

module.exports = LanguageHelper;
