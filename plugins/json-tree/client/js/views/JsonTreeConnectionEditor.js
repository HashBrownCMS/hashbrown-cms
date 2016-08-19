class JsonTreeConnectionEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'json-tree-editor'});

        this.fetch();
    }
    
    /**
     * Render remote editor
     */
    renderRemoteEditor() {
        let view = this;
        
        function onChange() {
            view.model.remote = $(this).val();
        }

        return _.div({class: 'field-editor'},
            _.input({class: 'form-control', type: 'text', value: this.model.remote, placeholder: 'Input remote URL'})
                .change(onChange)
        );
    }
    
    /**
     * Render token editor
     */
    renderTokenEditor() {
        let view = this;
        
        function onChange() {
            view.model.token = $(this).val();
        }

        return _.div({class: 'field-editor'},
            _.input({class: 'form-control', type: 'text', value: this.model.token, placeholder: 'Input token'})
                .change(onChange)
        );
    }

    render() {
        this.$element.empty();

        _.append(this.$element,
            // Remote
            _.div({class: 'field-container json-tree-remote'},
                _.div({class: 'field-key'}, 'Remote'),
                _.div({class: 'field-value'},
                    this.renderRemoteEditor()
                )
            ),

            // Token
            _.div({class: 'field-container json-tree-token'},
                _.div({class: 'field-key'}, 'Token'),
                _.div({class: 'field-value'},
                    this.renderTokenEditor()
                )
            )
        );
    }
}

resources.connectionEditors['JSON Tree'] = JsonTreeConnectionEditor;
