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
        this.state.projects = await HashBrown.Service.RequestService.customRequest('get', '/api/server/projects');
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
            let newUserObject = this.model.getObject();

            if(this.state.newPassword) {
                newUserObject.password = this.state.newPassword;
            }

            await HashBrown.Service.ResourceService.set('users', this.model.id, newUserObject);
            
            this.close();

            this.trigger('change', this.model);
        
        } catch(e) {
            this.setErrorState(e);

        }
    }
}

module.exports = UserEditor;
