class Editor extends View {
    constructor(args) {
        super(args);

        this.initFieldEditors();

        this.$element = _.div({class: 'panel panel-default editor'}, [
            _.div({class: 'panel-heading'}),
            _.div({class: 'panel-body'})
        ]);
    }

    initFieldEditors() {
        this.fieldEditors = {
            'text': require('./field-editors/text'),
            'text-html': require('./field-editors/text-html'),
            'checkbox': require('./field-editors/checkbox')
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
            view.highlight(path.replace('/', ''));
        });
        
        api.file.fetch(path, function(content) {
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
                view.highlight(view.model.path);
            });
        }
    }

    getFieldEditor(editorName, alias, fieldModel, isArray) {
        let FieldEditor = this.fieldEditors[editorName];

        if(FieldEditor) {
            let fieldEditorInstance = new FieldEditor({ model: fieldModel });

            fieldEditorInstance.on('change', function() {
                console.log(fieldModel.value);
                // TODO: Do we need to commit something? Probably not.
            });

            return fieldEditorInstance;
        }
    }

    render() {
        let view = this;

        api.structs.fields.get(function(fieldStructs) {
            api.structs.pages.get(view.model.struct || 'page', function(pageStruct) {
                view.$element.children('.panel-heading').html(view.model.name);
                view.$element.children('.panel-body').empty();

                // TODO: Populate struct with model data

                for(let alias in pageStruct) {
                    let fieldModel = pageStruct[alias];
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
            });
        });
    }
}

module.exports = Editor;
