'use strict';

/**
 * The server-side content model
 *
 * @memberof HashBrown.Server.Entity.Resource
 */
class Content extends require('Common/Entity/Resource/Content') {
    /**
     * Creates a new instance of this entity type
     *
     * @param {HashBrown.Entity.User} user
     * @param {String} projectId
     * @param {String} environment
     * @param {Object} data
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async create(user, projectId, environment, data = {}, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(data, 'data', Object, true);
        checkParam(data.schemaId, 'data.schemaId', String, true);
        checkParam(options, 'options', Object, true);

        let siblings = []

        if(data.parentId) {
            let parent = await this.get(projectId, environment, data.parentId);
            
            if(!parent) {
                throw new Error(`Parent content ${data.parentId} could not be found`);
            }
            
            let parentSchema = await HashBrown.Entity.Resource.ContentSchema.get(projectId, environment, parent.schemaId);
           
            if(!parentSchema) {
                throw new Error(`Schema ${parent.schemaId} for parent content ${data.parentId} could not be found`);
            }

            if(parentSchema.allowedChildSchemas.indexOf(data.schemaId) < 0) {
                throw new Error('This type of content is not allowed here');
            }

            siblings = await parent.getChildren();

        } else {
            siblings = await this.getOrphans(projectId, environment);    

        }

        if(siblings.length < 1) {
            data.sort = 1;
        } else {
            data.sort = (siblings.pop().sort || siblings.length - 1) + 1;
        }
        
        return await super.create(user, projectId, environment, data, options);
    }
    
    /**
     * Removes this entity
     *
     * @param {HashBrown.Entity.User} user
     * @param {Object} options
     */
    async remove(user, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(options, 'options', Object, true);
        
        let children = await this.getChildren();

        for(let child of children) {
            if(options.removeChildren) {
                await child.remove(user, options);
            
            } else {
                child.parentId = this.parentId;
                await child.save(user);
            
            }
        }

        await this.unpublish();

        await super.remove(user, options);
    }
    
    /**
     * Saves the current state of this entity
     *
     * @param {HashBrown.Entity.User} user
     * @param {Object} options
     */
    async save(user, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(options, 'options', Object, true);

        if(!this.schemaId) {
            throw new Error('Schema id is required');
        }

        await super.save(user, options);

        if(this.isPublished) {
            await this.publish();
        } else {
            await this.unpublish();
        }
            
        // Update publish task
        let publishTask = await HashBrown.Entity.Task.get(this.context.project, this.context.environment, this.id, 'publish');

        if(!this.isPublished && this.publishOn) {
            if(!publishTask) {
                publishTask = await HashBrown.Entity.Task.create(this.context.project, this.context.environment, this.id, 'publish');
            }
            
            publishTask.date = new Date(this.publishOn);

            await publishTask.save();
        
        } else if(publishTask) {
            await publishTask.remove();

        }

        // Update unpublish task
        let unpublishTask = await HashBrown.Entity.Task.get(this.context.project, this.context.environment, this.id, 'unpublish');

        if(this.isPublished && this.unpublishOn) {
            if(!unpublishTask) {
                unpublishTask = await HashBrown.Entity.Task.create(this.context.project, this.context.environment, this.id, 'unpublish');
            }

            unpublishTask.date = new Date(this.unpublishOn);

            await unpublishTask.save();
        
        } else if(unpublishTask) {
            await unpublishTask.remove();

        }

        // Clear publication cache
        let publications = await HashBrown.Entity.Resource.Publication.list(this.context.project, this.context.environment);

        for(let publication of publications) {
            await publication.clearCache();
        }
    }

    /**
     * Publishes this content
     */
    async publish() {
        let publications = await HashBrown.Entity.Resource.Publication.list(this.context.project, this.context.environment);
        
        for(let publication of publications) {
            await publication.deployContent(this.id);
        }
    }
    
    /**
     * Unpublishes this content
     */
    async unpublish() {
        let publications = await HashBrown.Entity.Resource.Publication.list(this.context.project, this.context.environment);
        
        for(let publication of publications) {
            await publication.redactContent(this.id);
        }
    }

    /**
     * Gets parent content
     *
     * @returns {HashBrown.Entity.Resource.Content} Parent
     */
    async getParent() {
        if(!this.parentId) { return null; }

        return await this.constructor.get(this.context.project, this.context.environment, this.parentId);
    }
    
    /**
     * Checks whether a content node is a descendant of another one
     *
     * @param {String} ancestorId
     *
     * @return {Boolean} Is descendant
     */
    async isDescendantOf(ancestorId) {
        checkParam(ancestorId, 'ancestorId', String, true);
        
        let allContent = await this.constructor.list(this.context.project, this.context.environment) || [];
        
        let map = {};

        for(let content of allContent) {
            map[content.id] = content;
        }

        if(!map[this.id]) { return false; }

        let parentId = map[this.id].parentId;

        while(parentId && map[parentId]) {
            if(parentId === ancestorId) { return true; }

            parentId = map[parentId].parentId;
        }

        return false;
    }
    
