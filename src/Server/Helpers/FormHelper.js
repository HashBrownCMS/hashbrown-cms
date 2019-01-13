'use strict';

/**
 * The helper class for Forms
 *
 * @memberof HashBrown.Server.Helpers
 */
class FormHelper {
    /**
     * Gets Form by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Promise} Form
     */
    static getForm(project, environment, id) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);

        let collection = environment + '.forms';
    
        return HashBrown.Helpers.DatabaseHelper.findOne(
            project,
            collection,
            {
                id: id
            }
        )
        .then((result) => {
            if(!result) {
                return HashBrown.Helpers.SyncHelper.getResourceItem(project, environment, 'forms', id);
            }

            return Promise.resolve(result);
        })
        .then((result) => {
            return Promise.resolve(new HashBrown.Models.Form(result));
        });
    }
    
    /**
     * Deletes Form by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Promise} Promise
     */
    static deleteForm(project, environment, id) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);

        let collection = environment + '.forms';
    
        return HashBrown.Helpers.DatabaseHelper.removeOne(
            project,
            collection,
            {
                id: id
            }
        );
    }

    /**
     * Gets all Forms
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} Array of forms
     */
    static getAllForms(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        let collection = environment + '.forms';
        
        return HashBrown.Helpers.DatabaseHelper.find(
            project,
            collection,
            {}
        )
        .then((results) => {
            return HashBrown.Helpers.SyncHelper.mergeResource(project, environment, 'forms', results); 
        });
    }
    
    /**
     * Sets a Form by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Object} properties
     * @param {Boolean} create
     *
     * @returns {Promise} Form
     */
    static setForm(project, environment, id, properties, create = true) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(properties, 'properties', Object);

        let collection = environment + '.forms';

        // Unset automatic flags
        properties.isLocked = false;

        properties.sync = {
            isRemote: false,
            hasRemote: false
        };
        
        return HashBrown.Helpers.DatabaseHelper.updateOne(
            project,
            collection,
            {
                id: id
            },
            properties,
            {
                upsert: create
            }
        )
        .then(() => {
            return Promise.resolve(new HashBrown.Models.Form(properties));
        });
    }

    /**
     * Creates a new Form
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} Form
     */
    static createForm(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        let form = HashBrown.Models.Form.create();
        let collection = environment + '.forms';

        return HashBrown.Helpers.DatabaseHelper.insertOne(
            project,
            collection,
            form.getObject()
        )
        .then(() => {
            return Promise.resolve(form);
        });
    }

    /**
     * Adds an entry by to a Form by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Object} entry
     *
     * @returns {Promise} Promise
     */
    static addEntry(project, environment, id, entry) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(entry, 'entry', Object);

        return this.getForm(project, environment, id)
        .then((form) => {
            form.addEntry(entry);

            return this.setForm(project, environment, id, form.getObject())
        });
    }

    /**
     * Clears all entries in a Form by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Promise} Promise
     */
    static clearAllEntries(project, environment, id) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);

        return this.getForm(project, environment, id)
        .then((form) => {
            form.clearAllEntries();

            return this.setForm(project, environment, id, form.getObject())
        });
    }
}

module.exports = FormHelper;
