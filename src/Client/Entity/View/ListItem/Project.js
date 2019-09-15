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

        let modal = new HashBrown.View.Modal.Modal({
            title: 'Delete ' + this.model.settings.info.name,
            body: _.div({class: 'widget-group'},
                _.p({class: 'widget widget--label'}, 'Type the project name to confirm'),
                _.input({class: 'widget widget--input text', type: 'text', placeholder: this.model.settings.info.name})
                    .on('input', (e) => {
                        let $btn = modal.$element.find('.widget.warning');
                        let isMatch = $(e.target).val() == this.model.settings.info.name;
                        
                        $btn.toggleClass('disabled', !isMatch);
                    })
            ),
            actions: [
                {
                    label: 'Cancel',
                    class: 'default'
                },
                {
                    label: 'Delete',
                    class: 'warning disabled',
                    onClick: async () => {
                        try {
                            await HashBrown.Service.RequestService.request('delete', 'server/projects/' + this.model.id);

                            this.remove();

                        } catch(e) {
                            UI.errorModal(e); 
                        
                        }
                    }
                }
            ]
        });
    }

    /**
     * Event: Click remove environment
     *
     * @param {String} environmentName
     */
    onClickRemoveEnvironment(environmentName) {
        let modal = UI.confirmModal('Remove', 'Remove environment "' + environmentName + '"', 'Are you sure want to remove the environment "' + environmentName + '" from the project "' + (this.model.settings.info.name || this.model.id) + '"?', async () => {
            try {
                await HashBrown.Service.RequestService.request('delete', 'server/projects/' + this.model.id + '/' + environmentName);

                this.update();
            
            } catch(e) {
                UI.errorModal(e);

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
            UI.errorModal(new Error('You need at least 2 environments to migrate content'));
            return;
        }
    
        new HashBrown.View.Dashboard.MigrationEditor({
            model: this.model
        })
        .on('change', () => { this.update(); });
    }

    /**
     * Event: Click add environment button
     */
    onClickAddEnvironment() {
        let modal = new HashBrown.View.Modal.Modal({
            title: 'New environment for "' + this.model.settings.info.name + '"',
            body: _.div({class: 'widget-group'},
                _.label({class: 'widget widget--label'}, 'Environment name'),
                new HashBrown.View.Widget.Input({
                    placeholder: 'i.e. "testing" or "staging"'
                })
            ),
            actions: [
                {
                    label: 'Create',
                    onClick: () => {
                        let environmentName = modal.$element.find('input').val();

                        if(!environmentName) { return false; }

                        HashBrown.Service.RequestService.request('put', 'server/projects/' + this.model.id + '/' + environmentName)
                        .then(() => {
                            modal.close();

                            this.update();
                        })
                        .catch(UI.errorModal);

                        return false;
                    }
                }
            ]
        });
    }
}

module.exports = Project;
