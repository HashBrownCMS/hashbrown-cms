'use strict';

/**
 * The editor for Connections
 *
 * @memberof HashBrown.Client.View.Editor
 */
class ConnectionEditor extends HashBrown.View.Editor.ResourceEditor {
    /**
     * Fetches the model
     *
     * @param {Boolean} skipEntity
     */
    async fetch(skipEntity = false) {
        if(skipEntity) {
            return super.fetch();
        }
        
        try {
            this.model = await HashBrown.Service.ConnectionService.getConnectionById(this.modelId);

            super.fetch();

        } catch(e) {
            UI.errorModal(e);

        }
    }

    /**
     * Event: Click advanced. Routes to the JSON editor
     */
    onClickAdvanced() {
        location.hash = '/connections/json/' + this.model.id;
    }

    /**
     * Event: Click save
     */
    async onClickSave() {
        this.$saveBtn.toggleClass('working', true);

        try {
            await HashBrown.Service.ResourceService.set('connections', this.model.id, this.model);
                
            HashBrown.Service.EventService.trigger('resource');  
        
        } catch(e) {
            UI.errorModal(e);

        }

        this.$saveBtn.toggleClass('working', false);
    }

    /**
     * Renders the Media provider editor
     */
    renderMediaProviderEditor() {
        let input = new HashBrown.Entity.View.Widget.Checkbox({
            model: {
                value: false,
                onchange: (isProvider) => {
                    HashBrown.Service.ConnectionService.setMediaProvider(isProvider ? this.model.id : null)
                    .catch(UI.errorModal);
                }
            }
        });

        // Set the value
        input.element.classList.toggle('working', true);

        HashBrown.Service.ConnectionService.getMediaProvider()
        .then((connection) => {
            if(connection && connection.id === this.model.id) {
                input.setValue(true);
            }
        
            input.element.classList.toggle('working', false);
        });

        return input.element;
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
                // Media provider
                this.field(
                    'Is Media provider',
                    this.renderMediaProviderEditor()
                ),
                
                // Title
                this.field(
                    'Title',
                    new HashBrown.Entity.View.Widget.Text({
                        model: {
                            value: this.model.title,
                            onchange: (newValue) => {
                                this.model.title = newValue;
                            }
                        }
                    }).element
                ),

                // URL
                this.field(
                    'URL',
                    new HashBrown.Entity.View.Widget.Text({
                        model: {
                            value: this.model.url,
                            onchange: (newValue) => {
                                this.model.url = newValue;
                            }
                        }
                    }).element
                ),

                // Processor settings
                this.field(
                    { label: 'Processor', description: 'Which format to deploy Content in' },
                    this.field(
                        'Type',
                        new HashBrown.Entity.View.Widget.Popup({
                            model: {
                                value: this.model.processor.alias,
                                options: (async () => {
                                    let options = {};
                                    let processors = await HashBrown.Service.RequestService.request('get', 'connections/processors');

                                    for(let id in processors) {
                                        options[processors[id]] = id;
                                    }

                                    return options;
                                })(),
                                onchange: (newValue) => {
                                    this.model.processor.alias = newValue;

                                    this.fetch(true);
                                }
                            }
                        }).element
                    ),
                    this.field(
                        { label: 'File extension', description: 'A file extension such as .json or .xml'},
                        _.each(HashBrown.View.Editor.ProcessorEditor, (name, editor) => {
                            if(editor.alias !== this.model.processor.alias) { return; }
                                
                            return new editor({
                                model: this.model.processor
                            });
                        }),
                        new HashBrown.Entity.View.Widget.Text({
                            model: {
                                value: this.model.processor.fileExtension,
                                onchange: (newValue) => {
                                    this.model.processor.fileExtension = newValue;
                                }
                            }
                        }).element
                    )
                ),
                
                // Deployer settings
                this.field(
                    { label: 'Deployer', description: 'How to transfer data to and from the website\'s server' },
                    this.field(
                        'Type',
                        new HashBrown.Entity.View.Widget.Popup({
                            model: {
                                value: this.model.deployer.alias,
                                options: (async () => {
                                    let options = {};
                                    let processors = await HashBrown.Service.RequestService.request('get', 'connections/deployers');

                                    for(let id in processors) {
                                        options[processors[id]] = id;
                                    }

                                    return options;
                                })(),
                                placeholder: 'Type',
                                onchange: (newValue) => {
                                    this.model.deployer.alias = newValue;

                                    this.fetch(true);
                                }
                            }
                        }).element
                    ),
                    _.each(HashBrown.View.Editor.DeployerEditor, (name, editor) => {
                        if(editor.alias !== this.model.deployer.alias) { return; }
                            
                        return new editor({
                            model: this.model.deployer
                        }).$element;
                    }),
                    _.do(() => {
                        if(!this.model.deployer || !this.model.deployer.paths) { return; }
                        
                        return this.field(
                            { label: 'Paths', description: 'Where to send the individual resources' },
                            this.field(
                                'Content',
                                new HashBrown.Entity.View.Widget.Text({
                                    model: {
                                        value: this.model.deployer.paths.content,
                                        onchange: (newValue) => {
                                            this.model.deployer.paths.content = newValue;
                                        }
                                    }
                                }).element
                            ),
                            this.field(
                                'Media',
                                new HashBrown.Entity.View.Widget.Text({
                                    model: {
                                        value: this.model.deployer.paths.media,
                                        onchange: (newValue) => {
                                            this.model.deployer.paths.media = newValue;
                                        }
                                    }
                                }).element
                            )
                        );
                    })
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
