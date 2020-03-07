'use strict';

const FileSystem = require('fs');
const Path = require('path');

/**
 * The Media controller
 *
 * @memberof HashBrown.Server.Controller
 */
class MediaController extends HashBrown.Controller.ResourceController {
    /**
     * Initiates this controller
     */
    static init(app) {
        '/api/${project}/${environment}/media/tree': {
            handler: this.tree,
            user: {
                scope: 'media'
            }
        },
        '/api/${project}/${environment}/media/tree/${id}', {
            handler: this.treeItem,
            methods: [ 'POST' ],
            user: {
                scope: 'media'
            }
        },
        '/api/${project}/${environment}/media/${id}/rename': {
            handler: this.rename,
            methods: [ 'POST' ],
            user: {
                scope: 'media'
            }
        }
    }
    
    /**
     * @example GET /api/${project}/${environment}/media/tree
     */
    static async tree(request, params, body, query, user) {
        let tree = await HashBrown.Service.MediaService.getTree(params.project, params.environment);
            
        return new HttpResponse(tree);
    }
    
    /**
     * @example POST /api/:project/:environment/media/tree/:id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     
     * @param {Object} item
     *
     * @returns {Object} Media tree item
     */
    static async treeItem(request, params, body, query, user) {
        let id = req.params.id;
        let item = req.body;

        try {
            await HashBrown.Service.MediaService.setTreeItem(req.project, req.environment, id, item);
            
            res.status(200).send(item);
        
        } catch(e) {
            res.status(502).send(MediaController.printError(e));
        
        }
    }
    
    /**
     * @example GET /api/:project/:environment/media
     *
     * @param {String} project
     * @param {String} environment
     
     * @returns {Array} All Media nodes
     */
    static async getAll(request, params, body, query, user) {
        try {
            let connection = await HashBrown.Service.ConnectionService.getMediaProvider(req.project, req.environment);

            if(!connection) { return res.status(200).send([]); }

            let media = await connection.getAllMedia();
                
            let tree = await HashBrown.Service.MediaService.getTree(req.project, req.environment);

            for(let i in media) {
                media[i].applyFolderFromTree(tree);  
            }

            res.status(200).send(media);
        
        } catch(e) {
            res.status(404).send(MediaController.printError(e));    
        
        }
    }
    
    /**
     * @example GET /api/:project/:environment/media/:id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     
     * @returns {Media} Media
     */
    static async get(request, params, body, query, user) {
        try {
            let id = req.params.id;

            let connection = await HashBrown.Service.ConnectionService.getMediaProvider(req.project, req.environment);

            if(!connection) {
                throw new Error('No connection has been assigned as media provider');
            }

            let media = await connection.getMedia(id);
            
            if(!media) {
                throw new Error('Connection "' + connection.id + '" failed to fetch media "' + id + '"');
            }

            let tree = await HashBrown.Service.MediaService.getTree(req.project, req.environment);

            media.applyFolderFromTree(tree);

            res.status(200).send(media);
        
        } catch(e) {
            res.status(404).send(e.message);    
        
        }     
    }
    
    /**
     * @example DELETE /api/:project/:environment/media/:id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     */
    static async remove(request, params, body, query, user) {
        try {
            let id = req.params.id;

            await HashBrown.Service.MediaService.removeCachedMedia(req.project, id);

            let connection = await HashBrown.Service.ConnectionService.getMediaProvider(req.project, req.environment);

            await connection.removeMedia(id);
            
            res.sendStatus(200);
        
        } catch(e) {
            res.status(404).send(MediaController.printError(e));
        
        }    
    }
    
    /**
     * @example POST /api/:project/:environment/media/rename/:id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {String} name
     */
    static async rename(request, params, body, query, user) {
        try {
            let id = req.params.id;
            let name = req.query.name;

            await HashBrown.Service.MediaService.renameMedia(req.project, req.environment, id, name);
            
            res.status(200).send(id);

        } catch(e) {
            res.status(400).send(MediaController.printError(e));
        
        }
    }
    