    /**
     * Gets children
     *
     * @param {Array} excludeIds
     *
     * @return {Array} Children
     */
    async getChildren(excludeIds = []) {
        checkParam(excludeIds, 'excludeIds', Array);
        
        let result = await HashBrown.Service.DatabaseService.find(
            this.context.project,
            this.context.environment + '.content',
            {
                parentId: this.id
            },
            {},
            {
                sort: 1
            }
        );
        
        let children = [];

        for(let child of result) {
            if(excludeIds && excludeIds.indexOf(child.id) > -1) { continue; }

            child = this.constructor.new(child);

            children.push(child);
        }

        return children;
    }
    
    /**
     * Gets orphans (root items)
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {Array} excludeIds
     *
     * @return {Array} Orphans
     */
    static async getOrphans(projectId, environment, excludeIds = []) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(excludeIds, 'excludeIds', Array);
        
        let result = await HashBrown.Service.DatabaseService.find(
            projectId,
            environment + '.content',
            {
                parentId: ''
            },
            {},
            {
                sort: 1
            }
        );
        
        let orphans = [];

        for(let orphan of result) {
            if(excludeIds && excludeIds.indexOf(orphan.id) > -1) { continue; }

            orphan = this.new(orphan);

            orphans.push(orphan);
        }

        return orphans;
    }
    
    /**
     * Inserts content before/after another node
     *
     * @param {HashBrown.Entity.User} user
     * @param {String} parentId
     * @param {Number} position
     */
    async insert(user, parentId, position) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(parentId, 'parentId', String);
        checkParam(position, 'position', Number, true);
        
        // Get siblings
        let parent = null;
        let siblings = [];
       
        if(parentId) {
            parent = await this.constructor.get(this.context.project, this.context.environment, parentId);
        
            if(parent) {
                siblings = await parent.getChildren();
            }
        
        } else {
            siblings = await this.constructor.getOrphans(this.context.project, this.context.environment);

        }

        // Check parent id for errors
        if(parent) {
            if(parent.id === this.id) { throw new Error('Content cannot be a parent of itself'); }

            let isAllowed = await parent.isSchemaAllowedAsChild(this.schemaId);

            if(!isAllowed) { throw new Error('This type of content is not allowed here'); }

            let isDescendant = await parent.isDescendantOf(this.id); 
            
            if(isDescendant) { throw new Error('Content cannot be a child of its own descendants'); }
        }

        // Assign the new position
        let result = [];
        
        if(position < 0) { position = 0; }
      
        for(let i = 0; i < siblings.length; i++) {
            if(siblings[i].id === contentId) { continue; }

            if(i === position) {
                result.push(content);
            }

            result.push(siblings[i]);
        }

        if(result.indexOf(content) < 0) {
            result.push(content);
        }

        // Update all nodes with their new sort index
        for(let i = 0; i < result.length; i++) {
            await HashBrown.Service.DatabaseService.updateOne(
                this.context.project,
                this.context.environment + '.content',
                {
                    id: result[i].id
                },
                {
                    sort: i,
                    parentId: parentId
                }
            );
        }
    }

    /**
     * Gets a nested list of dependencies
     *
     * @return {Object} Dependencies
     */
    async getDependencies() {
        let schema = await HashBrown.Entity.Resource.ContentSchema.get(this.context.project, this.context.environment, this.schemaId);

        if(!schema) {
            throw new Error(`Schema ${this.schemaId} could not be found`);
        }

        let dependencies = {
            content: {},
            schemas: {},
            media: {}
        };

        dependencies.schemas[schema.id] = schema;

        let schemaDependencies = await schema.getDependencies();

        for(let id in schemaDependencies.schemas) {
            dependencies.schemas[id] = schemaDependencies.schemas[id];
        }

        let content = this;

        while(content) {
            content = content.parentId ? await this.constructor.get(this.context.project, this.context.environment, content.parentId) : null;

            if(!content) { break; }

            dependencies.content[content.id] = content;
        }

        return dependencies;
    }

    /**
     * Performs a series of unit test
     *
     * @param {HashBrown.Entity.User} user
     * @param {HashBrown.Entity.Project} project
     * @param {Function} report
     */
    static async test(user, project, report) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(project, 'project', HashBrown.Entity.Project, true);
        checkParam(report, 'report', Function, true);
        
        report('Create content');
        
        let content = await HashBrown.Entity.Resource.Content.create(user, project.id, 'live', { schemaId: 'contentBase', title: 'Test content' });
            
        report(`Get content ${content.getName()}`);
        
        content = await HashBrown.Entity.Resource.Content.get(project.id, 'live', content.id);
            
        report(`Update content ${content.getName()}`);
       
        content.properties.title += ' (updated)';
        await content.save(user);
            
        report('Get all content');
        
        await HashBrown.Entity.Resource.Content.list(project.id, 'live');
        
        report(`Remove content ${content.getName()}`);
        
        await content.remove(user);
    }
}

module.exports = Content;
