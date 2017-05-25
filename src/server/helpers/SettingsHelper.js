'use strict';

let SettingsHelperCommon = require('../../common/helpers/SettingsHelper');

class SettingsHelper extends SettingsHelperCommon {
    /**
     * Migrates old settings format
     *
     * @param {String} project
     * @param {Boolean} commitChanges
     *
     * @returns {Promise} Promise
     */
    static migrateOldSettings(
        project = requiredParam('project'),
        commitChanges = false
    ) {
        debug.log('Migrating old settings for project "' + project + '"...', this);

        let collection = [];
        
        let newProjectSettings = {
            usedBy: 'project'
        };

        collection.push(newProjectSettings);

        // First check if project exists
        return MongoHelper.databaseExists(project)
        .then((doesExist) => {
            if(!doesExist) {
                return Promise.reject(new Error('Project by id "' + project + '" not found'));
            }
        
            debug.log('Getting project settings...', this, 3);

            // Then get project settings
            return MongoHelper.find(
                project,
                'settings',
                {}
            );
        })
        .then((projectSettings) => {
            if(!projectSettings) {
                return Promise.reject(new Error('Project settings for "' + project + '" not found'));
            }
            
            // Make sure there is a "live" environment
            if(!projectSettings.environments) {
                projectSettings.environments = { names: [ 'live' ] };
            }

            for(let section of projectSettings) {
                let sectionKey = section.section;

                // We're handling environments a little differently now, so skip this key
                if(sectionKey === 'environments') { continue; }

                delete section.section;

                newProjectSettings[sectionKey] = section;
            }
            
            // Then parse all environments
            let parseNextEnvironment = () => {
                let environment = projectSettings.environments.names.pop();

                if(!environment) {
                    return Promise.resolve();
                }
            
                debug.log('Getting settings for environment "' + environment + '"...', this, 3);

                return MongoHelper.find(
                    project, 
                    environment + '.settings',
                    {}
                ).then((environmentSettings) => {
                    if(!environmentSettings) {
                        return Promise.reject(new Error('Environment settings for "' + project + '/' + environment + '" not found'));
                    }

                    let newEnvironmentSettings = {
                        usedBy: environment
                    };

                    collection.push(newEnvironmentSettings);

                    for(let section of environmentSettings) {
                        let sectionKey = section.section;

                        delete section.section;

                        if(sectionKey === 'sync') {
                            newProjectSettings.sync = {
                                project: section.project,
                                url: section.url,
                                token: section.token
                            }
                        } else {
                            newEnvironmentSettings[sectionKey] = section;
                        }
                    }

                    // Delete old docs
                    debug.log('Deleting old settings for "' + project + '/' + environment + '"...', this, 3);
                    
                    if(!commitChanges) { return Promise.resolve(); }
                    
                    return MongoHelper.remove(
                        project,
                        environment + '.settings',
                        {}
                    );
                })
                .then(() => {
                    return parseNextEnvironment();  
                });
            };
            
            return parseNextEnvironment();
        })

        // Delete old project settings
        .then(() => {
            debug.log('Deleting old project settings...', this, 3);

            if(!commitChanges) { return Promise.resolve(); }

            return MongoHelper.remove(
                project,
                'settings',
                {}
            );
        })

        // Insert new collections
        .then(() => {
            debug.log('Inserting new collections...', this, 3);
            
            let insertNextSetting = () => {
                let setting = collection.pop();

                if(!setting) {
                    return Promise.resolve();
                }

                debug.log('Inserting "' + setting.usedBy + '": ' + JSON.stringify(setting) + '...', this, 3);
                    
                if(!commitChanges) { return insertNextSetting(); }

                return MongoHelper.insertOne(
                    project,
                    'settings',
                    setting
                ).then(() => {
                    return insertNextSetting();
                });
            };

            return insertNextSetting();
        })
        
        // Done    
        .then(() => {
            debug.log('Done migrating settings for project "' + project + '"!', this);
        });
    }

