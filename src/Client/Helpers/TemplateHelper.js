'use strict';

/**
 * A helper class for Template resources
 *
 * @memberof HashBrown.Client.Helpers
 */
class TemplateHelper {
    /**
     * Gets all templates
     *
     * @param {String} type
     *
     * @returns {Array} Templates
     */
    static getAllTemplates(type) {
        if(!type) { return resources.templates; }

        let templates = [];

        for(let template of resources.templates) {
            if(template.type !== type) { continue; }

            templates.push(template);
        }

        return templates;
    }
}

module.exports = TemplateHelper;
