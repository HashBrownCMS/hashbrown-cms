'use strict';

let Entity = require('./Entity');
let Connection = require('./Connection');

class Project extends Entity {
    structure() {
        this.def(String, 'id');
        this.def(Array, 'users', []);
        this.def(Object, 'settings', {});
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

        project.settings.info = {
            section: 'info',
            name: name
        };

        return project;
    }
}

module.exports = Project;
