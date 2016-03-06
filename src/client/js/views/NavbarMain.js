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
        
        let $button = _.button({class: 'btn'}, [
            _.span({class: 'fa fa-' + params.icon}),
            _.p(params.name)
        ]).click(function() { view.showTab(params.name); });
        
        let $pane = _.div({class: 'pane list-group', 'data-name': params.name},
            _.div({class: 'pane-content'})
        );

        if(params.uri) {
            $.getJSON(params.uri, function(items) {
                $pane.html(
                    _.each(items, function(i, item) {
                        return _.a({href: '#/jsoneditor/' + params.name + '/' + item._id, class: 'pane-item list-group-item'},
                            _.p(item.title)
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
    showTab(tabName) {
        this.$element.find('.tab-panes .pane').each(function(i) {
            $(this).toggleClass('active', $(this).attr('data-name') == tabName);
        });
    }

    render() {
        this.$element.html([
            // Tab buttons
            _.div({class: 'tab-buttons'}, [
            ]),

            // Tab panes
            _.div({class: 'tab-panes'})
        ]);

        $('.navspace').html(this.$element);

        this.renderPane({
            uri: '/api/content/pages',
            name: 'pages',
            icon: 'file'
        });

        this.renderPane({
            uri: '/api/content/sections',
            name: 'sections',
            icon: 'th'
        });
        
        this.renderPane({
            uri: '/api/schemas',
            name: 'schemas',
            icon: 'gears'
        });
    }
}

module.exports = NavbarMain;
