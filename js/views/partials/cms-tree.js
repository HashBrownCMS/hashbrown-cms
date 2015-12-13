class Tree extends View {
    constructor(args) {
        super(args);

        this.dirs = {};

        // Register events
        this.on('openFolder', this.onOpenFolder);

        // Prerender container
        this.$element = _.div({class: 'tree'});

        this.modelFunction = api.tree.fetch;
        this.fetch();
    }

    /**
     * Events
     */
    onOpenFolder(e, element, view) {
        let path = $(e.target).data('path');

        if(path.indexOf('/media') == 0) {
            page(path);
        }
    }

    /**
     * Actions
     */
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
    }

    getFolderContent(path, recursive) {
        return this.sortFoldersFirst(this.filterPath(path, recursive));
    }

    getCurrentRoot() {
        return this.$rootNav.find('li.active a').attr('aria-controls');
    }

    /**
     * Tree data
     */
    prerender() {
        this.dirs.pages = this.getFolderContent('pages/', true);
        this.dirs.media = this.getFolderContent('media/', true);
    }

    /** 
     * Render
     */
    render() {
        let view = this;

        this.$element.html([
            // Root folders
            this.$rootNav = _.ul({class: 'nav nav-root nav-tabs', role: 'tablist'},
                _.each(
                    this.dirs,
                    function(label, files) {
                        return _.li(
                            { role: 'presentation', class: '' },
                            _.a(
                                { href: '#' + label, 'aria-controls': label, role: 'tab', 'data-toggle': 'tab' },
                                label
                            )
                        )
                    }
                )
            ),

            // Subfolders
            this.$subNav = _.nav({class: 'tab-content nav-sub'},
                _.each(this.dirs,
                    function(label, files) {
                        return _.div({role: 'tab-panel', id: label, class: 'list-group tab-pane'},
                            _.each(
                                files,
                                function(i, file) {
                                    var isDir = file.mode == '040000';
                                    var name = helper.basename(file.path);
                                
                                    if(isDir) {
                                        return _.panel({class: 'panel-default'}, [
                                            _.panel_heading({role: 'tab'},
                                                _.a({class: 'panel-title collapsed', 'data-toggle': 'collapse', role: 'button', href: '#' + file.sha, 'data-path': '/' + file.path}, [
                                                    name,
                                                    _.glyphicon({ class: 'glyphicon-folder-close' }),
                                                    _.glyphicon({ class: 'glyphicon-folder-open' })
                                                ]).click(view.events.openFolder)
                                            ),
                                            _.panel_collapse({class: 'collapse', role: 'tabpanel', id: file.sha},
                                                _.panel_body()
                                            )
                                        ]);

                                    } else {
                                        return _.a({class: 'list-group-item', href: '/' + file.path}, [
                                            name,
                                            _.glyphicon({ class: 'glyphicon-file' })
                                        ]).click(function(e) {
                                            e.preventDefault();

                                            page($(this).attr('href'));
                                        });

                                    }
                                }
                            )
                        )
                    }
                )
            )
        ]);

        // Put files into folders
        view.$subNav.find('.list-group-item').each(function(i) {
            let dir = helper.basedir($(this).attr('href'));
            
            view.$subNav.find('a[data-path="' + dir + '"]').parents('.panel').eq(0).find('.panel-body').append(
                $(this)
            );
        });
    }
}

module.exports = Tree;
