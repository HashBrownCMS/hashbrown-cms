'use strict';

/**
 * The editor for Forms
 *
 * @class View FormEditor
 *
 * @param {Object} params
 */
class FormEditor extends View {
    constructor(params) {
        super(params);
        
        this.$element = _.div({class: 'editor form-editor'});

        this.fetch();
    }
    
    /**
     * Event: Click advanced. Routes to the JSON editor
     */
    onClickAdvanced() {
        location.hash = location.hash.replace('/forms/', '/forms/json/');
    }

    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        this.$saveBtn.toggleClass('working', true);

        apiCall('post', 'forms/' + this.model.id, this.model)
        .then(() => {
            debug.log('Saved form "' + this.model.id + '"', this);
            this.$saveBtn.toggleClass('working', false);
        
            reloadResource('forms')
            .then(() => {
                let navbar = ViewHelper.get('NavbarMain');
                
                navbar.reload();
            });
        })
        .catch((err) => {
            new MessageModal({
                model: {
                    title: 'Error',
                    body: err
                }
            });
        });
    }

    /**
     * Event: Click add input
     */
    onClickAddInput() {
        if(!this.model.inputs['newinput']) {
            this.model.inputs['newinput'] = { type: 'text' };
        }

        this.render();
    }

    /**
     * Event: Click remove input
     *
     * @param {String} key
     */
    onClickRemoveInput(key) {
        delete this.model.inputs[key];

        this.render();
    }

    /**
     * Renders the title editor
     *
     * @return {Object} element
     */
    renderTitleEditor() {
        let view = this;

        function onInputChange() {
            view.model.title = $(this).val();
        }

        let $element = _.div({class: 'name-editor'},
            _.input({class: 'form-control', type: 'text', value: view.model.title, placeholder: 'Type the form name here'})
                .on('change', onInputChange)
        );

        return $element;
    }

    /**
     * Renders the inputs editor
     *
     * @return {Object} element
     */
    renderInputsEditor() {
        let types = [
            'textarea',
            'select',
            'checkbox',
            'color',
            'date',
            'datetime',
            'datetime-local',
            'email',
            'hidden',
            'month',
            'number',
            'password',
            'radio',
            'range',
            'reset',
            'search',
            'submit',
            'tel',
            'text',
            'time ',
            'url',
            'week'
        ];

        let $element = _.div({class: 'inputs-editor'},
            _.each(this.model.inputs, (key, input) => {
                let view = this;
                let $input = _.div({class: 'input raised'});
                
                function onChange() {
                    if(this.dataset.key == 'name') {
                        delete view.model.inputs[key];

                        key = $(this).val();

                        view.model.inputs[key] = input;
                        
                        render();
                        let $newPreview = view.renderPreview();
                        view.$preview.replaceWith($newPreview);
                        view.$preview = $newPreview;

                    } else {
                        if(this.dataset.key == 'required') {
                            input.required = this.checked;
                        } else if(this.dataset.key == 'options') {
                            input.options = $(this).val().replace(/, /g, ',').split(',');
                        } else {
                            input[this.dataset.key] = $(this).val();
                        }

                        render();
                        let $newPreview = view.renderPreview();
                        view.$preview.replaceWith($newPreview);
                        view.$preview = $newPreview;
                    }
                };

                function render() {
                    let switchId = 'switch-' + key;

                    _.append($input.empty(),
                        _.button({class: 'btn btn-embedded btn-remove'},
                            _.span({class: 'fa fa-remove'})
                        ).click(() => { view.onClickRemoveInput(key); }),
                        view.renderField(
                            'Name',
                            _.input({class: 'form-control', 'data-key': 'name', type: 'text', value: key, placeholder: 'Type the input name here'})
                                .on('change', onChange)
                        ),
                        view.renderField(
                            'Type',
                            _.select({class: 'form-control', 'data-key': 'type'},
                                _.each(types, (i, option) => {
                                    return _.option({value: option}, option);
                                })
                            ).val(input.type).on('change', onChange)
                        ),
                        _.if(input.type == 'select',
                            view.renderField(
                                'Select options (CSV)',
                                _.input({class: 'form-control', 'data-key': 'options', type: 'text', value: (input.options || []).join(','), placeholder: 'Type the select options here, separated by comma'})
                                    .on('change', onChange)
                            )
                        ),
                        view.renderField(
                            'Required',
                            _.div({class: 'switch'},
                                _.input({'data-key': 'required', id: switchId, class: 'form-control switch', type: 'checkbox', checked: input.required == true})
                                .on('change', onChange),
                                _.label({for: switchId})
                            )
                        ),
                        view.renderField(
                            'Pattern',
                            _.input({class: 'form-control', 'data-key': 'pattern', type: 'text', value: input.pattern, placeholder: 'Type a RegEx pattern here'})
                                .on('change', onChange)
                        )
                    );
                }
                
                render();

                return $input;
            }),
            _.button({class: 'btn btn-primary btn-round'}, _.span({class: 'fa fa-plus'}))
                .on('click', () => { this.onClickAddInput(); })
        );

        return $element;
    }

    /**
     * Renders a preview
     *
     * @return {Object} element
     */
    renderPreview() {
        return _.form({class: 'preview raised', onsubmit: 'return false;'},
            _.each(this.model.inputs, (key, input) => {
                if(input.type == 'textarea') {
                    return _.textarea({class: 'form-control', placeholder: key, name: key, pattern: input.pattern, required: input.required == true});
                } else if(input.type == 'select') {
                    return _.select({class: 'form-control', name: key, required: input.required == true},
                        _.each(input.options || [], (i, option) => {
                            return _.option({value: option}, option);
                        })
                    );
                } else {
                    return _.input({class: 'form-control', placeholder: key, type: input.type, name: key, pattern: input.pattern, required: input.required == true});
                }
            }),
            _.input({class: 'btn btn-primary', type: 'submit', value: 'Test'})
        );
    }

    /**
     * Renders all entries
     *
     * @return {Object} element
     */
    renderEntries() {
        let view = this;
        
        function onClick() {
            messageModal(
                'Entries',
                _.div({class: 'form-entries-list'},
                    _.each(view.model.entries.reverse(), (i, entry) => {
                        return _.div({class: 'entry'},
                            _.each(entry, (key, value) => {
                                return _.div({class: 'kvp'},
                                    _.div({class: 'key'}, key),
                                    _.div({class: 'value'}, value)
                                );
                            })
                        );
                    })  
                )
            ).$element.addClass('large');
        }

        return _.button({class: 'btn btn-primary'}, 'View entries').click(onClick);
    }

    /**
     * Renders a single field
     *
     * @return {Object} element
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

        
    /**
     * Renders all fields
     *
     * @return {Object} element
     */
    renderFields() {
        let id = parseInt(this.model.id);

        let $element = _.div({class: 'form editor-body'});
        let postUrl = location.protocol + '//' + location.hostname + '/api/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/forms/' + this.model.id + '/submit';
        
        // Content type
        $element.empty();

        this.$preview = this.renderPreview();

        $element.append(this.renderField('Entries', this.renderEntries())); 
        $element.append(this.renderField('POST URL',
            _.div({class: 'input-group'},
                _.input({readonly: 'readonly', class: 'form-control post-url', type: 'text', value: postUrl}),
                _.div({class: 'input-group-btn'},
                    _.button({class: 'btn btn-primary'},
                        'Copy'
                    ).click(() => {
                        copyToClipboard($('.post-url').val());
                    })
                )
            )
        ));
        $element.append(this.renderField('Title', this.renderTitleEditor())); 
        $element.append(this.renderField('Inputs', this.renderInputsEditor())); 
        $element.append(this.renderField('Test', this.$preview));

        return $element;
    }

    render() {
        _.append(this.$element.empty(),
            _.div({class: 'editor-header'},
                _.span({class: 'fa fa-wpforms'}),
                _.h4(this.model.title)
            ),
            this.renderFields(),
            _.div({class: 'editor-footer'}, 
                _.div({class: 'btn-group'},
                    _.button({class: 'btn btn-embedded'},
                        'Advanced'
                    ).click(() => { this.onClickAdvanced(); }),
                    _.if(!this.model.locked,
                        this.$saveBtn = _.button({class: 'btn btn-primary btn-raised btn-save'},
                            _.span({class: 'text-default'}, 'Save '),
                            _.span({class: 'text-working'}, 'Saving ')
                        ).click(() => { this.onClickSave(); }),
                        _.button({class: 'btn btn-embedded-danger btn-embedded'},
                            _.span({class: 'fa fa-trash'})
                        ).click(() => { this.onClickDelete(); })
                    )
                )
            )
        );
    }
}

module.exports = FormEditor;
