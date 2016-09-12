'use strict';

let Entity = require('../../common/models/Entity');

/**
 * The base class for all tasks
 */
class Task extends Entity {
    structure() {
        this.def(String, 'type');
        this.def(Date, 'date');
        this.def(String, 'content');
        this.def(String, 'project');
        this.def(String, 'environment');
    }

    /**
     * Checks if a task is overdue
     *
     * @returns {Boolean} Overdue
     */
    isOverdue() {
        return this.date && this.date <= new Date();
    }
}

module.exports = Task;
