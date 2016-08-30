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
     * @param {String} id
     * @param {Object} content
     *
     * @return {Promise} Promise
     */
    static setContentById(id, content) {
        return new Promise((resolve, reject) => {
            let updateContent = () => {
                content.updateDate = Date.now();
                let collection = ProjectHelper.currentEnvironment + '.content';

                MongoHelper.updateOne(
                    ProjectHelper.currentProject,
                    collection,
                    {
                        id: id
                    },
                    content
                )
                .then(resolve)
                .catch(reject);
            };

            // Check for empty Content object
            if(!content || Object.keys(content).length < 1) {
                reject(new Error('Posted content with id "' + id + '" is empty'));

            } else if(content.parentId) {
                this.isSchemaAllowedAsChild(content.parentId, content.schemaId)
                .then(updateContent)
                .catch(reject);

            } else {
                updateContent();

            }
        });
    }

    /**
     * Creates a new content object
     *
     * @param {String} schemaId
     * @param {String} parentId
     *
     * @return {Promise} New Content object
     */
    static createContent(schemaId, parentId) {
        return new Promise((resolve, reject) => {
            this.isSchemaAllowedAsChild(parentId, schemaId)
            .then(() => {
                SchemaHelper.getSchemaById(schemaId)
                .then((schema) => {
                    let content = Content.create(schema.id);
                    let collection = ProjectHelper.currentEnvironment + '.content';

                    if(parentId) {
                        content.parentId = parentId;
                    }

                    MongoHelper.insertOne(
                        ProjectHelper.currentProject,
                        collection,
                        content.getFields()
                    )
                    .then(resolve)
                    .catch(reject);
                })
                .catch(reject);
            })
            .catch(reject);
        });
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
