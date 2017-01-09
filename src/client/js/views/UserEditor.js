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

        apiCall('get', 'server/projects')
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

        apiCall('post', 'users/' + this.model.id, newUserObject)
        .then(() => {
            this.modal.hide();

            this.trigger('save');
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
     * Gets a list of user scopes
     *
     * @param {String} project
     *
     * @returns {Array} Array of scope strings
     */
    getUserScopes(project) {
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
     * @param {String} project
     *
     * @returns {HTMLElement} Element
     */
    renderScopesEditor(project) {
        let view = this;

        function onChange() {
            view.getUserScopes(project).splice(0, view.getUserScopes(project).length);
            
            $element.find('.scopes .scope .dropdown .dropdown-toggle').each(function() {
                 view.getUserScopes(project).push($(this).attr('data-id'));
            });

            render();
        }

        function onClickAdd() {
            let newScope = '';

            for(let scope of view.getScopes()) {
                if(view.getUserScopes(project).indexOf(scope) < 0) {
                    newScope = scope
                    break;
                }
            }

            if(newScope) {
                view.getUserScopes(project).push(newScope);

                render();
            }
        }

        function render() {
            _.append($element.empty(),
                _.div({class: 'scopes chip-group'},
                    _.each(view.getUserScopes(project), (i, userScope) => {
                        try {
                            let $scope = _.div({class: 'chip scope'},
                                _.div({class: 'chip-label dropdown'},
                                    _.button({class: 'dropdown-toggle', 'data-id': userScope, 'data-toggle': 'dropdown'},
                                        userScope
                                    ),
                                    _.ul({class: 'dropdown-menu'},
                                        _.each(view.getScopes(), (i, scope) => {
                                            if(scope == userScope || view.getUserScopes(project).indexOf(scope) < 0) {
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

        function onChange() {
            let isValid = password1 == password2 && password1 && password1.length > 4;

            $element.toggleClass('invalid', !isValid);

            view.$element.find('.model-footer .btn-primary').toggleClass('disabled', !isValid);

            if(isValid) {
                view.newPassword = password1;
            
            } else {
                view.newPassword = null;

            }
        }

        function onChange1() {
            password1 = $(this).val();
   
            onChange(); 
        } 
        
        function onChange2() {
            password2 = $(this).val();
        } 

        let $element = _.div({class: 'password-editor'},
            _.span({class: 'invalid-message'}, 'Check passwords'),
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

            _.if(User.current.isAdmin,
                this.renderField('Is admin', this.renderAdminEditor()),

                _.if(!this.model.isAdmin,
                    _.each(this.projects, (i, project) => {
                        let hasProject = this.model.scopes[project] != undefined;

                        return _.div({class: 'project'},
                            _.div({class: 'project-header'},
                                UI.inputSwitch(hasProject, (newValue) => {
                                    if(newValue) {
                                        this.model.scopes[project] = {};
                                    } else {
                                        delete this.model.scopes[project];
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
