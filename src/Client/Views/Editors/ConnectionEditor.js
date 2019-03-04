'use strict';

/**
 * The editor for Connections
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class ConnectionEditor extends Crisp.View {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Event: Click advanced. Routes to the JSON editor
     */
    onClickAdvanced() {
        location.hash = '/connections/json/' + this.model.id;
    }

    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        this.$saveBtn.toggleClass('saving', true);

        HashBrown.Helpers.RequestHelper.request('post', 'connections/' + this.model.id, this.model)
        .then(() => {
            this.$saveBtn.toggleClass('saving', false);
       
            location.reload(); 
        })
        .catch(UI.errorModal);
    }

    /**
     * Renders the Media provider editor
     */
    renderMediaProviderEditor() {
        let input = new HashBrown.Views.Widgets.Input({
            value: false,
            type: 'checkbox',
            onChange: (isProvider) => {
                HashBrown.Helpers.ConnectionHelper.setMediaProvider(isProvider ? this.model.id : null)
                .catch(UI.errorModal);
            }
        });

        // Set the value
        input.$element.toggleClass('working', true);

        HashBrown.Helpers.ConnectionHelper.getMediaProvider()
        .then((connection) => {
            if(connection && connection.id === this.model.id) {
                input.value = true;
                input.fetch();
            }
        
            input.$element.toggleClass('working', false);
        });

        return input.$element;
    }

    /**
     * Renders the title editor
     */
    renderTitleEditor() {
        return new HashBrown.Views.Widgets.Input({
            value: this.model.title,
            onChange: (newValue) => {
                this.model.title = newValue;
            }
        }).$element;
    }
    
    /**
     * Renders the URL editor
     */
    renderUrlEditor() {
        return new HashBrown.Views.Widgets.Input({
            value: this.model.url,
            onChange: (newValue) => {
                this.model.url = newValue;
            }
        }).$element;
    }

    /**
     * Renders the processing settings editor
     */
    renderProcessorSettingsEditor() {
        return [
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Type'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Dropdown({
                        value: this.model.processor.alias,
                        optionsUrl: 'connections/processors', 
                        valueKey: 'alias',
                        labelKey: 'name',
                        placeholder: 'Type',
                        onChange: (newValue) => {
                            this.model.processor.alias = newValue;

                            this.fetch();
                        }
                    }).$element
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'},
                    _.div({class: 'editor__field__key__label'}, 'File extension'),
                    _.div({class: 'editor__field__key__description'}, 'A file extension such as .json or .xml')
                ),
                _.each(HashBrown.Views.Editors.ProcessorEditors, (name, editor) => {
                    if(editor.alias !== this.model.processor.alias) { return; }
                        
                    return new editor({
                        model: this.model.processor
                    }).$element;
                }),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Input({
                        value: this.model.processor.fileExtension,
                        onChange: (newValue) => {
                            this.model.processor.fileExtension = newValue;
                        }
                    })
                )
            )
        ];
    }
    
    /**
     * Renders the deployment settings editor
     */
    renderDeployerSettingsEditor() {
        return [
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Type'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Dropdown({
                        value: this.model.deployer.alias,
                        optionsUrl: 'connections/deployers', 
                        valueKey: 'alias',
                        labelKey: 'name',
                        placeholder: 'Type',
                        onChange: (newValue) => {
                            this.model.deployer.alias = newValue;

                            this.fetch();
                        }
                    }).$element
                )
            ),
            _.each(HashBrown.Views.Editors.DeployerEditors, (name, editor) => {
                if(editor.alias !== this.model.deployer.alias) { return; }
                    
                return new editor({
                    model: this.model.deployer
                }).$element;
            }),
            _.do(() => {
                if(!this.model.deployer || !this.model.deployer.paths) { return; }
                
                return _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'},
                        _.div({class: 'editor__field__key__label'}, 'Paths'),
                        _.div({class: 'editor__field__key__description'}, 'Where to send the individual resources')
                    ),
                    _.div({class: 'editor__field__value'},
                        _.div({class: 'editor__field'},
                            _.div({class: 'editor__field__key'}, 'Content'),
                            _.div({class: 'editor__field__value'},
                                new HashBrown.Views.Widgets.Input({
                                    value: this.model.deployer.paths.content,
                                    onChange: (newValue) => {
                                        this.model.deployer.paths.content = newValue;
                                    }
                                })
                            )
                        ),
                        _.div({class: 'editor__field'},
                            _.div({class: 'editor__field__key'}, 'Media'),
                            _.div({class: 'editor__field__value'},
                                new HashBrown.Views.Widgets.Input({
                                    value: this.model.deployer.paths.media,
                                    onChange: (newValue) => {
                                        this.model.deployer.paths.media = newValue;
                                    }
                                })
                            )
                        )
                    )
                );
            })
        ];
    }

    /**
     * Prerender
     */
    prerender() {
        if(this.model instanceof HashBrown.Models.Connection === false) {
            this.model = new HashBrown.Models.Connection(this.model);
        }
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor editor--connection' + (this.model.isLocked ? ' locked' : '')},
            _.div({class: 'editor__header'},
                _.span({class: 'editor__header__icon fa fa-exchange'}),
                _.h4({class: 'editor__header__title'}, this.model.title)
            ),
            _.div({class: 'editor__body'},
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'}, 'Is Media provider'),
                    _.div({class: 'editor__field__value'},
                        this.renderMediaProviderEditor()
                    )
                ),
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'}, 'Title'),
                    _.div({class: 'editor__field__value'},
                        this.renderTitleEditor()
                    )
                ),
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'}, 'URL'),
                    _.div({class: 'editor__field__value'},
                        this.renderUrlEditor()
                    )
                ),
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'},
                        _.div({class: 'editor__field__key__label'}, 'Processor'),
                        _.div({class: 'editor__field__key__description'}, 'Which format to deploy Content in')
                    ),
                    _.div({class: 'editor__field__value'},
                        this.renderProcessorSettingsEditor()
                    )
                ),
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'},
                        _.div({class: 'editor__field__key__label'}, 'Deployer'),
                        _.div({class: 'editor__field__key__description'}, 'How to transfer data to and from the website\'s server')
                    ),
                    _.div({class: 'editor__field__value'},
                        this.renderDeployerSettingsEditor()
                    )
                )
            ),
            _.div({class: 'editor__footer'}, 
                _.div({class: 'editor__footer__buttons'},
                    _.button({class: 'widget widget--button embedded'},
                        'Advanced'
                    ).click(() => { this.onClickAdvanced(); }),
                    _.if(!this.model.isLocked, 
                        this.$saveBtn = _.button({class: 'widget widget--button editor__footer__buttons__save'},
                            _.span({class: 'widget--button__text-default'}, 'Save '),
                            _.span({class: 'widget--button__text-working'}, 'Saving ')
                        ).click(() => { this.onClickSave(); })
                    )
                )
            )
        );
    }
}

module.exports = ConnectionEditor;
