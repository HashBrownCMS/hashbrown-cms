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
        let allLocaleOptions = HashBrown.Service.LocaleService.getLocaleOptions(true);

        this.state.isDashboard = !this.context.project;
        this.state.localeOptions = {};
        
        if(this.context.project) {
            for(let locale of this.context.project.settings.locales) {
                this.state.localeOptions[HashBrown.Service.LocaleService.getLocaleName(locale)] = locale;
            }
        }
    }

    /**
     * Event: Changed locale
     *
     * @param {String} newLocale
     */
    async onChangeLocale(newLocale) {
        localStorage.setItem('locale', newLocale);
        
        HashBrown.Client.locale = newLocale;

        HashBrown.Service.EventService.trigger('locale');

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
