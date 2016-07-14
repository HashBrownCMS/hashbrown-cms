'use strict';

let Form = require(appRoot + '/src/common/models/Form');

class FormHelper {
    /**
     * Gets form by id
     *
     * @param {String} id
     *
     * @returns {Promise(Form)} form
     */
    static getForm(id) {
        return new Promise((resolve, reject) => {
            let collection = ProjectHelper.currentEnvironment + '.forms';
        
            MongoHelper.findOne(
                ProjectHelper.currentProject,
                collection,
                {
                    id: id
                }
            )
            .then((formData) => {
                resolve(new Form(formData));
            })
            .catch(reject);
        });
    }

    /**
     * Gets all forms
     *
     * @returns {Promise(Array)} forms
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
     * @returns {Promise(Form)}
     */
    static setForm(id, properties) {
        return new Promise((resolve, reject) => {
            let collection = ProjectHelper.currentEnvironment + '.forms';

            MongoHelper.updateOne(
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
                resolve(new Form(properties));
            })
            .catch(reject);
        });
    }

    /**
     * Creates a new form
     *
     * @returns {Promise(Form)}
     */
    static createForm() {
        return new Promise((resolve, reject) => {
            let form = Form.create();
            let collection = ProjectHelper.currentEnvironment + '.forms';

            MongoHelper.insertOne(
                ProjectHelper.currentProject,
                collection,
                form.getObject()
            )
            .then(() => {
                resolve(form);
            })
            .catch(reject);
        });
    }

    /**
     * Adds an entry by to a form by id
     *
     * @param {String} id
     * @param {Object} entry
     *
     * @returns {Promise} promise
     */
    static addEntry(id, entry) {
        return new Promise((resolve, reject) => {
            this.getForm(id)
            .then((form) => {
                form.addEntry(entry);

                this.setForm(id, form.getObject())
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);
        });
    }
}

module.exports = FormHelper;
