'use strict';

/**
 * The Forms navbar pane
 * 
 * @memberof HashBrown.Client.View.Navigation
 */
class FormPane extends HashBrown.View.Navigation.NavbarPane {
    static get route() { return '/forms/'; }
    static get label() { return 'Forms'; }
    static get icon() { return 'wpforms'; }
    
    /**
     * Gets all items
     */
    async fetch() {
        this.items = await HashBrown.Service.FormService.getAllForms();

        super.fetch();
    }

    /**
     * Event: Click create new form
     */
    async onClickNewForm() {
        let newForm = await HashBrown.Service.ResourceService.new(HashBrown.Entity.Resource.Form, 'forms');
            
        location.hash = '/forms/' + newForm.id;
    }
    
    /**
     * Event: On click remove
     */
    async onClickRemoveForm(target) {
        let id = target.dataset.id;
        let form = await HashBrown.Service.FormService.getFormById(id);

        UI.confirm(
            'Delete form',
            'Are you sure you want to delete the form "' + form.title + '"?',
            async () => {
                await HashBrown.Service.ResourceService.remove('forms', id);
            }
        );
    }
    
    /**
     * Event: Click pull Form
     */
    async onClickPullForm(target) {
        let id = target.dataset.id;

        await HashBrown.Service.ResourceService.pull('forms', id);
    }
    
    /**
     * Event: Click push Form
     */
    async onClickPushForm(target) {
        let id = target.dataset.id;

        await HashBrown.Service.ResourceService.push('forms', id);
    }
    
    /**
     * Item context menu
     */
    getItemContextMenu(item) {
        let menu = {};
        let isSyncEnabled = HashBrown.Context.projectSettings.sync.enabled;
        
        menu['This form'] = '---';

        if(!item.sync.hasRemote && !item.sync.isRemote && !item.isLocked) {
            menu['Remove'] = (target) => { this.onClickRemoveForm(target); };
        }
        
        menu['Copy id'] = (target) => { this.onClickCopyItemId(target); };

        if(item.isLocked && !item.sync.isRemote) { isSyncEnabled = false; }

        if(isSyncEnabled) {
            menu['Sync'] = '---';

            if(!item.sync.isRemote) {
                menu['Push to remote'] = (target) => { this.onClickPushForm(target); };
            }

            if(item.sync.hasRemote) {
                menu['Remove local copy'] = (target) => { this.onClickRemoveForm(target); };
            }
            
            if(item.sync.isRemote) {
                menu['Pull from remote'] = (target) => { this.onClickPullForm(target); };
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

module.exports = FormPane;
