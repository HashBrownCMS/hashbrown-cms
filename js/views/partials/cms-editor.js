class Editor extends View {
    constructor(args) {
        super(args);

        this.$element = _.div({class: 'panel panel-default editor'});
    }

    open(content, skipHighlight) {
        let view = this;

        view.model = content;

        view.render();

        // Highlight file in tree if not skipped
        if(!skipHighlight) {
            ViewHelper.get('Tree').ready(function(view) {
                view.highlight(view.model.path);
            });
        }
    }

    clear() {
        this.$element.html(
            _.div({class: 'spinner-container'},
                _.div({class: 'spinner'})
            )
        );
    }

    openAsync(path) {
        let view = this;

        view.clear();
        
        ViewHelper.get('Tree').ready(function(view) {
            view.highlight(path.replace('/', ''));
        });
        
        api.file.fetch(path, function(content) {
            view.open(content, true);
        });
    }

    render() {
        this.$element.html(JSON.stringify(this.model));
    }
}

module.exports = Editor;
