'use strict';

const FileSystem = require('fs');
const Path = require('path');

/**
 * The Media controller
 *
 * @memberof HashBrown.Server.Controller
 */
class MediaController extends HashBrown.Controller.ResourceController {
    static get category() { return 'media'; }

    /**
     * Routes
     */
    static routes() {
        return {
            ...super.routes,
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
        };
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
     * @example POST /api/${project}/${environment}/media/new
     */
    static async new(request, params, body, query, user) {
        let resources = [];

        for(let file of body.files) {
            let media = await HashBrown.Entity.Resource.Media.create(params.project, params.environment, file);

            resources.push(media);
        }

        return new HttpResponse(resources);
    }
}

module.exports = MediaController;
