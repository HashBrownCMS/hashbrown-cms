'use strict';

/**
 * The modal for creating users
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class CreateUser extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';

        for(let i = 0, n = charset.length; i < 8; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }

        this.model = {
            password: password
        };

        this.template = require('template/modal/createUser');
    }

    /**
     * Event: Clicked email
     */
    onClickEmail() {
        let subject = 'Invitation to HashBrown CMS';
        let url = `${location.protocol}//${location.host}`;
        let body = [
            `Hello ${this.model.fullName || this.model.username}!`,
            ``,
            `You have been invited by ${HashBrown.Context.user.fullName || HashBrown.Context.user.username} to join a HashBrown CMS instance.`,
            `Please visit this URL to login:`,
            url,
            ``,
            `Username: ${this.model.username}`,
            `Password: ${this.model.password}`,
            ``,
            `Make sure to change your password soon after your first login`
        ].join('%0D%0A');

        location.href = `mailto:${this.model.email}?subject=${subject}&body=${body}`;

        this.close();
    }

    /**
     * Event: Clicked create
     */
    async onClickCreate() {
        try {
            if(!this.model.username || this.model.username.length < 2) {
                throw new Error('The username is too short');
            }

            if(!this.model.password || this.model.password.length < 2) {
                throw new Error('The password is too short');
            }

            await HashBrown.Service.ResourceService.new(HashBrown.Entity.Resource.User, 'users', '', this.model);

            this.setState('success');
            
            this.trigger('change');

        } catch(e) {
            this.setErrorState(e);

        }
    }
   
    /**
     * Event: Input password
     */
    onInputPassword(e) {
        this.model.password = e.currentTarget.value;
    }
    
    /**
     * Event: Input email
     */
    onInputEmail(e) {
        this.model.email = e.currentTarget.value;
    }
        
    /**
     * Event: Input name
     */
    onInputUsername(e) {
        this.model.username = e.currentTarget.value;
    }
    
    /**
     * Event: Input full name
     */
    onInputFullName(e) {
        this.model.fullName = e.currentTarget.value;
    }
}

module.exports = CreateUser;
