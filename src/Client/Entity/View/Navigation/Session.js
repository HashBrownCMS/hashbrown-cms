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

        HashBrown.Service.EventService.trigger('resource');  

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
            UI.errorModal(e);

        }
    }

    /**
     * Event: Clicked content help
     */
    onClickContentHelp() {
        HashBrown.Service.ContentService.startTour();
    }

    /**
     * Event: Clicked media help
     */
    onClickMediaHelp() {
        new HashBrown.Entity.View.Modal.ModalBase({
            model: {
                heading: 'Media',
                message: 'This is a gallery of your statically hosted files, such as images, videos and PDFs. The contents of this gallery depends on which <a href="#/connections/">Connection</a> has been set up as the Media provider'
            }
        });
    }
    
    /**
     * Event: Clicked forms help
     */
    onClickFormsHelp() {
        HashBrown.Service.FormService.startTour();
    }
    
    /**
     * Event: Clicked connections help
     */
    onClickConnectionsHelp() {
        HashBrown.Service.ConnectionService.startTour();
    }
    
    /**
     * Event: Clicked schemas help
     */
    onClickSchemasHelp() {
        new HashBrown.Entity.View.Modal.ModalBase({
            model: {
                heading: 'Schemas',
                message: 'This is a library of content structures. Here you define how your editable content looks and behaves. You can define schemas for both content nodes and property fields.'
            }
        });
    }
}

module.exports = Session;
