'use strict';

class UserEditor extends View {
    constructor(params) {
        super(params);
        
        this.$element = _.div({class: 'editor user-editor'});

        this.init();
    }
    
    /**
     * Event: Click save.
     */
    onClickSave() {
        this.$saveBtn.toggleClass('working', true);

        apiCall('post', 'users/' + this.model.id, this.model)
        .then(() => {
            this.$saveBtn.toggleClass('working', false);
        
            return reloadResource('users');
        })
        .then(() => {
            let navbar = ViewHelper.get('NavbarMain');
            
            navbar.reload();
        })
        .catch(errorModal);
    }
    
    /**
     * Event: Click remove User
     */
    onClickRemove() {
        let id = this.model.id;
        let name = this.model.username;
        
        function onSuccess() {
            reloadResource('users')
            .then(function() {
                ViewHelper.get('NavbarMain').reload();
                
                location.hash = '/users/';
            });
        }

        function onClickOK() {
            apiCall('delete', 'users/' + id)
            .then(onSuccess)
            .catch(errorModal);
        }

        new MessageModal({
            model: {
                title: 'Delete user',
                body: 'Are you sure you want to remove the user "' + name + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: function() {
                    }
                },
                {
                    label: 'Remove',
                    class: 'btn-danger',
                    callback: onClickOK
                }
            ]
        });
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
            'users'
        ];
    }

    /**
     * Gets a list of user scopes
     *
     * @returns {Array} Array of scope strings
     */
    getUserScopes() {
        let project = ProjectHelper.currentProject;

        if(!this.model.scopes) {
            this.model.scopes = {};
        }

        if(!this.model.scopes[project]) {
            this.model.scopes[project] = [];
        }

        return this.model.scopes[project];
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
     * @returns {HTMLElement} Element
     */
    renderScopesEditor() {
        let view = this;

        function onChange() {
            view.getUserScopes().splice(0, view.getUserScopes().length);
            
            $element.find('.scopes .scope .dropdown .dropdown-toggle').each(function() {
                 view.getUserScopes().push($(this).attr('data-id'));
            });

            render();
        }

        function onClickAdd() {
            let newScope = '';

            for(let scope of view.getScopes()) {
                if(view.getUserScopes().indexOf(scope) < 0) {
                    newScope = scope
                    break;
                }
            }

            if(newScope) {
                view.getUserScopes().push(newScope);

                render();
            }
        }

        function render() {
            _.append($element.empty(),
                _.div({class: 'scopes chip-group'},
                    _.each(view.getUserScopes(), (i, userScope) => {
                        try {
                            let $scope = _.div({class: 'chip scope'},
                                _.div({class: 'chip-label dropdown'},
                                    _.button({class: 'dropdown-toggle', 'data-id': userScope, 'data-toggle': 'dropdown'},
                                        userScope
                                    ),
                                    _.ul({class: 'dropdown-menu'},
                                        _.each(view.getScopes(), (i, scope) => {
                                            if(scope == userScope || view.getUserScopes().indexOf(scope) < 0) {
                                                return _.li(
                                                    _.a({href: '#', 'data-id': scope},
                                                        scope
                                                    ).click(function(e) {
                                                        e.preventDefault();
                                                            
                                                        let $btn = $(this).parents('.dropdown').children('.dropdown-toggle');
                                                        
                                                        $btn.text($(this).text());
                                                        $btn.attr('data-id', $(this).attr('data-id'));

                                                        onChange();
                                                    })
                                                );
                                            }
                                        })
                                    )
                                ).change(onChange),
                                _.button({class: 'btn chip-remove'},
                                    _.span({class: 'fa fa-remove'})
                                ).click(() => {
                                    $scope.remove();        

                                    onChange();
                                })
                            );
                            
                            return $scope;

                        } catch(e) {
                            UI.errorModal(e);
                        }
                    }),
                    _.button({class: 'btn chip-add'},
                        _.span({class: 'fa fa-plus'})
                    ).click(onClickAdd)
                )
            );
        }

        let $element = _.div({class: 'scopes-editor'});

        render();

        return $element;
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

        let password1;
        let password2;

        function onChange1() {
            password1 = $(this).val();
    
            let isValid = password1 == password2;

            $element.toggleClass('invalid', !isValid);

            if(isValid) {
                view.model.password = password1;
            
            } else {
                view.model.password = null;

            }
        } 
        
        function onChange2() {
            password2 = $(this).val();
    
            let isValid = password1 == password2;

            $element.toggleClass('invalid', !isValid);

            if(isValid) {
                view.model.password = password1;
            
            } else {
                view.model.password = null;

            }
        } 

        let $element = _.div({class: 'password-editor'},
            _.span({class: 'invalid-message'}, 'Passwords to not match'),
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

        let $element = _.div({class: 'user editor-body'});
        
        $element.append(this.renderField('Username', this.renderUserNameEditor()));
        $element.append(this.renderField('Full name', this.renderFullNameEditor()));
        $element.append(this.renderField('Email', this.renderEmailEditor()));
        $element.append(this.renderField('Password', this.renderPasswordEditor()));
        $element.append(this.renderField('Is admin', this.renderAdminEditor()));
        $element.append(this.renderField('Scopes', this.renderScopesEditor()));

        return $element;
    }
    
    render() {
        _.append(this.$element.empty(),
            _.div({class: 'editor-header'},
                _.span({class: 'fa fa-user'}),
                _.h4(this.model.username || this.model.email)
            ),
            this.renderFields(),
            _.div({class: 'editor-footer'}, 
                _.div({class: 'btn-group'},
                    this.$saveBtn = _.button({class: 'btn btn-primary btn-raised btn-save'},
                        _.span({class: 'text-default'}, 'Save '),
                        _.span({class: 'text-working'}, 'Saving ')
                    ).click(() => { this.onClickSave(); }),
                    _.button({class: 'btn btn-embedded btn-embedded-danger'},
                        _.span({class: 'fa fa-trash'})
                    ).click(() => { this.onClickRemove(); })
                )
            )
        );
    }
}

module.exports = UserEditor;
