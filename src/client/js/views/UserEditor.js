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
        
            reloadResource('users')
            .then(() => {
                let navbar = ViewHelper.get('NavbarMain');
                
                navbar.reload();
            });
        })
        .catch((err) => {
            new MessageModal({
                model: {
                    title: 'Error',
                    body: err
                }
            });
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
                            errorModal(e);
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
     * Renders a single field
     *
     * @return {Object} element
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

        let $element = _.div({class: 'user'});
        
        $element.append(this.renderField('Username', this.renderUserNameEditor()));
        $element.append(this.renderField('Scopes', this.renderScopesEditor()));

        return $element;
    }
    
    render() {
        _.append(this.$element.empty(),
            this.renderFields(),
            _.div({class: 'panel panel-default panel-buttons'}, 
                _.div({class: 'btn-group'},
                    _.button({class: 'btn btn-danger btn-raised'},
                        'Delete'
                    ).click(() => { this.onClickDelete(); }),
                    this.$saveBtn = _.button({class: 'btn btn-success btn-raised btn-save'},
                        _.span({class: 'text-default'}, 'Save '),
                        _.span({class: 'text-working'}, 'Saving ')
                    ).click(() => { this.onClickSave(); })
                )
            )
        );
    }
}

module.exports = UserEditor;
