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
        console.log('    Putaitu [Struct]: Adopting Struct data...');
        
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

        console.log('    Putaitu [Struct]: Getting Struct data to adopt for "' + path + '"...');

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
    adoptContentAsync(asyncFunction) {
        let struct = this;

        return new Promise(function(callback) {
            asyncFunction()
                .then(function(json) {
                    struct.adoptContent(json);

                    if(callback) {
                        callback();
                    }
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
            console.log('    Putaitu [Struct]: Getting parent Struct "' + path + '"...')
            
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
            console.log('    Putaitu [Struct]: Checking for parent Struct...')

            // Check for initial parent
            if(struct.data.parentStruct) {
                getParent(struct.data.parentStruct, function() {
                    callback(); 
                });

            // If no parent, just exit
            } else {
                console.log('    Putaitu [Struct]: No parent found.')
                
                callback();
            
            }
        });
    }
}

module.exports = Struct;
