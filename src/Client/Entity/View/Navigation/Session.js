'use strict';

/**
 * The session menu
 *
 * @memberof HashBrown.Client.Entity.View.Navigation
 */
class Session extends HashBrown.Entity.View.Navigation.NavigationBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/navigation/session');
    }
   
    /**
     * Fetches the model data
     */
    async fetch() {
        this.state.isDashboard = !this.context.project;
        this.state.languageOptions = [];
        
        if(this.context.project) {
            this.state.languageOptions = this.context.project.settings.languages;
        }
    }

    /**
     * Event: Changed language
     *
     * @param {String} newLanguage
     */
    async onChangeLanguage(newLanguage) {
        localStorage.setItem('language', newLanguage);
        
        HashBrown.Client.language = newLanguage;

        HashBrown.Service.EventService.trigger('language');  

        this.update();
    }

    /**
     * Event: Clicked user settings
     */
    onClickUserSettings() {
        HashBrown.Entity.View.Modal.UserEditor.new({ modelId: this.context.user.id });
    }

    /**
     * Event: Clicked log out
     */
    async onClickLogOut() {
        try {
            await HashBrown.Service.RequestService.customRequest('post', '/api/user/logout')

            location.reload();

        } catch(e) {
            UI.error(e);

        }
    }
}

module.exports = Session;
