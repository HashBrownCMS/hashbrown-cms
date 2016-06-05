'use strict';

let Promise = require('bluebird');

let LanguageHelper = require('../helpers/LanguageHelper');

let Entity = require('./Entity');

/**
 * The base class for all Connection types
 */
class Connection extends Entity {
    structure() {
        // Fundamental fields
        this.id = '';
        this.title = '';
        this.type = '';
        
        // Extensible settings
        this.settings = {};
    }

    /**
     * Creates a new Connection object
     *
     * @return {Connection} connection
     */
    static create() {
        let connection = new Connection({
            id: Entity.createId(),
            title: 'New connection',
            settings: {}
        });
        
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
