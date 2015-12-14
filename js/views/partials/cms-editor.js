class Editor extends View {
    constructor(args) {
        super(args);

        this.$element = _.div({class: 'panel editor'});
    }

    open(content) {
        let view = this;

        // TODO: Get right path
        view.model = content[0];

        view.render();

        // Highlight file in tree
        let tree = ViewHelper.get('Tree');
       
        tree.ready(function() {
            tree.highlight(view.model.path);
        });
    }

    render() {
        this.$element.html(JSON.stringify(this.model));
    }
}

module.exports = Editor;
