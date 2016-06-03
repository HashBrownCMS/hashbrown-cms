'use strict';

let crypto = require('crypto');

let Promise = require('bluebird');

let LanguageHelper = require('../helpers/LanguageHelper');

/**
 * The base class for all Connection types
 */
class Connection {
    constructor(properties) {
        this.properties = properties;
    }

    /**
     * Creates a new Connection object
     *
     * @param {Object} properties
     *
     * @return {Object} content
     */
    static create(properties) {
        let connection = new Connection(properties || {});
        
        connection.properties.id = crypto.randomBytes(20).toString('hex');
        connection.properties.title = 'New connection';
        connection.properties.settings = {};

        return connection;
    }

    /**
     * Publishes content
     *
     * @param {Content} content
     *
     * @returns {Promise} promise
     */
    publishContent(content) {
        let connection = this;

        return new Promise((callback) => {
            console.log('[Connection] Publishing all localised property sets...');

            LanguageHelper.getAllLocalizedPropertySets(content)
            .then((sets) => {
                function next(i) {
                    let properties = sets[i];

                    connection.postContentProperties(properties)
                    .then(() => {
                        i++;

                        if(i < sets.length) {
                            next(i);
                        
                        } else {
                            console.log('[Connection] Published all localised property sets successfully!');
                                
                            callback();
                        
                        }
                    });
                }

                next(0);
            });
        });
    }

    /**
     * Posts content properties to the remote target
     *
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    postContentProperties(properties) {
        return new Promise((callback) => {
            callback();
        });
    }
}

module.exports = Connection;
