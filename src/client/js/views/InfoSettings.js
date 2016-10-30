'use strict';

/**
 * The info settings editor
 *
 * @class View InfoSettings
 */
class InfoSettings extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'editor info-settings'});

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

        SettingsHelper.setSettings('info', this.model)
        .then(() => {
            this.$saveBtn.toggleClass('working', false);
        })
        .catch(errorModal);
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
        SettingsHelper.getSettings('info')
        .then((infoSettings) => {
            this.model = infoSettings || {};

            _.append(this.$element.empty(),
                _.div({class: 'editor-header'},
                    _.span({class: 'fa fa-info'}),
                    _.h4('Info')
                ),
                _.div({class: 'editor-body'},
                    this.renderField('Project name', this.renderProjectNameEditor())
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

module.exports = InfoSettings;
