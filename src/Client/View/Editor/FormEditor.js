'use strict';

/**
 * The editor for Forms
 *
 * @memberof HashBrown.Client.View.Editor
 */
class FormEditor extends HashBrown.View.Editor.ResourceEditor {
    constructor(params) {
        super(params);
        
        this.fetch();
    }

    /**
     * Fetches the model
     */
    async fetch() {
        try {
            this.model = await HashBrown.Service.FormService.getFormById(this.modelId);

            super.fetch();

        } catch(e) {
            UI.errorModal(e);

        }
    }
    
    /**
     * Event: Click advanced. Routes to the JSON editor
     */
    onClickAdvanced() {
        location.hash = '/forms/json/' + this.model.id;
    }

    /**
     * Event: Click save
     */
    async onClickSave() {
        this.$saveBtn.toggleClass('working', true);

        await HashBrown.Service.ResourceService.set('forms', this.model.id, this.model);
        
        this.$saveBtn.toggleClass('working', false);
    }

    /**
     * Event: Click add input
     */
    onClickAddInput() {
        if(!this.model.inputs['newinput']) {
            this.model.inputs['newinput'] = { type: 'text' };
        }

        this.update();
    }

    /**
     * Event: Click remove input
     *
     * @param {String} key
     */
    onClickRemoveInput(key) {
        delete this.model.inputs[key];

        this.update();
    }
    
    /**
     * Renders the allowed origin editor
     *
     * @return {Object} element
     */
    renderAllowedOriginEditor() {
        return new HashBrown.View.Widget.Input({
            value: this.model.allowedOrigin,
            tooltip: 'The allowed origin from which entries to this form can be posted',
            onChange: (newOrigin) => {
                this.model.allowedOrigin = newOrigin;
            }
        });
    }

    /**
     * Renders the title editor
     *
     * @return {Object} element
     */
    renderTitleEditor() {
        return new HashBrown.View.Widget.Input({
            value: this.model.title,
            tooltip: 'The title of the form',
            onChange: (newTitle) => {
                this.model.title = newTitle;
            }
        });
    }
    
    /**
     * Renders the redirect editor
     *
     * @return {Object} element
     */
    renderRedirectEditor() {
        return _.div({class: 'widget-group'},
            new HashBrown.View.Widget.Input({
                value: this.model.redirect,
                tooltip: 'The URL that the user will be redirected to after submitting the form entry',
                onChange: (newUrl) => {
                    this.model.redirect = newUrl;
                }
            }),
            new HashBrown.View.Widget.Input({
                value: this.model.appendRedirect,
                placeholder: 'Append',
                type: 'checkbox',
                tooltip: 'If ticked, the redirect URL will be appended to that of the origin',
                onChange: (newValue) => {
                    this.model.appendRedirect = newValue;
                }
            })
        );
    }

    /**
     * Gets all input types
     *
     * @return {Array} Types
     */
    getInputTypes() {
        return [ 'checkbox', 'hidden', 'number', 'select', 'text' ];
    }

    /**
     * Renders all entries
     *
     * @return {Object} element
     */
    renderEntries() {
        return _.div({class: 'editor__field__value'},
            _.div({class: 'widget-group'},
                _.button({class: 'widget widget--button low warning'}, 'Clear').click(() => {
                    UI.confirmModal('Clear', 'Clear "' + this.model.title + '"', 'Are you sure you want to clear all entries?', async () => {
                        try {
                            await HashBrown.Service.RequestService.request('post', 'forms/clear/' + this.model.id);

                            this.model.entries = [];
                        
                        } catch(e) {
                            UI.errorModal(e);

                        }
                    });
                }),
                _.button({class: 'widget widget--button low'}, 'Get .csv').click(() => {
                    location = HashBrown.Service.RequestService.environmentUrl('forms/' + this.model.id + '/entries');
                })
            )
        );
    }

