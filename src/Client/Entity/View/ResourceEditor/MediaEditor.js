'use strict';

/**
 * The editor for media resources
 */
class MediaEditor extends HashBrown.Entity.View.ResourceEditor.ResourceEditorBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
        
        this.template = require('template/resourceEditor/mediaEditor.js');    

        this.state.thumbnailSource = '/media/' + this.context.project.id + '/' + this.context.environment + '/' + this.state.id + '/?thumbnail';
    }
    
    /**
     * Fetches model data
     */
    async fetch() {
        this.state.hasSettings = true;
        
        await super.fetch();
            
        if(this.state.tab === 'settings') {
            this.state.settings = {
                mediaDeployer: await this.context.project.getEnvironmentSettings(this.context.environment, 'mediaDeployer') || {},
                mediaPublicUrl: await this.context.project.getEnvironmentSettings(this.context.environment, 'mediaPublicUrl') || ''
            };
        }
    }

    /** 
     * Pre render
     */
    prerender() {
        if(this.state.tab === 'settings') {
            this.state.deployerEditor = HashBrown.Entity.View.DeployerEditor.DeployerEditorBase.new({
                model: this.state.settings.mediaDeployer
            });

            this.state.deployerEditor.on('change', (newValue) => {
                this.onChangeDeployer(newValue);
            });
            
            this.state.deployerEditor.on('changealias', (newValue) => {
                this.render();
            });
        }
    }

    /**
     * Event: Clicked start tour
     */
    async onClickStartTour() {
        if(location.hash.indexOf('media/') < 0) {
            location.hash = '/media/';
        }
       
        await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });
            
        await UI.highlight('.navigation--resource-browser__tab[href="#/media/"]', 'This the media section, where you will find static files, such as images, videos and documents.', 'right', 'next');

        await UI.highlight('.panel', 'Here is a list of all your media. You can right click here to upload new files. If no files appear here, you may need to to configure a media deployer', 'right', 'next');
        
        await UI.highlight('.resource-editor', 'This is the media viewer, where you can preview files.', 'left', 'next');
    }
    
    /**
     * Event: Change deployer
     */
    onChangeDeployer(newValue) {
        if(!newValue || !newValue.alias) {
            newValue = null;
        }

        this.state.settings.mediaDeployer = newValue;
    }
    
    /**
     * Event: Change public URL
     */
    onChangePublicUrl(newValue) {
        this.state.settings.mediaPublicUrl = newValue;
    }

    /**
     * Event: Click new
     */
    onClickNew() {
        let modal = HashBrown.Entity.View.Modal.UploadMedia.new();
            
        modal.on('success', (resources) => {
            if(resources && resources[0] && resources[0].id) {
                location.hash = '/media/' + resources[0].id;
            }
        });
    }
    
    /**
     * Event: Click move
     */
    async onClickMove() {
        let resources = await HashBrown.Entity.Resource.Media.list();
        
        let folders = [];

        for(let resource of resources) {
            folders.push(resource.folder);
        }

        let modal = HashBrown.Entity.View.Modal.Folders.new({
            model: {
                folders: folders,
                canAdd: true,
                heading: `Move ${this.model.getName()} to...`
            }
        });

        modal.on('picked', async (path) => {
            this.model.folder = path;
    
            this.onChange();
        
            this.render();
        });
    }
    
    /**
     * Event: Change full media file
     */
    async onChangeFull(newValue) {
        if(!newValue || !newValue[0]) { return; }

        this.state.saveOptions = this.state.saveOptions || {};

        this.model.filename = newValue[0].name;
        this.state.saveOptions.filename = newValue[0].name;
        this.state.saveOptions.full = await HashBrown.Entity.Resource.Media.toBase64(newValue[0]);

        this.onChange();

        this.render();
    }
    
    /**
     * Event: Change thumbnail media file
     */
    async onChangeThumbnail(newValue) {
        if(!newValue || !newValue[0]) {
            this.state.saveOptions.thumbnail = false;
            this.state.thumbnailSource = null;
        } else {
            this.state.saveOptions.thumbnail = await HashBrown.Entity.Resource.Media.toBase64(newValue[0]);
            this.state.thumbnailSource = 'data:image/jpeg;base64,' + this.state.saveOptions.thumbnail;
        }
        
        this.onChange();

        this.renderPartial('thumbnail');
    }

    /**
     * Event: Change folder
     */
    onChangeFolder(newValue) {
        this.model.folder = newValue;
    
        this.onChange();
    }
    
    /**
     * Event: Change caption
     */
    onChangeCaption(newValue) {
        this.model.caption = newValue;
    
        this.onChange();
    }
    
    /**
     * Event: Change author name
     */
    onChangeAuthorName(newValue) {
        this.model.author.name = newValue;
    
        this.onChange();
    }
    
    /**
     * Event: Change author URL
     */
    onChangeAuthorUrl(newValue) {
        this.model.author.url = newValue;
    
        this.onChange();
    }
    
    /**
     * Event: Change copyright holder name
     */
    onChangeCopyrightHolderName(newValue) {
        this.model.copyrightHolder.name = newValue;
    
        this.onChange();
    }
    
    /**
     * Event: Change copyright holder URL
     */
    onChangeCopyrightHolderUrl(newValue) {
        this.model.copyrightHolder.url = newValue;
    
        this.onChange();
    }
    
    /**
     * Event: Change copyright year
     */
    onChangeCopyrightYear(newValue) {
        this.model.copyrightYear = newValue;
    
        this.onChange();
    }
}

module.exports = MediaEditor;
