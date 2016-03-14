'use strict';

/**
 * The main navbar
 */
class NavbarMain extends View {
    constructor(params) {
        super(params);

        this.$element = _.nav({class: 'navbar-main'});

        this.fetch();
    }

    /**
     * Event: Click copy page
     */
    onClickCopyPage() {
        let view = this;
        let id = $('.context-menu-target-element').data('id');

        // This function should only exist if an item has been copied
        view.onClickPastePage = function onClickPastePage() {
            let parentId = $('.context-menu-target-element').data('id');
            
            $.getJSON('/api/pages/' + id, function(copiedPage) {
                console.log('copied  ', copiedPage);

                delete copiedPage['id'];

                copiedPage.parentId = parentId;
                    
                $.post('/api/pages/new/', copiedPage, function(pastedPage) {
                    reloadResource('pages', function() { view.fetch(); });

                    console.log('pasted  ', pastedPage);

                    view.onClickPastePage = null;
                });
            });
        }
    }

    /**
     * Fetches pane information and renders it
     *
     * @param {String} uri
     * @param {String} name
     */
    renderPane(params) {
        let view = this;
       
        let $button = _.button({'data-route': params.route}, [
            _.span({class: 'fa fa-' + params.icon}),
            _.span(params.label)
        ]).click(function() { view.showTab(params.route); });
        
        let $pane = _.div({class: 'pane'},
            _.div({class: 'pane-content'})
        );

        if(params.resource) {
            let items = window.resources[params.resource];
            let sortingQueue = [];

            // Items
            $pane.append(
                _.each(items, function(i, item) {
                    let id = item.id || i;
                    let name = item.title || item.name || id;
                    let routingPath = item.shortPath || item.path || id;
                    let queueItem = {};
                    let icon = item.icon;

                    // Truncate long names
                    if(name.length > 18) {
                        name = name.substring(0, 18) + '...';
                    }

                    // If this item has a schema id, fetch the appropriate icon
                    if(item.schemaId) {
                        icon = resources.schemas[item.schemaId].icon;
                    }

                    // Item element
                    let $element = _.div({
                        class: 'pane-item-container',
                        'data-routing-path': routingPath,
                        draggable: true
                    }, [
                        _.a({
                            'data-id': id,
                            href: '#/' + params.route + '/' + routingPath,
                            class: 'pane-item'
                        }, [
                            icon ? _.span({class: 'fa fa-' + icon}) : null,
                            _.span(name)
                        ]),
                        _.div({class: 'children'})
                    ]);

                    // Attach context menu
                    if(params.contextMenu) {
                        $element.find('a').context(params.contextMenu);
                    }

                    // Specific sorting behaviours for every tab route
                    switch(params.route) {
                        // Pages & sections
                        case 'pages': case 'sections':
                            $element.attr('data-content-id', item.id);
                           
                            queueItem.parentDirAttr = {'data-content-id': item.parentId };
                            
                            break;

                        // Schema
                        case 'schemas':
                            $element.attr('data-schema-id', item.id);
                            
                            if(item.parentSchemaId) {
                                queueItem.parentDirAttr = {'data-schema-id': item.parentSchemaId };

                            } else {
                                let schemaType = 'invalid';
                                let schemaId = parseInt(item.id);

                                if(schemaId < 20000) {
                                    schemaType = 'Object';
                                } else if(schemaId < 30000) {
                                    schemaType = 'Field';
                                }

                                queueItem.createDir = true;
                                queueItem.parentDirAttr = {'data-schema-type': schemaType };
                            }
                            break;
                    }

                    // Add element to queue
                    queueItem.$element = $element;

                    // Add queue item to sorting queue
                    sortingQueue.push(queueItem);

                    return $element;
                })
            );

            // Sort items into hierarchy
            for(let queueItem of sortingQueue) {
                if(queueItem.parentDirAttr) { 
                    // Find parent item
                    let parentDirAttrKey = Object.keys(queueItem.parentDirAttr)[0];
                    let parentDirAttrValue = queueItem.parentDirAttr[parentDirAttrKey];
                    let parentDirSelector = '.pane-item-container[' + parentDirAttrKey + '="' + parentDirAttrValue + '"]';
                    let $parentDir = $pane.find(parentDirSelector);
              
                    if($parentDir.length > 0) {
                        $parentDir.children('.children').append(queueItem.$element);
                    
                    // Create parent item
                    } else if(queueItem.createDir) {
                        $parentDir = _.div({class: 'pane-item-container'}, [
                            _.a({
                                class: 'pane-item'
                            }, [
                                _.span({class: 'fa fa-folder'}),
                                _.span(parentDirAttrValue)
                            ]),
                            _.div({class: 'children'})
                        ]);
                        
                        $parentDir.attr(parentDirAttrKey, parentDirAttrValue);

                        // TODO: Append to correct parent
                        $pane.append($parentDir); 
                        
                        $parentDir.children('.children').append(queueItem.$element);
                    }
                }
            }
        }

        let $paneContainer = _.div({class: 'pane-container', 'data-route': params.route},
            $pane
        );

        if(this.$element.find('.tab-panes .pane-container').length < 1) {
            $paneContainer.addClass('active');
            $button.addClass('active');
        }

        this.$element.find('.tab-panes').append($paneContainer);
        this.$element.find('.tab-buttons').append($button);
    }
    
