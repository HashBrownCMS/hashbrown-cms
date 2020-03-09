'use strict';

/**
 * The base class for schemas
 *
 * @memberof HashBrown.Server.Entity.Resource
 */
class SchemaBase extends require('Common/Entity/Resource/SchemaBase') {
    /**
     * Creates a new instance of this entity type
     *
     * @param {HashBrown.Entity.User} user
     * @param {String} project
     * @param {String} environment
     * @param {Object} data
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async create(user, project, environment, data = {}, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(data, 'data', Object, true);
        checkParam(data.parentId, 'data.parentId', String, true);
        checkParam(options, 'options', Object, true);

        let parent = this.get(project, environment, data.parentId, { withParentFields: true });

        if(!parent) {
            throw new Error(`Parent schema ${data.parentId} could not be found`);
        }

        if(parent.constructor !== this) {
            throw new Error(`Parent schema ${data.parentId} does not match schema type`);
        }

        return await super.create(user, project, environment, data, options);
    }
    
    /**
     * Gets a schema by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Schema.SchemaBase} Schema
     */
    static async get(project, environment, id, options = {}) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(id, 'id', String, true);
        checkParam(options, 'options', Options, true);

        let data = null;

        if(!options.customOnly) {
            let corePath = Path.join(APP_ROOT, 'schema', '*', id + '.json');
            let corePaths = await HashBrown.Service.FileService.list(corePath);
            
            let pluginPath = Path.join(APP_ROOT, 'plugins', '*', 'schema', '*', id + '.json');
            let pluginPaths = await HashBrown.Service.FileService.list(pluginPath);
            let schemaPath = corePaths[0] || pluginPaths[0];
       
            if(schemaPath) {
                data = await HashBrown.Service.FileService.read(schemaPath);
                data = JSON.parse(data);

                let parentDirName = Path.dirname(schemaPath).split('/').pop();

                data.id = id;
                data.type = parentDirName.toLowerCase();
                data.isLocked = true;
            }
        }
        
        if(!data && !options.nativeOnly) {
            data = await HashBrown.Service.DatabaseService.findOne(
                project,
                environment + '.schemas',
                {
                    id: id
                }
            );
        }

        if(!data && !options.localOnly && !options.nativeOnly) {
            data = await HashBrown.Service.SyncService.getResourceItem(project, environment, 'schemas', id);
        }

        // Get parent fields if specified
        if(data && query.withParentFields && data.parentSchemaId) {
            let childSchema = data;
            let mergedSchema = childSchema;

            while(childSchema.parentSchemaId) {
                let parentSchema = await this.get(project, environment, childSchema.parentSchemaId);
                
                mergedSchema = this.merge(mergedSchema, parentSchema);

                childSchema = parentSchema;
            }
            
            data = mergedSchema;
        }
            
        if(data.type === 'field') {
            return new HashBrown.Entity.Resource.FieldSchema(data);
        
        } else if(data.type === 'content') {
            return new HashBrown.Entity.Resource.ContentSchema(data);
        
        } else {
            return new HashBrown.Entity.Resource.SchemaBase(data);
        
        }
    }
    
    /**
     * Gets a list of instances of this entity type
     *
     * @param {String} project
     * @param {String} environment
     * @param {Object} options
     *
     * @return {Array} Instances
     */
    static async list(project, environment, options = {}) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);
  
        let list = [];
        let type = undefined;
        
        if(this === HashBrown.Entity.Resource.ContentSchema) {
            type = 'content';

        } else if(this === HashBrown.Entity.Resource.FieldSchema) {
            type = 'field';
        
        }

        if(!options.customOnly) {
            let corePath = Path.join(APP_ROOT, 'schema', '*', '*.json');
            let corePaths = await HashBrown.Service.FileService.list(corePath);
            
            let pluginPath = Path.join(APP_ROOT, 'plugins', '*', 'schema', '*', '*.json');
            let pluginPaths = await HashBrown.Service.FileService.list(pluginPath);

            for(let schemaPath of corePaths.concat(pluginPaths)) {
                let data = await HashBrown.Service.FileService.read(schemaPath);

                data = JSON.parse(data);

                let parentDirName = Path.dirname(schemaPath).split('/').pop();
                
                data.id = Path.basename(schemaPath, '.json');
                data.type = parentDirName.toLowerCase();
                data.isLocked = true;

                list.push(data);
            }
        }

        if(!options.nativeOnly) {
            let custom = await HashBrown.Service.DatabaseService.find(
                options.project,
                environment + '.schemas',
                {},
                {}
            );

            list = list.concat(custom);
        }

        if(!options.localOnly) {
            list = await HashBrown.Service.SyncService.mergeResource(
                project,
                environment,
                'schemas',
                list
            );
        }

        for(let i = list.length - 1; i>= 0; i--) {
            if(list[i].type !== type) {
                delete list[i];
                continue;
            }

            list[i] = new this(list[i]);
        }

        return list;
    }
}

module.exports = SchemaBase;
