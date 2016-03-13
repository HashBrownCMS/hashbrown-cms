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
        
        let $pane = _.div({class: 'pane', 'data-route': params.route},
            _.div({class: 'pane-content'})
        );

        if(params.resource) {
            let items = window.resources[params.resource];
            let sortingQueue = [];

            $pane.html(
                _.each(items, function(i, item) {
                    let id = item.id || item._id || i;
                    let name = item.title || item.name || id;
                    let routingPath = item.shortPath || item.path || id;
                    let parentDirSelector;
                    let icon = item.icon;

                    // Content
                    if(item.schemaId) {
                        icon = resources.schemas[item.schemaId].icon;
                    }

                    let $element = _.div({class: 'pane-item-container'}, [
                        _.a({
                            'data-id': id,
                            'data-routing-path': routingPath,
                            href: '#/' + params.route + '/' + routingPath,
                            class: 'pane-item'
                        }, [
                            icon ? _.span({class: 'fa fa-' + icon}) : null,
                            _.span(name)
                        ]),
                        _.div({class: 'children'})
                    ]);

                    switch(params.route) {
                        // Schema
                        case 'schemas':
                            $element.attr('data-schema-id', item.id);
                            
                            if(item.parentSchemaId) {
                                parentDirSelector = '.pane-item-container[data-schema-id="' + item.parentSchemaId + '"] .children';
                            } else {
                                parentDirSelector = '.pane-dir[data-dir="' + item.schemaType + '"] .children';
                            }
                            break;
                    }

                    sortingQueue.push({
                        parentDirSelector: parentDirSelector,
                        $element: $element
                    });

                    return $element;
                })
            );

            // Sort items into hierarchy
            for(let queueItem of sortingQueue) {    
                // Find parent item
                let $parentDir = $pane.find(queueItem.parentDirSelector);
            
                if($parentDir.length > 0) {
                    $parentDir.append(queueItem.$element);
                
                // TODO: Create parent item
                } else {
                    
                }
            }
        }

        if(this.$element.find('.tab-panes .pane').length < 1) {
            $pane.addClass('active');
            $button.addClass('active');
        }

        this.$element.find('.tab-panes').append($pane);
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
        
        let $pane = _.div({class: 'pane', 'data-route': 'settings'},
            _.div({class: 'pane-content'})
        );

        $pane.html([
            _.a({href: '#/settings/something', class: 'pane-item'},
                _.span('Something')
            )
        ]);

        if(this.$element.find('.tab-panes .pane').length < 1) {
            $pane.addClass('active');
            $button.addClass('active');
        }

        this.$element.find('.tab-panes').append($pane);
        this.$element.find('.tab-buttons').append($button);
    }

    /**
     * Shows a tab
     *
     * @param {String} tabName
     */
    showTab(tabRoute) {
        this.$element.find('.tab-panes .pane').each(function(i) {
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

        this.$element.find('.pane-item').each(function(i) {
            let $item = $(this);

            $item.toggleClass('active', false);
            
            if(
                $item.attr('data-id') == route ||
                $item.attr('data-routing-path') == route
            ) {
                $item.toggleClass('active', true);

                view.showTab($item.parents('.pane').attr('data-route'));
            }
        });
    }

    render() {
        this.$element.html([
            _.div({class: 'tab-buttons'}),
            _.div({class: 'tab-panes'})
        ]);

        $('.navspace').html(this.$element);

        this.renderPane({
            resource: 'pages',
            label: 'Pages',
            route: 'pages',
            icon: 'file'
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
