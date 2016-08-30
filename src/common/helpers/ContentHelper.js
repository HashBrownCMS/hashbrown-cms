'use strict';

class ContentHelper {
    /**
     * Gets all Content objects
     *
     * @return {Promise} promise
     */
    static getAllContents() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    /**
     * Gets a URL-friendly version of a string
     *
     * @param {String} string
     *
     * @param {String} slug
     */
    static getSlug(string) {
        return string
            .toLowerCase()
            .replace(/[æ|ä]/g, 'ae')
            .replace(/[ø|ö]/g, 'oe')
            .replace(/å/g, 'aa')
            .replace(/ü/g, 'ue')
            .replace(/ß/g, 'ss')
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
            ;
    }

    /**
     * Gets a Content object by id
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static getContentById(id) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    
    /**
     * Sets a Content object by id
     *
     * @param {Number} id
     * @param {Object} content
     *
     * @return {Promise} promise
     */
    static setContentById(id, content) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    /**
     * Checks if a Schema type is allowed as a child of a Content object
     *
     * @param {String} parentId
     * @param {String} childSchemaId
     *
     * @returns {Promise} Is the Content node allowed as a child
     */
    static isSchemaAllowedAsChild(parentId, childSchemaId) {
        return new Promise((resolve, reject) => {
            this.getContentById(parentId)
            .then((parentContent) => {
                SchemaHelper.getSchemaById(parentContent.schemaId)
                .then((parentSchema) => {
                    if(
                        parentSchema.allowedChildSchemas.indexOf(childSchemaId) < 0
                    ) {
                        reject(new Error('Content with Schema "' + childSchemaId + '" is not an allowed child of Content with Schema "' + parentSchema.id + '"'));
                    
                    } else {
                        resolve();

                    }
                })
                .catch(reject);
            })
            .catch(reject);
        });
    }

    /**
     * Creates a new content object
     *
     * @return {Promise} promise
     */
    static createContent() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    
    /**
     * Removes a content object
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static removeContentById(id) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}

module.exports = ContentHelper;
