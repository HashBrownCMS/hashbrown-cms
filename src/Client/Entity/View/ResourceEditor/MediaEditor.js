'use strict';

/**
 * The editor for media resources
 */
class MediaEditor extends HashBrown.Entity.View.ResourceEditor.ResourceEditorBase {
    static get category() { return 'media'; }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
        
        this.template = require('template/resourceEditor/mediaEditor.js');    

        this.state.thumbnailSource = '/media/' + HashBrown.Context.project.id + '/' + HashBrown.Context.environment + '/' + this.state.id + '/?thumbnail';
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

        await UI.highlight('.panel', 'Here is a list of all your media. You can right click here to upload new files. If no files appear here, you may need to to configure a connection as a media provider', 'right', 'next');
        
        await UI.highlight('.resource-editor', 'This is the media viewer, where you can preview files.', 'left', 'next');
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
