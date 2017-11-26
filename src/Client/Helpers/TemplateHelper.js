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

    /**
     * Gets a template by id
     *
     * @param {String} type
     * @param {String} id
     *
     * @returns {Template} Template
     */
    static getTemplate(type, id) {
        for(let template of resources.templates) {
            if(template.type !== type || template.id !== id) { continue; }

            return template;
        }

        return null;
    }
}

module.exports = TemplateHelper;
