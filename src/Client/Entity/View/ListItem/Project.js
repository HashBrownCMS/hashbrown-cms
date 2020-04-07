'use strict';

/**
 * The editor for projects as seen on the dashboard
 *
 * @memberof HashBrown.Client.Entity.View.ListItem
 */
class Project extends HashBrown.Entity.View.ListItem.ListItemBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/listItem/project');
    }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'modelId');
    }

    /**
     * Fetches the model
     */
    async fetch() {
        this.model = await HashBrown.Entity.Project.get(this.modelId);
    }
        
    /**
     * Event: Click remove button
     */ 
    onClickRemove() {
        if(!HashBrown.Context.user.isAdmin) { return; }
        
        HashBrown.Entity.View.Modal.DeleteProject.new({
            model: this.model
        })
        .on('change', () => { this.remove(); });
    }

    /**
     * Event: Click remove environment
     *
     * @param {String} environmentName
     */
    onClickRemoveEnvironment(environmentName) {
        if(!HashBrown.Context.user.isAdmin) { return; }
        if(this.model.environments.length < 1) { return; }

        let modal = HashBrown.Entity.View.Modal.ModalBase.new({
            model: {
                heading: `Remove environment "${environmentName}"`,
                message: `Are you sure want to remove the environment "${environmentName}" from the project "${this.model.getName()}"?`
            }
        })
        .on('ok', async () => {
            try {
                await HashBrown.Service.RequestService.request('delete', 'projects/' + this.model.id + '/environments/' + environmentName);

                this.update();

            } catch(e) {
                modal.setErrorState(e);

            }
        });
    }
    
    /**
     * Event: Click settings button
     */
    onClickSettings() {
        if(!HashBrown.Context.user.isAdmin) { return; }
        
        HashBrown.Entity.View.Modal.ProjectSettings.new({
            model: this.model
        })
        .on('change', () => { this.update(); });
    }
    
    /**
     * Event: Click backups button
     */
    onClickBackups() {
        if(!HashBrown.Context.user.isAdmin) { return; }
        
        HashBrown.Entity.View.Modal.ProjectBackups.new({
            model: this.model
        })
        .on('change', () => { this.update(); });
    }

    /**
     * Event: Click add environment button
     */
    onClickAddEnvironment() {
        HashBrown.Entity.View.Modal.AddEnvironment.new({
            model: this.model
        })
        .on('change', () => { this.update(); });
    }
}

module.exports = Project;
