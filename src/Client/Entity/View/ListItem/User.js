'use strict';

/**
 * The user list item as seen on the dashboard
 *
 * @memberof HashBrown.Client.Entity.View.ListItem
 */
class User extends HashBrown.Entity.View.ListItem.ListItemBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/listItem/user');
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
        this.model = await HashBrown.Service.ResourceService.get(HashBrown.Entity.Resource.User, 'users', this.modelId);
    }

    /**
     * Event: Click edit button
     */
    onClickEdit() {
        if(!HashBrown.Context.user.isAdmin && this.model.id !== HashBrown.Context.user.id) { return }
        
        new HashBrown.Entity.View.Modal.UserEditor({
            model: this.model.clone()
        })
        .on('change', () => { this.update(); });
    }
    
    /**
     * Event: Click delete user
     */
    onClickDelete() {
        if(this.model.id === HashBrown.Context.user.id) { return; }

        new HashBrown.Entity.View.Modal.ModalBase({
            model: {
                heading: `Delete user ${this.model.fullName || this.model.username || this.model.id}`,
                message: 'Are you sure want to delete this user?'
            }
        })
        .on('ok', async () => {
            await HashBrown.Service.ResourceService.remove('users', this.model.id);

            this.remove();
        });
    }
}

module.exports = User;
