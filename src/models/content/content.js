'use strict';

let Struct = require('../structs/struct');
let Debug = require('../../helpers/debug');

class Content {
    constructor(json) {
        this.data = json;
    }
    
    /**
     * Fetch content asynchronously
     */
    fetchAsync(contentAsyncFunction, structAsyncFunction) {
        let content = this;

        return new Promise(function(callback) {
            // Run the content fetching promise
            contentAsyncFunction()
                .then(function(json) {
                    // Set immediate result as data temporarily
                    content.data = json;

                    // Get the struct with the struct fetching promise
                    if(content.data.presentation.struct.value) {
                        Debug.log2('Getting Struct "' + content.data.presentation.struct.value + '"...', content);

                        content.getStruct(structAsyncFunction)
                            .then(callback)
                            .catch(Debug.error);
                        
                    // No struct was specified, exit
                    } else {
                        Debug.error('Content has no struct specified!', content, json);

                        callback();
                    }
                }).catch(Debug.error);
        });
    }

    /**
     * Get struct
     * Takes a promise to fetch the JSON data
     */
    getStruct(asyncFunction) {
        let content = this;

        return new Promise(function(callback) {
            // Get the base struct
            let struct = new Struct();
            
            Debug.log2('Applying Struct base...', content);
       
            // Include the respective bases for each struct directory 
            if(content.data.presentation.struct.value.indexOf('pages/') == 0) {
                struct.adoptStruct(require('../../structs/page.json'));
            
            } else if(content.data.presentation.struct.value.indexOf('sections/') == 0) {
                struct.adoptStruct(require('../../structs/section.json'));
            
            } else if(content.data.presentation.struct.value.indexOf('blocks/') == 0) {
                struct.adoptStruct(require('../../structs/block.json'));
            
            }

            Debug.log2('Invoking struct fetching promise from plugin...', content);

            // Adopt the values of the child page struct
            struct.adoptStructAsync(asyncFunction, content.data.presentation.struct.value)
                .then(function() {
                    // Adopt the content data into the struct, to weed out any leftover values
                    struct.adoptContent(content.data);

                    // Apply the new data structure back onto the content instance
                    content.data = struct.data;

                    // Exit
                    callback();
                }).catch(Debug.error);
        });
    }

    /**
     * Bake content into flat object
     */
    static bake(content) {
        function bakeProperty(prop) {
            let type = Object.prototype.toString.call(prop);
            let baked;

            // This is an array
            if(type === '[object Array]') {
                baked = [];

                for(let i in prop) {
                    baked.push(bakeProperty(prop[i]));
                }
            
            // This is a struct
            } else if(prop.value) {
                baked = bakeProperty(prop.value);
            
            // This is a normal value
            } else {
                baked = prop.toString();
                
            }

            return baked || '';
        }

        function bakeProperties(json) {
            let baked = {};

            for(let k in json) {
                let prop = json[k];

                baked[k] = bakeProperty(prop.value);
            }   

            return baked;
        }
        
        Debug.log2('Baking...', this);

        let baked = bakeProperties(content);

        return baked;
    }
}

module.exports = Content;
