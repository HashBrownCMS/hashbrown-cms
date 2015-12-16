class Tree extends View {
    constructor(args) {
        super(args);

        this.dirs = {};

        // Register events
        this.on('clickFolder', this.onClickFolder);
        this.on('clickFile', this.onClickFile);
        this.on('clickCloseRootNav', this.onClickCloseRootNav);
        this.on('clickDeleteItem', this.onClickDeleteItem);
        this.on('clickRenameItem', this.onClickDeleteItem);

        // Prerender container
        this.$element = _.div({class: 'tree panel panel-default'}, [
            _.div({class: 'panel-heading'}),
            _.div({class: 'panel-body'})
        ]);

        this.modelFunction = api.tree.fetch;
        this.fetch();
    }

    /**
     * Events
     */
    onClickFolder(e, element, view) {
        e.preventDefault();

        view.highlight($(element).attr('href').replace('#/', ''));
    }

    onClickFile(e, element, view) {
        view.highlight($(element).attr('href').replace('#/', ''));
    }

    onClickCloseRootNav(e, element, view) {
        view.$element.find('.nav-root > li').toggleClass('active', false);
        view.$element.find('.tab-pane').toggleClass('active', false);
    }

    onClickDeleteItem(e, element, view) {
        console.log('dude');
    }
    
    onClickRenameItem(e, element, view) {
        console.log('dude');
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

    highlight(path) {
        let $fileAnchor = $('.tree li a[href="#/' + path + '"]');
        let $file = $fileAnchor.parent();

        $('.tree .file').toggleClass('active', false);

        // Highlighting a file does not unhighlight a folder
        if($file.hasClass('folder')) {
            $('.tree .folder').toggleClass('active', false);
        }
        
        $file.toggleClass('active', true);

        $file.parents('.folder').toggleClass('active', true);
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
        this.dirs.content = this.getFolderContent('_content/', true);
        this.dirs.media = this.getFolderContent('media/', true);
    }

    /** 
     * Render
     */
    render() {
        let view = this;

        this.$element.children('.panel-heading').html([
            // Close root nav button
            _.button({class: 'btn close'},
                _.span({class: 'glyphicon glyphicon-remove'})
            ).click(view.events.clickCloseRootNav),

            // Root folders
            this.$rootNav = _.ul({class: 'nav-root btn-group', role: 'tablist'},
                _.each(this.dirs,
                    function(label, files) {
                        return _.a({class: 'btn btn-default', href: '#' + label, 'aria-controls': label, role: 'tab', 'data-toggle': 'tab' },
                            label
                        );
                    }
                )
            )
        ]);

        this.$element.children('.panel-body').html([
            // Subfolders
            this.$subNav = _.nav({class: 'tab-content nav-sub'},
                _.each(this.dirs,
                    function(label, files) {
                        return _.div({role: 'tab-panel', id: label, class: 'tab-pane'},
                            _.ul({class: 'folder-content'},
                                _.each(
                                    files,
                                    function(i, file) {
                                        let contextMenuItems = {
                                            'Rename': view.events.clickRenameItem,
                                            'Delete': view.events.clickDeleteItem
                                        };

                                        let dragHandler = {
                                            dragstart: function(e) {
                                                e.originalEvent.dataTransfer.setData('href', $el.children('a').attr('href'));
                                            },

                                            dragend: function() {
                                                $('.drag-over').toggleClass('drag-over', false);
                                            }
                                        };

                                        let dropHandler = {
                                            dragleave: function(e) {
                                                e.preventDefault();

                                                $(e.target).toggleClass('drag-over', false);
                                            },

                                            dragover: function(e) {
                                                e.preventDefault();

                                                /*let $folder = $(this).parents('.folder');
                                                let $folderContent = $(this).parents('.folder-content');*/

                                                $(e.target).parents('.folder-content').toggleClass('drag-over', false);
                                                $(e.target).find('.folder-content').toggleClass('drag-over', false);
                                                $(e.target).toggleClass('drag-over', true);
                                            },

                                            drop: function(e) {
                                                e.preventDefault();
                                                let href = e.originalEvent.dataTransfer.getData('href');

                                                let $fileAnchor = $('.tree li a[href="' + href + '"]');
                                                let $file = $fileAnchor.parent();
                                                let $target = $(e.target);

                                                // Is this is a folder, redirect to folder content container
                                                if($target.siblings('.folder-content').length > 0) {
                                                    $target = $target.siblings('.folder-content');
                                                }

                                                let isFolder = $target.hasClass('folder-content');
                                                let isSelf = $target.is($fileAnchor.siblings('.folder-content'));

                                                if(isFolder && !isSelf) {
                                                    $target.append($file);

                                                    view.highlight(href.replace('#/', ''));
                                                }
                                            }
                                        };

                                        let isDir = file.mode == '040000';
                                        let name = helper.basename(file.path);
                                        let $el;
                                   
                                        if(isDir) {
                                            $el = _.li({class: 'folder', draggable: 'true'}, [
                                                _.a({href: '#/' + file.path}, [
                                                    _.glyphicon({ class: 'glyphicon-folder-close' }),
                                                    name
                                                ]).click(view.events.clickFolder).context(contextMenuItems).on(dragHandler),
                                                _.ul({class: 'folder-content', id: file.sha}).on(dropHandler)
                                            ]);

                                        } else {
                                            $el = _.li({class: 'file', draggable: 'true'},
                                                _.a({href: '#/' + file.path}, [
                                                    _.glyphicon({ class: 'glyphicon-file' }),
                                                    name
                                                ]).click(view.events.clickFile).context(contextMenuItems).on(dragHandler)
                                            );
                                        }

                                        return $el;
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

            if($folder) {
                $folder.children('.folder-content').append(
                    $(this)
                );
            }
        });
    }
}

module.exports = Tree;
