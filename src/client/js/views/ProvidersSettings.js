'use strict';

/**
 * The providers settings editor
 *
 * @class View ProvidersSettings
 */
class ProvidersSettings extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'editor providers-settings'});

        this.fetch();
    }
    
    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        this.$saveBtn.toggleClass('working', true);

        SettingsHelper.setSettings(ProjectHelper.currentProject, ProjectHelper.currentEnvironment, 'providers', this.model)
        .then(() => {
            this.$saveBtn.toggleClass('working', false);

            location.reload();
        })
        .catch(errorModal);
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
        // Fetch providers settings
        SettingsHelper.getSettings(ProjectHelper.currentProject, ProjectHelper.currentEnvironment, 'providers')
        
        // Previously, providers were set project-wide, so retrieve automatically if needed
        .then((providersSettings) => {
            if(!providersSettings) {
                return SettingsHelper.getSettings(ProjectHelper.currentProject, null, 'providers');
            
            } else {
                return Promise.resolve(providersSettings);
            }
        })
        .then((providersSettings) => {
            let connectionOptions = [];

            for(let connection of resources.connections) {
                connectionOptions.push({
                    label: connection.title,
                    value: connection.id
                });
            }

            this.model = providersSettings || {};

            _.append(this.$element.empty(),
                _.div({class: 'editor-header'},
                    _.span({class: 'fa fa-gift'}),
                    _.h4('Providers')
                ),
                _.div({class: 'editor-body'},
                    this.renderField('Media', UI.inputDropdownTypeAhead(this.model.media, connectionOptions, (newValue) => {
                        this.model.media = newValue;
                    }, true)),
                    this.renderField('Templates', UI.inputDropdownTypeAhead(this.model.template, connectionOptions, (newValue) => {
                        this.model.template = newValue;
                    }, true))
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

module.exports = ProvidersSettings;
