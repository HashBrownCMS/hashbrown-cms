'use strict';

const DatabaseHelper = require('Server/Helpers/DatabaseHelper');
const SettingsHelperCommon = require('Common/Helpers/SettingsHelper');

/**
 * The helper class for settings
 *
 * @memberof HashBrown.Server.Helpers
 */
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
        return DatabaseHelper.databaseExists(project)
        .then((doesExist) => {
            if(!doesExist) {
                return Promise.reject(new Error('Project by id "' + project + '" not found'));
            }
        
            debug.log('Getting project settings...', this, 3);

            // Then get project settings
            return DatabaseHelper.find(
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

                return DatabaseHelper.find(
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
                    
                    return DatabaseHelper.remove(
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

            return DatabaseHelper.remove(
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

                return DatabaseHelper.insertOne(
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
        return DatabaseHelper.findOne(
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
        return HashBrown.Helpers.ProjectHelper.getAllProjects()
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
            return DatabaseHelper.findOne(project, 'settings', { usedBy: 'project' })
            .then((projectSettings) => {
                if(!projectSettings) {
                    projectSettings = {};
                }

                return Promise.resolve(projectSettings.sync || {});
            });
        }

        // Find the remote resource, if applicable
        return HashBrown.Helpers.SyncHelper.getResource(project, environment, 'settings')

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

            return DatabaseHelper.findOne(project, 'settings', query);
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
     * @param {Boolean} upsertEnvironment
     *
     * @return {Promise} promise
     */
    static setSettings(
        project = requiredParam('project'),
        environment = null,
        section = null,
        settings = requiredParam('settings'),
        upsertEnvironment = false
    ) {
        debug.log('Setting "' + section + '" to ' + JSON.stringify(settings), this, 3);
       
        // Check if the environment exists
        return HashBrown.Helpers.ProjectHelper.environmentExists(project, environment)
        .then((environmentExists) => {
            if(environment && !environmentExists && !upsertEnvironment) {
                return Promise.reject(new Error('Environment "' + environment + '" of project "' + project + '" could not be found'));
            }

            // First get the existing settings object
            return this.getSettings(project, environment);
        })
        .then((oldSettings) => {
            if(!oldSettings) {
                oldSettings = {};
            }

            // If the section is "sync", always set the local setting
            if(section === 'sync') {
                oldSettings.sync = settings;

                return DatabaseHelper.updateOne(project, 'settings', { usedBy: 'project' }, oldSettings, { upsert: true });
            }

            // Set the remote setting, if applicable
            return HashBrown.Helpers.SyncHelper.setResourceItem(project, environment, 'settings', section, settings)
            .then((isSyncEnabled) => {
                // If the setting was synced, resolve immediately
                if(isSyncEnabled) {
                    return Promise.resolve();
                }

                // If sync was not enabled, set the local setting instead
                let query = {};
                let newSettings = oldSettings;

                // If a section was provided, only set that setting
                if(section) {
                    newSettings[section] = settings;

                    // The field isn't necessary here, so remove it if it was set somewhere
                    delete newSettings[section].usedBy;

                // If not, replace all settings
                } else {
                    newSettings = settings;
                }

                // Set the environment/project that this setting is used by
                if(environment) {
                    newSettings.usedBy = environment;
                    query.usedBy = environment;
                } else {
                    newSettings.usedBy = 'project';
                    query.usedBy = 'project';
                }
                
                // Update the database
                return DatabaseHelper.updateOne(
                    project,
                    'settings',
                    query,
                    newSettings,
                    { upsert: true }
                );
            });
        });
    }
}

module.exports = SettingsHelper;
