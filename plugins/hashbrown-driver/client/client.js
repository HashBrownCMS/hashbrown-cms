(function() {
    function ConnectionEditor(params) {
        View.call(this, params);
        
        this.$element = _.div({class: 'hashbrown-driver-editor'});

        this.fetch();
    }

    ConnectionEditor.prototype = Object.create(Crisp.View.prototype);
    ConnectionEditor.prototype.constructor = Crisp.View;

    /**
     * Render token editor
     */
    ConnectionEditor.prototype.renderTokenEditor = function renderTokenEditor() {
        var view = this;

        function onChange() {
            view.model.token = $(this).val();
        }

        return _.div({class: 'field-editor'},
            _.input({class: 'form-control', type: 'text', value: this.model.token, placeholder: 'Input HashBrown Driver token'})
                .change(onChange)
        );
    };

    ConnectionEditor.prototype.render = function render() {
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
    };

    HashBrown.Views.Editors.ConnectionEditors['HashBrown Driver'] = ConnectionEditor;
})();
