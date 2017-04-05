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
        debug.log('Checking scheduled tasks...', this, 4);

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
                            debug.log(e.message + ', removing task...', this, 2);

                            this.removeTask(task.project, task.environment, task.type, task.content);

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

        let user;

        return UserHelper.getUserById(task.user)
        .then((taskUser) => {
            user = taskUser;

            return ContentHelper.getContentById(task.project, task.environment, task.content);
        })
        .then((content) => {
            switch(task.type) {
                case 'publish':
                    return ConnectionHelper.publishContent(task.project, task.environment, content, user)
                    .then(() => {
                        return this.removeTask(task.project, task.environment, task.type, task.content);
                    });
                    break;

                case 'unpublish':
                    return ConnectionHelper.unpublishContent(task.project, task.environment, content, user)
                    .then(() => {
                        return this.removeTask(task.project, task.environment, task.type, task.content);
                    });
                    break;
            }

            return Promise.resolve();
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

            return Promise.resolve(tasks);
        });
    }

    /**
     * Updates a task
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} type
     * @param {String} contentId
     * @param {Date} date
     * @param {User} user
     *
     * @returns {Promise} Promise
     */
    static updateTask(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        type = requiredParam('type'),
        contentId = requiredParam('contentId'),
        date = requiredParam('date'),
        user = requiredParam('user')
    ) {
        // If the date is invalid, remove instead
        if(!date || isNaN(new Date(date).getTime()) || new Date(date).getFullYear() == 1970) {
            return Promise.reject(new Error('Date "' + date + '" is invalid'));
        }

        let task = new Task({
            type: type,
            content: contentId,
            date: date,
            project: project,
            environment: environment,
            user: user.id
        });

        let query = {
            type: type,
            content: contentId,
            project: project,
            environment: environment
        };

        debug.log('Updating ' + type + ' task for "' + contentId + '" to ' + date + '...', this, 2);

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
     * @param {String} project
     * @param {String} environment
     * @param {String} type
     * @param {String} contentId
     *
     * @returns {Promise} Promise
     */
    static removeTask(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        type = requiredParam('type'),
        contentId = requiredParam('contentId')
    ) {
        let query = {
            type: type,
            content: contentId,
            project: project,
            environment: environment
        };
        
        return MongoHelper.findOne(
            'schedule',
            'tasks',
            query
        )
        .then((task) => {
            if(!task) { return Promise.resolve(); }
           
            debug.log('Removing ' + type + ' task for "' + contentId + '"...', this, 2);

            return MongoHelper.remove(
                'schedule',
                'tasks',
                query
            );
        });
    }
}

module.exports = ScheduleHelper;
