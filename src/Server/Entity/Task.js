'use strict';

/**
 * The base class for all tasks
 *
 * @memberof HashBrown.Server.Entity
 */
class Task extends HashBrown.Entity.EntityBase {
    structure() {
        this.def(String, 'type');
        this.def(Date, 'date');
        this.def(String, 'content');
        this.def(String, 'user');
        this.def(String, 'project');
        this.def(String, 'environment');
    }

    /**
     * Checks if a task is overdue
     *
     * @returns {Boolean} Overdue
     */
    isOverdue() {
        if(!this.date || isNaN(this.date.getTime()) || this.date.getFullYear() == 1970) {
            debug.log('Task in "' + this.project + '/' + this.environment + '" for content "' + this.content + '" has an invalid date', this);
            return false;
        }
       
        return this.date <= new Date();
    }
}

module.exports = Task;
