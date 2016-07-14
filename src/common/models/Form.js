'use strict';

let Entity = require('./Entity');

/**
 * The Form class
 */
class Form extends Entity {
    constructor(params) {
        super(params);
    }

    structure() {
        // Fundamental fields
        this.def(String, 'id');
        this.def(String, 'title');
        this.def(String, 'redirect');
        
        // Mutable fields
        this.def(Object, 'inputs', {});
        this.def(Array, 'entries', []);
    }

    /**
     * Creates a new Form object
     *
     * @return {Form} form
     */
    static create() {
        let form = new Form({
            id: Entity.createId(),
            title: 'New form',
            inputs: {},
            entries: []
        });
        
        return form;
    }

    /**
     * Adds an entry
     *
     * @param {Object} entry
     */
    addEntry(entry) {
        let filteredEntry = {};

        // Only accept values as defined by the "inputs" variable
        for(let k in this.inputs) {
            if(this.inputs[k].pattern) {
                let regexp = new RegExp(this.inputs[k].pattern);

                if(!regexp.test(entry[k])) {
                    throw new Error('Field "' + k + '" is incorrectly formatted');
                }
            }
            
            filteredEntry[k] = entry[k];

        }

        this.entries.push(filteredEntry);
    }
}

module.exports = Form;
