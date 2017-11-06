'use strict';

class HashBrownDriverConnectionEditor extends Crisp.View {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor__field'},
            _.div({class: 'editor__field__key'}, 'Token'),
            _.div({class: 'editor__field__value'},
                _.input({class: 'widget widget--input text', type: 'text', value: this.model.token, placeholder: 'Input HashBrown Driver token'})
                    .change((e) => {
                        this.model.token = e.currentTarget.value;
                    })
            )
        );
    };

}
    
//HashBrown.Views.Editors.ConnectionEditors['HashBrown Driver'] = HashBrownDriverConnectionEditor;
