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
    async remove(options = {}) {
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

        if(this.publishOn) {
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

        if(this.unpublishOn) {
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
     * @param {HashBrown.Entity.Resource.Content} ancestor
     *
     * @return {Boolean} Is descendant
     */
    async isDescendantOf(ancestor) {
        checkParam(ancestor, 'ancestor', HashBrown.Entity.Resource.Content, true);
        
        let allContent = await this.constructor.list(this.context) || [];
        
        let map = {};

        for(let content of allContent) {
            map[content.id] = content;
        }

        if(!map[this.id]) { return false; }

        let parentId = map[this.id].parentId;

        while(parentId && map[parentId]) {
            if(parentId === ancestor.id) { return true; }

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
        
        let allContent = await this.constructor.list(this.context);
        let children = [];

        for(let content of allContent) {
            if(content.parentId !== this.id) { continue; }
            if(excludeIds && excludeIds.indexOf(content.id) > -1) { continue; }

            content.context = this.context;
            children.push(content);
        }

        return children;
    }
    
    /**
     * Gets whether this content is allowed at the root
     *
     * @return {Boolean} Is allowed at root
     */
    async isAllowedAtRoot() {
        let schema = await HashBrown.Entity.Resource.ContentSchema.get(this.context, this.schemaId);

        if(!schema) { return false; }

        return schema.isAllowedAtRoot !== false;
    }

    /**
     * Gets orphans (root items)
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Array} excludeIds
     *
     * @return {Array} Orphans
     */
    static async getOrphans(context, excludeIds = []) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(excludeIds, 'excludeIds', Array);
        
        let allContent = await this.list(context);
        let orphans = [];

        for(let content of allContent) {
            if(content.parentId) { continue; }
            if(excludeIds && excludeIds.indexOf(content.id) > -1) { continue; }

            content.context = context;
            orphans.push(content);
        }

        return orphans;
    }
    
    /**
     * Inserts content before/after another node
     *
     * @param {HashBrown.Entity.Resource.Content} parent
     * @param {Number} position
     */
    async insert(parent, position) {
        checkParam(parent, 'parent', HashBrown.Entity.Resource.Content);
        checkParam(position, 'position', Number, true);
        
        // Get siblings
        let siblings = [];
       
        if(parent) {
            siblings = await parent.getChildren();
        
        } else {
            siblings = await this.constructor.getOrphans(this.context);

        }

        // Check parent id for errors
        if(parent) {
            if(parent.id === this.id) { throw new Error('Content cannot be a parent of itself'); }

            let isAllowed = await this.isAllowedAsChildOf(parent);

            if(!isAllowed) { throw new Error('This type of content is not allowed here'); }

            let isDescendant = await parent.isDescendantOf(this); 
            
            if(isDescendant) { throw new Error('Content cannot be a child of its own descendants'); }

        // Check if allowed at root
        } else {
            let isAllowed = await this.isAllowedAtRoot();

            if(!isAllowed) { throw new Error('This type of content is not allowed here'); }
        }

        // Assign the new position
        let result = [];
        
        if(position < 0) { position = 0; }
      
        for(let i = 0; i < siblings.length; i++) {
            if(siblings[i].id === this.id) { continue; }

            if(i === position) {
                result.push(this);
            }

            result.push(siblings[i]);
        }

        if(result.indexOf(this) < 0) {
            result.push(this);
        }

        // Update all nodes with their new sort index
        for(let i = 0; i < result.length; i++) {
            if(result[i].isLocked) { continue; }

            result[i].sort = i;
            result[i].parentId = parent ? parent.id : null;

            await result[i].save();
        }
    }

    /**
     * Checks if a schema type is allowed as a child of this content
     *
     * @param {HashBrown.Entity.Resource.Content} content
     *
     * @returns {Boolean} Is the schema allowed as a child
     */
    async isAllowedAsChildOf(parent) {
        checkParam(parent, 'parent', HashBrown.Entity.Resource.Content, true);

        let schema = await HashBrown.Entity.Resource.ContentSchema.get(this.context, parent.schemaId);

        if(!schema) { return false; }

        return schema.allowedChildSchemas.indexOf(this.schemaId) > -1;
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
