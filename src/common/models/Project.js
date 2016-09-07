'use strict';

let Entity = require('./Entity');

class Project extends Entity {
    structure() {
        this.def(String, 'name', 'noname');
        this.def(Array, 'users', []);
        this.def(Array, 'backups', []);
        this.def(Object, 'settings', {});
    }
}

module.exports = Project;
