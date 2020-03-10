'use strict';

/**
 * The project settings editor
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class ProjectSettings extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/projectSettings');
    }

    /**
     * Event: Change name
     */
    onChangeName(projectName) {
        this.model.settings.info.name = projectName;
    }

    /**
     * Event: Change languages
     */
    onChangeLanguages(languages) {
        this.model.settings.languages = languages;
    }

    /**
     * Event: Toggle sync on/off
     */
    onToggleSync(isEnabled) {
        this.model.settings.sync.enabled = isEnabled;
    }
    
    /**
     * Event: Change sync URL
     */
    onChangeSyncUrl(newUrl) {
        this.model.settings.sync.url = newUrl;
    }

    /**
     * Event: Change sync project
     */
    onChangeSyncProject(newProjectId) {
        this.model.settings.sync.project = newProjectId;
    }
    
    /**
     * Event: Change sync token
     */
    onChangeSyncToken(newToken) {
        this.model.settings.sync.token = newToken;
    }
   
    /**
     * Event: Click remote login
     */
    async onClickRemoteLogin() {
        try {
            let username = this.element.querySelector('input[name="username"]').value;
            let password = this.element.querySelector('input[name="password"]').value;
            let url = this.model.settings.sync.url;
   
            if(username && password && url) {
                let token = await HashBrown.Service.RequestService.request( 'post', this.model.settings.sync.project + '/sync/login', { username: username, password: password, url: url });

                this.model.settings.sync.token = token;
                
                this.element.querySelector('input[name="token"]').value = token;
            }

        } catch(e) {
            UI.error(e);

        }
        
        let inputGroup = this.element.querySelector('.modal--project-settings__sync-token__input');
        let loginGroup = this.element.querySelector('.modal--project-settings__sync-token__login');
    
        inputGroup.removeAttribute('style');
        loginGroup.style.display = 'none';
    }

    /**
     * Event: Click get sync token
     */
    onClickGetSyncToken() {
        if(!this.model.settings.sync.url) { return; }
    
        let inputGroup = this.element.querySelector('.modal--project-settings__sync-token__input');
        let loginGroup = this.element.querySelector('.modal--project-settings__sync-token__login');
    
        inputGroup.style.display = 'none';
        loginGroup.removeAttribute('style');
    }

    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    async onClickSave() {
        try {
            await this.model.save();
            
            this.close();

            this.trigger('change');
       
        } catch(e) {
            UI.error(e);
        
        }
    }    
}

module.exports = ProjectSettings;
