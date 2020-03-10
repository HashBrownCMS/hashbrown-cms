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
            await HashBrown.Entity.User.create(this.model.username, this.model.password);

            this.setState('success');
            
            this.trigger('change');

        } catch(e) {
            this.setErrorState(e);

        }
    }
   
    /**
     * Event: Input password
     */
    onInputPassword(password) {
        this.model.password = password;
    }
    
    /**
     * Event: Input email
     */
    onInputEmail(email) {
        this.model.email = email;
    }
        
    /**
     * Event: Input name
     */
    onInputUsername(username) {
        this.model.username = username;
    }
    
    /**
     * Event: Input full name
     */
    onInputFullName(fullName) {
        this.model.fullName = fullName;
    }
}

module.exports = CreateUser;
