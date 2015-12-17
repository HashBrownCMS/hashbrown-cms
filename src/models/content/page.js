'use strict';

let Content = require('./content');
let PageStruct = require('../structs/page');

class PageContent extends Content {
    constructor(json) {
        super(json);
    }
    
    getStruct(asyncFunction) {
        let content = this;

        return new Promise(function(callback) {
            // Get the base page struct
            let struct = new PageStruct();
        
            // Adopt the values of the child page struct
            console.log('    Putaitu [PageContent]: Getting Struct "' + content.data.struct + '"...');
            struct.adoptStructAsync(asyncFunction, content.data.struct)
                .then(function() {
                    console.log('    Putaitu [PageContent]: Adopting Struct data from "' + content.data.struct + '"...');
                    // Adopt the content data into the struct, to weed out any leftover values
                    struct.adoptContent(content.data);

                    // Apply the new data structure back onto the content instance
                    content.data = struct.data;

                    // Exit
                    callback();
                });
        });
    }
}

module.exports = PageContent;
