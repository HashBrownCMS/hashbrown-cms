'use strict';

const ContentHelperCommon = require('Common/Helpers/ContentHelper');
const ScheduleHelper = require('Server/Helpers/ScheduleHelper');
const SyncHelper = require('Server/Helpers/SyncHelper');
const SchemaHelper = require('Server/Helpers/SchemaHelper');
const MongoHelper = require('Server/Helpers/MongoHelper');

const Content = require('Common/Models/Content');
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
    static getAllContents(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        let collection = environment + '.content';

        return MongoHelper.find(
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
     * @return {Promise} promise
     */
    static getContentById(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id'),
        localOnly = false
    ) {
        let collection = environment + '.content';
        let content;

        return MongoHelper.findOne(
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
     * @param {Content} content
     */
    static updateContent(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        content = requiredParam('content')
    ) {
        return MongoHelper.updateOne(
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
    static setContentById(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id'),
        content = requiredParam('content'),
        user = requiredParam('user'),
        create = false
    ) {
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

            console.log(this.isSchemaAllowedAsChild);

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
            return MongoHelper.updateOne(
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
     *
     * @return {Promise} New Content object
     */
    static createContent(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        schemaId = requiredParam('schemaId'),
        parentId = null,
        user = requiredParam('user'),
        properties = null,
        sortIndex = 10000
    ) {
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

            return MongoHelper.insertOne(
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
    static removeContentById(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id'),
        removeChildren = false
    ) {
        debug.log('Removing content "' + id + '"...', this);

        let collection = environment + '.content';
        
        return MongoHelper.removeOne(
            project,
            collection,
            {
                id: id
            }
        )
        .then(() => {
            // Remove children if specified
            if(removeChildren) {
                return MongoHelper.remove(
                    project,
                    collection,
                    {
                        parentId: id
                    }
                );

            // If not removing children, we should unset their parent
            } else {
                return MongoHelper.update(
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
    static createExampleContent(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        user = requieredParam('user')
    ) {
        // Rich Text Page
        let richTextPageSchema = new ContentSchema({
            id: ContentSchema.createId(),
            icon: 'file',
            type: 'content',
            defaultTabId: 'content',
            name: 'Rich Text Page',
            parentSchemaId: 'page',
            fields: {
                properties: {
                    text: {
                        label: 'Text',
                        tabId: 'content',
                        schemaId: 'richText'
                    }
                }
            }
        });

        let richTextPageContent = new Content({
            id: Content.createId(),
            createDate: Date.now(),
            updateDate: Date.now(),
            schemaId: richTextPageSchema.id,
            sort: 10000,
            properties: {
                url: '/my-rich-text-page/',
                title: 'My Rich Text Page',
                text: '<h2>This is a rich text page</h2><p>A simple page for inserting formatted text and media</p>'
            }
        });

        // Section page
        let sectionSchema = new FieldSchema({
            id: FieldSchema.createId(),
            name: 'Section',
            icon: 'arrows-h',
            type: 'field',
            editorId: 'struct',
            parentSchemaId: 'struct',
            config: {
                struct: {
                    heading: {
                        label: 'Heading text',
                        schemaId: 'string'
                    },
                    body: {
                        label: 'Body text',
                        schemaId: 'richText'
                    }
                }
            }
        });

        let sectionPageSchema = new ContentSchema({
            id: ContentSchema.createId(),
            icon: 'file',
            type: 'content',
            defaultTabId: 'content',
            name: 'Section Page',
            parentSchemaId: 'page',
            fields: {
                properties: {
                    sections: {
                        label: 'Sections',
                        tabId: 'content',
                        schemaId: 'array',
                        config: {
                            allowedSchemas: [ sectionSchema.id ]
                        }
                    }
                }
            }
        });

        let sectionPageContent = new Content({
            id: Content.createId(),
            createDate: Date.now(),
            updateDate: Date.now(),
            schemaId: sectionPageSchema.id,
            sort: 10000,
            properties: {
                url: '/my-section-page/',
                title: 'My Section Page',
                sections: {
                    items: [ { heading: 'This is a section', body: '<p>With a heading and some body text</p>' } ],
                    schemaBindings: [ sectionSchema.id ]
                }
            }
        });

        // Create rich text page
        return SchemaHelper.setSchemaById(
            project,
            environment,
            richTextPageSchema.id,
            richTextPageSchema,
            true
        )
        .then(ContentHelper.setContentById(
            project,
            environment,
            richTextPageContent.id,
            richTextPageContent,
            user,
            true
        ))
        
        // Create section page
        .then(SchemaHelper.setSchemaById(
            project,
            environment,
            sectionSchema.id,
            sectionSchema, 
            true
        ))
        .then(SchemaHelper.setSchemaById(
            project,
            environment,
            sectionPageSchema.id,
            sectionPageSchema, 
            true
        ))
        .then(ContentHelper.setContentById(
            project,
            environment,
            sectionPageContent.id,
            sectionPageContent,
            user,
            true
        ));
    }
}

module.exports = ContentHelper;
