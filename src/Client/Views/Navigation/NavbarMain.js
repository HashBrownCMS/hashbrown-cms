'use strict';

/**
 * The main navbar
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class NavbarMain extends Crisp.View {
    constructor(params) {
        super(params);

        HashBrown.Helpers.EventHelper.on('resource', 'navbar', () => { this.reload(); });  
        HashBrown.Helpers.EventHelper.on('route', 'navbar', () => { this.updateHighlight(); });  
        
        $('.page--environment__space--nav').html(this.$element);

        this.fetch();
    }

    /**
     * Updates the highlight state
     */
    updateHighlight() {
        let resourceCategory = location.hash.match(/\#\/([a-z]+)\//)[1];

        if(!resourceCategory) { return; }

        this.showTab('/' + resourceCategory + '/');
        
        let resourceItem = Crisp.Router.params.id;
        
        if(resourceItem) {
            let pane = this.getCurrentPaneInstance();

            if(pane) {
                pane.highlightItem(resourceItem);
            }
        }
    }

    /**
     * Gets the current pane
     *
     * @return {HashBrown.Views.Navigation.NavbarPane} Pane
     */
    getCurrentPaneInstance() {
        return Crisp.View.get(HashBrown.Views.Navigation.NavbarPane);
    }

    /**
     * Gets a pane by route
     *
     * @param {String} route
     *
     * @return {HashBrown.Views.Navigation.NavbarPane} Pane
     */
    getPaneByRoute(route) {
        for(let pane of this.getPanes()) {
            if(pane.route === route) {
                return pane;
            }
        }

        return null;
    }

    /**
     * Gets all panes
     *
     * @return {Array} Panes
     */
    getPanes() {
        let panes = [];
        
        for(let name in HashBrown.Views.Navigation) {
            let pane = HashBrown.Views.Navigation[name];
         
            if(pane.scope && !HashBrown.Context.user.hasScope(pane.scope)) { continue; }

            if(pane.prototype instanceof HashBrown.Views.Navigation.NavbarPane) {
                panes.push(pane);
            }
        }

        return panes;
    }

    /**
     * Toggles the tab buttons
     *
     * @param {Boolean} isActive
     */
    toggleTabButtons(isActive) {
        this.$element.toggleClass('hide-tabs', !isActive);
    }

    /**
     * Shows a tab
     *
     * @param {String} tabName
     */
    showTab(tabRoute) {
        for(let element of Array.from(this.element.querySelectorAll('.navbar-main__tab'))) {
            element.classList.toggle('active', element.getAttribute('href') === '#' + tabRoute);
        }

        let oldPaneInstance = this.getCurrentPaneInstance();
        let newPaneConstructor = this.getPaneByRoute(tabRoute);

        if(oldPaneInstance && oldPaneInstance.constructor === newPaneConstructor) { return; }

        let $panes = _.find('.navbar-main__panes');
        _.replace($panes[0], new newPaneConstructor());
    }

    /**
     * Reloads this view
     */
    async reload() {
        let pane = this.getCurrentPaneInstance();

        if(!pane) { return; }

        await pane.reload();

        this.updateHighlight();
    }
    
    /**
     * Static version of the reload method
     */
    static reload() {
        Crisp.View.get('NavbarMain').reload();
    }

    /**
     * Clears all content within the navbar
     */
    clear() {
        this.$element.find('.navbar-main__tabs').empty();
        this.$element.find('.navbar-main__panes').empty();
    }

    /**
     * Template
     */
    template() {
        return _.nav({class: 'navbar-main'},
            // Buttons
            _.div({class: 'navbar-main__tabs'},
                _.a({href: '/', class: 'navbar-main__tab'},
                    _.img({src: '/svg/logo_white.svg', class: 'navbar-main__tab__icon'}),
                    _.div({class: 'navbar-main__tab__label'}, 'Dashboard')
                ),            
                _.each(this.getPanes(), (i, pane) => {
                    return _.a({class: 'navbar-main__tab', 'href': '#' + pane.route, title: pane.label},
                        _.div({class: 'navbar-main__tab__icon fa fa-' + pane.icon}),
                        _.div({class: 'navbar-main__tab__label'}, pane.label)
                    );
                })
            ),

            // Panes
            _.div({class: 'navbar-main__panes'}),

            // Toggle button (mobile only)
            _.button({class: 'navbar-main__toggle'})
                .click((e) => {
                    $('.page--environment__space--nav').toggleClass('expanded');
                })
        );
    }
}

module.exports = NavbarMain;
