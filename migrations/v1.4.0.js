'use strict';
    
/**
 * The main migration task
 */
async function migrate() {
    let databases = await HashBrown.Service.DatabaseService.listDatabases();

    // Migrate users
    if(databases.indexOf('users') > -1) {
        debug.log('Migrating users...', HashBrown.Service.MigrationService);
        
        await HashBrown.Service.DatabaseService.dump('users');

        let users = await HashBrown.Service.DatabaseService.find('users', 'users');

        for(let user of users) {
            debug.log(`${user.id}`, HashBrown.Service.MigrationService);
            
            await HashBrown.Service.DatabaseService.updateOne('system', 'users', { id: user.id }, user, { upsert: true });
        }

        await HashBrown.Service.DatabaseService.dropDatabase('users');
        
        databases = await HashBrown.Service.DatabaseService.listDatabases();
    }

    // Migrate schedule
    if(databases.indexOf('schedule') > -1) {
        debug.log('Migrating schedule...', HashBrown.Service.MigrationService);
        
        await HashBrown.Service.DatabaseService.dump('schedule');

        let tasks = await HashBrown.Service.DatabaseService.find('schedule', 'tasks');

        for(let task of tasks) {
            debug.log(`${task.id}`, HashBrown.Service.MigrationService);
            
            await HashBrown.Service.DatabaseService.updateOne('system', 'tasks', { id: task.id }, task, { upsert: true });
        }

        await HashBrown.Service.DatabaseService.dropDatabase('schedule');
        
        databases = await HashBrown.Service.DatabaseService.listDatabases();
    }

    // Check each project
    for(let projectId of databases) {
        debug.log(`Migrating project ${projectId}...`, HashBrown.Service.MigrationService);

        debug.log('Creating backup...', HashBrown.Service.MigrationService);

        await HashBrown.Service.DatabaseService.dump(projectId);

        debug.log('Migrating settings...', HashBrown.Service.MigrationService);
        
        await migrateSettings(projectId);
        
        debug.log('Migrating publications...', HashBrown.Service.MigrationService);
        
        await migratePublications(projectId);
        
        debug.log('Migrating content...', HashBrown.Service.MigrationService);
        
        await migrateContent(projectId);
        
        debug.log('Migrating schemas...', HashBrown.Service.MigrationService);
        
        await migrateSchemas(projectId);
    }
}

/**
 * Migrates publications
 *
 * @param {String} projectId
 */
async function migratePublications(projectId) {
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

        // Remove "connections" collection
        await HashBrown.Service.DatabaseService.dropCollection(projectId, collection.name);
    }
}

/**
 * Migrates settings
 *
 * @param {String} projectId
 */
async function migrateSettings(projectId) {
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
 * Migrates content
 *
 * @param {String} projectId
 */
async function migrateContent(projectId) {
    checkParam(projectId, 'projectId', String, true);

    let project = await HashBrown.Entity.Project.get(projectId);

    for(let environment of await project.getEnvironments()) {
        let contents = await HashBrown.Service.DatabaseService.find(
            project.id,
            environment + '.content'
        );

        for(let content of contents) {
            // Remove "_multilingual" marker
            let recurse = (fields) => {
                if(
                    !fields ||
                    (
                        fields.constructor !== Object &&
                        fields.constructor !== Array
                    )
                ) { return; }

                delete fields._multilingual;

                for(let key in fields) {
                    recurse(fields[key]);
                }
            };

            recurse(content.properties);

            await HashBrown.Service.DatabaseService.updateOne(
                project.id,
                environment + '.content',
                { id: content.id },
                content
            );
        }
    }
}

/**
 * Migrates schemas
 *
 * @param {String} projectId
 */
async function migrateSchemas(projectId) {
    checkParam(projectId, 'projectId', String, true);

    let project = await HashBrown.Entity.Project.get(projectId);

    for(let environment of await project.getEnvironments()) {
        let schemas = await HashBrown.Service.DatabaseService.find(
            project.id,
            environment + '.schemas'
        );

        for(let schema of schemas) {
            schema.config = schema.config || {};
            
            // Reassign "fields.properties" to "config"
            if(schema.fields) {
                let properties = schema.fields.properties || {};
                delete schema.fields.properties;

                for(let k in schema.fields) {
                    schema.config[k] = schema.fields[k];
                }
                
                for(let k in properties) {
                    schema.config[k] = properties[k];
                }
                
                delete schema.fields;
            }

            // Rename "multilingual" to "isLocalized"
            let recurse = (fields) => {
                if(!fields || fields.constructor !== Object) { return; }

                if(fields.multilingual) {
                    fields.isLocalized = true;
                }

                delete fields.multilingual;

                for(let key in fields) {
                    recurse(fields[key]);
                }
            };
            
            recurse(schema.config);

            await HashBrown.Service.DatabaseService.updateOne(
                project.id,
                environment + '.schemas',
                { id: schema.id },
                schema
            );
        }
    }
}

module.exports = migrate;
