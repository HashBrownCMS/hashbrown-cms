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
        location = HashBrown.Service.RequestService.environmentUrl('server/backups/' + this.model.id + '/' + backup + '.hba');
    }
    
    /**
     * Event: Click backup button
     */
    async onClickCreateBackup() {
        if(!HashBrown.Context.user.isAdmin) { return; }

        try {
            let timestamp = await HashBrown.Service.RequestService.request('post', 'server/backups/' + this.model.id + '/new');
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
    async onSubmitBackup(formData) {
        let timestamp = await HashBrown.Service.RequestService.upload('server/backups/' + this.model.id + '/upload', formData);

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
        if(!HashBrown.Context.user.isAdmin) { return; }
        
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
            let timestamp = await HashBrown.Service.RequestService.request('post', 'server/backups/' + this.model.id + '/' + this.state.backupTimestamp + '/restore');

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
        if(!HashBrown.Context.user.isAdmin) { return; }
        
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
            await HashBrown.Service.RequestService.request('delete', 'server/backups/' + this.model.id + '/' + this.state.backupTimestamp);
            
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
