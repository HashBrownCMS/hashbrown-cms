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
            {},
            {
                sort: 1
            }
        ).then((results) => {
            let contentList = [];

            for(let i in results) {
                let content = new Content(results[i]);

                // Make sure runaway publish dates are not included
                content.publishOn = null;
                content.unpublishOn = null;
                
                contentList[contentList.length] = content;

            }

            contentList.sort((a, b) => {
                return a.sort > b.sort;
            });

            return SyncHelper.mergeResource('content', contentList);
        });
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
        let content;

        return MongoHelper.findOne(
            ProjectHelper.currentProject,
            collection,
            {
                id: id
            }
        ).then((result) => {
            if(!result) {
                return SyncHelper.getResourceItem('content', id);
            }
            
            return Promise.resolve(result);

        }).then((result) => {
            content = new Content(result);

            // Make sure runaway publish dates are not included
            content.publishOn = null;
            content.unpublishOn = null;

            return ScheduleHelper.getTasks(null, content.id);
        })
        .then((tasks) => {
            content.adoptTasks(tasks);

            return Promise.resolve(content);
        });
    }
    
    /**
     * Sets a Content object by id
     *
     * @param {String} id
     * @param {Object} content
     * @param {Boolean} create
     *
     * @return {Promise} Promise
     */
    static setContentById(id, content, create) {
        debug.log('Updating content "' + id + '"...', this);
        
        let updateContent = () => {
            // Unset automatic flags
            content.locked = false;
            content.remote = false;

            if(UserHelper.current) {
                content.updatedBy = UserHelper.current.id;
            }

            content.updateDate = Date.now();
            
            if(!content.createdBy) {
                content.createdBy = content.updatedBy;
            }
            
            let collection = ProjectHelper.currentEnvironment + '.content';
            
            // Register publish dates centrally
            if(content.publishOn) {
                ScheduleHelper.updateTask('publish', id, content.publishOn);
            } else {
                ScheduleHelper.removeTask('publish', id, content.publishOn);
            }

            if(content.unpublishOn) {
                ScheduleHelper.updateTask('unpublish', id, content.unpublishOn);
            } else {
                ScheduleHelper.removeTask('unpublish', id, content.unpublishOn);
            }

            // Remove inserted publish dates
            content.publishOn = null;
            content.unpublishOn = null;
           
            return MongoHelper.updateOne(
                ProjectHelper.currentProject,
                collection,
                { id: id },
                content,
                { upsert: create } // Whether or not to create the node if it doesn't already exist
            )
            .then(() => {
                debug.log('Done updating content "' + id + '"', this);
            });
        };

        // Check for empty Content object
        if(!content || Object.keys(content).length < 1) {
            return Promise.reject(new Error('Posted content with id "' + id + '" is empty'));

        } else if(content.parentId) {
            return this.isSchemaAllowedAsChild(content.parentId, content.schemaId)
            .then(() => {
                return updateContent();
            });

        } else {
            return updateContent();

        }
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
        return this.isSchemaAllowedAsChild(parentId, schemaId)
        .then(() => {
            return SchemaHelper.getSchemaById(schemaId);
        })
        .then((schema) => {
            let content = Content.create(schema.id);
            let collection = ProjectHelper.currentEnvironment + '.content';

            debug.log('Creating content "' + content.id + '"...', this);

            content.createdBy = UserHelper.current.id;
            content.updatedBy = content.createdBy;

            if(parentId) {
                content.parentId = parentId;
            }

            return MongoHelper.insertOne(
                ProjectHelper.currentProject,
                collection,
                content.getFields()
            )
            .then(() => {
                debug.log('Content "' + content.id + '" created and inserted into "' + ProjectHelper.currentProject + '.' + collection + '"', this);

                return Promise.resolve(content);
            });
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
