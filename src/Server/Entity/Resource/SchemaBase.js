'use strict';

const Path = require('path');

/**
 * The base class for schemas
 *
 * @memberof HashBrown.Server.Entity.Resource
 */
class SchemaBase extends require('Common/Entity/Resource/SchemaBase') {
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
        checkParam(data.parentId, 'data.parentId', String, true);
        checkParam(options, 'options', Object, true);

        let parent = await this.get(context, data.parentId, { withParentFields: true });

        if(!parent) {
            throw new Error(`Parent schema ${data.parentId} could not be found`);
        }

        data.defaultTabId = parent.defaultTabId;
        data.customIcon = parent.icon;
        data.type = parent.type;

        return await super.create(context, data, options);
    }
    
    /**
     * Gets a schema by id
     *
     * @param {HashBrown.Entity.Context} context
     * @param {String} id
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Schema.SchemaBase} Schema
     */
    static async get(context, id, options = {}) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(id, 'id', String);
        checkParam(options, 'options', Object);

        if(!id) { return null; }

        let resource = null;

        // First attempt fetch from disk
        if(!options.customOnly) {
            let corePath = Path.join(APP_ROOT, 'schema', '*', id + '.json');
            let corePaths = await HashBrown.Service.FileService.list(corePath);
            
            let pluginPath = Path.join(APP_ROOT, 'plugins', '*', 'schema', '*', id + '.json');
            let pluginPaths = await HashBrown.Service.FileService.list(pluginPath);
            let schemaPath = corePaths[0] || pluginPaths[0];
       
            if(schemaPath) {
                let stats = await HashBrown.Service.FileService.stat(schemaPath);
                let data = await HashBrown.Service.FileService.read(schemaPath);
                data = JSON.parse(data);

                let parentDirName = Path.dirname(schemaPath).split('/').pop();

                data.id = id;
                data.type = parentDirName.toLowerCase();
                data.isLocked = true;
                data.updatedOn = stats.mtime;

                data.context = context;

                resource = this.new(data);
            }
        }

        // Then attempt normal fetch
        if(!resource && !options.nativeOnly) {
            resource = await super.get(context, id, options);
        }
        
        if(!resource) { return null; }

        // Get parent fields, if specified
        if(options.withParentFields && resource.parentId) {
            let parent = await this.get(context, resource.parentId, options);
           
            if(parent) {
                resource = this.merge(resource, parent);
            }
        }
     
        return resource;
    }
    
    /**
     * Gets a list of instances of this entity type
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Object} options
     *
     * @return {Array} Instances
     */
    static async list(context, options = {}) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(options, 'options', Object, true);
  
        let list = [];

        if(this.type && !options.type) {
            options.type = this.type;
        }

        // Read from disk
        if(!options.customOnly) {
            let corePath = Path.join(APP_ROOT, 'schema', options.type || '*', '*.json');
            let corePaths = await HashBrown.Service.FileService.list(corePath);
            
            let pluginPath = Path.join(APP_ROOT, 'plugins', '*', 'schema', options.type || '*', '*.json');
            let pluginPaths = await HashBrown.Service.FileService.list(pluginPath);

            for(let schemaPath of corePaths.concat(pluginPaths)) {
                let stats = await HashBrown.Service.FileService.stat(schemaPath);
                let data = await HashBrown.Service.FileService.read(schemaPath);

                data = JSON.parse(data);

                data.id = Path.basename(schemaPath, '.json');
                data.type = data.type || options.type || Path.basename(Path.dirname(schemaPath));
                data.isLocked = true;
                data.updatedOn = stats.mtime;

                if(!data.parentId && data.id !== data.type + 'Base') {
                    data.parentId = data.type + 'Base';
                }

                data.context = context;
                
                let resource = this.new(data);
                
                if(!resource) { continue; }

                list.push(resource);
            }
        }

        // Read normally
        if(!options.nativeOnly) {
            let custom = await super.list(context, options);

            list = list.concat(custom);
        }

        // Post process
        for(let i = list.length - 1; i >= 0 ; i--) {
            // Remove all schema without a "type" value
            if(!list[i].type) {
                list.splice(i, 1);
                continue;
            }

            // Get parent fields, if specified
            if(options.withParentFields && list[i].parentId) {
                let parent = await this.get(context, list[i].parentId, options);
               
                if(parent) {
                    list[i] = this.merge(list[i], parent);
                }
            }
        }

        return list;
    }
    
    /**
     * Saves the current state of this entity
     *
     * @param {Object} options
     */
    async save(options = {}) {
        checkParam(options, 'options', Object, true);

        await super.save(options);

        // Save children to modify their update date (this will work recursively)
        for(let child of await this.getChildren()) {
            await child.save();
        }
    }
}

module.exports = SchemaBase;
