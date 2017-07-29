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
        super(params);

        this.sanityCheck();
    }

    sanityCheck() {
        if(!this.settings) { this.settings = {}; }
        if(!this.settings.info) { this.settings.info = {}; }
        if(!this.settings.languages) { this.settings.languages = [ 'en' ]; }
    
        if(!Array.isArray(this.settings.languages)) {
            let languages = [];
            
            for(let key in this.settings.languages) {
                if(key === 'section') { continue; }

                languages.push(this.settings.languages[key]);
            }

            this.settings.languages = languages;
        }
    }

    structure() {
        this.def(String, 'id');
        this.def(Array, 'users', []);
        this.def(Object, 'settings', {});
        this.def(Array, 'environments', [ 'live'  ]);
        this.def(Boolean, 'useAutoBackup');
        this.def(Array, 'backups', []);
        this.def(String, 'backupStorage', 'local');
    }

    static create(name) {
        let project = new Project();

        let id = name.toLowerCase();
        id = id.replace('.', '_');
        id = id.replace(/[^a-z_]/g, '');
        
        project.id = id;

        project.settings.usedBy = 'project';
        project.settings.info = {
            name: name
        };

        return project;
    }
}

module.exports = Project;
