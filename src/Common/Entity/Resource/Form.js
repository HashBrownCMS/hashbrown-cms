'use strict';

/**
 * The Form class
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class Form extends HashBrown.Entity.Resource.ResourceBase {
    /**
     * Structure
     */
    structure() {
        super.structure();
        
        // Fundamental fields
        this.def(String, 'name', 'New form');
        this.def(String, 'allowedOrigin');
        this.def(String, 'redirect');
        this.def(Boolean, 'appendRedirect');
        
        // Mutable fields
        this.def(Object, 'inputs', {});
        this.def(Array, 'entries', []);
    }
    
    /**
     * Gets the human readable name
     *
     * @return {String} Name
     */
    getName() {
        return this.name || this.id;
    }
    
    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);

        params = params || {};

        // Adopt old value names
        if(params.title) {
            params.name = params.title;
        }

        super.adopt(params);
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
