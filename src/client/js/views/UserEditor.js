'use strict';

class UserEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'user-editor'});

        this.modal = UI.confirmModal(
            'save',
            'Settings for "' + this.getLabel() + '"', this.$element,
            () => {
                this.onClickSave();

                return false;
            }
        );

        this.modal.$element.addClass('modal-user-editor');

        customApiCall('get', '/api/server/projects')
        .then((projects) => {
            this.projects = projects;
            this.init();
        });
    }
    
    /**
     * Gets the user label
     *
     * @returns {String} Label
     */
    getLabel() {
        return this.model.fullName || this.model.username || this.model.email || this.model.id;
    }

    /**
     * Event: Click save.
     */
    onClickSave() {
        let newUserObject = this.model.getObject();

        if(this.newPassword) {
            newUserObject.password = this.newPassword;
        }

        apiCall('post', 'user/' + this.model.id, newUserObject)
        .then(() => {
            this.modal.hide();

            this.trigger('save', this.model);
        })
        .catch(errorModal);
    }
    
    
    /**
     * Gets a list of available scopes
     *
     * @returns {Array} Array of scope strings
     */
    getScopes() {
        return [
            'connections',
            'schemas',
            'settings',
            'templates',
            'users'
        ];
    }

    /**
     * Renders the username editor
     *
     * @returns {HTMLElement} Element
     */
    renderUserNameEditor() {
        let view = this;

        function onInputChange() {
            view.model.username = $(this).val();
        }

        let $element = _.div({class: 'username-editor'},
            _.input({
                    class: 'form-control',
                    type: 'text',
                    value: view.model.username,
                    placeholder: 'Input the username here'
            }).on('change', onInputChange)
        );

        return $element;
    }

    /**
     * Renders the scopes editor
     *
     * @param {String} project
     *
     * @returns {HTMLElement} Element
     */
    renderScopesEditor(project) {
        return _.div({class: 'scopes-editor'},
            UI.inputChipGroup(this.model.getScopes(project), this.getScopes(), (newValue) => {
                this.model.scopes[project] = newValue;

                this.$element.find('.project[data-id="' + project + '"] .switch input')[0].checked = true;
            }, true)
        );
    }

    /**
     * Renders the full name editor
     *
     * @return {HTMLElement} Element
     */
    renderFullNameEditor() {
        let view = this;

        function onChange() {
            let fullName = $(this).val();

            view.model.fullName = fullName;
        } 

        return _.div({class: 'full-name-editor'},
            _.input({class: 'form-control', type: 'text', value: this.model.fullName}).
                change(onChange)
        );
    }
    
    /**
     * Renders the email editor
     *
     * @return {HTMLElement} Element
     */
    renderEmailEditor() {
        let view = this;

        function onChange() {
            let email = $(this).val();

            view.model.email = email;
        } 

        return _.div({class: 'full-name-editor'},
            _.input({class: 'form-control', type: 'email', value: this.model.email}).
                change(onChange)
        );
    }
    
    /**
     * Renders the password
     *
     * @return {HTMLElement} Element
     */
    renderPasswordEditor() {
        let view = this;

        let $invalidMessage;
        let password1;
        let password2;

        function onChange() {
            let isMatch = password1 == password2;
            let isLongEnough = password1 && password1.length > 3;
            let isValid = isMatch && isLongEnough;

            $element.toggleClass('invalid', !isValid);

            view.$element.find('.model-footer .btn-primary').toggleClass('disabled', !isValid);

            if(isValid) {
                view.newPassword = password1;
            
            } else {
                view.newPassword = null;

                if(!isMatch) {
                    $invalidMessage.html('Passwords do not match');
                } else if(!isLongEnough) {
                    $invalidMessage.html('Passwords are too short');
                }
            }
        }

        function onChange1() {
            password1 = $(this).val();
   
            onChange(); 
        } 
        
        function onChange2() {
            password2 = $(this).val();
            
            onChange(); 
        } 

        let $element = _.div({class: 'password-editor'},
            $invalidMessage = _.span({class: 'invalid-message'}, 'Passwords do not match'),
            _.input({class: 'form-control', type: 'password', placeholder: 'Type new password'})
                .on('change propertychange keyup paste input', onChange1),
            _.input({class: 'form-control', type: 'password', placeholder: 'Confirm new password'})
                .on('change propertychange keyup paste input', onChange2)
        );

        return $element;
    }
    
    /**
     * Renders the admin editor
     *
     * @return {HTMLElement} Element
     */
    renderAdminEditor() {
        return UI.inputSwitch(this.model.isAdmin == true, (newValue) => {
            this.model.isAdmin = newValue;

            this.render();
        }).addClass('admin-editor');
    }

    /**
     * Renders a single field
     *
     * @return {HTMLElement} Element
     */
    renderField(label, $content) {
        return _.div({class: 'field-container'},
            _.div({class: 'field-key'},
                label
            ),
            _.div({class: 'field-value'},
                $content
            )
        );
    }
    
    /**
     * Renders all fields
     *
     * @return {Object} element
     */
    renderFields() {
        let id = parseInt(this.model.id);


        return $element;
    }
    
    render() {
        _.append(this.$element.empty(),
            this.renderField('Username', this.renderUserNameEditor()),
            this.renderField('Full name', this.renderFullNameEditor()),
            this.renderField('Email', this.renderEmailEditor()),
            this.renderField('Password', this.renderPasswordEditor()),

            _.if(User.current.isAdmin && !this.hidePermissions,
                this.renderField('Is admin', this.renderAdminEditor()),

                _.if(!this.model.isAdmin,
                    _.each(this.projects, (i, project) => {
                        return _.div({class: 'project', 'data-id': project},
                            _.div({class: 'project-header'},
                                UI.inputSwitch(this.model.hasScope(project), (newValue) => {
                                    if(newValue) {
                                        this.model.giveScope(project);
                                    } else {
                                        this.model.removeScope(project);
                
                                        this.$element.find('.project[data-id="' + project + '"] .chip-group .chip').remove();
                                    }   
                                }),
                                _.h4({class: 'project-title'}, project)
                            ),
                            _.div({class: 'project-scopes'},
                                _.p('Scopes:'),
                                this.renderScopesEditor(project)
                            )
                        );
                    })
                )
            )
        );
    }
}

module.exports = UserEditor;
