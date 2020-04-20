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
        this.def(String, 'user');
    }

    /**
     * Gets the content
     *
     * @return {HashBrown.Entity.Resource.Content} Content
     */
    async getContent() {
        let context = new HashBrown.Entity.Context({
            project: await HashBrown.Entity.Project.get(this.project),
            environment: this.environment,
            user: await HashBrown.Entity.User.get(this.user)
        });

        return await HashBrown.Entity.Resource.Content.get(context, this.content);
    }

    /**
     * Runs this task
     */
    async run() {
        if(!this.isOverdue()) { return; }

        debug.log(`Running ${this.type} task for ${this.content}...`, this);
                
        try {
            let content = await this.getContent();
            
            if(!content) {
                throw new Error(`Content ${this.content} not found`);
            }

            switch(this.type) {
                case 'publish':
                    await content.publish();
                    content.isPublished = true;
                    content.publishOn = null;
                    await content.save();
                    break;

                case 'unpublish':
                    await content.unpublish();
                    content.isPublished = false;
                    content.unpublishOn = null;
                    await content.save();
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
     * @param {HashBrown.Entity.Context} context
     * @param {String} content
     * @param {String} type
     *
     * @return {HashBrown.Entity.Task} Task
     */
    static async get(context, content, type) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(content, 'content', String, true);
        checkParam(type, 'type', String, true);

        let task = await HashBrown.Service.DatabaseService.findOne(
            'schedule',
            'tasks',
            {
                type: type,
                content: content,
                project: context.project.id,
                environment: context.environment
            }
        );

        if(!task) { return null; }

        return this.new(task);
    }
    
    /**
     * Creates a task
     *
     * @param {HashBrown.Entity.Context} context
     * @param {String} content
     * @param {String} type
     *
     * @return {HashBrown.Entity.Task} Task
     */
    static async create(context, content, type) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(content, 'content', String, true);
        checkParam(type, 'type', String, true);

        let task = this.new({
            type: type,
            content: content,
            project: context.project.id,
            environment: context.environment,
            user: context.user.id
        });

        await HashBrown.Service.DatabaseService.insertOne(
            'schedule',
            'tasks',
            task.getObject()
        );

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
        checkParam(options, 'options', Object, true);
        
        let tasks = await HashBrown.Service.DatabaseService.find('schedule', 'tasks', options);
        
        for(let i in tasks) {
            tasks[i] = this.new(tasks[i]);
        }

        return tasks;
    }
}

module.exports = Task;
