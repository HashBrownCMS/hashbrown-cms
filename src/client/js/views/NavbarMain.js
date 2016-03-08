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
       
        let $button = _.button({class: 'btn', 'data-route': params.route}, [
            _.span({class: 'fa fa-' + params.icon}),
            _.p(params.label)
        ]).click(function() { view.showTab(params.route); });
        
        let $pane = _.div({class: 'pane list-group', 'data-route': params.route},
            _.div({class: 'pane-content'})
        );

        if(params.api) {
            $.getJSON(params.api, function(items) {
                if(!window.resources) {
                    window.resources = [];
                }

                window.resources[params.route] = items;

                $pane.html(
                    _.each(items, function(i, item) {
                        return _.a({href: '#/' + params.route + '/' + (item.id || item._id || i), class: 'pane-item list-group-item'},
                            _.p(item.title || item.name || item.id || item._id || i)
                        );
                    })
                );
            });
        }

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
        
        this.$element.find('.tab-buttons .btn').each(function(i) {
            $(this).toggleClass('active', $(this).attr('data-route') == tabRoute);
        });
    }

    render() {
        this.$element.html([
            _.div({class: 'tab-buttons'}),
            _.div({class: 'tab-panes'})
        ]);

        $('.navspace').html(this.$element);

        this.renderPane({
            api: '/api/pages',
            label: 'Pages',
            route: 'pages',
            icon: 'file'
        });

        this.renderPane({
            api: '/api/sections',
            label: 'Sections',
            route: 'sections',
            icon: 'th'
        });
        
        this.renderPane({
            api: '/api/objectSchemas',
            label: 'Objects',
            route: 'objectSchemas',
            icon: 'gears'
        });
        
        this.renderPane({
            api: '/api/fieldSchemas',
            label: 'Fields',
            route: 'fieldSchemas',
            icon: 'list-ul'
        });
       
        $.getJSON('/api/fieldViews', function(fieldViews) {
            window.resources['fieldViews'] = fieldViews;
        }); 
    }
}

module.exports = NavbarMain;
