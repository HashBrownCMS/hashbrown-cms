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
        this.model = await HashBrown.Service.RequestService.request('get', 'server/projects/' + this.modelId);
        this.model = new HashBrown.Entity.Project(this.model);
    }
        
    /**
     * Event: Click remove button
     */ 
    onClickRemove() {
        if(!HashBrown.Context.user.isAdmin) { return; }
        
        new HashBrown.Entity.View.Modal.DeleteProject({
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
        if(this.model.environments.length < 1) { return; }

        let modal = new HashBrown.Entity.View.Modal.ModalBase({
            model: {
                heading: `Remove environment "${environmentName}"`,
                message: `Are you sure want to remove the environment "${environmentName}" from the project "${this.model.settings.info.name || this.model.id}"?`
            }
        })
        .on('ok', async () => {
            try {
                await HashBrown.Service.RequestService.request('delete', 'server/projects/' + this.model.id + '/' + environmentName);

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
        
        new HashBrown.Entity.View.Modal.ProjectSettings({
            model: this.model
        })
        .on('change', () => { this.update(); });
    }
    
    /**
     * Event: Click backups button
     */
    onClickBackups() {
        if(!HashBrown.Context.user.isAdmin) { return; }
        
        new HashBrown.Entity.View.Modal.ProjectBackups({
            model: this.model
        })
        .on('change', () => { this.update(); });
    }

    /**
     * Event: Click migration button
     */
    onClickMigrate() {
        if(!HashBrown.Context.user.isAdmin) { return; }

        if(this.model.environments.length < 2) {
            UI.error(new Error('You need at least 2 environments to migrate resources'));
            return;
        }
    
        new HashBrown.Entity.View.Modal.MigrateResources({
            model: this.model
        })
        .on('change', () => { this.update(); });
    }

    /**
     * Event: Click add environment button
     */
    onClickAddEnvironment() {
        new HashBrown.Entity.View.Modal.AddEnvironment({
            model: this.model
        })
        .on('change', () => { this.update(); });
    }
}

module.exports = Project;
