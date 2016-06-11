'use strict';

// Models
let Content = require('../../common/models/Content');

// Helpers
let ProjectHelper = require('./ProjectHelper');
let MongoHelper = require('./MongoHelper');

class ContentHelper {
    /**
     * Gets all Content objects
     *
     * @return {Promise} promise
     */
    static getAllContents() {
        let collection = ProjectHelper.currentEnvironment + '.content';
        
        return MongoHelper.find(
            ProjectHelper.currentProject,
            collection,
            {}
        );
    }

    /**
     * Gets a Content object by id
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static getContentById(id) {
        let collection = ProjectHelper.currentEnvironment + '.content';
        
        return MongoHelper.findOne(
            ProjectHelper.currentProject,
            collection,
            {
                id: id
            }
        );
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
        content.updateDate = Date.now();
        let collection = ProjectHelper.currentEnvironment + '.content';

        return MongoHelper.updateOne(
            ProjectHelper.currentProject,
            collection,
            {
                id: id
            },
            content
        );
    }

    /**
     * Creates a new content object
     *
     * @return {Promise} promise
     */
    static createContent() {
        let content = Content.create();
        let collection = ProjectHelper.currentEnvironment + '.content';

        return MongoHelper.insertOne(
            ProjectHelper.currentProject,
            collection,
            content.getFields()
        );
    }
    
    /**
     * Removes a content object
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static removeContentById(id) {
        let collection = ProjectHelper.currentEnvironment + '.content';
        
        return MongoHelper.removeOne(
            ProjectHelper.currentProject,
            collection,
            {
                id: id
            }
        );
    }
}

module.exports = ContentHelper;
