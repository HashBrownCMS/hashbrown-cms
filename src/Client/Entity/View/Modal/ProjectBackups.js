'use strict';

/**
 * The backup list for projects
 * 
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class ProjectBackups extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/projectBackups');
    }

    /**
     * Gets the name of a backup timestamp
     *
     * @param {String|Number} timestamp
     *
     * @return {String} Name
     */
    getBackupName(timestamp) {
        if(typeof timestamp === 'string' && !isNaN(timestamp)) {
            timestamp = parseInt(timestamp);
        }

        return isNaN(new Date(timestamp)) ? timestamp : new Date(timestamp).toString();
    }

    /**
     * Event: Clicked download backup
     */
    onClickDownloadBackup(backup) {
        location = HashBrown.Service.RequestService.environmentUrl('projects/' + this.model.id + '/backups/' + backup);
    }
    
    /**
     * Event: Click backup button
     */
    async onClickCreateBackup() {
        if(!this.context.user.isAdmin) { return; }

        try {
            let timestamp = await HashBrown.Service.RequestService.request('post', 'projects/' + this.model.id + '/backups/new');
            this.model.backups.push(timestamp);
          
            this.trigger('change');
            this.reset();

        } catch(e) {
            this.setErrorState(e);

        }
    }

    /**
     * Event: Click upload button
     */
    onClickUploadBackup() {
        this.state.name = 'uploading';

        this.render();
    }

    /**
     * Event: Submitted backup
     */
    async onSubmitBackup(files) {
        let timestamp = await HashBrown.Service.RequestService.request('post', 'projects/' + this.model.id + '/backups/upload', { files: files });

        this.model.backups.push(timestamp);

        this.trigger('change');
        this.reset();
    }

    /**
     * Event: Click restore backup button
     *
     * @param {String} timestamp
     */
    onClickRestoreBackup(timestamp) {
        if(!this.context.user.isAdmin) { return; }
        
        this.state.name = 'restoring';
        this.state.backupTimestamp = timestamp;
        this.state.backupName = this.getBackupName(timestamp);
    
        this.render();
    }
    
    /**
     * Event: Click confirm backup restoration
     */
    async onClickConfirmRestoreBackup(e) {
        try {
            let timestamp = await HashBrown.Service.RequestService.request('post', 'projects/' + this.model.id + '/backups/' + this.state.backupTimestamp + '/restore');

            this.trigger('change');
            this.reset();

        } catch(e) {
            this.setErrorState(e);            

        }
    }

    /**
     * Event: Click delete backup button
     */ 
    onClickDeleteBackup(timestamp) {
        if(!this.context.user.isAdmin) { return; }
        
        this.state.name = 'deleting';
        this.state.backupTimestamp = timestamp;
        this.state.backupName = this.getBackupName(timestamp);
   
        this.render();
    }
    
    /**
     * Event: Click confirm backup deletion
     */
    async onClickConfirmDeleteBackup(e) {
        try {
            await HashBrown.Service.RequestService.request('delete', 'projects/' + this.model.id + '/backups/' + this.state.backupTimestamp);
            
            let index = this.model.backups.indexOf(this.state.backupTimestamp);

            if(index > -1) {
                this.model.backups.splice(index, 1);
            }

            this.trigger('change');
            this.reset();
    
        } catch(e) {
            this.setErrorState(e);            

        }
    }
}

module.exports = ProjectBackups;
