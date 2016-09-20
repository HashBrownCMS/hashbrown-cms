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
        app.post('/api/:project/:environment/schemas/new', this.middleware({scope: 'schemas'}), this.createSchema);
        app.get('/api/:project/:environment/schemas', this.middleware(), this.getSchemas);
        app.get('/api/:project/:environment/schemas/:id', this.middleware(), this.getSchema);
        app.post('/api/:project/:environment/schemas/:id', this.middleware({scope: 'schemas'}), this.setSchema);
        app.delete('/api/:project/:environment/schemas/:id', this.middleware({scope: 'schemas'}), this.deleteSchema);
    }        
    
    /**
     * Get a list of all Schemas
     */
    static getSchemas(req, res) {
        SchemaHelper.getAllSchemas()
        .then((schemas) => {
            res.status(200).send(schemas);
        })
        .catch((e) => {
            res.status(502).send(ApiController.error(e));
        });
    }
    
    /**
     * Get a Schema by id
     */
    static getSchema(req, res) {
        let id = req.params.id;
        let getter = req.query.withParentFields ? 
            SchemaHelper.getSchemaWithParentFields :
            SchemaHelper.getSchema;

        getter(id)    
        .then((schema) => {
            res.status(200).send(schema);
        })
        .catch((e) => {
            res.status(502).send(ApiController.error(e));
        });
    }
    
    /**
     * Set a Schema by id
     */
    static setSchema(req, res) {
        let id = req.params.id;
        let schema = req.body;

        SchemaHelper.setSchema(id, schema)
        .then(() => {
            res.status(200).send(schema);
        })
        .catch((e) => {
            res.status(502).send(ApiController.error(e));
        });
    }
    
    /**
     * Creates a new Schema
     */
    static createSchema(req, res) {
        let parentSchema = req.body;

        SchemaHelper.createSchema(parentSchema)
        .then((newSchema) => {
            res.status(200).send(newSchema.getObject());
        })
        .catch((e) => {
            res.status(502).send(ApiController.error(e));
        });
    }
    
    /**
     * Deletes a Schema by id
     */
    static deleteSchema(req, res) {
        let id = req.params.id;
        
        SchemaHelper.removeSchema(id)
        .then(() => {
            res.status(200).send('Schema with id "' + id + '" deleted successfully');
        })
        .catch((e) => {
            res.status(502).send(ApiController.error(e));
        });
    }
}

module.exports = SchemaController;
