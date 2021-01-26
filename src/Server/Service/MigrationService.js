'use strict';

const Path = require('path');

/**
 * The helper class for migrating older structures to new ones
 */
class MigrationService {
    /**
     * Runs all necessary migrations
     * 
     * @param {Boolean} skipCompleted
     */
    static async migrate(skipCompleted = true) {
        let availableMigrations = await HashBrown.Service.FileService.list(Path.join(APP_ROOT, 'migrations'));

        for(let filePath of availableMigrations) {
            let filename = Path.basename(filePath);

            if(filename[0] === '.' || Path.extname(filename) !== '.js') { continue; }

            // Determine version number from filename
            let version = filename.replace(/[^0-9.]/g, '').split('.').filter(Boolean).join('.');

            // Make sure version number contains 3 numbers
            if(version.split('.').length !== 3) { continue; }

            // Check if this migration has already been completed
            if(skipCompleted) {
                let completedMigration = await HashBrown.Service.DatabaseService.findOne('system', 'migrations', { version: version });

                if(completedMigration) { continue; }
            }
            
            // Start migration
            debug.log(`Migrating database to version ${version}...`, this);
            
            let migration = require(filePath);

            await migration();
            
            // Record migration
            await HashBrown.Service.DatabaseService.insertOne('system', 'migrations', {
                version: version,
                time: Date.now()
            });

            debug.log(`Done!`, this);
        }
    }
}

module.exports = MigrationService;
