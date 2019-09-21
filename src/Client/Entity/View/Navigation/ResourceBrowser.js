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
    
        instance = this;
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
        if(!this.state.panel || this.state.panel.category !== getRoute(0)) {
            this.update();

        } else {
            this.state.panel.update();

        }
    }

    /**
     * Fetches the view data
     */
    async fetch() {
        let category = getRoute(0);

        this.state.panels = [];

        for(let panel of Object.values(HashBrown.Entity.View.Panel)) {
            if(panel === HashBrown.Entity.View.Panel.PanelBase) { continue; }
        
            this.state.panels.push(panel);

            if(panel.name.toLowerCase() === category.toLowerCase()) {
                this.state.panel = new panel();
            }
        }

        if(!this.state.panel) {
            throw new Error(`No panel matching "${category}" could be found`);
        }
    }
}

module.exports = ResourceBrowser;
