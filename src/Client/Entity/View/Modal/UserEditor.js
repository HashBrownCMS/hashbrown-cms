'use strict';

/**
 * An editor for Users
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class UserEditor extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/userEditor');
    }

    /**
     * Fetches the model
     */
    async fetch() {
        this.state.projects = await HashBrown.Service.RequestService.customRequest('get', '/api/projects');
    }
   
    /**
     * Event: Change project scope
     */
    onChangeProjectScope(projectId, isEnabled) {
        if(isEnabled) {
            this.model.giveScope(projectId);
        } else {
            this.model.removeScope(projectId);
        }
    }
    
    /**
     * Event: Change resource scope
     */
    onChangeResourceScope(projectId, scopes) {
        this.model.scopes[projectId] = scopes;
    }
    
    /**
     * Event: Change username
     */
    onChangeUsername(username) {
        this.model.username = username;
    }
    
    /**
     * Event: Change full name
     */
    onChangeFullName(fullName) {
        this.model.fullName = fullName;
    }
    
    /**
     * Event: Change theme
     */
    onChangeTheme(theme) {
        this.model.theme = theme;
    }
    
    /**
     * Event: Change email
     */
    onChangeEmail(email) {
        this.model.email = email;
    }
    
    /**
     * Event: Change password
     */
    onChangePassword(newPassword) {
        this.state.newPassword = newPassword;
    }

    /**
     * Event: Change admin
     */
    onChangeAdmin(isAdmin) {
        this.model.isAdmin = isAdmin;

        this.render();
    }

    /**
     * Event: Click save.
     */
    async onClickSave() {
        try {
            let options = {};

            if(this.state.newPassword) {
                options.password = this.state.newPassword;
            }

            await HashBrown.Entity.User.save(options);
            
            this.close();

            let link = document.getElementById('theme');

            if(link) {
                link.setAttribute('href', '/css/theme.css?t=' + Date.now());
            }

            this.trigger('change', this.model);
        
        } catch(e) {
            this.setErrorState(e);

        }
    }
}

module.exports = UserEditor;
