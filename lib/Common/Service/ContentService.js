'use strict';

/**
 * A helper class for Content
 *
 * @memberof HashBrown.Common.Service
 */
class ContentService {
    /**
     * Gets all Content objects
     *
     * @param {String} project
     * @param {String} environment
     */
    static async getAllContent(project, environment) {}

    /**
     * Gets a URL-friendly version of a string
     *
     * @param {String} string
     *
     * @param {String} slug
     */
    static getSlug(string) {
        return (string || '')
            .toLowerCase()
            .replace(/[æ|ä]/g, 'ae')
            .replace(/[ø|ö]/g, 'oe')
            .replace(/å/g, 'aa')
            .replace(/ü/g, 'ue')
            .replace(/ß/g, 'ss')
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }

    /**
     * Gets a Content object by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     */
    static async getContentById(project, environment, id) {}
    
    /**
     * Sets a Content object by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Content} content
     */
    static async setContentById(project, environment, id, content) {}

    /**
     * Checks if a Schema type is allowed as a child of a Content object
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} parentId
     * @param {String} childSchemaId
     *
     * @returns {Promise} Is the Content node allowed as a child
     */
    static async isSchemaAllowedAsChild(project, environment, parentId, childSchemaId) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(parentId, 'parentId', String);
        checkParam(childSchemaId, 'childSchemaId', String);

        // No parent id means root, and all schemas are allowed there
        if(!parentId) { return true; }

        let parentContent = await HashBrown.Service.ContentService.getContentById(project, environment, parentId);
        let parentSchema = await HashBrown.Service.SchemaService.getSchemaById(project, environment, parentContent.schemaId);

        return parentSchema.allowedChildSchemas.indexOf(childSchemaId) > -1;
    }

    /**
     * Creates a new content object
     */
    static async createContent() {}
    
    /**
     * Removes a content object
     *
     * @param {String} id
     */
    static async removeContentById(id) {}
}

module.exports = ContentService;
