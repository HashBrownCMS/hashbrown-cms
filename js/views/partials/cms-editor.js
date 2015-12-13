class Editor extends View {
    constructor(args) {
        super(args);

        this.$element = _.div({class: 'panel editor'});
    }

    open(content) {
        this.model = content;

        this.render();
    }

    render() {
        this.$element.html(JSON.stringify(this.model));
    }
}

module.exports = Editor;
