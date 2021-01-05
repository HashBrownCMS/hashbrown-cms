'use strict';

const Path = require('path');

let locales = [];

/**
 * A helper for locales
 *
 * @memberof HashBrown.Server.Service
 */
class LocaleService extends require('Common/Service/LocaleService') {
    /**
     * Gets a list of system locales
     *
     * @param {Boolean} includeNames
     *
     * @returns {Array} List of locale names
     */
    static async getSystemLocales() {
        if(locales.length < 1) {
            let files = await HashBrown.Service.FileService.list(Path.join(APP_ROOT, 'i18n'));

            for(let file of files) {
                if(Path.extname(file) !== '.json') { continue; }

                locales.push(Path.basename(file, Path.extname(file)));
            }

            locales.push('en');

            locales.sort();
        }

        return locales;
    }
}

module.exports = LocaleService;
