'use strict';

/**
 * The sync settings editor
 *
 * @class View SyncSettings
 */
class SyncSettings extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'editor sync-settings'});

        this.fetch();
    }
    
    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        if(this.jsonEditor && this.jsonEditor.isValid == false) {
            return;
        }

        this.$saveBtn.toggleClass('working', true);

        SettingsHelper.setSettings(ProjectHelper.currentProject, ProjectHelper.currentEnvironment, 'sync', this.model)
        .then(() => {
            this.$saveBtn.toggleClass('working', false);

            location.reload();
        })
        .catch(errorModal);
    }
    
    /**
     * Render enabled switch
     */
    renderEnabledSwitch() {
        return _.div({class: 'field-editor'},
            UI.inputSwitch(this.model.enabled == true, (newValue) => {
                this.model.enabled = newValue;
            })
        );
    }

    /**
     * Renders the URL editor
     *
     * @returns {HTMLElement} Element
     */
    renderUrlEditor() {
        let view = this;

        function onInputChange() {
            view.model.url = $(this).val();
        }

        let $element = _.div({class: 'url-editor'},
            _.input({class: 'form-control', type: 'text', value: view.model.url || '', placeholder: 'Input the remote API URL here, e.g. "https://myserver.com/api/"'})
                .on('change', onInputChange)
        );

        return $element;
    }
    
    /**
     * Renders the project name editor
     *
     * @returns {HTMLElement} Element
     */
    renderProjectNameEditor() {
        let view = this;
        
        if(!view.model.project) {
            view.model.project = ProjectHelper.currentProject;
        }

        function onInputChange() {
            view.model.project = $(this).val();
        }

        let $element = _.div({class: 'project-name-editor'},
            _.input({class: 'form-control', type: 'text', value: view.model.project || '', placeholder: 'Input the remote project name here, e.g. "' + ProjectHelper.currentProject + '"'})
                .on('change', onInputChange)
        );

        return $element;
    }
    
    /**
     * Renders the environment name editor
     *
     * @returns {HTMLElement} Element
     */
    renderEnvironmentNameEditor() {
        let view = this;

        if(!view.model.environment) {
            view.model.environment = ProjectHelper.currentEnvironment;
        }

        function onInputChange() {
            view.model.environment = $(this).val();
        }

        let $element = _.div({class: 'project-name-editor'},
            _.input({class: 'form-control', type: 'text', value: view.model.environment || '', placeholder: 'Input the remote environment name here, e.g. "' + ProjectHelper.currentEnvironment + '"'})
                .on('change', onInputChange)
        );

        return $element;
    }
    
    /**
     * Renders the token editor
     *
     * @returns {HTMLElement} Element
     */
    renderTokenEditor() {
        let view = this;

        function onInputChange() {
            view.model.token = $(this).val();
        }

        function onClickRenew() {
            let modal = new MessageModal({
                model: {
                    title: 'Renew token',
                    body: _.div({},
                        _.input({class: 'form-control', type: 'text', placeholder: 'Username'}),
                        _.input({class: 'form-control', type: 'password', placeholder: 'Password'})
                    )
                },
                buttons: [
                    {
                        label: 'Cancel',
                        class: 'btn-default'
                    },
                    {
                        label: 'Renew',
                        class: 'btn-primary',
                        callback: () => {
                            apiCall(
                                'post',
                                'sync/login',
                                {
                                    username: modal.$element.find('input[type="text"]').val(),
                                    password: modal.$element.find('input[type="password"]').val()
                                }
                            ).then((token) => {
                                view.model.token = token;
                                $element.children('input').val(token);

                                modal.hide();
                            })
                            .catch(errorModal);

                            return false;
                        }
                    }
                ]
            });
        }


        let $element;
       
        if(this.model.url) {
            $element = _.div({class: 'token-editor input-group'},
                _.input({class: 'form-control', type: 'text', value: view.model.token || '', placeholder: 'Input the remote API token here'})
                    .on('change', onInputChange),
                _.div({class: 'input-group-btn'},
                    _.button({class: 'btn btn-small btn-default'},
                        _.span({class: 'fa fa-refresh'})
                    ).on('click', onClickRenew)
                )
            );
        
        } else {
            $element = _.div('Please input the API URL and save first');

        }

        return $element;
    }
    
    /**
     * Render Content switch
     */
    renderContentSwitch() {
        return _.div({class: 'field-editor content'},
            UI.inputSwitch(this.model.content == true, (isActive) => {
                this.model.content = isActive;  

                if(isActive) {
                    this.model.schemas = true;
                    this.$element.find('.field-editor.schemas input')[0].checked = true;
                }
            })
        );
    }
    
    /**
     * Render Connections switch
     */
    renderConnectionsSwitch() {
        return _.div({class: 'field-editor connections'},
            UI.inputSwitch(this.model.connections == true, (isActive) => {
                this.model.connections = isActive;  
            })
        );
    }
    
    /**
     * Render Forms switch
     */
    renderFormsSwitch() {
        return _.div({class: 'field-editor forms'},
            UI.inputSwitch(this.model.forms == true, (isActive) => {
                this.model.forms = isActive;  
            })
        );
    }

    /**
     * Render Schema switch
     */
    renderSchemaSwitch() {
        return _.div({class: 'field-editor schemas'},
            UI.inputSwitch(this.model.schemas == true, (isActive) => {
                this.model.schemas = isActive;  

                if(!isActive) {
                    this.model.content = false;
                    this.$element.find('.field-editor.content input')[0].checked = false;
                }
            })
        );
    }
    
    /**
     * Render Media tree switch
     */
    renderMediaTreeSwitch() {
        return _.div({class: 'field-editor forms'},
            UI.inputSwitch(this.model['media/tree'] == true, (isActive) => {
                this.model['media/tree'] = isActive;  
            })
        );
    }
    
    /**
     * Renders a single field
     *
     * @param {String} label
     * @param {HTMLElement} content
     *
     * @return {HTMLElement} Editor element
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

    render() {
        SettingsHelper.getSettings(ProjectHelper.currentProject, ProjectHelper.currentEnvironment, 'sync')
        .then((syncSettings) => {
            this.model = syncSettings || {};

            _.append(this.$element.empty(),
                _.div({class: 'editor-header'},
                    _.span({class: 'fa fa-refresh'}),
                    _.h4('Sync')
                ),
                _.div({class: 'editor-body'},
                    this.renderField('Enabled', this.renderEnabledSwitch()),
                    this.renderField('API URL', this.renderUrlEditor()),
                    this.renderField('API Token', this.renderTokenEditor()),
                    this.renderField('Project', this.renderProjectNameEditor()),
                    this.renderField('Environment', this.renderEnvironmentNameEditor()),
                    this.renderField('Content', this.renderContentSwitch()),
                    this.renderField('Schemas', this.renderSchemaSwitch()),
                    this.renderField('Connections', this.renderConnectionsSwitch()),
                    this.renderField('Forms', this.renderFormsSwitch()),
                    this.renderField('Media tree', this.renderMediaTreeSwitch())
                ),
                _.div({class: 'editor-footer panel panel-default panel-buttons'}, 
                    _.div({class: 'btn-group'},
                        this.$saveBtn = _.button({class: 'btn btn-primary btn-raised btn-save'},
                            _.span({class: 'text-default'}, 'Save '),
                            _.span({class: 'text-working'}, 'Saving ')
                        ).click(() => { this.onClickSave(); })
                    )
                )
            );
        });
    } 
}

module.exports = SyncSettings;
