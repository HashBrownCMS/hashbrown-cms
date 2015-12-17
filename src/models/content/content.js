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

                    // Get the content struct with the struct fetching promise
                    if(content.data.struct) {
                        console.log('    Putaitu [Content]: Getting Struct "' + content.data.struct + '"...');

                        content.getStruct(structAsyncFunction)
                            .then(callback)
                            .catch(Debug.error);
                        
                    // No struct was specified, exit
                    } else {
                        console.log('Putaitu [ERROR]: Content has no struct specified!', json);

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
            
            console.log('    Putaitu [Content]: Applying Struct base...');
       
            // Include the respective bases for each struct directory 
            if(content.data.struct.indexOf('pages/') == 0) {
                struct.adoptStruct(require('../../structs/page.json'));
            
            } else if(content.data.struct.indexOf('sections/') == 0) {
                struct.adoptStruct(require('../../structs/section.json'));
            
            } else if(content.data.struct.indexOf('blocks/') == 0) {
                struct.adoptStruct(require('../../structs/block.json'));
            
            }

            console.log('    Putaitu [Content]: Invoking struct fetching promise from plugin...');

            // Adopt the values of the child page struct
            struct.adoptStructAsync(asyncFunction, content.data.struct)
                .then(function() {
                    console.log('    Putaitu [Content]: Adopting Struct data from "' + content.data.struct + '"...');

                    // Adopt the content data into the struct, to weed out any leftover values
                    struct.adoptContent(content.data);

                    // Apply the new data structure back onto the content instance
                    content.data = struct.data;

                    // Exit
                    callback();
                }).catch(Debug.error);
        });
    }
}

module.exports = Content;
