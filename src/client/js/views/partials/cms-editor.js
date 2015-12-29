class Editor extends View {
    constructor(args) {
        super(args);

        // Register events
        this.on('clickPublish', this.onClickPublish);
        this.on('clickSave', this.onClickSave);

        this.initFieldEditors();

        this.$element = _.div({class: 'panel panel-default editor'}, [
            _.div({class: 'panel-body'},
                _.div({class: 'row'}, [
                    _.div({class: 'col-md-3 editor-nav'},
                        _.div({}, [
                            _.div({class: 'btn-group-vertical field-anchors'}),
                            _.div({class: 'btn-group content-actions'}, [
                                _.button({class: 'btn btn-primary btn-publish'}, [
                                    'Save ',
                                    _.span({class: 'glyphicon glyphicon-floppy-disk'})
                                ]).click(this.events.clickSave),
                                _.button({class: 'btn btn-success btn-publish'}, [
                                    'Publish ',
                                    _.span({class: 'glyphicon glyphicon-upload'})
                                ]).click(this.events.clickPublish),
                            ])
                        ])
                    ),
                    _.div({class: 'col-md-9 editor-content'}, [
                        _.h1('Welcome to the Putaitu CMS editor!'),
                        _.p('Pick a content node from the navigation menu above to begin')
                    ])
                ])
            )
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
            'date-picker': require('./field-editors/date-picker'),
            'block': require('./field-editors/block-picker')
        };
    }

    clear() {
        this.$element.find('editor-content').html(
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
            view.model = content;
            view.path = path;

            view.render();
        });
    }
    
    getFieldEditor(editorName, alias, fieldModel, isArray) {
        let view = this;

        let FieldEditor = view.fieldEditors[editorName];

        if(FieldEditor) {
            let fieldEditorInstance = new FieldEditor({ model: fieldModel });

            fieldEditorInstance.on('change', function() {
                console.log(view.model)
            });

            return fieldEditorInstance;
        }
    }

    renderModelData(modelData, $el, anchorNav) {
        $el.empty();

        for(let anchorLabel in modelData) {
            // If specified, render anchor navigation buttons
            if(anchorNav) {
                function onClickAnchor(e) {
                    e.preventDefault();
                
                    let $btn = $(this);

                    $('html, body').animate({
                        scrollTop: $('#' + $btn.attr('aria-scrollto')).offset().top - 160
                    }, 500);
                }

                let $btn = this.$element.find('.field-anchors').append(
                    _.button({class: 'btn btn-default', 'aria-scrollto': 'anchor-' + anchorLabel},
                        anchorLabel
                    ).click(onClickAnchor)
                );
            }

            // Render anchor points
            let $h4 = $el.append(
                _.h4({id: 'anchor-' + anchorLabel, class: 'field-anchor'},
                    anchorLabel
                )
            );
            
            // Render properties
            let props = modelData[anchorLabel];

            for(let alias in props) {
                let fieldModel = props[alias];
                let fieldStruct = this.fieldStructs[fieldModel.struct];

                if(fieldStruct) {
                    let fieldEditorView = this.getFieldEditor(fieldStruct.editor, alias, fieldModel);

                    if(fieldEditorView) {
                        $el.append(
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
    }

    render() {
        let view = this;

        api.structs.fields.fetch(function(fieldStructs) {
            view.fieldStructs = fieldStructs;

            view.$element.find('.field-anchors').empty();

            view.renderModelData(view.model.data, view.$element.find('.editor-content'), true);
        });
    }
}

module.exports = Editor;
