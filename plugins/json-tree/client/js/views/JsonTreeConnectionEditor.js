class JsonTreeConnectionEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'github-editor'});

        this.fetch();
    }

    render() {
    }
}

resources.connectionEditors['JSON Tree'] = JsonTreeConnectionEditor;
