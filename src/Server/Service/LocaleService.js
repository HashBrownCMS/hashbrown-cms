'use strict';

const Path = require('path');

let locales = {};

/**
 * A helper for locales
 *
 * @memberof HashBrown.Server.Service
 */
class LocaleService extends require('Common/Service/LocaleService') {
    /**
     * Initialises the locales
     */
    static async init() {
        let files = await HashBrown.Service.FileService.list(Path.join(APP_ROOT, 'i18n'));

        for(let file of files) {
            if(Path.extname(file) !== '.json') { continue; }

            locales[Path.basename(file, Path.extname(file))] = require(file);
        }

        locales['en'] = null;
    }

    /**
     * Gets a list of system locales
     *
     * @param {Boolean} includeNames
     *
     * @returns {Array} List of locale names
     */
    static getSystemLocales() {
        let names = Object.keys(locales);

        names.sort();

        return names;
    }

    /**
     * Gets the translation strings for a system locale
     *
     * @param {String} locale
     *
     * @return {Object} Translations
     */
    static getSystemLocale(locale) {
        checkParam(locale, 'locale', String, true);

        return locales[locale] || {};
    }

    /**
     * Appends translation strings to an existing locale
     *
     * @param {String} locale
     * @param {Object} i18n
     */
    static appendSystemLocale(locale, i18n) {
        checkParam(locale, 'locale', String, true);
        checkParam(i18n, 'i18n', Object, true);

        if(locale === 'en') { return; }

        if(!locales[locale]) {
            locales[locale] = {};
        }

        for(let key in i18n) {
            if(locales[locale][key]) { continue; }

            locales[locale][key] = i18n[key];
        }
    }
}

module.exports = LocaleService;
