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
        this.model = await HashBrown.Entity.User.get(this.modelId);
    }

    /**
     * Event: Click edit button
     */
    onClickEdit() {
        if(!HashBrown.Context.user.isAdmin && this.model.id !== HashBrown.Context.user.id) { return }
        
        HashBrown.Entity.View.Modal.UserEditor.new({
            modelId: this.model.id
        })
        .on('change', () => { this.update(); });
    }
    
    /**
     * Event: Click delete user
     */
    onClickDelete() {
        if(this.model.id === HashBrown.Context.user.id) { return; }

        HashBrown.Entity.View.Modal.ModalBase.new({
            model: {
                heading: `Delete user ${this.model.fullName || this.model.username || this.model.id}`,
                message: 'Are you sure want to delete this user?'
            }
        })
        .on('ok', async () => {
            await this.model.remove();

            this.remove();
        });
    }
}

module.exports = User;
