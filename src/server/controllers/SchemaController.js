'use strict';

// Classes
let ApiController = require('./ApiController');

/**
 * The Controller for Schemas
 */
class SchemaController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/schemas', this.middleware(), this.getSchemas);
        app.get('/api/:project/:environment/schemas/:id', this.middleware(), this.getSchema);
        
        app.post('/api/:project/:environment/schemas/pull/:id', this.middleware(), this.pullSchema);
        app.post('/api/:project/:environment/schemas/push/:id', this.middleware(), this.pushSchema);
        app.post('/api/:project/:environment/schemas/new', this.middleware({scope: 'schemas'}), this.createSchema);
        app.post('/api/:project/:environment/schemas/:id', this.middleware({scope: 'schemas'}), this.setSchema);
        
        app.delete('/api/:project/:environment/schemas/:id', this.middleware({scope: 'schemas'}), this.deleteSchema);
    }        
    
    /**
     * Get a list of all Schemas
     */
    static getSchemas(req, res) {
        let getter = req.query.customOnly ? 
            SchemaHelper.getCustomSchemas :
            SchemaHelper.getAllSchemas;

        getter(req.project, req.environment)
        .then((schemas) => {
            res.status(200).send(schemas);
        })
        .catch((e) => {
            res.status(502).send(SchemaController.printError(e));
        });
    }
    
    /**
     * Get a Schema by id
     */
    static getSchema(req, res) {
        let id = req.params.id;
        let getter = req.query.withParentFields ? 
            SchemaHelper.getSchemaWithParentFields :
            SchemaHelper.getSchemaById;

        getter(req.project, req.environment, id)    
        .then((schema) => {
            res.status(200).send(schema);
        })
        .catch((e) => {
            res.status(502).send(SchemaController.printError(e));
        });
    }
    
    /**
     * Set a Schema by id
     */
    static setSchema(req, res) {
        let id = req.params.id;
        let schema = req.body;
        let shouldCreate = req.query.create == 'true' || req.query.create == true;

        SchemaHelper.setSchema(req.project, req.environment, id, schema, shouldCreate)
        .then(() => {
            res.status(200).send(schema);
        })
        .catch((e) => {
            res.status(502).send(SchemaController.printError(e));
        });
    }
    
    /**
     * Pulls Schema by id
     */
    static pullSchema(req, res) {
        let id = req.params.id;

        SyncHelper.getResourceItem(req.project, req.environment, 'schemas', id)
        .then((resourceItem) => {
            if(!resourceItem) { return Promise.reject(new Error('Couldn\'t find remote Schema "' + id + '"')); }
        
            return SchemaHelper.setSchema(req.project, req.environment, id, resourceItem, true)
            .then(() => {
                res.status(200).send(resourceItem);
            });
        })
        .catch((e) => {
            res.status(404).send(SchemaController.printError(e));   
        }); 
    }
    
    /**
     * Pushes Schema by id
     */
    static pushSchema(req, res) {
        let id = req.params.id;

        SchemaHelper.getSchemaById(req.project, req.environment, id)
        .then((localSchema) => {
            return SyncHelper.setResourceItem(req.project, req.environment, 'schemas', id, localSchema);
        })
        .then(() => {
            res.status(200).send(id);
        })
        .catch((e) => {
            res.status(404).send(SchemaController.printError(e));   
        }); 
    }
    
    /**
     * Creates a new Schema
     */
    static createSchema(req, res) {
        let parentSchema = req.body;

        SchemaHelper.createSchema(req.project, req.environment, parentSchema)
        .then((newSchema) => {
            res.status(200).send(newSchema.getObject());
        })
        .catch((e) => {
            res.status(502).send(SchemaController.printError(e));
        });
    }
    
    /**
     * Deletes a Schema by id
     */
    static deleteSchema(req, res) {
        let id = req.params.id;
        
        SchemaHelper.removeSchema(req.project, req.environment, id)
        .then(() => {
            res.status(200).send('Schema with id "' + id + '" deleted successfully');
        })
        .catch((e) => {
            res.status(502).send(SchemaController.printError(e));
        });
    }
}

module.exports = SchemaController;
