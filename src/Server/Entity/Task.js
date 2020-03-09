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
        this.def(String, 'project');
        this.def(String, 'environment');
    }

    /**
     * Gets the content
     *
     * @return {HashBrown.Entity.Resource.Content} Content
     */
    await getContent() {
        return await HashBrown.Entity.Resource.Content.get(this.content);
    }

    /**
     * Runs this task
     */
    async run() {
        if(!this.isOverdue()) { return; }

        debug.log(`Running ${this.type} task for "${this.content}"...`, this);
                
        try {
            let content = await this.getContent();
            
            if(!content) {
                throw new Error(`Content ${this.content} not found`);
            }

            switch(this.type) {
                case 'publish':
                    await content.publish(this.project, this.environment);
                    break;

                case 'unpublish':
                    await content.unpublish(this.project, this.environment);
                    break;
            }

        } catch(e) {
            debug.log(e.message + ', removing task...', this);
        
        } finally {
            await this.remove();
        }
    }

    /**
     * Removes this task
     */
    async remove() {
        await HashBrown.Service.DatabaseService.remove(
            'schedule',
            'tasks',
            {
                type: this.type,
                content: this.content,
                project: this.project,
                environment: this.environment
            }
        );
    }

    /**
     * Saves this task
     */
    async save() {
        // If the date is invalid, remove instead
        if(
            !this.date ||
            isNaN(new Date(this.date).getTime()) ||
            new Date(this.date) < new Date()
        ) {
            await this.remove();
       
        // Update in database
        } else {
            await HashBrown.Service.DatabaseService.updateOne(
                'schedule',
                'tasks',
                {
                    type: this.type,
                    content: this.content,
                    project: this.project,
                    environment: this.environment
                },
                this.getObject()
            );
        }
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

    /**
     * Gets a task
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} content
     * @param {String} type
     *
     * @return {HashBrown.Entity.Task} Task
     */
    static async get(project, environment, content, type) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(content, 'content', String, true);
        checkParam(type, 'type', String, true);

        let task = await HashBrown.Service.DatabaseService.findOne(
            'schedule',
            'tasks',
            {
                type: type,
                content: content,
                project: project,
                environment: environment
            }
        );

        if(!task) { return null; }

        return new this(task);
    }
    
    /**
     * Creates a task
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} content
     * @param {String} type
     *
     * @return {HashBrown.Entity.Task} Task
     */
    static async create(project, environment, content, type) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(content, 'content', String, true);
        checkParam(type, 'type', String, true);

        let task = await this.get(project, environment, content, type);

        if(!task) {
            task = new this({
                type: type,
                content: content,
                project: project,
                environment: environment
            });

            await task.save();
        }

        return task;
    }

    /**
     * Gets all tasks
     *
     * @param {Object} options
     *
     * @returns {Array} Tasks
     */
    static async list(options = {}) {
        let tasks = await HashBrown.Service.DatabaseService.find(
            'schedule',
            'tasks',
            options
        );
        
        for(let i in tasks) {
            tasks[i] = new this(tasks[i]);
        }

        return tasks;
    }
}

module.exports = Task;