    /**
     * Gets the POST URL
     *
     * @return {String} URL
     */
    getPostUrl() {
        return location.protocol + '//' + location.hostname + '/api/' + HashBrown.Context.projectId + '/' + HashBrown.Context.environment + '/forms/' + this.model.id + '/submit';
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor editor--form' + (this.model.isLocked ? ' locked' : '')},
            _.div({class: 'editor__header'},
                _.span({class: 'editor__header__icon fa fa-wpforms'}),
                _.h4({class: 'editor__header__title'}, this.model.title)
            ),
            _.div({class: 'editor__body'},
                this.field(
                    'Entries (' + this.model.entries.length + ')',
                    this.renderEntries()
                ),
                this.field(
                    'POST URL',
                    _.div({class: 'widget-group'},
                        _.input({readonly: 'readonly', class: 'widget widget--input text', type: 'text', value: this.getPostUrl()}),
                        _.button({class: 'widget widget--button small fa fa-copy', title: 'Copy POST URL'})
                            .click((e) => { copyToClipboard(e.currentTarget.previousElementSibling.value); })
                    )
                ),
                this.field(
                    'Title',
                    this.renderTitleEditor()
                ),
                this.field(
                    'Allowed origin',
                    this.renderAllowedOriginEditor() 
                ),
                this.field(
                    'Redirect URL',
                    this.renderRedirectEditor() 
                ),
                this.field(
                    'Inputs',
                    _.div({class: 'editor--form__inputs'},
                        _.div({class: 'editor__field__value'},
                            _.each(this.model.inputs, (key, input) => {
                                return this.field(
                                    {
                                        isCollapsible: true,
                                        isCollapsed: true,
                                        label: key,
                                        actions: {
                                            remove: () => { this.onClickRemoveInput(key); }
                                        }
                                    },
                                    this.field(
                                        'Name',
                                        new HashBrown.View.Widget.Input({
                                            value: key,
                                            onChange: (newValue) => {
                                                delete this.model.inputs[key];

                                                key = newValue;

                                                this.model.inputs[key] = input;
                                            }
                                        })
                                    ),
                                    this.field(
                                        'Type',
                                        new HashBrown.View.Widget.Dropdown({
                                            value: input.type,
                                            options: this.getInputTypes(),
                                            onChange: (newValue) => {
                                                input.type = newValue;

                                                this.update();
                                            }
                                        })
                                    ),
                                    _.if(input.type == 'select',
                                        this.field(
                                            'Select options',
                                            new HashBrown.Entity.View.Widget.List({
                                                model: {
                                                    value: input.options || [],
                                                    onchange: (newValue) => {
                                                        input.options = newValue;

                                                        this.update();
                                                    }
                                                }
                                            }).element
                                        )
                                    ),
                                    this.field(
                                        'Required',
                                        new HashBrown.View.Widget.Input({
                                            type: 'checkbox',
                                            value: input.required === true,
                                            onChange: (newValue) => {
                                                input.required = newValue;
                                            }
                                        })
                                    ),
                                    this.field(
                                        'Check duplicates',
                                        new HashBrown.View.Widget.Input({
                                            type: 'checkbox',
                                            value: input.checkDuplicates === true,
                                            onChange: (newValue) => {
                                                input.checkDuplicates = newValue;
                                            }
                                        })
                                    ),
                                    this.field(
                                        'Pattern',
                                        new HashBrown.View.Widget.Input({
                                            value: input.pattern,
                                            onChange: (newValue) => {
                                                input.pattern = newValue;
                                            }
                                        })
                                    )
                                );
                            }),
                            _.button({class: 'widget widget--button dashed expanded embedded editor__field__add'},
                                _.span({class: 'fa fa-plus'}),
                                'Add input'
                            ).on('click', () => { this.onClickAddInput(); })
                        )
                    )
                ),
                this.field(
                    'Preview',
                    _.div({class: 'editor--form__preview'},
                        _.each(this.model.inputs, (key, input) => {
                            if(input.type === 'select') {
                                return new HashBrown.View.Widget.Dropdown({
                                    options: input.options || []
                                });
                            } else {
                                return _.input({class: 'widget widget--input ' + (input.type || 'text'), placeholder: key, type: input.type, name: key, pattern: input.pattern, required: input.required === true});
                            }
                        })
                    )
                )
            ),
            _.div({class: 'editor__footer'}, 
                _.div({class: 'editor__footer__buttons'},
                    _.button({class: 'widget widget--button embedded'},
                        'Advanced'
                    ).click(() => { this.onClickAdvanced(); }),
                    _.if(!this.model.isLocked,
                        this.$saveBtn = _.button({class: 'widget widget--button'},
                            _.span({class: 'widget--button__text-default'}, 'Save '),
                            _.span({class: 'widget--button__text-working'}, 'Saving ')
                        ).click(() => { this.onClickSave(); })
                    )
                )
            )
        );
    }
}

module.exports = FormEditor;
