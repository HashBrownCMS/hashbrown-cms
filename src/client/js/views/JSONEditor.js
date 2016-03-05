'use strict';

class JSONEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'json-editor'});
        
        this.fetch();
    }

    render() {
        this.$element.html(
            _.textarea(
                JSON.stringify(this.model)
            )
        );
    }
}

module.exports = JSONEditor;
