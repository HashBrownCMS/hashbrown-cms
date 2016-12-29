'use strict';

let LanguageHelperCommon = require('../../common/helpers/LanguageHelper');

class LanguageHelper extends LanguageHelperCommon {
    /**
     * Gets all selected languages
     *
     * @param {String} project
     *
     * @returns {Array} Array of language names
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

            return Promise.resolve(settings.selected);
        });  
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
