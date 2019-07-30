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
     * Gets all items
     */
    async fetch() {
        this.items = await HashBrown.Helpers.FormHelper.getAllForms();

        super.fetch();
    }

    /**
     * Event: Click create new form
     */
    async onClickNewForm() {
        let newForm = await HashBrown.Helpers.ResourceHelper.new(HashBrown.Models.Form, 'forms');
            
        location.hash = '/forms/' + newForm.id;
    }
    
    /**
     * Event: On click remove
     */
    async onClickRemoveForm() {
        let id = $('.context-menu-target').data('id');
        let form = await HashBrown.Helpers.FormHelper.getFormById(id);

        UI.confirmModal(
            'delete',
            'Delete form',
            'Are you sure you want to delete the form "' + form.title + '"?',
            async () => {
                await HashBrown.Helpers.ResourceHelper.remove('forms', id);
            }
        );
    }
    
    /**
     * Event: Click pull Form
     */
    async onClickPullForm() {
        let id = $('.context-menu-target').data('id');

        await HashBrown.Helpers.ResourceHelper.pull('forms', id);
    }
    
    /**
     * Event: Click push Form
     */
    async onClickPushForm() {
        let id = $('.context-menu-target').data('id');

        await HashBrown.Helpers.ResourceHelper.push('forms', id);
    }
    
    /**
     * Item context menu
     */
    getItemContextMenu(item) {
        let menu = {};
        let isSyncEnabled = HashBrown.Context.projectSettings.sync.enabled;
        
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

        return menu;
    }
    
    /**
     * General context menu
     */
    getPaneContextMenu() {
        return {
            'Forms': '---',
            'New form': () => { this.onClickNewForm(); }
        }
    }
}

module.exports = FormsPane;
