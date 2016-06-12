'use strict';

let ContentHelperCommon = require('../../../common/helpers/ContentHelper');

let Content = require('../models/Content');

class ContentHelper extends ContentHelperCommon {
    /**
     * Gets Content by id
     *
     * @param {String} id
     *
     * @returns {Promise(Content)} content
     */
    static getContentById(id) {
        return new Promise((resolve, reject) => {
            let result;

            for(let content of resources.content) {
                if(content.id == id) {
                    result = content;
                    break;
                }
            }
           
            if(result) { 
                resolve(new Content(result)); 
            } else {
                reject(new Error('Couldn\'t get Content by id "' + id + '"'));
            }
        });
    }
}

module.exports = ContentHelper;
