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

        this.state.isDashboard = !HashBrown.Context.projectId;
        this.state.languageOptions = [];
        
        if(HashBrown.Context.projectSettings) {
            this.state.languageOptions = HashBrown.Context.projectSettings.languages;
        }
    }
    
    /**
     * Event: Changed language
     *
     * @param {String} newLanguage
     */
    async onChangeLanguage(newLanguage) {
        localStorage.setItem('language', newLanguage);
        HashBrown.Context.language = newLanguage;

        HashBrown.Service.EventService.trigger('language');  

        let contentEditor = Crisp.View.get('ContentEditor');

        if(contentEditor) {
            contentEditor.model = null;
            await contentEditor.fetch();
        }

        this.fetch();
    }

    /**
     * Event: Clicked user settings
     */
    onClickUserSettings() {
        new HashBrown.Entity.View.Modal.UserEditor({ model: HashBrown.Context.user });
    }

    /**
     * Event: Clicked log out
     */
    async onClickLogOut() {
        try {
            await HashBrown.Service.RequestService.customRequest('post', '/api/user/logout')

            location = '/login';

        } catch(e) {
            UI.error(e);

        }
    }
}

module.exports = Session;
