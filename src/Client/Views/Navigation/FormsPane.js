'use strict';

const ProjectHelper = require('Client/Helpers/ProjectHelper');
const RequestHelper = require('Client/Helpers/RequestHelper');

const NavbarPane = require('./NavbarPane');
const NavbarMain = require('./NavbarMain');

/**
 * The Forms navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class FormsPane extends NavbarPane {
    /**
     * Event: Click create new form
     */
    static onClickNewForm() {
        RequestHelper.request('post', 'forms/new')
        .then((newFormId) => {
            return RequestHelper.reloadResource('forms')
            .then(() => {
                NavbarMain.reload();
                
                location.hash = '/forms/' + newFormId;
            });
        })
        .catch(UI.errorModal);
    }
    
    /**
     * Event: On click remove
     */
    static onClickRemoveForm() {
        let view = this;
        let $element = $('.context-menu-target'); 
        let id = $element.data('id');
        let form = resources.forms.filter((form) => { return form.id == id; })[0];

        UI.confirmModal(
            'delete',
            'Delete form',
            'Are you sure you want to delete the form "' + form.title + '"?',
            () => {
                RequestHelper.request('delete', 'forms/' + form.id)
                .then(() => {
                    debug.log('Removed Form with id "' + form.id + '"', view); 

                    return RequestHelper.reloadResource('forms');
                })
                .then(() => {
                    NavbarMain.reload();

                    // Cancel the FormEditor view
                    location.hash = '/forms/';
                })
                .catch(UI.errorModal);
            }
        );
    }
    
    /**
     * Event: Click pull Form
     */
    static onClickPullForm() {
        let pullId = $('.context-menu-target').data('id');

        // API call to pull the Form by id
        RequestHelper.request('post', 'forms/pull/' + pullId, {})
        
        // Upon success, reload all Form models    
        .then(() => {
            return RequestHelper.reloadResource('forms');
        })

        // Reload the UI
        .then(() => {
            NavbarMain.reload();

			location.hash = '/forms/' + pullId;
		
			let editor = Crisp.View.get('FormEditor');

			if(editor && editor.model.id == pullId) {
                editor.model = null;
				editor.fetch();
			}
        }) 
        .catch(UI.errorModal);
    }
    
    /**
     * Event: Click push Form
     */
    static onClickPushForm() {
		let $element = $('.context-menu-target');
        let pushId = $element.data('id');

		$element.parent().addClass('loading');

        RequestHelper.request('post', 'forms/push/' + pushId)
        .then(() => {
            return RequestHelper.reloadResource('forms');
        })
        .then(() => {
            NavbarMain.reload();
        }) 
        .catch(UI.errorModal);
    }

    /**
     * Init
     */
    static init() {
        NavbarMain.addTabPane('/forms/', 'Forms', 'wpforms', {
            getItems: () => { return resources.forms; },

            // Hierarchy logic
            hierarchy: function(item, queueItem) {
                queueItem.$element.attr('data-form-id', item.id);
               
                if(item.folder) {
                    queueItem.createDir = true;
                    queueItem.parentDirAttr = {'data-form-folder': item.folder };
                }
            },
            
            // Item context menu
            getItemContextMenu: (item) => {
                let menu = {};
                let isSyncEnabled = HashBrown.Helpers.SettingsHelper.getCachedSettings(ProjectHelper.currentProject, null, 'sync').enabled;
                
                menu['This form'] = '---';
                menu['Copy id'] = () => { this.onClickCopyItemId(); };

                if(!item.sync.hasRemote && !item.sync.isRemote && !item.isLocked) {
                    menu['Remove'] = () => { this.onClickRemoveForm(); };
                }
                
                if(item.isLocked && !item.sync.isRemote) { isSyncEnabled = false; }

                if(isSyncEnabled) {
                    menu['Sync'] = '---';

                    if(!item.sync.isRemote) {
                        menu['Push to remote'] = () => { this.onClickPushForm(); };
                    }

                    if(item.sync.hasRemote) {
                        menu['Remove local copy'] = () => { this.onClickRemoveForm(); };
                    }
                    
                    if(item.sync.isRemote) {
                        menu['Pull from remote'] = () => { this.onClickPullForm(); };
                    }
                }
                
                menu['Forms'] = '---';
                menu['New form'] = () => { this.onClickNewForm(); };
                menu['Refresh'] = () => { this.onClickRefreshResource('forms'); };

                return menu;
            },
            
            // General context menu
            paneContextMenu: {
                'Forms': '---',
                'New form': () => { this.onClickNewForm(); },
                'Refresh': () => { this.onClickRefreshResource('forms'); }
            }
        });
    }
}

module.exports = FormsPane;
