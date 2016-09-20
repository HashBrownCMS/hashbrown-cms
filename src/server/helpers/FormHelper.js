'use strict';

let Form = require(appRoot + '/src/common/models/Form');

/**
 * The helper class for Forms
 */
class FormHelper {
    /**
     * Gets Form by id
     *
     * @param {String} id
     *
     * @returns {Promise} Form
     */
    static getForm(id) {
        let collection = ProjectHelper.currentEnvironment + '.forms';
    
        return MongoHelper.findOne(
            ProjectHelper.currentProject,
            collection,
            {
                id: id
            }
        )
        .then((formData) => {
            return new Promise((resolve, reject) => {
                resolve(new Form(formData));
            });
        });
    }
    
    /**
     * Deletes Form by id
     *
     * @param {String} id
     *
     * @returns {Promise} Promise
     */
    static deleteForm(id) {
        let collection = ProjectHelper.currentEnvironment + '.forms';
    
        return MongoHelper.removeOne(
            ProjectHelper.currentProject,
            collection,
            {
                id: id
            }
        );
    }

    /**
     * Gets all Forms
     *
     * @returns {Promise} Array of forms
     */
    static getAllForms() {
        let collection = ProjectHelper.currentEnvironment + '.forms';
        
        return MongoHelper.find(
            ProjectHelper.currentProject,
            collection,
            {}
        );
    }
    
    /**
     * Sets a Form by id
     *
     * @param {String} id
     * @param {Object} properties
     *
     * @returns {Promise} Form
     */
    static setForm(id, properties) {
        let collection = ProjectHelper.currentEnvironment + '.forms';

        return MongoHelper.updateOne(
            ProjectHelper.currentProject,
            collection,
            {
                id: id
            },
            properties,
            {
                upsert: true
            }
        )
        .then(() => {
            return new Promise((resolve) => {
                resolve(new Form(properties));
            });
        });
    }

    /**
     * Creates a new Form
     *
     * @returns {Promise} Form
     */
    static createForm() {
        let form = Form.create();
        let collection = ProjectHelper.currentEnvironment + '.forms';

        return MongoHelper.insertOne(
            ProjectHelper.currentProject,
            collection,
            form.getObject()
        )
        .then(() => {
            return new Promise((resolve) => {
                resolve(form);
            });
        });
    }

    /**
     * Adds an entry by to a Form by id
     *
     * @param {String} id
     * @param {Object} entry
     *
     * @returns {Promise} Promise
     */
    static addEntry(id, entry) {
        return this.getForm(id)
        .then((form) => {
            form.addEntry(entry);

            return this.setForm(id, form.getObject())
        });
    }
}

module.exports = FormHelper;