    /**
     * @example POST /api/:project/:environment/media/:id { filename: 'file.png', base64: ... }
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @param {String} filename
     * @param {String} base64
     */
    static async set(request, params, body, query, user) {
        try {
            let file = req.files ? req.files[0] : null;
            
            if(!file) {
                throw new Error('No files provided');
            }

            let base64 = await HashBrown.Service.FileService.read(file.path, 'base64'); 
            let connection = await HashBrown.Service.ConnectionService.getMediaProvider(req.project, req.environment);

            await connection.setMedia(req.params.id, file.filename, base64);

            await HashBrown.Service.FileService.remove(file.path);
            await HashBrown.Service.MediaService.removeCachedMedia(req.project, req.params.id);

            res.status(200).send(req.params.id);

        } catch(e) {
            res.status(500).send(MediaController.printError(e));    

        }
    }

    /**
     * @example GET /api/:project/:environment/media/new
     *
     * @param {String} project
     * @param {String} environment
     *
     * @param {Array} files Binary Media data
     *
     * @returns {String} Created Media id
     */
    static async new(request, params, body, query, user) {
        try {
            let connection = await HashBrown.Service.ConnectionService.getMediaProvider(req.project, req.environment);
            
            let ids = [];

            for(let file of req.files) {
                let media = HashBrown.Entity.Resource.Media.create();

                let base64 = await HashBrown.Service.FileService.read(file.path, 'base64'); 

                await connection.setMedia(media.id, file.filename, base64);
            
                await HashBrown.Service.FileService.remove(file.path);
                
                ids.push(media.id);
            }

            res.status(200).send(ids);
        
        } catch(e) {
            res.status(500).send(MediaController.printError(e));    
        
        }
    }
    
    /**
     * @example POST /api/${project}/${environment}/media/${id}/heartbeat
     */
    static async heartbeat(request, params, body, query, user) {
        return new HttpResponse('Heartbeat not enabled for media', 400);
    }
   
    /**
     * @example POST /api/${project}/${environment}/${category}/{$id}/pull
     *
     * @return {Object} The pulled resource
     */
    static async pull(request, params, body, query, user) {
        return new HttpResponse('Pull not enabled for media', 400);
    }
    
    /**
     * @example POST /api/${project}/${environment}/{category}/${id}/push
     */
    static async push(request, params, body, query, user) {
        return new HttpResponse('Push not enabled for media', 400);
    }
    
    /**
     * @example GET /api/${project}/${environment}/${category}
     */
    static async resources(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        let resources = await model.list(params.project, params.environment, query);

        return new HttpResponse(resources);
    }
    
    /**
     * @example GET|POST|DELETE /api/${project}/${environment}/${category}/${id}
     */
    static async resource(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        let resource = null;

        switch(request.method) {
            case 'GET':
                resource = await model.get(params.project, params.environment, params.id, query);
                
                if(!resource) {
                    return new HttpResponse('Not found', 404);
                }
                
                return new HttpResponse(resource);
                
            case 'POST':
                resource = await model.get(params.project, params.environment, params.id, query);
                
                if(!resource) {
                    return new HttpResponse('Not found', 404);
                }
                
                resource.adopt(body);
                    
                await resource.save(params.project, params.environment, query);
                
                return new HttpResponse(updated);

            case 'DELETE':
                resource = await model.get(params.project, params.environment, params.id, query);
                
                if(!resource) {
                    return new HttpResponse('Not found', 404);
                }
                
                await resource.remove(params.project, params.environment, query);

                return new HttpResponse('OK');
        }

        return new HttpResponse('Unexpected error', 500);
    }
    
    /**
     * @example POST /api/${project}/${environment}/${category}/new
     */
    static async new(request, params, body, query, user) {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);
        let resource = await model.create(params.project, params.environment, body, query);

        return new HttpResponse(resource);
    }
}

module.exports = MediaController;