    /**
     * Renders the about pane
     */
    renderAboutPane() {
        let view = this;
       
        let $button = _.button({'data-route': 'about'}, [
            _.span({class: 'fa fa-question'}),
            _.span('Endomon CMS')
        ]).click(function() { view.showTab('about'); });
        
        let $pane = _.div({class: 'pane'},
            _.div({class: 'pane-content'})
        );

        $pane.html([
            _.div({class: 'pane-item-container'}, 
                _.a({href: '#/about/version', class: 'pane-item'},
                    _.span('Version')
                )
            )
        ]);

        if(this.$element.find('.tab-panes .pane').length < 1) {
            $pane.addClass('active');
            $button.addClass('active');
        }

        let $paneContainer = _.div({class: 'pane-container', 'data-route': 'about'},
            $pane
        );

        this.$element.find('.tab-panes').append($paneContainer);
        this.$element.find('.tab-buttons').append($button);
    }

    /**
     * Renders the settings pane
     */
    renderSettingsPane() {
        let view = this;
       
        let $button = _.button({'data-route': 'settings'}, [
            _.span({class: 'fa fa-wrench'}),
            _.span('Settings')
        ]).click(function() { view.showTab('settings'); });
        
        let $pane = _.div({class: 'pane'},
            _.div({class: 'pane-content'})
        );

        $pane.html([
            _.div({class: 'pane-item-container'}, 
                _.a({href: '#/settings/something', class: 'pane-item'},
                    _.span('Something')
                )
            )
        ]);

        if(this.$element.find('.tab-panes .pane').length < 1) {
            $pane.addClass('active');
            $button.addClass('active');
        }

        let $paneContainer = _.div({class: 'pane-container', 'data-route': 'settings'},
            $pane
        );
        
        this.$element.find('.tab-panes').append($paneContainer);
        this.$element.find('.tab-buttons').append($button);
    }

    /**
     * Shows a tab
     *
     * @param {String} tabName
     */
    showTab(tabRoute) {
        this.$element.find('.tab-panes .pane-container').each(function(i) {
            $(this).toggleClass('active', $(this).attr('data-route') == tabRoute);
        });
        
        this.$element.find('.tab-buttons button').each(function(i) {
            $(this).toggleClass('active', $(this).attr('data-route') == tabRoute);
        });
    }

    /**
     * Highlights an item
     */
    highlightItem(route) {
        let view = this;

        this.$element.find('.pane-item-container').each(function(i) {
            let $item = $(this);

            $item.toggleClass('active', false);
            
            if(
                $item.attr('data-id') == route ||
                $item.attr('data-routing-path') == route
            ) {
                $item.toggleClass('active', true);

                view.showTab($item.parents('.pane-container').attr('data-route'));
            }
        });
    }

    render() {
        let view = this;

        this.$element.html([
            _.div({class: 'tab-buttons'}),
            _.div({class: 'tab-panes'})
        ]);

        $('.navspace').html(this.$element);
        
        this.renderAboutPane();

        this.renderPane({
            resource: 'pages',
            label: 'Pages',
            route: 'pages',
            icon: 'file',
            contextMenu: {
                'This page': '---',
                'Rename': function() { view.onClickRenamePage(); },
                'Delete': function() { view.onClickDeletePage(); },
                'Copy': function() { view.onClickCopyPage(); },
                'Cut': function() { view.onClickCutPage(); },
                'General': '---',
                'Create new page': function() { view.onClickCreateNewPage(); },
                'Paste page': function() { view.onClickPastePage(); }
            }
        });

        this.renderPane({
            resource: 'sections',
            label: 'Sections',
            route: 'sections',
            icon: 'th'
        });
        
        this.renderPane({
            resource: 'media',
            label: 'Media',
            route: 'media',
            icon: 'file-image-o'
        });
        
        this.renderPane({
            resource: 'schemas',
            label: 'Schemas',
            route: 'schemas',
            icon: 'gears'
        });

        this.renderSettingsPane();
    }
}

module.exports = NavbarMain;
