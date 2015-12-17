class Editor extends View {
    constructor(args) {
        super(args);

        // Register events
        this.on('clickPublish', this.onClickPublish);
        this.on('clickSave', this.onClickSave);

        this.initFieldEditors();

        this.$element = _.div({class: 'panel panel-default editor'}, [
            _.div({class: 'panel-heading hidden'}, [
                _.div({class: 'btn-group content-actions'}, [
                    _.button({class: 'btn btn-primary btn-publish'}, [
                        'Save ',
                        _.span({class: 'glyphicon glyphicon-floppy-disk'})
                    ]).click(this.events.clickSave),
                    _.button({class: 'btn btn-success btn-publish'}, [
                        'Publish ',
                        _.span({class: 'glyphicon glyphicon-upload'})
                    ]).click(this.events.clickPublish),
                ]),
                _.div({class: 'btn-group field-anchors'})
            ]),
            _.div({class: 'panel-body'}, [
                _.h1('Welcome to the Putaitu CMS editor!'),
                _.p('Pick a content node from the navigation menu above to begin')
            ])
        ]);
    }

    /**
     * Events
     */
    onClickPublish(e, element, view) {
        api.content.publish(view.model, view.path, function() {
            console.log('done!');
        }); 
    }
    
    onClickSave(e, element, view) {
        api.content.save(view.model, view.path, function() {
            console.log('done!');
        }); 
    }

    /**
     * Actions
     */
    initFieldEditors() {
        this.fieldEditors = {
            'text': require('./field-editors/text'),
            'text-html': require('./field-editors/text-html'),
            'url': require('./field-editors/url'),
            'checkbox': require('./field-editors/checkbox'),
            'template-picker': require('./field-editors/template-picker'),
            'struct-picker': require('./field-editors/struct-picker'),
            'date-picker': require('./field-editors/date-picker')
        };
    }

    clear() {
        this.$element.children('panel-body').html(
            _.div({class: 'spinner-container'},
                _.div({class: 'spinner'})
            )
        );
    }

    openAsync(path) {
        let view = this;

        view.clear();
       
        ViewHelper.get('Tree').ready(function(view) {
            view.highlight('content/' + path);
        });
        
        api.content.fetch(path, function(content) {
            view.open(content, true);
        });
    }
    
    open(content, skipHighlight) {
        let view = this;

        view.model = content;

        view.render();

        // Highlight file in tree if not skipped
        if(!skipHighlight) {
            ViewHelper.get('Tree').ready(function(view) {
                view.highlight('content/' + view.model.path);
            });
        }
    }

    getFieldEditor(editorName, alias, fieldModel, isArray) {
        let FieldEditor = this.fieldEditors[editorName];

        if(FieldEditor) {
            let fieldEditorInstance = new FieldEditor({ model: fieldModel });

            return fieldEditorInstance;
        }
    }

    render() {
        let view = this;

        api.structs.fields.fetch(function(fieldStructs) {
            view.$element.children('.panel-heading').children('.field-anchors').empty();
            view.$element.children('.panel-body').empty();

            for(let anchorLabel in view.model) {
                // Render anchor points
                function onClickAnchor(e) {
                    e.preventDefault();
                }

                view.$element.children('.panel-heading').children('.field-anchors').append(
                    _.button({class: 'btn btn-default'},
                        anchorLabel
                    ).click(onClickAnchor)
                );
                

                view.$element.children('.panel-body').append(
                    _.h4({class: 'field-anchor'},
                        anchorLabel
                    )
                );
                
                // Render properties
                let props = view.model[anchorLabel];

                for(let alias in props) {
                    let fieldModel = props[alias];
                    let fieldStruct = fieldStructs[fieldModel.struct];

                    if(fieldStruct) {
                        let fieldEditorView = view.getFieldEditor(fieldStruct.editor, alias, fieldModel);

                        if(fieldEditorView) {
                            view.$element.children('.panel-body').append(
                                _.div({class: 'input-group field-editor-container'}, [
                                    _.span({class: 'field-editor-label input-group-addon'},
                                        fieldModel.label
                                    ),
                                    fieldEditorView.$element
                                ])
                            );
                        
                        } else {
                            console.log('No field editor with name "' + fieldStruct.editor + '" was found');
                        
                        }

                    } else {
                        console.log('No field struct with name "' + fieldModel.struct + '" was found');
                    }
                }
            }
        });
    }
}

module.exports = Editor;
