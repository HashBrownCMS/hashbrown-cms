class ConnectionEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'hashbrown-driver-editor'});

        this.fetch();
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
            _.input({class: 'form-control', type: 'text', value: this.model.token, placeholder: 'Input HashBrown Driver token'})
                .change(onChange)
        );
    }

    render() {
        this.$element.empty();

        _.append(this.$element,
            // Token
            _.div({class: 'field-container hashbrown-token'},
                _.div({class: 'field-key'}, 'Token'),
                _.div({class: 'field-value'},
                    this.renderTokenEditor()
                )
            )
        );
    }
}

resources.connectionEditors['HashBrown Driver'] = ConnectionEditor;
