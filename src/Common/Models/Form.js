'use strict';

/**
 * The Form class
 *
 * @memberof HashBrown.Common.Models
 */
class Form extends HashBrown.Models.Resource {
    /**
     * Structure
     */
    structure() {
        super.structure();
        
        // Fundamental fields
        this.def(String, 'title');
        this.def(String, 'allowedOrigin');
        this.def(String, 'redirect');
        this.def(Boolean, 'appendRedirect');
        this.def(Boolean, 'isLocked');
        
        // Sync
        this.def(Object, 'sync');
        
        // Mutable fields
        this.def(Object, 'inputs', {});
        this.def(Array, 'entries', []);
    }

    /**
     * Gets the resource category name
     *
     * @returns {String} Name
     */
    static get category() { return 'forms'; }

    /**
     * Creates a new Form object
     *
     * @return {Form} form
     */
    static create() {
        let form = new Form({
            id: Form.createId(),
            title: 'New form',
            inputs: {},
            entries: []
        });
        
        return form;
    }

    /**
     * Clears all entries
     */
    clearAllEntries() {
        this.entries = [];
    }

    /**
     * Adds an entry
     *
     * @param {Object} entry
     */
    addEntry(entry) {
        if(!entry) { return; }

        let filteredEntry = {};
        let duplicateChecks = {};

        // Only accept values as defined by the "inputs" variable
        for(let k in this.inputs) {
            // Register fields to check for duplicates
            if(this.inputs[k].checkDuplicates) {
                duplicateChecks[k] = {};
            }

            // Apply regex pattern
            if(this.inputs[k].pattern) {
                let regexp = new RegExp(this.inputs[k].pattern);

                if(!regexp.test(entry[k])) {
                    throw new Error('Field "' + k + '" is incorrectly formatted');
                }
            }
            
            // Check if a required field is missing
            if(this.inputs[k].required == true && !entry[k]) {
                throw new Error('Field "' + k + '" is required');
            }

            filteredEntry[k] = entry[k];
        }

        // Copy to new entries array to avoid changing original before duplicate check
        let newEntries = [...(this.entries || [])];

        // Add timestamp
        filteredEntry.time = new Date().toISOString();

        newEntries.push(filteredEntry);

        // Look for duplicates
        for(let duplicateKey in duplicateChecks) {
            for(let entry of newEntries) {
                // Does this entry have the field we're checking for?
                if(!entry[duplicateKey]) { continue; }

                // Does this entry have a field value that already exists?
                if(duplicateChecks[duplicateKey][entry[duplicateKey]]) {
                    throw new Error('Field "' + duplicateKey + '" is a duplicate');
                }

                duplicateChecks[duplicateKey][entry[duplicateKey]] = true;
            }
        }

        // Assign new entries array to original variable
        this.entries = newEntries;
    }
}

module.exports = Form;
