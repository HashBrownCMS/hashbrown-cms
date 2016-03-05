'use strict';

class JSONEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'json-editor flex-vertical'});
        
        this.fetch();
    }

    onClickReload() {

    }

    onClickSave() {
        
    }

    render() {
        this.$element.html([
            _.textarea({class: 'flex-expand'},
                JSON.stringify(this.model)
            ),
            _.div({class: 'btn-group flex-horizontal'}, [
                _.button({class: 'btn btn-primary flex-expand'}, 'Reload'),
                    .click(this.onClickReload)
                _.button({class: 'btn btn-success flex-expand'}, 'Save')
                    .click(this.onClickSave)
            ])
        ]);
    }
}

module.exports = JSONEditor;
