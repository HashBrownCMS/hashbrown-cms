class Tree extends View {
    constructor(args) {
        super(args);

        this.dirs = {};

        // Register events
        this.on('clickFolder', this.onClickFolder);
        this.on('clickFile', this.onClickFile);
        this.on('clickCloseRootNav', this.onClickCloseRootNav);

        // Prerender container
        this.$element = _.div({class: 'tree'});

        this.modelFunction = api.tree.fetch;
        this.fetch();
    }

    /**
     * Events
     */
    onClickFolder(e, element, view) {
        e.preventDefault();

        let path = $(element).attr('href');
        
        let $folder = $(element).parent();

        $folder.toggleClass('active');
        $folder.siblings().each(function(i) {
            let active = !$folder.hasClass('active');

            $(this).toggleClass('active', active);
            $(this).find('.folder').toggleClass('active', active);
        });
        
        if(path.indexOf('/media') == 0) {
            page(path);
        }
    }

    onClickFile(e, element, view) {
        e.preventDefault();

        page($(element).attr('href'));
    }

    onClickCloseRootNav(e, element, view) {
        view.$element.find('.nav-root > li').toggleClass('active', false);
        view.$element.find('.tab-pane').toggleClass('active', false);
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
            // Close root nav button
            _.button({class: 'btn close'},
                _.span({class: 'glyphicon glyphicon-remove'})
            ).click(view.events.clickCloseRootNav),

            // Root folders
            this.$rootNav = _.ul({class: 'nav nav-root nav-tabs', role: 'tablist'},
                _.each(this.dirs,
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
                        return _.div({role: 'tab-panel', id: label, class: 'tab-pane'},
                            _.ul({class: 'folder-content'},
                                _.each(
                                    files,
                                    function(i, file) {
                                        var isDir = file.mode == '040000';
                                        var name = helper.basename(file.path);
                                    
                                        if(isDir) {
                                            return _.li({class: 'folder'}, [
                                                _.a({href: '/' + file.path}, [
                                                    _.glyphicon({ class: 'glyphicon-folder-close' }),
                                                    name
                                                ]).click(view.events.clickFolder),
                                                _.ul({class: 'folder-content', id: file.sha})
                                            ]);

                                        } else {
                                            return _.li({class: 'file'},
                                                _.a({href: '/' + file.path}, [
                                                    _.glyphicon({ class: 'glyphicon-file' }),
                                                    name
                                                ]).click(view.events.clickFile)
                                            );
                                        }
                                    }
                                )
                            )
                        );
                    }
                )
            )
        ]);

        // Put files into folders
        view.$subNav.find('.file, .folder').each(function(i) {
            let path = $(this).children('a').attr('href');
            let dir = helper.basedir(path);
            
            let $folder = view.$subNav.find('.folder a[href="' + dir + '"]').parent();
           
            console.log(dir, $folder.length);

            if($folder) {
                $folder.children('.folder-content').append(
                    $(this)
                );
            }
        });
    }
}

module.exports = Tree;
