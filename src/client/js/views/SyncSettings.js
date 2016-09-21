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

        SettingsHelper.setSettings('sync', this.model)
        .then(() => {
            this.$saveBtn.toggleClass('working', false);
        })
        .catch(errorModal);
    }
    
    /**
     * Render enabled switch
     */
    renderEnabledSwitch() {
        let view = this;
        
        function onChange() {
            view.model.enabled = this.checked;
        }

        return _.div({class: 'field-editor'},
            _.div({class: 'switch'},
                _.input({
                    id: 'switch-sync-enabled',
                    class: 'form-control switch',
                    type: 'checkbox',
                    checked: this.model.enabled == true
                }).change(onChange),
                _.label({for: 'switch-sync-enabled'})
            )
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
            _.input({class: 'form-control', type: 'text', value: view.model.url, placeholder: 'Input the remote project URL here'})
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

        let $element = _.div({class: 'token-editor input-group'},
            _.input({class: 'form-control', type: 'text', value: view.model.token, placeholder: 'Input the remote project token here'})
                .on('change', onInputChange),
            _.div({class: 'input-group-btn'},
                _.button({class: 'btn btn-primary'}, 'Renew')
                    .on('click', onClickRenew)
            )
        );

        return $element;
    }

    /**
     * Render schema switch
     */
    renderSchemaSwitch() {
        let view = this;
        
        function onChange() {
            view.model.schemas = this.checked;
        }

        return _.div({class: 'field-editor'},
            _.div({class: 'switch'},
                _.input({
                    id: 'switch-sync-schemas',
                    class: 'form-control switch',
                    type: 'checkbox',
                    checked: this.model.schemas == true
                }).change(onChange),
                _.label({for: 'switch-sync-schemas'})
            )
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
        SettingsHelper.getSettings('sync')
        .then((syncSettings) => {
            this.model = syncSettings || {};

            _.append(this.$element.empty(),
                _.div({class: 'editor-header'},
                    _.span({class: 'fa fa-refresh'}),
                    _.h4('Sync')
                ),
                _.div({class: 'editor-body'},
                    this.renderField('Enabled', this.renderEnabledSwitch()),
                    this.renderField('URL', this.renderUrlEditor()),
                    this.renderField('Token', this.renderTokenEditor()),
                    this.renderField('Schemas', this.renderSchemaSwitch())
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
