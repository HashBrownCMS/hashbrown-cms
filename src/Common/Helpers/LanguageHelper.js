'use strict';

/**
 * A helper for language
 *
 * @memberof HashBrown.Common.Helpers
 */
class LanguageHelper {
    /**
     * Gets all selected languages
     *
     * @param {String} project
     *
     * @returns {Array} List of language names
     */
    static getLanguages(
        project = requiredParam('project')
    ) {
        return Promise.resolve([]);
    }
    
    /**
     * Sets all languages
     *
     * @param {String} project
     * @param {Array} languages
     *
     * @returns {Promise} Promise
     */
    static setLanguages(
        project = requiredParam('project'),
        languages = requiredParam('languages')
    ) {
        return Promise.resolve();
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
        return this.getLanguages(project)
        .then((languages) => {
            let sets = {};

            for(let language of languages) {
                let properties = content.getLocalizedProperties(language);
                
                sets[language] = properties;
            }

            return Promise.resolve(sets);
        });
    }
    
    /**
     * Gets all languages
     *
     * @returns {Array} List of language names
     */
    static getLanguageOptions() {
        return [
            "aa",
            "ab",
            "ae",
            "af",
            "ak",
            "am",
            "an",
            "ar",
            "as",
            "av",
            "ay",
            "az",
            "ba",
            "be",
            "bg",
            "bh",
            "bi",
            "bm",
            "bn",
            "bo",
            "br",
            "bs",
            "ca",
            "ce",
            "ch",
            "co",
            "cr",
            "cs",
            "cu",
            "cv",
            "cy",
            "da",
            "de",
            "dv",
            "dz",
            "ee",
            "el",
            "en",
            "eo",
            "es",
            "et",
            "eu",
            "fa",
            "ff",
            "fi",
            "fj",
            "fo",
            "fr",
            "fy",
            "ga",
            "gd",
            "gl",
            "gn",
            "gu",
            "gv",
            "ha",
            "he",
            "hi",
            "ho",
            "hr",
            "ht",
            "hu",
            "hy",
            "hz",
            "ia",
            "id",
            "ie",
            "ig",
            "ii",
            "ik",
            "io",
            "is",
            "it",
            "iu",
            "ja",
            "jv",
            "ka",
            "kg",
            "ki",
            "kj",
            "kk",
            "kl",
            "km",
            "kn",
            "ko",
            "kr",
            "ks",
            "ku",
            "kv",
            "kw",
            "ky",
            "la",
            "lb",
            "lg",
            "li",
            "ln",
            "lo",
            "lt",
            "lu",
            "lv",
            "mg",
            "mh",
            "mi",
            "mk",
            "ml",
            "mn",
            "mr",
            "ms",
            "mt",
            "my",
            "na",
            "nb",
            "nd",
            "ne",
            "ng",
            "nl",
            "nn",
            "no",
            "nr",
            "nv",
            "ny",
            "oc",
            "oj",
            "om",
            "or",
            "os",
            "pa",
            "pi",
            "pl",
            "ps",
            "pt",
            "qu",
            "rc",
            "rm",
            "rn",
            "ro",
            "ru",
            "rw",
            "sa",
            "sc",
            "sd",
            "se",
            "sg",
            "si",
            "sk",
            "sl",
            "sm",
            "sn",
            "so",
            "sq",
            "sr",
            "ss",
            "st",
            "su",
            "sv",
            "sw",
            "ta",
            "te",
            "tg",
            "th",
            "ti",
            "tk",
            "tl",
            "tn",
            "to",
            "tr",
            "ts",
            "tt",
            "tw",
            "ty",
            "ug",
            "uk",
            "ur",
            "uz",
            "ve",
            "vi",
            "vo",
            "wa",
            "wo",
            "xh",
            "yi",
            "yo",
            "za",
            "zh",
            "zu"
        ];
    }
}

module.exports = LanguageHelper;
