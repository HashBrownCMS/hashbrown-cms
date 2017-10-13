'use strict';

const RequestHelper = require('Client/Helpers/RequestHelper');

/**
 * An editor for Users
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class UserEditor extends HashBrown.Views.Modals.Modal {
    constructor(params) {
        params.title = 'Settings for "' + (params.model.fullName || params.model.username || params.model.email || params.model.id) + '"';

        params.autoFetch = false;

        super(params);

        RequestHelper.customRequest('get', '/api/server/projects')
        .then((projects) => {
            this.projects = projects;

            this.fetch();
        });
    }
    
    /**
     * Event: Click save.
     */
    onClickSave() {
        let newUserObject = this.model.getObject();

        if(this.newPassword) {
            newUserObject.password = this.newPassword;
        }

        RequestHelper.request('post', 'user/' + this.model.id, newUserObject)
        .then(() => {
            this.modal.hide();

            this.trigger('save', this.model);
        })
        .catch(UI.errorModal);
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
            'templates'
        ];
    }

    /**
     * Renders the username editor
     *
     * @returns {HTMLElement} Element
     */
    renderUserNameEditor() {
        return new HashBrown.Views.Widgets.Input({
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
        return new HashBrown.Views.Widgets.Dropdown({
            value: this.model.getScopes(project),
            options: this.getScopes(),
            onChange: (newValue) => {
                this.model.scopes[project] = newValue;

                this.fetch();
            }
        }).$element;
    }

    /**
     * Renders the full name editor
     *
     * @return {HTMLElement} Element
     */
    renderFullNameEditor() {
        return new HashBrown.Views.Widgets.Input({
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
        return new HashBrown.Views.Widgets.Input({
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

            $element.toggleClass('invalid', !isValid);

            this.$element.find('.modal__footer .widget--button').toggleClass('disabled', !isValid);

            if(isValid) {
                this.newPassword = password1;
            
            } else {
                this.newPassword = null;

                if(!isMatch) {
                    UI.errorModal(new Error('Passwords do not match'));
                } else if(!isLongEnough) {
                    UI.errorModal(new Error('Passwords are too short'));
                }
            }
        }

        return _.div({class: 'widget-group'},
            new HashBrown.Views.Widgets.Input({
                placeholder: 'Type new password',
                type: 'password',
                onChange: (newValue) => {
                    password1 = newValue;

                    onChange();
                }
            }).$element,
            new HashBrown.Views.Widgets.Input({
                placeholder: 'Confirm new password',
                type: 'password',
                onChange: (newValue) => {
                    password2 = newValue;

                    onChange();
                }
            }).$element
        );
    }
    
    /**
     * Renders the admin editor
     *
     * @return {HTMLElement} Element
     */
    renderAdminEditor() {
        return UI.inputSwitch(this.model.isAdmin == true, (newValue) => {
            this.model.isAdmin = newValue;

            this.fetch();
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

    /**
     * Renders this editor
     */
    renderBody() {
        return _.div(
            this.renderField('Username', this.renderUserNameEditor()),
            this.renderField('Full name', this.renderFullNameEditor()),
            this.renderField('Email', this.renderEmailEditor()),
            this.renderField('Password', this.renderPasswordEditor()),

            _.if(currentUserIsAdmin() && !this.hidePermissions,
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
