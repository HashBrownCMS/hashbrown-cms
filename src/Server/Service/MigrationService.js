'use strict';

/**
 * The helper class for migrating older structures to new ones
 */
class MigrationService {
    /**
     * The main migration task
     */
    static async migrate() {
        let projectIds = await HashBrown.Service.DatabaseService.listDatabases();

        for(let projectId of projectIds) {
            let needsMigration = await this.check(projectId);

            if(!needsMigration) { continue; }

            debug.log(`Migrating project ${projectId}...`, this);

            debug.log('...creating backup...', this);

            await HashBrown.Service.DatabaseService.dump(projectId);

            debug.log('...migrating settings...', this);
            
            await this.migrateSettings(projectId);
            
            debug.log('...migrating publications...', this);
            
            await this.migratePublications(projectId);
            
            debug.log('...cleaning up...', this);
            
            await this.cleanup(projectId);

            debug.log('...done!', this);
        }
    }
    
    /**
     * Checks is a migration is needed
     *
     * @param {String} projectId
     */
    static async check(projectId) {
        checkParam(projectId, 'projectId', String, true);

        let collections = await HashBrown.Service.DatabaseService.listCollections(projectId);
        
        for(let collection of collections) {
            if(!collection || !collection.name || collection.name.indexOf('.connections') < 0) { continue; }

            return true;
        }

        let settings = await HashBrown.Service.DatabaseService.find(
            projectId,
            'settings',
            {
                $or: [
                    { usedBy: { $exists: true } },
                    { providers: { $exists: true } },
                    { mediaProvider: { $exists: true } },
                    { info: { $exists: true } },
                ]
            }
        );

        if(settings && settings.length > 0) {
            return true;
        }

        return false;
    }

    /**
     * Migrates publications
     *
     * @param {String} projectId
     */
    static async migratePublications(projectId) {
        checkParam(projectId, 'projectId', String, true);

        let collections = await HashBrown.Service.DatabaseService.listCollections(projectId);

        // Convert connections to publications
        for(let collection of collections) {
            if(!collection || !collection.name || collection.name.indexOf('.connections') < 0) { continue; }

            let connections = await HashBrown.Service.DatabaseService.find(
                projectId,
                collection.name
            );
                
            let newCollection = collection.name.replace('.connections', '.publications');

            let publications = {};

            // Accumulate connection properties into publications
            // NOTE: This way, we can accommodate duplicate entries, should they exist
            for(let connection of connections) {
                if(!publications[connection.id]) {
                    publications[connection.id] = {};
                }

                let publication = publications[connection.id];

                if(!publication.deployer || Object.keys(publication.deployer).length < 1) {
                    publication.deployer = connection.deployer;
                }

                if(!publication.deployer.path && connection.deployer && connection.deployer.paths) {
                    publication.deployer.path = connection.deployer.paths.content;
                }
                
                if(!publication.processor || Object.keys(publication.processor).length < 1) {
                    publication.processor = connection.processor;
                }

                if(!publication.createdBy) {
                    publication.createdBy = connection.createdBy;
                }
                
                if(!publication.createdOn) {
                    publication.createdOn = connection.createdOn;
                }
                
                if(!publication.updatedBy) {
                    publication.updatedBy = connection.updatedBy;
                }

                if(!publication.name) {
                    publication.name = connection.name || connection.title;
                }

                if(!publication.id) {
                    publication.id = connection.id;
                }

                if(publication.deployer) {
                    delete publication.deployer.paths;
                    delete publication.deployer.name;
                    delete publication.deployer.fileExtension;
                }
                
                if(publication.processor) {
                    delete publication.processor.name;
                    delete publication.processor.fileExtension;
                }
            }

            // Create the publications
            for(let publication of Object.values(publications)) {
                // Find content with publishing settings referencing the connection this publication is based on
                let contents = await HashBrown.Service.DatabaseService.find(
                    projectId,
                    collection.name.replace('connections', 'content'),
                    {
                        'settings.publishing.connectionId': publication.id
                    }
                );

                // Add the content to the new publication's root contents
                publication.rootContents = [];

                for(let content of contents) {
                    if(publication.rootContents.indexOf(content.id) > -1) { continue; }

                    publication.rootContents.push(content.id);
                }

                // If no content is associated with this publication, don't migrate it
                if(publication.rootContents.length < 1) { continue; }
                
                publication.includeRoot = true;

                // Set dates
                if(!publication.createdOn) {
                    publication.createdOn = new Date();
                }

                publication.updatedOn = new Date();

                // Insert new publication
                await HashBrown.Service.DatabaseService.updateOne(
                    projectId,
                    newCollection,
                    {
                        id: publication.id
                    },
                    publication,
                    {
                        upsert: true
                    }
                );
            }
        }
    }

    /**
     * Migrates settings
     *
     * @param {String} projectId
     */
    static async migrateSettings(projectId) {
        checkParam(projectId, 'projectId', String, true);
        
        let allSettings = await HashBrown.Service.DatabaseService.find(
            projectId,
            'settings',
            {
                $or: [
                    { usedBy: { $exists: true } },
                    { providers: { $exists: true } },
                    { mediaProvider: { $exists: true } },
                    { info: { $exists: true } },
                ]
            },
            {
                _id: 1
            }
        );

        for(let settings of allSettings) {
            // Rename "usedBy" to "environment" and leave project-wide entries without an "environment" variable
            if(settings.usedBy !== 'project') {
                settings.environment = settings.usedBy;
            }
            
            delete settings.usedBy;
            
            // Turn media provider from the old "connection" entity type into a deployer
            let mediaProviderId = null;

            if(settings.providers && settings.providers.media) {
                mediaProviderId = settings.providers.media;
            } else if(settings.mediaProvider) {
                mediaProviderId = settings.mediaProvider;
            }

            if(mediaProviderId) {
                let connection = await HashBrown.Service.DatabaseService.findOne(
                    projectId,
                    settings.environment + '.connections',
                    {
                        id: mediaProviderId
                    }
                );

                if(connection) {
                    settings.mediaDeployer = connection.deployer;

                    if(settings.mediaDeployer && settings.mediaDeployer.paths) {
                        settings.mediaDeployer.path = settings.mediaDeployer.paths.media;
                    
                        delete settings.mediaDeployer.paths;
                    }
                        
                    delete settings.mediaDeployer.name;
                }
            }

            delete settings.providers;
            
            // Reassign "name" from the old "info" object
            if(settings.info && settings.info.name) {
                settings.name = settings.info.name;
            }

            delete settings.info;

            await HashBrown.Service.DatabaseService.replaceOne(
                projectId,
                'settings',
                {
                    _id: settings._id
                },
                settings
            );
        }
    }

    /**
     * Cleans up
     *
     * @param {String} projectId
     */
    static async cleanup(projectId) {
        checkParam(projectId, 'projectId', String, true);

        let collections = await HashBrown.Service.DatabaseService.listCollections(projectId);
        
        for(let collection of collections) {
            if(!collection || !collection.name) { continue; }

            // Remove "connections" collection
            if(collection.name.indexOf('.connections') > -1) {
                await HashBrown.Service.DatabaseService.dropCollection(projectId, collection.name);
            }
        }
    }
}

module.exports = MigrationService;
