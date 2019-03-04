'use strict';

let Entity = require('./Entity');
let Connection = require('./Connection');

/**
 * The Project class
 *
 * @memberof HashBrown.Common.Models
 */
class Project extends Entity {
    constructor(params) {
        super(Project.checkParams(params));
    }

    /**
     * Performs a sanity check of the params
     *
     * @param {Object} params
     *
     * @returns {Object} Params
     */
    static checkParams(params) {
        params = params || {};

        if(!params.id) { throw new Error('No id was provided for the Project constructor'); }

        if(!params.settings) { params.settings = {}; }
        if(!params.settings.info) { params.settings.info = {}; }
        if(!params.settings.info.name) { params.settings.info.name = params.id; }
        if(!params.settings.languages) { params.settings.languages = [ 'en' ]; }
        if(!params.settings.sync) { params.settings.sync = {}; }

        // Delete old flags
        delete params.useAutoBackup;
        delete params.backupStorage;

        // Restore from old languages structure
        if(!Array.isArray(params.settings.languages)) {
            let languages = [];
            
            for(let key in params.settings.languages) {
                if(key === 'section') { continue; }

                languages.push(params.settings.languages[key]);
            }

            params.settings.languages = languages;
        }

        return params;
    }

    /**
     * Defines the structure of this project
     */
    structure() {
        this.def(String, 'id');
        this.def(Array, 'users', []);
        this.def(Object, 'settings', {});
        this.def(Array, 'environments', []);
        this.def(Array, 'backups', []);
    }

    /**
     * Creates a database safe name
     *
     * @param {String} name
     *
     * @returns {String} Safe name
     */
    static safeName(name) {
        return name.toLowerCase().replace('.', '_').replace(/[^a-z_]/g, '');
    }
    
    /**
     * Creates a new project
     *
     * @param {String} name
     *
     * @returns {Project} New Project
     */
    static create(name) {
        let project = new Project({
            id: Entity.createId()
        });
        
        project.settings.usedBy = 'project';
        project.settings.info = {
            name: name
        };

        return project;
    }
}

module.exports = Project;
