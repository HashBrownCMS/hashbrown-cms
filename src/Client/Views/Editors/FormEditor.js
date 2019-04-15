'use strict';

/**
 * The editor for Forms
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class FormEditor extends Crisp.View {
    constructor(params) {
        super(params);
        
        this.fetch();
    }

    /**
     * Fetches the model
     */
    async fetch() {
        try {
            this.model = await HashBrown.Helpers.FormHelper.getFormById(this.modelId);

            super.fetch();

        } catch(e) {
            UI.errorModal(e);

        }
    }
    
    /**
     * Event: Click advanced. Routes to the JSON editor
     */
    onClickAdvanced() {
        location.hash = location.hash.replace('/forms/', '/forms/json/');
    }

    /**
     * Event: Click save
     */
    async onClickSave() {
        this.$saveBtn.toggleClass('working', true);

        await HashBrown.Helpers.ResourceHelper.set('forms', this.model.id, this.model);
        
        this.$saveBtn.toggleClass('working', false);
    }

    /**
     * Event: Click add input
     */
    onClickAddInput() {
        if(!this.model.inputs['newinput']) {
            this.model.inputs['newinput'] = { type: 'text' };
        }

        this.renderInputsEditor();
    }

    /**
     * Event: Click remove input
     *
     * @param {String} key
     */
    onClickRemoveInput(key) {
        delete this.model.inputs[key];

        this.renderInputsEditor();
    }
    
    /**
     * Renders the allowed origin editor
     *
     * @return {Object} element
     */
    renderAllowedOriginEditor() {
        return _.div({class: 'editor__field__value'},
            new HashBrown.Views.Widgets.Input({
                value: this.model.allowedOrigin,
                tooltip: 'The allowed origin from which entries to this form can be posted',
                onChange: (newOrigin) => {
                    this.model.allowedOrigin = newOrigin;
                }
            }).$element
        );
    }

    /**
     * Renders the title editor
     *
     * @return {Object} element
     */
    renderTitleEditor() {
        return _.div({class: 'editor__field__value'},
            new HashBrown.Views.Widgets.Input({
                value: this.model.title,
                tooltip: 'The title of the form',
                onChange: (newTitle) => {
                    this.model.title = newTitle;
                }
            }).$element
        );
    }
    
    /**
     * Renders the redirect editor
     *
     * @return {Object} element
     */
    renderRedirectEditor() {
        return _.div({class: 'editor__field__value'},
            _.div({class: 'widget-group'},
                new HashBrown.Views.Widgets.Input({
                    value: this.model.redirect,
                    tooltip: 'The URL that the user will be redirected to after submitting the form entry',
                    onChange: (newUrl) => {
                        this.model.redirect = newUrl;
                    }
                }).$element,
                new HashBrown.Views.Widgets.Input({
                    value: this.model.appendRedirect,
                    placeholder: 'Append',
                    type: 'checkbox',
                    tooltip: 'If ticked, the redirect URL will be appended to that of the origin',
                    onChange: (newValue) => {
                        this.model.appendRedirect = newValue;
                    }
                }).$element
            )
        );
    }

    /**
     * Renders the inputs editor
     *
     * @return {Object} element
     */
    renderInputsEditor() {
        let $inputs = this.$element.find('.editor--form__inputs');
        
        let types = [
            'checkbox',
            'hidden',
            'number',
            'select',
            'text'
        ];

        _.append($inputs.empty(),
            _.div({class: 'editor__field__value'},
                _.each(this.model.inputs, (key, input) => {
                    return _.div({class: 'editor__field raised'},
                        _.div({class: 'editor__field__actions'},
                            _.button({class: 'editor__field__action editor__field__action--remove', title: 'Remove field'})
                                .click(() => { view.onClickRemoveInput(key); })
                        ),
                        _.div({class: 'editor__field__value'},
                            _.div({class: 'editor__field'},
                                _.div({class: 'editor__field__key'}, 'Name'),
                                _.div({class: 'editor__field__value'},
                                    new HashBrown.Views.Widgets.Input({
                                        value: key,
                                        onChange: (newValue) => {
                                            delete this.model.inputs[key];

                                            key = newValue;

                                            this.model.inputs[key] = input;
                                        }
                                    }).$element
                                )
                            ),
                            _.div({class: 'editor__field'},
                                _.div({class: 'editor__field__key'}, 'Type'),
                                _.div({class: 'editor__field__value'},
                                    new HashBrown.Views.Widgets.Dropdown({
                                        value: input.type,
                                        options: types,
                                        onChange: (newValue) => {
                                            input.type = newValue;

                                            this.renderInputsEditor();
                                        }
                                    }).$element
                                )
                            ),
                            _.if(input.type == 'select',
                                _.div({class: 'editor__field'},
                                    _.div({class: 'editor__field__key'}, 'Select options'),
                                    _.div({class: 'editor__field__value'},
                                        new HashBrown.Views.Widgets.Chips({
                                            value: input.options || [],
                                            onChange: (newValue) => {
                                                input.options = newValue;

                                                this.renderPreview();
                                            }
                                        }).$element
                                    )
                                )
                            ),
                            _.div({class: 'editor__field'},
                                _.div({class: 'editor__field__key'}, 'Required'),
                                _.div({class: 'editor__field__value'},
                                    new HashBrown.Views.Widgets.Input({
                                        type: 'checkbox',
                                        value: input.required === true,
                                        onChange: (newValue) => {
                                            input.required = newValue;
                                        }
                                    }).$element
                                )
                            ),
                            _.div({class: 'editor__field'},
                                _.div({class: 'editor__field__key'}, 'Check duplicates'),
                                _.div({class: 'editor__field__value'},
                                    new HashBrown.Views.Widgets.Input({
                                        type: 'checkbox',
                                        value: input.checkDuplicates === true,
                                        onChange: (newValue) => {
                                            input.checkDuplicates = newValue;
                                        }
                                    }).$element
                                )
                            ),
                            _.div({class: 'editor__field'},
                                _.div({class: 'editor__field__key'}, 'Pattern'),
                                _.div({class: 'editor__field__value'},
                                    new HashBrown.Views.Widgets.Input({
                                        value: input.pattern,
                                        onChange: (newValue) => {
                                            input.pattern = newValue;
                                        }
                                    }).$element
                                )
                            )
                        )
                    );
                }),
                _.button({class: 'widget widget--button round editor__field__add fa fa-plus', title: 'Add an input'})
                    .on('click', () => { this.onClickAddInput(); })
            )
        );
    }

    /**
     * Renders a preview
     *
     * @return {Object} element
     */
    renderPreview() {
        let $preview = this.$element.find('.editor--form__preview');

        _.append($preview.empty(),
            _.each(this.model.inputs, (key, input) => {
                if(input.type === 'select') {
                    return new HashBrown.Views.Widgets.Dropdown({
                        options: input.options || []
                    }).$element
                } else {
                    return _.input({class: 'widget widget--input ' + (input.type || 'text'), placeholder: key, type: input.type, name: key, pattern: input.pattern, required: input.required === true});
                }
            })
        );
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
                            await HashBrown.Helpers.RequestHelper.request('post', 'forms/clear/' + this.model.id);

                            this.model.entries = [];
                        
                        } catch(e) {
                            UI.errorModal(e);

                        }
                    });
                }),
                _.button({class: 'widget widget--button low'}, 'Get .csv').click(() => {
                    location = HashBrown.Helpers.RequestHelper.environmentUrl('forms/' + this.model.id + '/entries');
                })
            )
        );
    }

    /**
     * Renders a single field
     *
     * @return {HTMLElement} Element
     */
    renderField(label, $content, className) {
        return _.div({class: 'editor__field'},
            _.div({class: 'editor__field__key'},
                label
            ),
            $content
        );
    }
        
    /**
     * Renders all fields
     *
     * @return {Object} element
     */
    renderFields() {
        let postUrl = location.protocol + '//' + location.hostname + '/api/' + HashBrown.Context.projectId + '/' + HashBrown.Context.environment + '/forms/' + this.model.id + '/submit';
        
        return _.div({class: 'editor__body'},
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Entries (' + this.model.entries.length + ')'),
                _.div({class: 'editor__field__value'},
                    this.renderEntries()
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'POST URL'),
                _.div({class: 'editor__field__value'},
                    _.div({class: 'widget-group'},
                        _.input({readonly: 'readonly', class: 'widget widget--input text', type: 'text', value: postUrl}),
                        _.button({class: 'widget widget--button small fa fa-copy', title: 'Copy POST URL'})
                            .click((e) => {
                                copyToClipboard(e.currentTarget.previousElementSibling.value);
                            })
                    )
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Title'),
                _.div({class: 'editor__field__value'},
                    this.renderTitleEditor()
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Allowed origin'),
                _.div({class: 'editor__field__value'},
                    this.renderAllowedOriginEditor() 
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Redirect URL'),
                _.div({class: 'editor__field__value'},
                    this.renderRedirectEditor() 
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Inputs'),
                _.div({class: 'editor__field__value'},
                    _.div({class: 'editor--form__inputs'})
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Preview'),
                _.div({class: 'editor__field__value'},
                    _.div({class: 'editor--form__preview'})
                )
            )
        );
    }

    /**
     * Post render
     */
    postrender() {
        this.renderInputsEditor();
        this.renderPreview();
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
            this.renderFields(),
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
