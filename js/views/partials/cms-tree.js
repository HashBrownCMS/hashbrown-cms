class Tree extends View {
    constructor(args) {
        super(args);

        this.dirs = {};

        // Prerender container
        this.$element = _.div({class: 'tree'});

        this.modelFunction = api.tree.fetch;
        this.fetch();
    }

    sortFoldersFirst(array) {
        array.sort(function(a, b) {
            if(a.mode == '040000' && b.mode != '040000') {
                return -1;

            } else if(a.mode != '040000' && b.mode == '040000') {
                return 1;

            } else {
                return 0;
            
            }
        });

        return array;
    }

    filterPath(path, recursive) {
        function filter(file) {
            var i = file.path.indexOf(path);

            var hasPath = i == 0;
            var isNotSelf = file.path != path;
            var shouldInclude = true;

            // Include only direct children if specified
            if(hasPath && isNotSelf && !recursive) {
                // Trim the path down to after this folder
                var base = file.path.replace(path, '');

                // Files will have a slash at position 0, folders won't have one
                shouldInclude = base.indexOf('/') <= 0;
            }

            return hasPath && isNotSelf && shouldInclude;
        }
        
        return this.model.tree.filter(filter);
    };

    getFolderContent(path, recursive) {
        return this.sortFoldersFirst(this.filterPath(path, recursive));
    }

    prerender() {
        this.dirs.pages = this.getFolderContent('pages/', true);
        this.dirs.media = this.getFolderContent('media/', true);
    }

    render() {
        console.log(this.dirs.pages);

        this.$element.html(
            
        );
    }
}

module.exports = Tree;
