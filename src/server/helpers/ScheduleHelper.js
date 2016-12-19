'use strict';

let Task = require('../models/Task');

let watchInterval;

const WATCH_INTERVAL = 1000 * 60; // One minute

/**
 * A helper class for scheduling tasks
 */
class ScheduleHelper {
    /**
     * Starts wathing for tasks
     */
    static startWatching() {
        // Start the interval
        watchInterval = setInterval(() => {
            this.checkTasks();
        }, WATCH_INTERVAL);

        // Do an initial check
        this.checkTasks();
    }
        
    /**
     * Checks for potential tasks to do
     *
     * @returns {Promise} Promise
     */
    static checkTasks() {
        debug.log('Checking scheduled tasks...', this, 3);

        return this.getTasks()
        .then((tasks) => {
            let nextTask = (i) => {
                let task = tasks[i];

                if(task && task.isOverdue()) {
                    return this.runTask(task)
                    .then(() => {
                        return nextTask(i + 1);
                    })
                    .catch((e) => {
                        // If tasks will infinitely fail, they should be removed
                        // It will take up the entire log, if these errors occur every minute
                        if(e.message.indexOf('No connections defined') > -1) {
                            debug.log(e.message + ', removing task...', this);

                            this.removeTask(task.type, task.content, task.project, task.environment);

                        } else {
                            debug.log(e.message, this);
                        }
                    });
                
                } else {
                    return new Promise((resolve) => {
                        resolve();
                    });

                }
            };

            return nextTask(0);
        });
    }

    /**
     * Runs a task
     *
     * @param {Task} task
     *
     * @return {Promise} Promise
     */
    static runTask(
        task = requiredParam('task')
    ) {
        debug.log('Running ' + task.type + ' task for "' + task.content + '"...', this);    

        return ContentHelper.getContentById(task.project, task.environment, task.content)
        .then((content) => {
            switch(task.type) {
                case 'publish':
                    return ConnectionHelper.publishContent(task.project, task.environment, content)
                    .then(() => {
                        return this.removeTask(task.type, task.content, task.project, task.environment);
                    });
                    break;

                case 'unpublish':
                    return ConnectionHelper.unpublishContent(task.project, task.environment, content)
                    .then(() => {
                        return this.removeTask(task.type, task.content, task.project, task.environment);
                    });
                    break;
            }

            return new Promise((resolve) => { resolve(); });
        });
    }

    /**
     * Gets a list of scheduled tasks by query
     *
     * @param {String} type
     * @param {String} contentId
     * @param {Date} date
     *
     * @returns {Promise} An array of tasks
     */
    static getTasks(type, contentId, date) {
        let query = {};

        if(type) {
            query.type = type;
        }

        if(contentId) {
            query.content = contentId;
        }
        
        if(date) {
            query.date = date;
        }

        return MongoHelper.find(
            'schedule',
            'tasks',
            query
        ).then((tasks) => {
            for(let i in tasks) {
                tasks[i] = new Task(tasks[i]);
            }

            return new Promise((resolve) => {
                resolve(tasks);
            });
        });
    }

    /**
     * Updates a task
     *
     * @param {String} type
     * @param {String} contentId
     * @param {Date} date
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} Promise
     */
    static updateTask(
        type = requiredParam('type'),
        contentId = requiredParam('contentId'),
        date = requiredParam('date'),
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        // If the date is invalid, remove instead
        if(!date || isNaN(new Date(date).getTime()) || new Date(date).getFullYear() == 1970) {
            return this.removeTask(type, contentId, date, project, environment);
        }

        let task = new Task({
            type: type,
            content: contentId,
            date: date,
            project: project,
            environment: environment
        });

        let query = {
            type: type,
            content: contentId,
            project: project,
            environment: environment
        };

        debug.log('Updating ' + type + ' task for "' + contentId + '" to ' + date + '...', this);

        return MongoHelper.updateOne(
            'schedule',
            'tasks',
            query,
            task.getObject(),
            {
                upsert: true
            }
        );
    }

    /**
     * Removes a task
     *
     * @param {String} type
     * @param {String} contentId
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} Promise
     */
    static removeTask(
        type = requiredParam('type'),
        contentId = requiredParam('contentId'),
        date = requiredParam('date'),
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        let query = {
            type: type,
            content: contentId,
            project: project,
            environment: environment
        };
        
        debug.log('Removing ' + type + ' task for "' + contentId + '"...', this);

        return MongoHelper.remove(
            'schedule',
            'tasks',
            query
        );
    }
}

module.exports = ScheduleHelper;
