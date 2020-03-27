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
        setInterval(this.checkTasks, WATCH_INTERVAL);

        this.checkTasks();
    }
        
    /**
     * Checks for potential tasks to do
     *
     * @returns {Promise} Promise
     */
    static async checkTasks() {
        let tasks = await HashBrown.Entity.Task.list();

        for(let task of tasks) {
            if(!task || !task.isOverdue()) { continue; }

            await task.run();
        }
    }
}

module.exports = ScheduleService;
