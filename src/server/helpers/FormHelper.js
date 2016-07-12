'use strict';

class FormHelper {
    /**
     * Gets form data by id
     *
     * @param {String} id
     *
     * @returns {Promise(Object)} formData
     */
    static getFormData(id) {
        let collection = ProjectHelper.currentEnvironment + '.forms';
        
        return MongoHelper.find(
            ProjectHelper.currentProject,
            collection,
            {
                id: id
            }
        );
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
            let collection = ProjectHelper.currentEnvironment + '.forms';

            FormHelper.getFormData(id)
            .then((form) => {
                if(!form) {
                    form  = {};
                }

                form.id = id;

                if(!form.entries) {
                    form.entries = [];
                }

                form.entries[form.entries.length] = entry;
                
                MongoHelper.updateOne(
                    ProjectHelper.currentProject,
                    collection,
                    {
                        id: id
                    },
                    form,
                    {
                        upsert: true
                    }
                )
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);

        });
    }
}

module.exports = FormHelper;
