'use strict';

// Helpers
let ContentHelperCommon = require('../../common/helpers/ContentHelper');

// Models
let Content = require('../../common/models/Content');

class ContentHelper extends ContentHelperCommon {
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
            {},
            {
                sort: 1
            }
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
        if(!content || Object.keys(content).length < 1) {
            return new Promise((resolve, reject) => {
                reject(new Error('Posted content with id "' + id + '" is empty'));
            });
        } else {
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
    }

    /**
     * Creates a new content object
     *
     * @param {String} parentId
     *
     * @return {Promise} promise
     */
    static createContent(parentId) {
        let content = Content.create();
        let collection = ProjectHelper.currentEnvironment + '.content';

        if(parentId) {
            content.parentId = parentId;
        }

        return MongoHelper.insertOne(
            ProjectHelper.currentProject,
            collection,
            content.getFields()
        );
    }
    
    /**
     * Removes a content object
     *
     * @param {String} id
     * @param {Boolean} removeChildren
     *
     * @return {Promise} promise
     */
    static removeContentById(id, removeChildren) {
        let collection = ProjectHelper.currentEnvironment + '.content';
        
        return new Promise((resolve, reject) => {
            MongoHelper.removeOne(
                ProjectHelper.currentProject,
                collection,
                {
                    id: id
                }
            )
            .then(() => {
                if(removeChildren) {
                    MongoHelper.remove(
                        ProjectHelper.currentProject,
                        collection,
                        {
                            parentId: id
                        }
                    )
                    .then(() => {
                        resolve();
                    })
                    .catch(reject);
                
                } else {
                    MongoHelper.update(
                        ProjectHelper.currentProject,
                        collection,
                        {
                            parentId: id
                        },
                        {
                            parentId: null
                        }
                    )
                    .then(() => {
                        resolve();
                    })
                    .catch(reject);

                }
            })
            .catch(reject);
        });
    }
}

module.exports = ContentHelper;
