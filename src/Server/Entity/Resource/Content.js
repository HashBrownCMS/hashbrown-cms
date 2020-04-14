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
     * @param {HashBrown.Entity.Context} context
     * @param {Object} data
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async create(context, data = {}, options = {}) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(data, 'data', Object, true);
        checkParam(data.schemaId, 'data.schemaId', String, true);
        checkParam(options, 'options', Object, true);

        let siblings = []

        if(data.parentId) {
            let parent = await this.get(context, data.parentId);
            
            if(!parent) {
                throw new Error(`Parent content ${data.parentId} could not be found`);
            }
            
            let parentSchema = await HashBrown.Entity.Resource.ContentSchema.get(context, parent.schemaId);
           
            if(!parentSchema) {
                throw new Error(`Schema ${parent.schemaId} for parent content ${data.parentId} could not be found`);
            }

            if(parentSchema.allowedChildSchemas.indexOf(data.schemaId) < 0) {
                throw new Error('This type of content is not allowed here');
            }

            siblings = await parent.getChildren();

        } else {
            siblings = await this.getOrphans(context);    

        }

        if(siblings.length < 1) {
            data.sort = 1;
        } else {
            data.sort = (siblings.pop().sort || siblings.length - 1) + 1;
        }
        
        return await super.create(context, data, options);
    }
    
    /**
     * Removes this entity
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Object} options
     */
    async remove(context, options = {}) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(options, 'options', Object, true);
        
        let children = await this.getChildren();

        for(let child of children) {
            if(options.removeChildren) {
                await child.remove(options);
            
            } else {
                child.parentId = this.parentId;
                await child.save();
            
            }
        }

        await this.unpublish();

        await super.remove(options);
    }
    
    /**
     * Saves the current state of this entity
     *
     * @param {Object} options
     */
    async save(options = {}) {
        checkParam(options, 'options', Object, true);

        if(!this.schemaId) {
            throw new Error('Schema id is required');
        }

        await super.save(options);

        if(this.isPublished) {
            await this.publish();
        } else {
            await this.unpublish();
        }
            
        // Update publish task
        let publishTask = await HashBrown.Entity.Task.get(this.context, this.id, 'publish');

        if(!this.isPublished && this.publishOn) {
            if(!publishTask) {
                publishTask = await HashBrown.Entity.Task.create(this.context, this.id, 'publish');
            }
            
            publishTask.date = new Date(this.publishOn);

            await publishTask.save();
        
        } else if(publishTask) {
            await publishTask.remove();

        }

        // Update unpublish task
        let unpublishTask = await HashBrown.Entity.Task.get(this.context, this.id, 'unpublish');

        if(this.isPublished && this.unpublishOn) {
            if(!unpublishTask) {
                unpublishTask = await HashBrown.Entity.Task.create(this.context, this.id, 'unpublish');
            }

            unpublishTask.date = new Date(this.unpublishOn);

            await unpublishTask.save();
        
        } else if(unpublishTask) {
            await unpublishTask.remove();

        }

        // Clear publication cache
        let publications = await HashBrown.Entity.Resource.Publication.list(this.context);

        for(let publication of publications) {
            await publication.clearCache();
        }
    }

    /**
     * Publishes this content
     */
    async publish() {
        let publications = await HashBrown.Entity.Resource.Publication.list(this.context);
        
        for(let publication of publications) {
            await publication.deployContent(this.id);
        }
    }
    
    /**
     * Unpublishes this content
     */
    async unpublish() {
        let publications = await HashBrown.Entity.Resource.Publication.list(this.context);
        
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

        return await this.constructor.get(this.context, this.parentId);
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
        
        let allContent = await this.constructor.list(this.context) || [];
        
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
            this.context.project.id,
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

            child.context = this.context;

            child = this.constructor.new(child);

            children.push(child);
        }

        return children;
    }
    
    /**
     * Gets orphans (root items)
     *
     * @param {HashBrown.Entity.Context} context
     *
     * @return {Array} Orphans
     */
    static async getOrphans(context, excludeIds = []) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
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

            orphan.context = context;

            orphan = this.new(orphan);

            orphans.push(orphan);
        }

        return orphans;
    }
    
    /**
     * Inserts content before/after another node
     *
     * @param {String} parentId
     * @param {Number} position
     */
    async insert(parentId, position) {
        checkParam(parentId, 'parentId', String);
        checkParam(position, 'position', Number, true);
        
        // Get siblings
        let parent = null;
        let siblings = [];
       
        if(parentId) {
            parent = await this.constructor.get(this.context, parentId);
        
            if(parent) {
                siblings = await parent.getChildren();
            }
        
        } else {
            siblings = await this.constructor.getOrphans(this.context);

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
                this.context.project.id,
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
     * Performs a series of unit test
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Function} report
     */
    static async test(context, report) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(report, 'report', Function, true);
        
        report('Create content');
        
        let content = await this.create(context, { schemaId: 'contentBase', title: 'Test content' });
            
        report(`Get content ${content.getName()}`);
        
        content = await this.get(context, content.id);
            
        report(`Update content ${content.getName()}`);
       
        content.properties.title += ' (updated)';
        await content.save();
            
        report('Get all content');
        
        await this.list(context);
        
        report(`Remove content ${content.getName()}`);
        
        await content.remove();
    }
}

module.exports = Content;
