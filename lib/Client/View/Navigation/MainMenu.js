'use strict';

/**
 * The main menu
 * 
 * @memberof HashBrown.Client.View.Navigation
 */
class MainMenu extends Crisp.View {
    constructor(params) {
        super(params);
        
        $('.page--environment__space--menu').html(this.$element);
        
        this.fetch();
    }
    
    /**
     * Event: On change language
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
     * Event: Click question
     *
     * @param {String} topic
     */
    onClickQuestion(topic) {
        switch(topic) {
            case 'content':
                HashBrown.Service.ContentService.startTour();
                break;

            case 'media':
                UI.messageModal('Media', [
                    _.p('This is a gallery of your statically hosted files, such as images, videos and PDFs.'),
                    _.p('The contents of this gallery depends on which <a href="#/connections/">Connection</a> has been set up as the Media provider')
                ]);
                break;

            case'forms':
                HashBrown.Service.FormService.startTour();
                break;

            case 'connections':
                HashBrown.Service.ConnectionService.startTour();
                break;

            case 'schemas':
                UI.messageModal('Schemas', 'This is a library of content structures. Here you define how your editable content looks and behaves. You can define schemas for both content nodes and property fields.');
                break;
        }
    }

    /**
     * Gets the help options
     *
     * @return {Object} Options
     */
    getHelpOptions() {
        let helpOptions = {
            'Connections': () => { this.onClickQuestion('connections'); },
            'Content': () => { this.onClickQuestion('content'); },
            'Forms': () => { this.onClickQuestion('forms'); },
            'Media': () => { this.onClickQuestion('media'); },
            'Schema': () => { this.onClickQuestion('schemas'); }
        };

        if(!currentUserHasScope('connections')) { delete helpOptions['Connections']; }
        if(!currentUserHasScope('schemas')) { delete helpOptions['Schema']; }

        return helpOptions;
    }

    /**
     * Post render
     */
    postrender() {
        if(this.languageDropdown) {
            this.languageDropdown.notify(HashBrown.Context.language);
        }
    }

    /**
     * Renders this menu
     */
    template() {
        return _.div({class: 'main-menu widget-group'},
            _.if(HashBrown.Context.projectSettings.languages.length > 1,
                // Language picker
                this.languageDropdown = new HashBrown.View.Widget.Dropdown({
                    tooltip: 'Language',
                    icon: 'flag',
                    value: HashBrown.Context.language,
                    options: HashBrown.Context.projectSettings.languages,
                    onChange: (newValue) => {
                        this.onChangeLanguage(newValue);
                    }
                })
            ),

            // User dropdown
            this.userDropdown = new HashBrown.View.Widget.Dropdown({
                tooltip: 'Logged in as "' + (HashBrown.Context.user.fullName || HashBrown.Context.user.username) + '"',
                icon: 'user',
                reverseKeys: true,
                options: {
                    'User settings': () => { new HashBrown.View.Editor.UserEditor({ hidePermissions: true, model: HashBrown.Context.user }); },
                    'Log out': () => {
                        HashBrown.Service.RequestService.customRequest('post', '/api/user/logout')
                        .then(() => {
                            location = '/';
                        });
                    }
                }
            }),

            // Help
            this.helpDropdown = new HashBrown.View.Widget.Dropdown({
                tooltip: 'Get help',
                icon: 'question-circle',
                reverseKeys: true,
                options: this.getHelpOptions(),
            })
        );
    }
}

module.exports = MainMenu;
