'use strict';

const ConnectionHelperCommon = require('Common/Helpers/ConnectionHelper');

/**
 * The helper class for Connections
 *
 * @memberof HashBrown.Server.Helpers
 */
class ConnectionHelper extends ConnectionHelperCommon {
    /**
     * Registers a deployer
     *
     * @param {Deployer} deployer
     */
    static registerDeployer(deployer) {
        checkParam(deployer, 'deployer', HashBrown.Models.Deployer);

        if(!this.deployers) {
            this.deployers = [];
        }

        this.deployers.push(deployer);
    }
    
    /**
     * Registers a processor
     *
     * @param {Processor} processor
     */
    static registerProcessor(processor) {
        checkParam(processor, 'processor', HashBrown.Models.Processor);

        if(!this.processors) {
            this.processors = [];
        }

        this.processors.push(processor);
    }

    /**
     * Gets a deployer
     *
     * @string {String} alias
     *
     * @returns {Deployer} Deployer
     */
    static getDeployer(alias) {
        if(!this.deployers) { return null; }

        for(let deployer of this.deployers) {
            if(deployer.alias !== alias) { continue; }

            return deployer;
        }

        return null;
    }
    
    /**
     * Gets a processor
     *
     * @string {String} alias
     *
     * @returns {Processor} Processor
     */
    static getProcessor(alias) {
        if(!this.processors) { return null; }

        for(let processor of this.processors) {
            if(processor.alias !== alias) { continue; }

            return processor;
        }

        return null;
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
    static previewContent(project, environment, content, user, language) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Models.Content);
        checkParam(user, 'user', HashBrown.Models.User);
        checkParam(language, 'language', String);

        return content.getSettings(project, environment, 'publishing')
        .then((settings) => {
            if(!settings.connectionId) {
                return Promise.reject(new Error('Content by id "' + content.id + '" has no connection configured'));
            }

            return this.getConnectionById(project, environment, settings.connectionId);
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
    static publishContent(project, environment, content, user) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Models.Content);
        checkParam(user, 'user', HashBrown.Models.User);

        let helper = this;

        debug.log('Publishing content "' + content.id + '"...', this);
        
        return content.getSettings(project, environment, 'publishing')
        .then((settings) => {
            if(!settings.connectionId) {
                return Promise.reject(new Error('No connections defined for content "' + content.id + '"'));
            }
            
            return this.getConnectionById(project, environment, settings.connectionId);
        })
        .then((connection) => {
            debug.log('Publishing through connection "' + connection.id + '"...', helper);

            return connection.publishContent(project, environment, content);
        })
        .then(() => {
            debug.log('Published content "' + content.id + '" successfully!', helper);

            // Update published flag
            content.isPublished = true;

            return HashBrown.Helpers.ContentHelper.setContentById(project, environment, content.id, content, user);
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
    static unpublishContent(project, environment, content, user, unpublishFirst = true) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Models.Content);
        checkParam(user, 'user', HashBrown.Models.User);

        debug.log('Unpublishing content "' + content.id + '"...', this);
        
        return content.getSettings(project, environment, 'publishing')
        .then((settings) => {
            if(!settings.connectionId) {
                return Promise.reject(new Error('No connection defined for content "' + content.id + '"'));
            }
            
            return this.getConnectionById(project, environment, settings.connectionId)
        })
        .then((connection) => {
            if(!unpublishFirst) { return Promise.resolve(); }
            
            debug.log('Unpublishing through connection "' + connection.id + '"...', this);

            return connection.unpublishContent(project, environment, content);
        })
        .then(() => {
            debug.log('Unpublished content "' + content.id + '" successfully!', this);

            // Update published flag
            content.isPublished = false;

            return HashBrown.Helpers.ContentHelper.setContentById(project, environment, content.id, content, user);
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
    static getAllConnections(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        let collection = environment + '.connections';
        
        return HashBrown.Helpers.DatabaseHelper.find(
            project,
            collection,
            {}
        ).then((array) => {
            return HashBrown.Helpers.SyncHelper.mergeResource(project, environment, 'connections', array)
            .then((connections) => {
                for(let i in connections) {
                    connections[i] = new HashBrown.Models.Connection(connections[i]);
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
    static async getConnectionById(project, environment, id) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);

        let collection = environment + '.connections';
       
        let data = await HashBrown.Helpers.DatabaseHelper.findOne(project, collection, { id: id });

        if(!data) {
            data = await HashBrown.Helpers.SyncHelper.getResourceItem(project, environment, 'connections', id);

            if(!data) {
                throw new Error('Connection by id "' + id + '" was not found');
            }

        } 
            
        return new HashBrown.Models.Connection(data);
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
    static removeConnectionById(project, environment, id) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);

        let collection = environment + '.connections';
        
        return HashBrown.Helpers.DatabaseHelper.removeOne(
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
    static setConnectionById(project, environment, id, connection, create = false) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(connection, 'connection', HashBrown.Models.Connection);

        // Unset automatic flags
        connection.isLocked = false;

        connection.sync = {
            isRemote: false,
            hasRemote: false
        };
        
        return HashBrown.Helpers.DatabaseHelper.updateOne(
            project,
            environment + '.connections',
            {
                id: id
            },
            connection.getObject(),
            {
                upsert: create
            }
        ).then(() => {
            return Promise.resolve(connection);  
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
    static async createConnection(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        let connection = HashBrown.Models.Connection.create();

        await HashBrown.Helpers.DatabaseHelper.insertOne(project, environment + '.connections', connection.getObject());
    
        return connection;
    }    

    /**
     * Gets the Media provider
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Promise} Connection object
     */
    static async getMediaProvider(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        let providers = await HashBrown.Helpers.SettingsHelper.getSettings(project, environment, 'providers');
        
        if(providers.media) {
            return await this.getConnectionById(project, environment, providers.media);
        } else {
            return null;
        }
    }
}

module.exports = ConnectionHelper;
