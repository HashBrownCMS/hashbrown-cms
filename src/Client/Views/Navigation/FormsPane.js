'use strict';

/**
 * The Forms navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class FormsPane extends HashBrown.Views.Navigation.NavbarPane {
    static get route() { return '/forms/'; }
    static get label() { return 'Forms'; }
    static get icon() { return 'wpforms'; }
    
    /**
     * Event: Click create new form
     */
    static onClickNewForm() {
        HashBrown.Helpers.RequestHelper.request('post', 'forms/new')
        .then((newFormId) => {
            return HashBrown.Helpers.RequestHelper.reloadResource('forms')
            .then(() => {
                HashBrown.Views.Navigation.NavbarMain.reload();
                
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
                HashBrown.Helpers.RequestHelper.request('delete', 'forms/' + form.id)
                .then(() => {
                    debug.log('Removed Form with id "' + form.id + '"', view); 

                    return HashBrown.Helpers.RequestHelper.reloadResource('forms');
                })
                .then(() => {
                    HashBrown.Views.Navigation.NavbarMain.reload();

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
        HashBrown.Helpers.RequestHelper.request('post', 'forms/pull/' + pullId, {})
        
        // Upon success, reload all Form models    
        .then(() => {
            return HashBrown.Helpers.RequestHelper.reloadResource('forms');
        })

        // Reload the UI
        .then(() => {
            HashBrown.Views.Navigation.NavbarMain.reload();

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

        HashBrown.Helpers.RequestHelper.request('post', 'forms/push/' + pushId)
        .then(() => {
            return HashBrown.Helpers.RequestHelper.reloadResource('forms');
        })
        .then(() => {
            HashBrown.Views.Navigation.NavbarMain.reload();
        }) 
        .catch(UI.errorModal);
    }

    /**
     * Gets all items
     *
     * @returns {Promise} Items
     */
    static getItems() {
        return HashBrown.Helpers.FormHelper.getAllForms();
    }

    /**
     * Hierarchy logic
     */
    static hierarchy(item, queueItem) {
        queueItem.$element.attr('data-form-id', item.id);
       
        if(item.folder) {
            queueItem.createDir = true;
            queueItem.parentDirAttr = {'data-form-folder': item.folder };
        }
    }
    
    /**
     * Item context menu
     */
    static getItemContextMenu(item) {
        let menu = {};
        let isSyncEnabled = HashBrown.Helpers.SettingsHelper.getCachedSettings(HashBrown.Helpers.ProjectHelper.currentProject, null, 'sync').enabled;
        
        menu['This form'] = '---';

        menu['Open in new tab'] = () => { this.onClickOpenInNewTab(); };

        if(!item.sync.hasRemote && !item.sync.isRemote && !item.isLocked) {
            menu['Remove'] = () => { this.onClickRemoveForm(); };
        }
        
        menu['Copy id'] = () => { this.onClickCopyItemId(); };

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
        
        menu['General'] = '---';
        menu['New form'] = () => { this.onClickNewForm(); };
        menu['Refresh'] = () => { this.onClickRefreshResource('forms'); };

        return menu;
    }
    
    /**
     * General context menu
     */
    static getPaneContextMenu() {
        return {
            'Forms': '---',
            'New form': () => { this.onClickNewForm(); },
            'Refresh': () => { this.onClickRefreshResource('forms'); }
        }
    }
}

module.exports = FormsPane;
