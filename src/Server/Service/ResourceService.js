'use strict';

/**
 * The unified service for resources
 */
class ResourceService {
    /**
     * Gets all resource models
     *
     * @return {Array} Models
     */
    static getAllResourceModels(namespace = true, models = []) {
        if(namespace === true) {
            namespace = HashBrown.Entity.Resource;
        }

        if(!namespace) { return models; }

        for(let name in namespace) {
            let model = namespace[name];

            if(model instanceof HashBrown.Entity.Resource.ResourceBase === false) {
                if(model instanceof HashBrown.Entity.EntityBase) {
                    continue;
                
                } else if(model instanceof Object) {
                    this.getAllResourceModels(model, models);
                
                } else {
                    continue;
                
                }
            }
            
            if(models.indexOf(model) > -1) { continue; }

            models.push(model);
        }

        return models;
    }

    /**
     * Gets a model by category
     *
     * @param {String} category
     * @param {Object} data
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Resource
     */
    static getModelForCategory(category, data) {
        checkParam(category, 'category', String, true);
        checkParam(data, 'data', Object, true);

        let models = this.getAllResourceModels();
        
        for(let model of models) {
            if(model.category === category) {
                if(data) {
                    return new model(data);
                } 
                
                return model;
            }
        }

        throw new Error(`No resource model found for category "${category}"`);
    }

    /**
     * Gets all resources
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} category
     *
     * @return {Array} Resources
     */
    static async getAllResources(project, environment, category) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(category, 'category', String, true);

        let collection = environment + '.' + category;
        let resources = await HashBrown.Service.DatabaseService.find(project, collection, {}, {}, { sort: 1 });

        resources = await HashBrown.Service.SyncService.mergeResource(project, environment, category, resources);

        for(let i in resources) {
            resources[i] = this.getModelForCategory(category, resources[i]);
        }

        return resources;
    }

    /**
     * Gets a resource by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Boolean} localOnly
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Resource
     */
    static async getResourceById(project, environment, category, id, localOnly = false) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);
        checkParam(localOnly, 'localOnly', Boolean);

        let resource = await HashBrown.Service.DatabaseService.findOne(project, environment + '.' + category, { id: id });

        if(!resource && !localOnly) {
            resource = await HashBrown.Service.SyncService.getResourceItem(project, environment, category, id);
        }

        if(!resource) { return null; }

        return this.getModelForCategory(category, resource);
    }
   
    /**
     * Checks if a resource is locked
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} category
     * @param {String} id
     *
     * @return {Boolean} Is locked
     */
    static async isResourceLocked(project, environment, category, id) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);
       
        let resource = await this.getResourceById(project, environment, category, id, true);

        return !resource || resource.isLocked;
    }

    /**
     * Sets a resource by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} category
     * @param {String} id
     * @param {Object} data
     * @param {Boolean} create
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Modified resource
     */
    static async setResourceById(project, environment, category, id, data, create = false) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(category, 'id', String, true);
        checkParam(id, 'id', String, true);
        checkParam(data, 'data', Object, true);

        // Check if resource is locked
        let isLocked = this.isResourceLocked(project, environment, category, id);

        if(isLocked) {
            throw new Error(`Resource ${id} is locked`);
        }

        // Check for empty data
        if(!data || Object.keys(data).length < 1) {
            throw new Error(`Data submitted to resource ${id} is empty`);
        }

        // Unset automatic flags
        data.isLocked = false;

        data.sync = {
            isRemote: false,
            hasRemote: false
        };

        // Insert into database
        await HashBrown.Service.DatabaseService.updateOne(
            project,
            environment + '.' + category,
            {
                id: id
            },
            data,
            {
                upsert: create
            }
        );

        return this.getModelForCategory(category, data);
    }
    
    /**
     * Creates a new resource
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} category
     * @param {Object} data
     *
     * @return {Content} New resource
     */
    static async createResource(project, environment, category, data) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(category, 'id', String, true);
        checkParam(data, 'data', Object, true);

        let model = this.getModelForCategory(category);
        let resource = model.create(data);
        let collection = environment + '.' + category;

        await HashBrown.Service.DatabaseService.insertOne(project, collection, resource.getObject());

        return resource;
    }
   
    /**
     * Removes a resource
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} category
     * @param {String} id
     *
     * @return {Promise} promise
     */
    static async removeResourceById(project, environment, category, id) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(category, 'category', String);
        checkParam(id, 'id', String);

        let collection = environment + '.' + category;

        await HashBrown.Service.DatabaseService.removeOne(project, collection, { id: id });
    }
}

module.exports = ResourceService;
