'use strict';

let Debug = require('../../helpers/debug');

class Struct {
    /**
     * Constructor
     * Takes a JSON object for initial data
     */
    constructor(json) {
        this.data = json || {};
    }

    /**
     * Adopt struct
     * Merge a struct with another. This method is being used when a struct derives from a parent
     */
    adoptStruct(struct) {
        Debug.log2('Adopting Struct data...', this);
        
        for(let anchorLabel in struct) {
            if(!this.data[anchorLabel]) {
                this.data[anchorLabel] = {};
            }

            let properties = struct[anchorLabel];

            for(let alias in properties) {
                let property = properties[alias];

                this.data[anchorLabel][alias] = property;
            }
        }
    }

    /**
     * Adopt struct asynchronously
     * Takes a function for getting the JSON data
     */
    adoptStructAsync(asyncFunction, path) {
        let struct = this;

        Debug.log2('Getting Struct data to adopt for "' + path + '"...', struct);

        return new Promise(function(callback) {
            asyncFunction(path)
                .then(function(json) {
                    struct.adoptStruct(json);
                        
                    struct.getParentsAsync()
                        .then(callback);
                }).catch(Debug.error);
        });
    }

    /**
     * Adopt content
     * Merges content from a content node, but only if the given fields exist in this struct
     */
    adoptContent(content) {
        Debug.log2('Adopting Content data...', this);

        for(let anchorLabel in content) {
            // Only accept data from anchor labels already existing in this struct
            if(this.data[anchorLabel]) {
                let properties = content[anchorLabel];

                for(let alias in properties) {
                    let property = properties[alias];

                    // Only accept values from aliases that already exist in this struct
                    if(this.data[anchorLabel][alias]) {
                        this.data[anchorLabel][alias].value = property.value;
                    }
                }
            }
        }
    }
    
    /**
     * Adopt content asynchronously
     * Takes a function for getting the JSON data
     */
    adoptContentAsync(asyncFunction, path) {
        let struct = this;

        Debug.log2('Getting Content data to adopt for "' + path + '"...', struct);

        return new Promise(function(callback) {
            asyncFunction(path)
                .then(function(json) {
                    struct.adoptContent(json);
                        
                    callback();
                }).catch(Debug.error);
        });
    }

    /**
     * Get parents asynchronously
     * Fetch and adopt the values of all parent structs
     */
    getParentsAsync(asyncFunction) {
        let struct = this;

        // Get parent by path
        function getParent(path, callback) {
            Debug.log2('Getting parent Struct "' + path + '"...', struct)
            
            asyncFunction(function(json) {
                // Automatically adopt the JSON values
                struct.adoptStruct(json);

                // Check for this parent's parent
                if(json.parentStruct) {
                    getParent(json.parentStruct, callback);
            
                // If none, just exit
                } else {
                    callback();

                }
            });
        }

        return new Promise(function(callback) {
            Debug.log2('Checking for parent Struct...', struct)

            // Check for initial parent
            if(struct.data.parentStruct) {
                getParent(struct.data.parentStruct, function() {
                    callback(); 
                });

            // If no parent, just exit
            } else {
                Debug.log2('No parent found.', struct)
                
                callback();
            
            }
        });
    }
}

module.exports = Struct;
