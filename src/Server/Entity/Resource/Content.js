'use strict';

/**
 * The server-side content model
 *
 * @memberof HashBrown.Server.Entity.Resource
 */
class Content extends require('Common/Entity/Resource/Content') {
    /**
     * Gets settings
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} key
     *
     * @returns {Promise} settings
     */
    getSettings(project, environment, key) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(key, 'key', String);

        let parentContent = await this.getParent(project, environment);

        // Loop through parents to find governing setting
        while(parentContent != null) {
            parentContent.settingsSanityCheck(key);

            // We found a governing parent, return those settings
            if(parentContent.settings[key].applyToChildren) {
                let settings = parentContent.settings;

                settings[key].governedBy = parentContent.id;

                return settings[key];
            }

            parentContent = await parentContent.getParent(project, environment);
        }
    
        this.settingsSanityCheck(key);

        return this.settings[key];
    }
    
    /**
     * Creates a new instance of this entity type
     *
     * @param {String} project
     * @param {String} environment
     * @param {Object} data
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async create(project, environment, data = {}, options = {}) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(data, 'data', Object, true);
        checkParam(data.schemaId, 'data.schemaId', String, true);
        checkParam(options, 'options', Object, true);

        if(data.parentId) {
            let parent = this.get(project, environment, data.parentId);
            let isAllowed = parent.isSchemaAllowedAsChild(project, environment, data.schemaId);
            
            if(!isAllowed) { throw new Error('This type of content is not allowed here'); }

            let siblings = await parent.getChildren();

            if(siblings.length < 1) {
                data.sort = 1;
            } else {
                data.sort = (siblings.pop().sort || siblings.length - 1) + 1;
        }

        return await super.create(project, environment, data, options);
    }
    
    /**
     * Removes this entity
     *
     * @param {String} project
     * @param {String} environment
     * @param {Object} options
     */
    async remove(project, environment, options = {}) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);
        
        let children = await this.getChildren(project, environment);

        for(let child of children) {
            if(options.removeChildren) {
                await child.remove(project, environment, options);
            
            } else {
                child.parentId = this.parentId;
                await child.save(project, environment);
            
            }
        }

        await.this.unpublish(project, environment);

        await super.remove(project, environment, options);
    }
    
    /**
     * Saves the current state of this entity
     *
     * @param {String} project
     * @param {String} environment
     * @param {Object} options
     */
    async save(project, environment, options = {}) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);

        if(!this.schemaId) {
            throw new Error('Schema id is required');
        }

        await super.save(project, environment, options);

        if(this.isPublished) {
            await this.publish(project, environment);
        } else {
            await.this.unpublish(project, environment);
        }
    }

    /**
     * Publishes this content
     *
     * @param {String} project
     * @param {String} environment
     */
    async publish(project, environment, options = {}) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);

        let settings = await this.getSettings(project, environment, 'publishing');
        
        if(!settings.connectionId) { return; }

        let connection = await HashBrown.Entity.Resource.Connection.get(settings.connectionId);

        if(!connection) {
            throw new Error(`Publishing connection ${settings.connectionId} not found)`;
        }

        await connection.publishContent(project, environment, this); 
    }
    
    /**
     * Unpublishes this content
     *
     * @param {String} project
     * @param {String} environment
     */
    async unpublish(project, environment, options = {}) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);

        let settings = await this.getSettings(project, environment, 'publishing');
        
        if(!settings.connectionId) { return; }

        let connection = await HashBrown.Entity.Resource.Connection.get(settings.connectionId);

        if(!connection) {
            throw new Error(`Publishing connection ${settings.connectionId} not found)`;
        }

        await connection.unpublishContent(project, environment, this); 
    }

    /**
     * Gets parent content
     *
     * @returns {HashBrown.Entity.Resource.Content} Parent
     */
    async getParent(project, environment) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        
        if(!this.parentId) { return null; }

        return await this.constructor.get(project, environment, this.parentId);
    }
    
    /**
     * Checks whether a content node is a descendant of another one
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} ancestorId
     *
     * @return {Boolean} Is descendant
     */
    async isDescendantOf(project, environment, ancestorId) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(ancestorId, 'ancestorId', String, true);
        
        let allContent = await this.constructor.list(project, environment) || [];
        
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
     * @param {String} project
     * @param {String} environment
     * @param {Array} excludeIds
     *
     * @return {Array} Children
     */
    async getChildren(project, environment, excludeIds = []) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(excludeIds, 'excludeIds', Array);
        
        let result = await HashBrown.Service.DatabaseService.find(
            project,
            environment + '.content',
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

            child = new this.constructor(child);

            children.push(child);
        }

        return children;
    }
    
    /**
     * Gets orphans (root items)
     *
     * @param {String} project
     * @param {String} environment
     * @param {Array} excludeIds
     *
     * @return {Array} Orphans
     */
    static async getOrphans(project, environment, excludeIds = []) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(excludeIds, 'excludeIds', Array);
        
        let result = await HashBrown.Service.DatabaseService.find(
            project,
            environment + '.content',
            {
                parentId: null
            },
            {},
            {
                sort: 1
            }
        );
        
        let orphans = [];

        for(let orphan of result) {
            if(excludeIds && excludeIds.indexOf(orphan.id) > -1) { continue; }

            oprhan = new this.constructor(orphan);

            orphans.push(orphan);
        }

        return orphans;
    }
    
    /**
     * Inserts content before/after another node
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} parentId
     * @param {Number} position
     */
    async insert(project, environment, parentId, position, user) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(parentId, 'parentId', String);
        checkParam(position, 'position', Number, true);
        checkParam(user, 'user', HashBrown.Entity.Resource.User, true);
        
        // Get siblings
        let parent = null;
        let siblings = [];
       
        if(parentId) {
            parent = await this.constructor.get(project, environment, parentId);
        
            if(parent) {
                siblings = await parent.getChildren(project, environment, parentId);
            }
        
        } else {
            siblings = await this.constructor.getOrphans(project, environment);

        }

        // Check parent id for errors
        if(parent) {
            if(parent.id === this.id) { throw new Error('Content cannot be a parent of itself'); }

            let isAllowed = await parent.isSchemaAllowedAsChild(project, environment, this.schemaId);

            if(!isAllowed) { throw new Error('This type of content is not allowed here'); }

            let isDescendant = await parent.isDescendantOf(project, environment, this.id); 
            
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
                project,
                environment + '.content',
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
}

module.exports = Content;
