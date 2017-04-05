'use strict';

// Views
let MessageModal = require('./MessageModal');

class ConnectionEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'editor connection-editor content-editor'});

        this.fetch();
    }

    /**
     * Event: Failed API call
     */
    onError(err) {
        new MessageModal({
            model: {
                title: 'Error',
                body: err
            }
        });
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
        let view = this;

        view.$saveBtn.toggleClass('saving', true);

        apiCall('post', 'connections/' + view.model.id, view.model)
        .then(() => {
            view.$saveBtn.toggleClass('saving', false);
       
            location.reload(); 
        })
        .catch(this.onError);
    }

    /**
     * Reload this view
     */
    reload() {
        this.model = null;
        
        this.fetch();
    }

    /**
     * Renders the title editor
     */
    renderTitleEditor() {
        let view = this;

        function onChange() {
            let title = $(this).val();

            view.model.title = title;
        } 

        let $editor = _.div({class: 'field-editor string-editor'},
            _.input({class: 'form-control', value: this.model.title, type: 'text'})
                .change(onChange)
        );

        return $editor;
    }
    
    /**
     * Renders the URL editor
     */
    renderUrlEditor() {
        let view = this;

        function onChange() {
            view.model.url = $(this).val();
        } 

        let $editor = _.div({class: 'field-editor string-editor'},
            _.input({class: 'form-control', value: this.model.url, type: 'text', placeholder: 'Input the remote URL here, e.g. http://awesomeproject.com'})
                .change(onChange)
        );

        return $editor;
    }
    
    
    /**
     * Renders the settings editor
     */
    renderSettingsEditor() {
        let editor = resources.connectionEditors[this.model.type];

        this.model.settings = this.model.settings || {};

        if(editor) {
            let $editor = new editor({
                model: this.model.settings
            }).$element;

            return $editor;

        } else {
            debug.log('No connection editor found for type alias "' + this.model.type + '"', this);
            return '';

        }
    }
    
    /**
     * Renders the type editor
     */
    renderTypeEditor() {
        // Generate dropdown options
        let dropdownOptions = [];
        
        for(let label in resources.connectionEditors || []) {
            let option = resources.connectionEditors[label];
            
            dropdownOptions[dropdownOptions.length] = {
                label: label,
                value: label,
                selected: label == this.model.type
            };
        }

        let $editor = _.div({class: 'field-editor dropdown-editor'},
            UI.inputDropdown('(none)', dropdownOptions, (newValue) => {
                this.model.type = newValue;

                this.$element.find('.connection-settings .field-value').html(
                    this.renderSettingsEditor()
                );
            }, true)
        );

        return $editor;
    }

    render() {
        let view = this;

        this.$element.toggleClass('locked', this.model.locked);
        this.$element.html(
            _.div({class: 'object'},
                _.div({class: 'editor-header'},
                    _.span({class: 'fa fa-exchange'}),
                    _.h4(this.model.title)
                ),
                _.div({class: 'tab-content editor-body'},
                    _.div({class: 'field-container connection-title'},
                        _.div({class: 'field-key'}, 'Title'),
                        _.div({class: 'field-value'},
                            this.renderTitleEditor()
                        )
                    ),
                    _.div({class: 'field-container connection-url'},
                        _.div({class: 'field-key'}, 'URL'),
                        _.div({class: 'field-value'},
                            this.renderUrlEditor()
                        )
                    ),
                    _.div({class: 'field-container connection-type'},
                        _.div({class: 'field-key'}, 'Type'),
                        _.div({class: 'field-value'},
                            this.renderTypeEditor()
                        )
                    ),
                    _.div({class: 'field-container connection-settings'},
                        _.div({class: 'field-key'}, 'Settings'),
                        _.div({class: 'field-value'},
                            this.renderSettingsEditor()
                        )
                    )
                ),
                _.div({class: 'editor-footer'}, 
                    _.div({class: 'btn-group'},
                        _.button({class: 'btn btn-embedded'},
                            'Advanced'
                        ).click(function() { view.onClickAdvanced(); }),
                        _.if(!this.model.locked, 
                            view.$saveBtn = _.button({class: 'btn btn-primary btn-raised btn-save'},
                                _.span({class: 'text-default'}, 'Save '),
                                _.span({class: 'text-working'}, 'Saving ')
                            ).click(function() { view.onClickSave(); })
                        )
                    )
                )
            )
        );
    }
}

module.exports = ConnectionEditor;
