'use strict';

const ContentHelperCommon = require('Common/Helpers/ContentHelper');
const ScheduleHelper = require('Server/Helpers/ScheduleHelper');
const SyncHelper = require('Server/Helpers/SyncHelper');
const SchemaHelper = require('Server/Helpers/SchemaHelper');
const DatabaseHelper = require('Server/Helpers/DatabaseHelper');

const Content = require('Server/Models/Content');
const ContentSchema = require('Common/Models/ContentSchema');
const FieldSchema = require('Common/Models/FieldSchema');
const User = require('Server/Models/User');

/**
 * The helper class for Content
 *
 * @memberof HashBrown.Server.Helpers
 */
class ContentHelper extends ContentHelperCommon {
    /**
     * Gets all Content objects
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Promise} promise
     */
    static getAllContents(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        let collection = environment + '.content';

        return DatabaseHelper.find(
            project,
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

            return SyncHelper.mergeResource(project, environment, 'content', contentList);
        });
    }

    /**
     * Gets a Content object by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Boolean} localOnly
     *
     * @return {Promise} Promise
     */
    static getContentById(project, environment, id, localOnly = false) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);

        let collection = environment + '.content';
        let content;

        return DatabaseHelper.findOne(
            project,
            collection,
            {
                id: id
            }
        ).then((result) => {
            if(!result) {
                if(localOnly) {
                    return Promise.reject(new Error('Content by id "' + id + '" was not found'));
                }

                return SyncHelper.getResourceItem(project, environment, 'content', id);
            }
            
            return Promise.resolve(result);

        }).then((result) => {
            if(!result) {
                return Promise.reject(new Error('Content by id "' + id + '" was not found'));
            }

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
     * Updates a Content object (quick, no checks)
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     */
    static updateContent(project, environment, content) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Models.Content);

        return DatabaseHelper.updateOne(
            project,
            environment + '.content',
            { id: content.id },
            content.getObject()
        );
    }

    /**
     * Sets a Content object by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Content} content
     * @param {User} user
     * @param {Boolean} create
     *
     * @return {Promise} Promise
     */
    static setContentById(project, environment, id, content, user, create = false) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(content, 'content', HashBrown.Models.Content);
        checkParam(user, 'user', HashBrown.Models.User);

        // Check for empty Content object
        if(!content || Object.keys(content).length < 1) {
            return Promise.reject(new Error('Posted content with id "' + id + '" is empty'));
        }

        // Check for self parent
        if(content.parentId == content.id) {
            return Promise.reject(new Error('Content "' + content.id + '" cannot be a child of itself'));
        }

        return (() => {
            // If no parent id was specified, let the content trough
            // TODO: Check if allowed at root
            if(!content.parentId) { return Promise.resolve(); }

            // Check for allowed Schemas
            return this.isSchemaAllowedAsChild(project, environment, content.parentId, content.schemaId);
        })()
        .then(() => {
            // Unset automatic flags
            content.isLocked = false;

            content.sync = {
                isRemote: false,
                hasRemote: false
            };

            // Content update data
            content.updatedBy = user.id;
            content.updateDate = Date.now();
            
            // Fallback in case of no "created by" user
            if(!content.createdBy) {
                content.createdBy = content.updatedBy;
            }
            
            // Handle scheduled publish task
            if(content.publishOn) {
                return ScheduleHelper.updateTask(project, environment, 'publish', id, content.publishOn, user);
            } else {
                return ScheduleHelper.removeTask(project, environment, 'publish', id);
            }
        })
        .then(() => {
            // Handle scheduled unpublish task
            if(content.unpublishOn) {
                return ScheduleHelper.updateTask(project, environment, 'unpublish', id, content.unpublishOn, user);
            } else {
                return ScheduleHelper.removeTask(project, environment, 'unpublish', id);
            }
        })
        .then(() => {
            // Insert into database
            return DatabaseHelper.updateOne(
                project,
                environment + '.content',
                { id: id },
                content,
                { upsert: create } // Whether or not to create the node if it doesn't already exist
            );
        })
        .then(() => {
            debug.log('Done updating content "' + id + '"', this);

            return Promise.resolve(content);
        });
    }

    /**
     * Creates a new content object
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} schemaId
     * @param {String} parentId
     * @param {User} user
     * @param {Object} properties
     * @param {Number} sortIndex
     *
     * @return {Promise} New Content object
     */
    static createContent(project, environment, schemaId, parentId = null, user, properties = null, sortIndex = 10000) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(schemaId, 'schemaId', String);
        checkParam(user, 'user', HashBrown.Models.User);

        return this.isSchemaAllowedAsChild(project, environment, parentId, schemaId)
        .then(() => {
            return SchemaHelper.getSchemaById(project, environment, schemaId);
        })
        .then((schema) => {
            let content = Content.create(schema.id, properties);
            let collection = environment + '.content';

            debug.log('Creating content "' + content.id + '"...', this);

            content.createdBy = user.id;
            content.updatedBy = content.createdBy;

            if(parentId) {
                content.parentId = parentId;
            }

            content.sort = sortIndex;

            return DatabaseHelper.insertOne(
                project,
                collection,
                content.getObject()
            )
            .then(() => {
                debug.log('Content "' + content.id + '" created and inserted into "' + project + '.' + collection + '"', this);

                return Promise.resolve(content);
            });
        });
    }
    
    /**
     * Removes a content object
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Boolean} removeChildren
     *
     * @return {Promise} promise
     */
    static removeContentById(project, environment, id, removeChildren = false) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);

        debug.log('Removing content "' + id + '"...', this);

        let collection = environment + '.content';
        
        return DatabaseHelper.removeOne(
            project,
            collection,
            {
                id: id
            }
        )
        .then(() => {
            // Remove children if specified
            if(removeChildren) {
                return DatabaseHelper.remove(
                    project,
                    collection,
                    {
                        parentId: id
                    }
                );

            // If not removing children, we should unset their parent
            } else {
                return DatabaseHelper.update(
                    project,
                    collection,
                    {
                        parentId: id
                    },
                    {
                        parentId: null
                    }
                );
            }
        })
        .then(() => {
            debug.log('Successfully removed content "' + id + '"...', this);

            return Promise.resolve();  
        });
    }
    
    /**
     * Creates example content
     *
     * @param {String} project
     * @param {String} environment
     * @param {User} user
     *
     * @returns {Promise} Result
     */
    static createExampleContent(project, environment, user = requiredParam('user')) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        // Example page Schema
        let examplePageSchemaId = ContentSchema.createId();
        
        let examplePageSchema = new ContentSchema({
            id: examplePageSchemaId,
            icon: 'file',
            type: 'content',
            defaultTabId: 'content',
            allowedChildSchemas: [ examplePageSchemaId ],
            name: 'Example Page',
            parentSchemaId: 'page',
            fields: {
                properties: {
                    array: {
                        tabId: 'content',
                        label: 'Array',
                        schemaId: 'array',
                        description: 'A list of values',
                        config: {
                            minItems: 0,
                            maxItems: 2,
                            allowedSchemas: [ 'string', 'richText' ]
                        }
                    },
                    boolean: {
                        tabId: 'content',
                        schemaId: 'boolean',
                        label: 'Boolean',
                        description: 'A true/false value'
                    },
                    contentReference: {
                        tabId: 'content',
                        schemaId: 'contentReference',
                        label: 'Content Reference',
                        description: 'A reference to another Content node',
                        config: {
                            allowedSchemas: [ examplePageSchemaId ]
                        }
                    },
                    contentSchemaReference: {
                        tabId: 'content',
                        schemaId: 'contentSchemaReference',
                        label: 'Content Schema Reference',
                        description: 'A reference to a Content Schema',
                        config: {
                            allowedSchemas: [ examplePageSchemaId ]
                        }
                    },
                    date: {
                        tabId: 'content',
                        schemaId: 'date',
                        label: 'Date',
                        description: 'A date picker'
                    },
                    dropdown: {
                        tabId: 'content',
                        schemaId: 'dropdown',
                        label: 'Dropdown',
                        description: 'A dropdown list of options',
                        config: {
                            options: [
                                {
                                    label: 'Option #1',
                                    value: 'option1'
                                },
                                {
                                    label: 'Option #2',
                                    value: 'option2'
                                },
                                {
                                    label: 'Option #3',
                                    value: 'option3'
                                }
                            ]
                        }
                    },
                    language: {
                        tabId: 'content',
                        schemaId: 'language',
                        label: 'Language',
                        description: 'A dropdown list of available languages'
                    },
                    mediaReference: {
                        tabId: 'content',
                        schemaId: 'mediaReference',
                        label: 'Media Reference',
                        description: 'A reference to a Media node'
                    },
                    number: {
                        tabId: 'content',
                        schemaId: 'number',
                        label: 'Number',
                        description: 'A number picker, which can optionally be a slider',
                        config: {
                            step: 0.5,
                            min: 0,
                            max: 10,
                            isSlider: true
                        }
                    },
                    richText: {
                        tabId: 'content',
                        schemaId: 'richText',
                        label: 'Rich Text',
                        description: 'A formatted text field'
                    },
                    string: {
                        tabId: 'content',
                        schemaId: 'string',
                        label: 'String',
                        description: 'A simple text string'
                    },
                    struct: {
                        tabId: 'content',
                        schemaId: 'struct',
                        label: 'Struct',
                        description: 'A combination of fields',
                        config: {
                            struct: {
                                string: {
                                    schemaId: 'string',
                                    label: 'String',
                                    description: 'A simple text string'
                                },
                                boolean: {
                                    schemaId: 'boolean',
                                    label: 'Boolean',
                                    description: 'A true/false value'
                                }
                            }
                        }
                    },
                    tags: {
                        tabId: 'content',
                        schemaId: 'tags',
                        label: 'Tags',
                        description: 'A comma-separated list of tags'
                    }
                }
            }
        });

        // Example page Content node
        let examplePageContent = new Content({
            id: Content.createId(),
            createDate: Date.now(),
            updateDate: Date.now(),
            schemaId: examplePageSchema.id,
            sort: 10000,
            properties: {
                url: '/my-example-page/',
                title: 'My Example Page',

            }
        });

        // Create example page
        return SchemaHelper.setSchemaById(
            project,
            environment,
            examplePageSchema.id,
            examplePageSchema,
            true
        )
        .then(ContentHelper.setContentById(
            project,
            environment,
            examplePageContent.id,
            examplePageContent,
            user,
            true
        ))
    }
}

module.exports = ContentHelper;
