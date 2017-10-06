'use strict';

const MessageModal = require('Client/Views/Modals/MessageModal');
const RequestHelper = require('Client/Helpers/RequestHelper');
const SettingsHelper = require('Client/Helpers/SettingsHelper');
const ProjectHelper = require('Client/Helpers/ProjectHelper');

/**
 * The sync settings editor
 *
 * @memberof HashBrown.Client.Views.Dashboard
 */
class SyncEditor extends Crisp.View {
    constructor(params) {
        super(params);

        this.modal = new MessageModal({
            model: {
                class: 'modal-sync-settings settings-modal',
                title: 'Sync'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default'
                },
                {
                    label: 'Apply',
                    class: 'btn-primary',
                    callback: () => {
                        this.onClickApply();

                        return false;
                    }
                },
                {
                    label: 'Save',
                    class: 'btn-primary',
                    callback: () => {
                        this.onClickSave();

                        return false;
                    }
                }
            ]
        });
        
        this.$element = this.modal.$element;

        SettingsHelper.getSettings(this.projectId, '', 'sync')
        .then((syncSettings) => {
            this.model = syncSettings || {};

            _.append(this.$element.find('.modal-body').empty(),
                this.renderField('Enabled', this.renderEnabledSwitch()),
                this.renderField('API URL', this.renderUrlEditor()),
                this.renderField('API Token', this.renderTokenEditor()),
                this.renderField('Project', this.renderProjectNameEditor())
            );

            this.fetch();
        });
    }
    
    /**
     * Event: Click save. Posts the model to the modelUrl and closes
     */
    onClickSave() {
        this.model.url = this.$element.find('.url-editor input').val();

        SettingsHelper.setSettings(this.projectId, '', 'sync', this.model)
        .then(() => {
            this.modal.hide();

            this.trigger('change', this.model);
        })
        .catch(UI.errorModal);
    }
    
    /**
     * Event: Click apply. Posts the model to the modelUrl
     */
    onClickApply() {
        this.model.url = this.$element.find('.url-editor input').val();

        SettingsHelper.setSettings(this.projectId, '', 'sync', this.model)
        .then(() => {
            this.trigger('change', this.model);
        })
        .catch(UI.errorModal);
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
        return _.div({class: 'url-editor'},
            _.input({class: 'form-control', type: 'text', value: this.model.url || '', placeholder: 'e.g. "https://myserver.com/api/"'})
        );
    }
    
    /**
     * Renders the project name editor
     *
     * @returns {HTMLElement} Element
     */
    renderProjectNameEditor() {
        if(!this.model.project) {
            this.model.project = this.projectId;
        }

        return _.div({class: 'project-name-editor'},
            _.input({class: 'form-control', type: 'text', value: this.model.project || '', placeholder: 'e.g. "' + ProjectHelper.currentProject + '"'})
                .on('change', (e) => {
                    this.model.project = $(e.target).val();
                })
        );
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
            if(!view.model.url) {
                alert('You need to specify a URL. Please do so and apply the settings first.');
                return;
            }
            
            let username = prompt('Remote instance username');
            let password = prompt('Remote instance password');

            RequestHelper.request(
                'post',
                view.projectId + '/sync/login',
                {
                    username: username,
                    password: password
                }
            ).then((token) => {
                view.model.token = token;
                $element.children('input').val(token);
            })
            .catch(UI.errorModal);
        }


        let $element;
       
        $element = _.div({class: 'token-editor input-group'},
            _.input({class: 'form-control', type: 'text', value: view.model.token || '', placeholder: 'Input the remote API token here'})
                .on('change', onInputChange),
            _.div({class: 'input-group-btn'},
                _.button({class: 'btn btn-small btn-default'},
                    _.span({class: 'fa fa-refresh'})
                ).on('click', onClickRenew)
            )
        );

        return $element;
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
        return _.div({class: 'field'},
            _.div({class: 'field-key'},
                label
            ),
            _.div({class: 'field-value'},
                $content
            )
        );
    }
}

module.exports = SyncEditor;
