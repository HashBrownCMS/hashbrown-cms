'use strict';

/**
 * The base class for schemas
 */
class SchemaBase extends require('Common/Entity/Resource/Schema') {
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

        for(let i in list) {
            if(list[i].type === 'field') {
                list[i] = new HashBrown.Entity.Resource.FieldSchema(list[i]);

            } else if(list[i].type === 'content') {
                list[i] = new HashBrown.Entity.Resource.ContentSchema(list[i]);

            } else {
                list[i] = new HashBrown.Entity.Resource.SchemaBase(list[i]);

            }
        }

        return list;
    }
}

module.exports = SchemaBase;
