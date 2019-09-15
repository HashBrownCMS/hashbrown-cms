'use strict';

/**
 * An editor for Users
 *
 * @memberof HashBrown.Client.View.Editor
 */
class UserEditor extends HashBrown.View.Modal.Modal {
    /**
     * Constructor
     */
    constructor(params) {
        params.title = 'Settings for "' + (params.model.fullName || params.model.username || params.model.email || params.model.id) + '"';
        params.actions = [
            {
                label: 'Save',
                onClick: () => { this.onClickSave(); }
            }
        ];

        params.autoFetch = false;

        super(params);

        this.fetch();
    }

    /**
     * Fetches the model
     */
    async fetch() {
        try {
            super.fetch();

            if(currentUserIsAdmin() && !this.hidePermissions) {
                let body = this.element.querySelector('.modal__body');
                let $spinner = UI.spinner(body); 
                
                this.projects = await HashBrown.Service.RequestService.customRequest('get', '/api/server/projects');

                $spinner.remove();
                
                _.append(body,
                    this.renderField('Is admin', this.renderAdminEditor()),
                    _.if(!this.model.isAdmin,
                        _.div({class: 'widget widget--separator'}, 'Projects'),
                        _.each(this.projects, (i, project) => {
                            return _.div({class: 'widget-group'},
                                new HashBrown.View.Widget.Input({
                                    type: 'checkbox',
                                    value: this.model.hasScope(project.id),
                                    onChange: (newValue) => {
                                        if(newValue) {
                                            this.model.giveScope(project.id);
                                        } else {
                                            this.model.removeScope(project.id);
                                        }
                                    }
                                }).$element,
                                _.div({class: 'widget widget--label'}, project.settings.info.name),
                                this.renderScopesEditor(project.id)
                            );
                        })
                    )
                )
            }

        } catch(e) {
            UI.errorModal(e);
        
        }
    }
    
    /**
     * Event: Click save.
     */
    async onClickSave() {
        try {
            let newUserObject = this.model.getObject();

            if(this.newPassword) {
                newUserObject.password = this.newPassword;
            }

            await HashBrown.Service.ResourceService.set('users', this.model.id, newUserObject);
            
            this.close();

            this.trigger('save', this.model);
        
        } catch(e) {
            UI.errorModal(e);

        }
    }
     
    /**
     * Renders the username editor
     *
     * @returns {HTMLElement} Element
     */
    renderUserNameEditor() {
        return new HashBrown.View.Widget.Input({
            value: this.model.username,
            placeholder: 'Input the username here',
            onChange: (newValue) => {
                this.model.username = newValue;
            }
        }).$element;
    }

    /**
     * Renders the scopes editor
     *
     * @param {String} project
     *
     * @returns {HTMLElement} Element
     */
    renderScopesEditor(project) {
        return new HashBrown.View.Widget.Dropdown({
            value: this.model.getScopes(project),
            useMultiple: true,

            placeholder: '(no scopes)',
            options: [
                'connections',
                'schemas'
            ],
            onChange: (newValue) => {
                this.model.scopes[project] = newValue;
            }
        }).$element;
    }

    /**
     * Renders the full name editor
     *
     * @return {HTMLElement} Element
     */
    renderFullNameEditor() {
        return new HashBrown.View.Widget.Input({
            value: this.model.fullName,
            onChange: (newValue) => {
                this.model.fullName = newValue;
            }
        }).$element;
    }
    
    /**
     * Renders the email editor
     *
     * @return {HTMLElement} Element
     */
    renderEmailEditor() {
        return new HashBrown.View.Widget.Input({
            value: this.model.email,
            onChange: (newValue) => {
                this.model.email = newValue;
            }
        }).$element;
    }
    
    /**
     * Renders the password
     *
     * @return {HTMLElement} Element
     */
    renderPasswordEditor() {
        let password1;
        let password2;

        let onChange = () => {
            let isMatch = password1 == password2;
            let isLongEnough = password1 && password1.length > 3;
            let isValid = isMatch && isLongEnough;

            this.$element.find('.modal__footer .widget--button').toggleClass('disabled', !isValid);

            let $passwordWarning = this.$element.find('.editor--user__password-warning');

            if(isValid) {
                this.newPassword = password1;

                $passwordWarning.hide();
            
            } else {
                $passwordWarning.show();
                
                this.newPassword = null;

                if(!isMatch) {
                    $passwordWarning.html('Passwords do not match');
                } else if(!isLongEnough) {
                    $passwordWarning.html('Passwords are too short');
                }
            }
        }

        return [
            new HashBrown.View.Widget.Input({
                placeholder: 'Type new password',
                type: 'password',
                onChange: (newValue) => {
                    password1 = newValue;

                    onChange();
                }
            }).$element,
            new HashBrown.View.Widget.Input({
                placeholder: 'Confirm new password',
                type: 'password',
                onChange: (newValue) => {
                    password2 = newValue;

                    onChange();
                }
            }).$element
        ];
    }
    
    /**
     * Renders the admin editor
     *
     * @return {HTMLElement} Element
     */
    renderAdminEditor() {
        return new HashBrown.View.Widget.Input({
            type: 'checkbox',
            value: this.model.isAdmin == true,
            onChange: (newValue) => {
                this.model.isAdmin = newValue;

                setTimeout(() => {
                    this.fetch();
                }, 300);
            }
        }).$element;
    }

    /**
     * Renders a single field
     *
     * @return {HTMLElement} Element
     */
    renderField(label, $content) {
        return _.div({class: 'widget-group'},
            _.div({class: 'widget widget--label small'},
                label
            ),
            $content
        );
    }
    
    /**
     * Renders this editor
     */
    renderBody() {
        return [
            this.renderField('Username', this.renderUserNameEditor()),
            this.renderField('Full name', this.renderFullNameEditor()),
            this.renderField('Email', this.renderEmailEditor()),
            this.renderField('Password', this.renderPasswordEditor()),
            _.div({class: 'widget widget--label warning hidden editor--user__password-warning'}),
        ];
    }
}

module.exports = UserEditor;
