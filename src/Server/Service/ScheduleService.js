'use strict';

const WATCH_INTERVAL = 1000 * 60; // One minute

/**
 * A helper class for scheduling tasks
 *
 * @memberof HashBrown.Server.Service
 */
class ScheduleService {
    /**
     * Starts wathing for tasks
     */
    static startWatching() {
        // Start the interval
        setInterval(() => {
            this.checkTasks()
            .catch(debug.error);
        }, WATCH_INTERVAL);

        // Do an initial check
        this.checkTasks();
    }
        
    /**
     * Checks for potential tasks to do
     *
     * @returns {Promise} Promise
     */
    static async checkTasks() {
        debug.log('Checking scheduled tasks...', this, 4);

        let tasks = await this.getTasks();

        for(let task of tasks) {
            if(!task || !task.isOverdue()) { continue; }

            try {
                await this.runTask(task);
            
            } catch(e) {
                debug.log(e.message + ', removing task...', this, 2);
                await this.removeTask(task.project, task.environment, task.type, task.content);
            
            }
        }
    }

    /**
     * Runs a task
     *
     * @param {Task} task
     *
     * @return {Promise} Promise
     */
    static async runTask(task) {
        checkParam(task, 'task', HashBrown.Entity.Task);

        debug.log('Running ' + task.type + ' task for "' + task.content + '"...', this);

        let user = task.user ? await HashBrown.Service.UserService.getUserById(task.user) : null;
        let content = await HashBrown.Service.ContentService.getContentById(task.project, task.environment, task.content);
        
        switch(task.type) {
            case 'publish':
                await HashBrown.Service.ConnectionService.publishContent(task.project, task.environment, content, user);
                break;

            case 'unpublish':
                await HashBrown.Service.ConnectionService.unpublishContent(task.project, task.environment, content, user);
                break;
        }
                
        await this.removeTask(task.project, task.environment, task.type, task.content);
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

        return HashBrown.Service.DatabaseService.find(
            'schedule',
            'tasks',
            query
        ).then((tasks) => {
            for(let i in tasks) {
                tasks[i] = new HashBrown.Entity.Task(tasks[i]);
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
    static updateTask(project, environment, type, contentId, date, user = null) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(type, 'type', String);
        checkParam(contentId, 'contentId', String);
        checkParam(date, 'date', Date);
        checkParam(user, 'user', HashBrown.Entity.Resource.User);

        // If the date is invalid, remove instead
        if(!date || isNaN(new Date(date).getTime()) || new Date(date).getFullYear() == 1970) {
            return Promise.reject(new Error('Date "' + date + '" is invalid'));
        }

        let task = new HashBrown.Entity.Task({
            type: type,
            content: contentId,
            date: date,
            project: project,
            environment: environment,
            user: user ? user.id : null
        });

        let query = {
            type: type,
            content: contentId,
            project: project,
            environment: environment
        };

        debug.log('Updating ' + type + ' task for "' + contentId + '" to ' + date + '...', this, 2);

        return HashBrown.Service.DatabaseService.updateOne(
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
    static removeTask(project, environment, type, contentId) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(type, 'type', String);
        checkParam(contentId, 'contentId', String);

        let query = {
            type: type,
            content: contentId,
            project: project,
            environment: environment
        };
        
        return HashBrown.Service.DatabaseService.findOne(
            'schedule',
            'tasks',
            query
        )
        .then((task) => {
            if(!task) { return Promise.resolve(); }
           
            debug.log('Removing ' + type + ' task for "' + contentId + '"...', this, 2);

            return HashBrown.Service.DatabaseService.remove(
                'schedule',
                'tasks',
                query
            );
        });
    }
}

module.exports = ScheduleService;
