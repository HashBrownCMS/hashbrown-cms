'use strict';

/**
 * A list of resources
 *
 * @memberof HashBrown.Client.Entity.View.Navigation
 */
class ResourceBrowser extends HashBrown.Entity.View.Navigation.NavigationBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/navigation/resourceBrowser');

        HashBrown.Service.EventService.on('resource', 'resourceBrowser', (id) => { this.onChangeResource(id); });
        HashBrown.Service.EventService.on('language', 'resourceBrowser', (id) => { this.onChangeLanguage(); });
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
     * Sets the panel
     *
     * @param {HashBrown.Entity.View.Panel.PanelBase} panel
     */
    setPanel(panel) {
        checkParam(panel, 'panel', HashBrown.Entity.View.Panel.PanelBase, true);

        // If it's the same panel, just update it
        if(this.state.panel && panel.constructor === this.state.panel.constructor) {
            this.state.panel.state.id = panel.state.id;
            this.state.panel.render();

        // If it's a new panel, replace it
        } else {
            this.state.panel = panel;
            this.render();

        }
    }

    /**
     * Fetches the view data
     */
    async fetch() {
        this.state.panels = [];

        for(let panel of Object.values(HashBrown.Entity.View.Panel)) {
            if(panel === HashBrown.Entity.View.Panel.PanelBase) { continue; }
            if(!this.context.user.hasScope(this.context.project.id, panel.module)) { continue; }
        
            this.state.panels.push(panel);
        }
    }
}

module.exports = ResourceBrowser;
