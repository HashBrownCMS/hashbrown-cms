'use strict';

/**
 * The helper class for Connections
 *
 * @memberof HashBrown.Server.Service
 */
class ConnectionService extends require('Common/Service/ConnectionService') {
    /**
     * Gets a deployer
     *
     * @string {String} alias
     *
     * @returns {Deployer} Deployer
     */
    static getDeployer(alias) {
        for(let name in HashBrown.Entity.Deployer) {
            let deployer = HashBrown.Entity.Deployer[name];

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
        for(let name in HashBrown.Entity.Processor) {
            let processor = HashBrown.Entity.Processor[name];

            if(processor.alias !== alias) { continue; }

            return processor;
        }

        return null;
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
    static async publishContent(project, environment, content, user) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Entity.Resource.Content);
        checkParam(user, 'user', HashBrown.Entity.Resource.User);

        debug.log('Publishing content "' + content.id + '"...', this);
        
        let settings = await content.getSettings(project, environment, 'publishing');

        if(!settings.connectionId) {
            return debug.log('No connections defined for content "' + content.id + '", skipping...', this);
        }
            
        let connection = await this.getConnectionById(project, environment, settings.connectionId);

        debug.log('Publishing through connection "' + connection.id + '"...', this);

        await connection.publishContent(project, environment, content);
            
        debug.log('Published content "' + content.id + '" successfully!', this);

        // Update published flag
        content.isPublished = true;

        await HashBrown.Service.ContentService.setContentById(project, environment, content.id, content, user);
    }
    
    /**
     * Unpublishes content
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     * @param {User} user
     */
    static async unpublishContent(project, environment, content, user, unpublishFirst = true) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Entity.Resource.Content);

        debug.log('Unpublishing content "' + content.id + '"...', this);
        
        let settings = await content.getSettings(project, environment, 'publishing');

        if(!settings.connectionId) { 
            return debug.log('No connection defined for content "' + content.id + '", skipping...', this);
        }
            
        let connection = await this.getConnectionById(project, environment, settings.connectionId);

        if(unpublishFirst) {
            debug.log('Unpublishing through connection "' + connection.id + '"...', this);

            await connection.unpublishContent(project, environment, content);
        }
        
        debug.log('Unpublished content "' + content.id + '" successfully!', this);

        // Update published flag
        content.isPublished = false;

        await HashBrown.Service.ContentService.setContentById(project, environment, content.id, content, user);
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
        
        return HashBrown.Service.DatabaseService.find(
            project,
            collection,
            {}
        ).then((array) => {
            return HashBrown.Service.SyncService.mergeResource(project, environment, 'connections', array)
            .then((connections) => {
                for(let i in connections) {
                    connections[i] = new HashBrown.Entity.Resource.Connection(connections[i]);
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
       
        let data = await HashBrown.Service.DatabaseService.findOne(project, collection, { id: id });

        if(!data) {
            data = await HashBrown.Service.SyncService.getResourceItem(project, environment, 'connections', id);

            if(!data) {
                throw new Error('Connection by id "' + id + '" was not found');
            }

        } 
            
        return new HashBrown.Entity.Resource.Connection(data);
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
        
        return HashBrown.Service.DatabaseService.removeOne(
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
    static async setConnectionById(project, environment, id, connection, create = false) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(connection, 'connections', HashBrown.Entity.Resource.Connection);

        // Unset automatic flags
        connection.isLocked = false;

        connection.sync = {
            isRemote: false,
            hasRemote: false
        };
        
        await HashBrown.Service.DatabaseService.updateOne(project, environment + '.connections', { id: id }, connection.getObject(), { upsert: create });
        
        return connection;
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

        let connection = HashBrown.Entity.Resource.Connection.create();

        await HashBrown.Service.DatabaseService.insertOne(project, environment + '.connections', connection.getObject());
    
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

        let providers = await HashBrown.Service.SettingsService.getSettings(project, environment, 'providers');
        
        if(providers && providers.media) {
            return await this.getConnectionById(project, environment, providers.media);
        } else {
            return null;
        }
    }
}

module.exports = ConnectionService;
