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
        checkParam(data.parentId, 'data.parentId', String, true);
        checkParam(options, 'options', Object, true);

        let parent = await this.get(projectId, environment, data.parentId, { withParentFields: true });

        if(!parent) {
            throw new Error(`Parent schema ${data.parentId} could not be found`);
        }

        data.defaultTabId = parent.defaultTabId;
        data.customIcon = parent.icon;
        data.type = parent.type;

        return await super.create(user, projectId, environment, data, options);
    }
    
    /**
     * Gets a schema by id
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {String} id
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Schema.SchemaBase} Schema
     */
    static async get(projectId, environment, id, options = {}) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
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

                data.context = {
                    project: projectId,
                    environment: environment
                };

                resource = this.new(data);
            }
        }

        // Then attempt normal fetch
        if(!resource && !options.nativeOnly) {
            resource = await super.get(projectId, environment, id, options);
        }
        
        if(!resource) { return null; }

        // Get parent fields, if specified
        if(options.withParentFields && resource.parentId) {
            let parent = await this.get(projectId, environment, resource.parentId, options);
           
            if(parent) {
                resource = this.merge(resource, parent);
            }
        }
     
        return resource;
    }
    
    /**
     * Gets a list of instances of this entity type
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {Object} options
     *
     * @return {Array} Instances
     */
    static async list(projectId, environment, options = {}) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
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
                let data = await HashBrown.Service.FileService.read(schemaPath);

                data = JSON.parse(data);

                data.id = Path.basename(schemaPath, '.json');
                data.type = data.type || options.type || Path.basename(Path.dirname(schemaPath));
                data.isLocked = true;

                if(!data.parentId && data.id !== data.type + 'Base') {
                    data.parentId = data.type + 'Base';
                }

                data.context = {
                    project: projectId,
                    environment: environment
                };
                
                let resource = this.new(data);
                
                if(!resource) { continue; }

                list.push(resource);
            }
        }

        // Read normally
        if(!options.nativeOnly) {
            let custom = await super.list(projectId, environment, options);

            list = list.concat(custom);
        }

        // Remove all schemas without a "type" value
        for(let i = list.length - 1; i >= 0 ; i--) {
            if(!list[i].type) {
                list.splice(i, 1);
            }
        }

        return list;
    }
    
    /**
     * Gets a nested list of dependencies
     *
     * @return {Object} Dependencies
     */
    async getDependencies() {
        let dependencies = {
            schemas: {}
        };

        // NOTE: The quickest way to find all schema references is
        // to stringify this schema and look up keywords, since they can be nested infinitely
        let string = JSON.stringify(this);

        let schemaIds = [];
        let schemaIdRegex = /"schemaId": "([^"]+)"/;
        let schemaIdMatch = schemaIdRegex.exec(string);

        while(schemaIdMatch && schemaIdMatch[1]) {
            if(!schemaIds.indexOf(schemaIdMatch[1]) < 0) {
                schemaIds.push(schemaIdMatch[1]);
            }

            schemaIdMatch = schemaIdRegex.exec(string);
        }
        
        let allowedSchemasRegex = /"allowedSchemas": \[([^\]]+)\]/;
        let allowedSchemasMatch = allowedSchemasRegex.exec(string);

        while(allowedSchemasMatch && allowedSchemasMatch[1]) {
            schemaIds = schemaIds.concat(JSON.parse(allowedSchemasMatch[1]));

            allowedSchemasMatch = allowedSchemasRegex.exec(string);
        }
        
        // Recurse up through parents
        let schema = this;

        while(schema) {
            schema = schema.parentId ? await this.constructor.get(this.context.project, this.context.environment, schema.parentId) : null;

            if(!schema) { break; }

            if(!dependencies.schemas[schema.id]) {
                dependencies.schemas[schema.id] = schema;
            }

            let parentDependencies = await schema.getDependencies();

            schemaIds = schemaIds.concat(Object.keys(parentDependencies.schemas));
        }

        // Load all schema dependencies
        for(let id of schemaIds) {
            if(dependencies.schemas[id]) { continue; }

            let schema = await this.constructor.get(id);

            if(!schema) { continue; }

            dependencies.schemas[schema.id] = schema;
        }

        return dependencies;
    }
}

module.exports = SchemaBase;
