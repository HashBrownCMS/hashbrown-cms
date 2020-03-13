'use strict';

// Keep an instance of this view in memory for easy access
let instance;

/**
 * A list of resources
 *
 * @memberof HashBrown.Client.Entity.View.Navigation
 */
class ResourceBrowser extends HashBrown.Entity.View.Navigation.NavigationBase {
    /**
     * Gets the instance in memory
     */
    static getInstance() { return instance; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/navigation/resourceBrowser');

        HashBrown.Service.EventService.on('route', 'resourceBrowser', () => { this.onChangeRoute(); });
        HashBrown.Service.EventService.on('resource', 'resourceBrowser', (id) => { this.onChangeResource(id); });
        HashBrown.Service.EventService.on('language', 'resourceBrowser', (id) => { this.onChangeLanguage(); });
    
        instance = this;
    }
    
    /**
     * Event: Language
     */
    async onChangeLanguage() {
        if(!this.state.panel) { return; }

        await this.state.panel.update();
    }

    /**
     * Event: Resource changed
     *
     * @param {String} id
     */
    async onChangeResource(id) {
        if(!this.state.panel) { return; }

        await this.state.panel.update();
    }

    /**
     * Event: Route changed
     */
    onChangeRoute() {
        if(!this.state.panel || this.state.panel.category !== HashBrown.Service.NavigationService.getRoute(0)) {
            this.update();

        } else {
            this.state.panel.update();

        }
    }

    /**
     * Fetches the view data
     */
    async fetch() {
        let category = HashBrown.Service.NavigationService.getRoute(0);

        this.state.panels = [];

        if(!category) { return; }

        for(let panel of Object.values(HashBrown.Entity.View.Panel)) {
            if(panel === HashBrown.Entity.View.Panel.PanelBase) { continue; }
            if(!HashBrown.Context.user.hasScope(HashBrown.Context.project.id, panel.category)) { continue; }
        
            this.state.panels.push(panel);

            if(panel.category === category) {
                this.state.panel = new panel();
            }
        }

        if(!this.state.panel) {
            throw new Error(`No panel matching "${category}" could be found`);
        }
    }
}

module.exports = ResourceBrowser;
