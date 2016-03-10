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

        if(params.resource) {
            let items = window.resources[params.resource];

            $pane.html(
                _.each(items, function(i, item) {
                    let id = item.id || item._id || i;
                    let name = item.title || item.name || id;

                    return _.a({'data-id': id, href: '#/' + params.route + '/' + id, class: 'pane-item list-group-item'},
                        _.p(name)
                    );
                })
            );
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

    /**
     * Highlights an item
     */
    highlightItem(id) {
        let view = this;

        this.$element.find('.pane-item').each(function(i) {
            $(this).toggleClass('active', false);

            if($(this).attr('data-id') == id) {
                $(this).toggleClass('active', true);

                view.showTab($(this).parents('.pane').attr('data-route'));
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
            resource: 'schemas',
            label: 'Schemas',
            route: 'schemas',
            icon: 'gears'
        });
    }
}

module.exports = NavbarMain;
