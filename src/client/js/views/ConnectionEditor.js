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

        $.ajax({
            type: 'post',
            url: '/api/connections/' + view.model.id,
            data: view.model,
            success: function() {
                console.log('[ConnectionEditor] Saved model to /api/connections/' + view.model.id);
                view.$saveBtn.toggleClass('saving', false);
            
                reloadResource('connections')
                .then(function() {
                    let navbar = ViewHelper.get('NavbarMain');

                    view.reload();
                    navbar.reload();
                });
            },
            error: function(err) {
                new MessageModal({
                    model: {
                        title: 'Error',
                        body: err
                    }
                });
            }
        });
    }

    /**
     * Event: On click remove
     */
    onClickDelete() {
        let view = this;

        function onSuccess() {
            console.log('[ConnectionEditor] Removed connection with id "' + view.model.id + '"'); 
        
            reloadResource('connection')
            .then(function() {
                ViewHelper.get('NavbarMain').reload();
                
                // Cancel the ConnectionEditor view
                location.hash = '/connections/';
            });
        }

        new MessageModal({
            model: {
                title: 'Delete connection',
                body: 'Are you sure you want to delete the connection "' + view.model.title + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: function() {
                    }
                },
                {
                    label: 'OK',
                    class: 'btn-danger',
                    callback: function() {
                        $.ajax({
                            url: '/api/connections/' + view.model.id,
                            type: 'DELETE',
                            success: onSuccess
                        });
                    }
                }
            ]
        });
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
        let $editor = _.div({class: 'field-editor string-editor'},
            _.input({class: 'form-control', value: this.model.title})
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
            return new editor({
                model: this.model.settings
            }).$element;

        } else {
            console.log('[ConnectionEditor] No connection editor found for type alias "' + this.model.type + '"');

        }
    }
    
    /**
     * Renders the type editor
     */
    renderTypeEditor() {
        let view = this;

        function onChange() {
            let type = $editor.children('select').val();

            view.model.type = type;

            view.$element.find('.connection-settings .field-value').html(
                view.renderSettingsEditor()
            );
        }

        let $editor = _.div({class: 'field-editor dropdown-editor'},
            _.select({class: 'form-control'},
                _.each(resources.connectionEditors, function(alias, editor) {
                    return _.option({value: alias}, alias);
                })
            ).change(onChange)
        );

        $editor.children('select').val(this.model.type);

        return $editor;
    }

    render() {
        let view = this;

        this.$element.html(
            _.div({class: 'object'},
                _.div({class: 'tab-content'},
                    _.div({class: 'field-container connection-title'},
                        _.div({class: 'field-key'}, 'Title'),
                        _.div({class: 'field-value'},
                            this.renderTitleEditor()
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
                _.div({class: 'panel panel-default panel-buttons'}, 
                    _.div({class: 'btn-group'},
                        _.button({class: 'btn btn-embedded'},
                            'Advanced'
                        ).click(function() { view.onClickAdvanced(); }),
                        _.button({class: 'btn btn-danger btn-raised'},
                            'Delete'
                        ).click(function() { view.onClickDelete(); }),
                        view.$saveBtn = _.button({class: 'btn btn-success btn-raised btn-save'},
                            _.span({class: 'text-default'}, 'Save '),
                            _.span({class: 'text-saving'}, 'Saving ')
                        ).click(function() { view.onClickSave(); })
                    )
                )
            )
        );
    }
}

module.exports = ConnectionEditor;
