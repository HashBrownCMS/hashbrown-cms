'use strict';

const HEARTBEAT_INTERVAL  = 1000 * 60; // 1 minute between each heartbeat
const HEARTBEAT_TIMEOUT  = 1000 * 5; // An extra 5 seconds waiting time when checking for last heartbeat

/**
 * The base class for resource editors
 *
 * @memberof HashBrown.Client.Entity.View.ResourceEditor
 */
class ResourceEditorBase extends HashBrown.Entity.View.ViewBase {
    /**
     * Gets the type of item this resource editor works with
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Item type
     */
    static get itemType() { return HashBrown.Service.LibraryService.getClass(this.library, HashBrown.Entity.Resource.ResourceBase); }
    get itemType() { return this.constructor.itemType; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.state.saveOptions = this.state.saveOptions || {};
        this.state.settings = this.state.settings || {};
    }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(Boolean, 'isDirty', false);
    }

    /**
     * Gets the placeholder
     *
     * @return {HTMLElement} Placeholder
     */
    getPlaceholder(_, model, state) {
        return _.div({class: 'resource-editor loading'},
            _.div({class: 'resource-editor__header'}),
            _.div({class: 'resource-editor__body'}),
            _.div({class: 'resource-editor__footer'})
        );
    }
    
    /**
     * Checks whether this resource is currently being edited by someone else, and displays a warning if it is
     */
    editedCheck() {
        if(
            this.model &&
            this.model.viewedBy &&
            this.model.viewedOn &&
            this.model.viewedBy !== this.context.user.id &&
            new Date() - this.model.viewedOn < HEARTBEAT_INTERVAL + HEARTBEAT_TIMEOUT
        ) {
            let modal = UI.confirm('Resource busy', `"${this.state.title}" is currently being edited by someone else. Do you still want to proceed?`);

            modal.on('no', () => {
                location.hash = '/' + this.model.library + '/';
            });
        }
    }
    
    /**
     * Init
     */
    async init() {
        this.setDirty(false);

        if(!this.state.library) {
            this.state.library = this.library;
        }

        if(!this.state.id || this.state.id === 'settings' || this.state.id === 'overview') {
            this.state.tab = this.state.id || 'overview';
            this.state.id = null;
            this.state.name = 'welcome';
        
        } else {
            this.state.name = undefined;
       
        }

        await super.init();
        
        this.editedCheck();
    }

    /**
     * Fetches the model
     */
    async fetch() {
        if(this.state.id) {
            this.model = await this.itemType.get(this.state.id);

            if(!this.model) {
                this.setErrorState(new Error(`Resource ${this.library}/${this.state.id} not found`));
                return;
            }

        } else {
            this.model = null;

        }

        if(this.model) {
            this.state.title = this.model.getName();
        
        } else if(this.library) {
            this.state.title = HashBrown.Service.LibraryService.getName(this.library);

        }

        this.state.icon = this.itemType.icon;
    
        if(this.state.name === 'welcome') {
            this.state.tabs = {
                overview: 'Overview'
            };

            if(this.context.user.isAdmin && this.state.hasSettings) {
                this.state.tabs.settings = 'Settings';
            }
        
        } else {
            this.state.tabs = null;

        }
    }
 
    /**
     * Override render to maintain scroll position
     */
    render() {
        // Cache scroll position
        let body = this.namedElements.body;

        if(body instanceof HashBrown.Entity.View.ViewBase) {
            body = body.element;
        }
        
        let scrollTop = 0;

        if(body) {
            scrollTop = body.scrollTop;
        }

        super.render();
        
        // Restore scroll position
        body = this.namedElements.body;

        if(body instanceof HashBrown.Entity.View.ViewBase) {
            body = body.element;
        }
        
        if(body) {
            body.scrollTop = scrollTop;
        }

        this.element.classList.toggle('locked', this.model && this.model.isLocked);
    }

    /**
     * Sets this editor dirty/clean
     *
     * @param {Boolean} isDirty
     */
    setDirty(isDirty) {
        this.isDirty = isDirty === true;

        let title = document.querySelector('title');

        if(this.isDirty && title.innerHTML.indexOf(' *') < 0) {
            title.innerHTML += ' *';
        
        } else if(!this.isDirty && title.innerHTML.indexOf(' *') > -1) {
            title.innerHTML = title.innerHTML.replace(' *', '');

        }
    }

    /**
     * Event: Heartbeat
     */
    async onHeartbeat() {
        if(
            typeof this === 'undefined' ||
            !this ||
            !this.model ||
            Object.keys(this.model).length < 1 ||
            !this.element ||
            !this.element.parentElement
        ) { return; }

        try {
            await this.model.heartbeat({ id: this.state.id });

        } catch(e) {
            if(e && e.message) {
                debug.error(e, this, true);
            }
        
        } finally {
            this.state.lastHeartbeat = Date.now();

        }
    }
    
    /**
     * Event: Change id
     */
    onChangeId(id) {
        this.model.id = id;
    
        this.onChange();
    }
    
    /**
     * Event: Change a specific value
     *
     * @param {String} key
     * @param {*} value
     */
    onChangeValue(key, value) {
        if(!this.model || this.model.isLocked) { return; }
        
        this.model[key] = value;

        this.onChange();
    }

    /**
     * Event: Change happened
     */
    onChange() {
        if(!this.model || this.model.isLocked) { return; }

        if((this.state.lastHeartbeat || 0) + HEARTBEAT_INTERVAL < Date.now()) {
            this.onHeartbeat();
        }

        this.setDirty(true);
        this.trigger('change', this.model);
    }
    
    /**
     * Event: Click save settings
     */
    async onClickSaveSettings() {
        if(this.namedElements.save) {
            this.namedElements.save.classList.toggle('loading', true);
        }

        try {
            await this.context.project.setEnvironmentSettings(this.context.environment, this.state.settings);

            UI.notifySmall(`${this.state.title} settings saved successfully`, null, 3);
        
        } catch(e) {
            UI.error(e);

        } finally {
            if(this.namedElements.save) {
                this.namedElements.save.classList.toggle('loading', false);
            }

            this.render();
        }
    }

    /**
     * Event: Click save
     */
    async onClickSave() {
        if(!this.model) { return; }

        this.state.title = this.model.getName();

        if(this.namedElements.save) {
            this.namedElements.save.classList.toggle('loading', true);
        }

        try {
            this.state.saveOptions.id = this.state.id;

            await this.model.save(this.state.saveOptions);

            HashBrown.Service.EventService.trigger('resource', this.model.id);

            UI.notifySmall(`"${this.state.title}" saved successfully`, null, 3);
        
            this.setDirty(false);

        } catch(e) {
            UI.error(e);

        } finally {
            if(this.namedElements.save) {
                this.namedElements.save.classList.toggle('loading', false);
            }

            if(this.state.id && this.state.id !== this.model.id) {
                location.hash = '/' + this.model.library + '/' + this.model.id;
            } else {
                this.render();
            }
        }
    }
    
    /**
     * Event: Click new
     */
    async onClickNew() {
        let resource = await this.itemType.create();
        
        location.hash = `/${this.library}/${resource.id}`;
    }
}

module.exports = ResourceEditorBase;
