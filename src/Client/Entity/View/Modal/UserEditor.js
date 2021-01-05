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
        this.model = await HashBrown.Entity.User.get(this.modelId);
        this.state.projects = await HashBrown.Entity.Project.list();
        this.state.localeOptions = {};

        for(let locale of this.context.locales) {
            let name = HashBrown.Service.LocaleService.getLocaleName(locale);

            this.state.localeOptions[name] = locale;
        }
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
     * Event: Change locale
     */
    onChangeLocale(locale) {
        this.model.locale = locale;
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

            await this.model.save(options);
            
            this.close();

            if(this.model.isCurrent) {
                location.reload();
            }

            this.trigger('change', this.model);
        
        } catch(e) {
            this.setErrorState(e);

        }
    }
}

module.exports = UserEditor;
