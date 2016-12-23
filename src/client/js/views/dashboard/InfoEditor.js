'use strict';

/**
 * The info settings editor
 *
 * @class View InfoEditor
 */
class InfoEditor extends View {
    constructor(params) {
        super(params);

        this.modal = new MessageModal({
            model: {
                class: 'info-settings settings-modal',
                title: 'Project info'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default'
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

        this.fetch();
    }
    
    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        SettingsHelper.setSettings(this.projectId, null, 'info', this.model)
        .then(() => {
            this.modal.hide();

            this.trigger('change', this.model);
        })
        .catch(UI.errorModal);
    }
    
    /**
     * Renders the project name editor
     *
     * @returns {HTMLElement} Element
     */
    renderProjectNameEditor() {
        let view = this;
        
        function onInputChange() {
            view.model.name = $(this).val();
        }

        let $element = _.div({class: 'project-name-editor'},
            _.input({class: 'form-control', type: 'text', value: view.model.name, placeholder: 'Input the project name here'})
                .on('change', onInputChange)
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
        return _.div({class: 'input-group'},
            _.span(label),
            _.div({class: 'input-group-addon'},
                $content
            )
        );
    }

    render() {
        SettingsHelper.getSettings(this.projectId, null, 'info')
        .then((infoSettings) => {
            this.model = infoSettings || {};

            _.append(this.$element.find('.modal-body').empty(),
                this.renderField('Project name', this.renderProjectNameEditor())
            );
        });
    } 
}

module.exports = InfoEditor;