    /**
     * Checks if migration is needed
     * This is determined by the existence of the "section" key within any setting 
     *
     * @param {String} project
     *
     * @returns {Boolean} Migration is needed or not
     */
    static checkIfNeedsMigration(
        project = requiredParam('project')
    ) {
        return MongoHelper.findOne(
            project,
            'settings',
            { section: { $exists: true } }
        ).then((projectSettings) => {
            if(projectSettings && Object.keys(projectSettings).length > 0) {
                return Promise.resolve(true);
            }

            return Promise.resolve(false);
        });
    }

    /**
     * Migration check for all projects
     *
     * @returns {Promise} Result
     */
    static migrationCheck() {
        return ProjectHelper.getAllProjects()
        .then((projects) => {
            let checkNext = () => {
                let project = projects.pop();

                if(!project) {
                    return Promise.resolve();
                }
            
                return this.checkIfNeedsMigration(project)
                .then((needsMigration) => {
                    if(!needsMigration) {
                        return Promise.resolve();
                    }

                    return this.migrateOldSettings(project, true);
                })
                .then(() => {
                    return checkNext();  
                });
            };

            return checkNext();
        });
    }

    /**
     * Gets all settings
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} section
     *
     * @return {Promise} Settings
     */
    static getSettings(
        project = requiredParam('project'),
        environment = null,
        section = null
    ) {
        // Is the environment is a wildcard, just discard it
        if(environment === '*') {
            environment = null;
        }

        // If the requested section is "sync", always return the local setting
        if(section === 'sync') {
            return MongoHelper.findOne(project, 'settings', { usedBy: 'project' })
            .then((projectSettings) => {
                if(!projectSettings) {
                    projectSettings = {};
                }

                return Promise.resolve(projectSettings.sync || {});
            });
        }

        // Find the remote resource, if applicable
        return SyncHelper.getResource(project, environment, 'settings')
        .catch((e) => {
            if(e.message) {
                debug.log(e.message, SettingsHelper);
            }

            return Promise.resolve(null);  
        })

        // Process local settings, if applicable
        .then((remoteSettings) => {
            // If the remote settings were found, return it
            if(remoteSettings && !Array.isArray(remoteSettings)) {
                return Promise.resolve(remoteSettings);
            }

            // If not, get the local settings instead
            let query = { usedBy: 'project' };

            if(environment) {
                query.usedBy = environment;
            }

            return MongoHelper.findOne(project, 'settings', query);
        })

        // Return appropriate section or all settings
        .then((settings) => {
            if(!settings) {
                settings = {};
            }

            // If a section was specified, only return this content
            if(section) {
                return Promise.resolve(settings[section]);
            }

            return Promise.resolve(settings);
        });
    }
    
    /**
     * Sets settings
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} section
     * @param {Object} settings
     *
     * @return {Promise} promise
     */
    static setSettings(
        project = requiredParam('project'),
        environment = null,
        section = null,
        settings = requiredParam('settings')
    ) {
        debug.log('Setting "' + section + '" to ' + JSON.stringify(settings), this, 3);
        
        // First get the existing settings object
        return this.getSettings(project, environment)
        .then((oldSettings) => {
            if(!oldSettings) {
                oldSettings = {};
            }

            // If the section is "sync", always set the local setting
            if(section === 'sync') {
                oldSettings.sync = settings;

                return MongoHelper.updateOne(project, 'settings', { usedBy: 'project' }, oldSettings);
            }

            // Set the remote setting, if applicable
            return SyncHelper.setResourceItem(project, environment, 'settings', section, settings)
            .then((isSyncEnabled) => {
                // If the setting was synced, resolve immediately
                if(isSyncEnabled) {
                    return Promise.resolve();
                }

                // If sync was not enabled, set the local setting instead
                let query = { usedBy: 'project' };
                oldSettings.usedBy = 'project';

                if(environment) {
                    query.usedBy = environment;
                    oldSettings.usedBy = environment;
                }
                
                // If a section was provided, only set that setting
                if(section) {
                    oldSettings[section] = settings;

                // If not, replace all settings
                } else {
                    oldSettings = settings;
                }

                return MongoHelper.updateOne(project, 'settings', query, oldSettings, { upsert: true });
            });
        });
    }
}

module.exports = SettingsHelper;
