'use strict';

const ConnectionHelperCommon = require('Common/Helpers/ConnectionHelper');
const ContentHelper = require('Server/Helpers/ContentHelper');
const MongoHelper = require('Server/Helpers/MongoHelper');
const SyncHelper = require('Server/Helpers/SyncHelper');

const Connection = require('Common/Models/Connection');

/**
 * The helper class for Connections
 *
 * @memberof HashBrown.Server.Helpers
 */
class ConnectionHelper extends ConnectionHelperCommon {
    /**
     * Registers a connection type
     *
     * @param {String} name
     * @param {Connection} connection
     */
    static registerConnectionType(name, connection) {
        if(!this.connectionTypes) {
            this.connectionTypes = {};
        }

        this.connectionTypes[name] = connection;
    }

    /**
     * Inits a connection with the appropriate constructor
     *
     * @param {Object} data
     *
     * @returns {Connection} connection
     */
    static initConnection(data) {
        let constructor = this.connectionTypes[data.type];
        let connection;
           
        if(typeof constructor === 'function') {
            connection = new constructor(data);
        } else {
            connection = new Connection(data);
        }

        return connection;
    }

    /**
     * Previews content
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     * @param {User} user
     * @param {String} language
     *
     * @returns {Promise} Promise
     */
    static previewContent(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        content = requiredParam('content'),
        user = requiredParam('user'),
        language = requiredParam('language')
    ) {
        return content.getSettings(project, environment, 'publishing')
        .then((settings) => {
            if(!settings.connections || settings.connections.length < 1) {
                return Promise.reject(new Error('Content by id "' + content.id + '" has no connections configured'));
            }

            return this.getConnectionById(project, environment, settings.connections[0]);
        })
        .then((connection) => {
            return connection.generatePreview(project, environment, content, language);
        })
        .then((previewUrl) => {
            return Promise.resolve(previewUrl);  
        });
    }

    /**
     * Publishes content
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     * @param {User} user
     *
     * @returns {Promise} Promise
     */
    static publishContent(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        content = requiredParam('content'),
        user = requiredParam('user')
    ) {
        let helper = this;

        debug.log('Publishing content "' + content.id + '"...', this);
        
        return content.getSettings(project, environment, 'publishing')
        .then((settings) => {
            if(settings.connections && settings.connections.length > 0) {
                debug.log('Looping through ' + settings.connections.length + ' connections...', this);
                
                function nextConnection(i) {
                    return this.getConnectionById(project, environment, settings.connections[i])
                    .then((connection) => {
                        debug.log('Publishing through connection "' + settings.connections[i] + '" of type "' + connection.type + '"...', helper);

                        return connection.publishContent(project, environment, content);
                    })
                    .then(() => {
                        i++;

                        if(i < settings.connections.length) {
                            return nextConnection(i);
                        
                        } else {
                            debug.log('Published content "' + content.id + '" successfully!', helper);

                            // Update published flag
                            content.isPublished = true;

                            return ContentHelper.setContentById(project, environment, content.id, content, user);
                        }
                    })
					.catch((e) => {
						return Promise.reject(e);
					});
                }

                return nextConnection(0);
            
            } else {
                return Promise.reject(new Error('No connections defined for content "' + content.id + '"'));

            }
        });
    }
    
    /**
     * Unpublishes content
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     * @param {User} user
     *
     * @returns {Promise} promise
     */
    static unpublishContent(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        content = requiredParam('content'),
        user = requiredParam('user'),
        unpublishFirst = true
    ) {
        let helper = this;

        debug.log('Unpublishing content "' + content.id + '"...', this);
        
        return content.getSettings(project, environment, 'publishing')
        .then((settings) => {
            if(settings.connections && settings.connections.length > 0) {
                debug.log('Looping through ' + settings.connections.length + ' connections...', this);
                
                function nextConnection(i) {
                    return this.getConnectionById(project, environment, settings.connections[i])
                    .then((connection) => {
                        if(!unpublishFirst) { return Promise.resolve(); }
                        
                        debug.log('Unpublishing through connection "' + settings.connections[i] + '" of type "' + connection.type + '"...', helper);

                        return connection.unpublishContent(project, environment, content);
                    })
                    .then(() => {
                        i++;

                        if(i < settings.connections.length) {
                            return nextConnection(i);
                        
                        } else {
                            debug.log('Unpublished content "' + content.id + '" successfully!', helper);

                            // Update published flag
                            content.isPublished = false;

                            return ContentHelper.setContentById(project, environment, content.id, content, user);
                        }
                    });
                }

                return nextConnection(0);
            
            } else {
                return new Promise((resolve, reject) => {
                    reject(new Error('No connections defined for content "' + content.id + '"'));
                });
            }
        });
    }

    /**
     * Gets all connections
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Promise} Array of Connections
     */
    static getAllConnections(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        let collection = environment + '.connections';
        
        return MongoHelper.find(
            project,
            collection,
            {}
        ).then((array) => {
            return SyncHelper.mergeResource(project, environment, 'connections', array)
            .then((connections) => {
                for(let i in connections) {
                    connections[i] = this.initConnection(connections[i]);
                }

                return Promise.resolve(connections);
            });
        });
    }
    
    /**
     * Gets a connection by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {string} id
     *
     * @return {Promise} Connection
     */
    static getConnectionById(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id')
    ) {
        let collection = environment + '.connections';
        
        return MongoHelper.findOne(
            project,
            collection,
            {
                id: id
            }
        ).then((data) => {
            if(!data) {
                return SyncHelper.getResourceItem(project, environment, 'connections', id)
                .then((resourceItem) => {
                      return Promise.resolve(this.initConnection(resourceItem));
                });
            } 
            
            return Promise.resolve(this.initConnection(data));
        });
    }
    
    /**
     * Removes a connection by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {string} id
     *
     * @return {Promise} promise
     */
    static removeConnectionById(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id')
    ) {
        let collection = environment + '.connections';
        
        return MongoHelper.removeOne(
            project,
            collection,
            {
                id: id
            }
        );
    }

    /**
     * Sets a connection by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {string} id
     * @param {Connection} connection
     * @param {Boolean} create
     *
     * @return {Promise} promise
     */
    static setConnectionById(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id'),
        connection = requiredParam('connection'),
        create = false
    ) {
        // Unset automatic flags
        connection.locked = false;
        connection.remote = false;
        connection.local = false;
        
        return MongoHelper.updateOne(
            project,
            environment + '.connections',
            {
                id: id
            },
            connection,
            {
                upsert: create
            }
        ).then(() => {
            return Promise.resolve(new Connection(connection));  
        });
    }
    
    /**
     * Creates a new connection
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Promise} New Connection
     */
    static createConnection(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        let connection = Connection.create();

        return MongoHelper.insertOne(
            project,
            environment + '.connections',
            connection.getObject()
        ).then((newConnection) => {
            return Promise.resolve(connection);
        });
    }    
}

module.exports = ConnectionHelper;
