'use strict';

let Entity = require('./Entity');

class Project extends Entity {
    structure() {
        this.def(String, 'id');
        this.def(Array, 'users', []);
        this.def(Array, 'backups', []);
        this.def(Object, 'settings', {});
    }

    static create(name) {
        let project = new Project();

        let id = name.toLowerCase();
        id = id.replace(/[^a-z_.]/g, '');
        
        project.id = id;
        project.settings.info = {
            section: 'info',
            name: name
        };
    }
}

module.exports = Project;
