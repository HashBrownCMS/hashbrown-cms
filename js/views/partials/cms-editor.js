class Editor extends View {
    constructor(args) {
        super(args);

        self.$element = _.div({class: 'container editor'});
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
