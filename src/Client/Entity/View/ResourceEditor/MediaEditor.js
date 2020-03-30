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
    }

    /**
     * Override this check, as it's not relevant to media
     */
    editedCheck() {}

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
        
            this.render();
        });
    }
    
    /**
     * Event: Click replace full media file
     */
    onClickReplaceFull() {
        let modal = HashBrown.Entity.View.Modal.UploadMedia.new({
            model: {
                replaceId: this.model.id
            }
        });
        
        modal.on('success', () => {
            HashBrown.Service.NavigationService.poke();
        });
    }
    
    /**
     * Event: Click replace thumbnail media file
     */
    onClickReplaceThumbnail() {

    }

    /**
     * Event: Change folder
     */
    onChangeFolder(newValue) {
        this.model.folder = newValue;
    }
    
    /**
     * Event: Change caption
     */
    onChangeCaption(newValue) {
        this.model.caption = newValue;
    }
    
    /**
     * Event: Change author name
     */
    onChangeAuthorName(newValue) {
        this.model.author.name = newValue;
    }
    
    /**
     * Event: Change author URL
     */
    onChangeAuthorUrl(newValue) {
        this.model.author.url = newValue;
    }
    
    /**
     * Event: Change copyright holder name
     */
    onChangeCopyrightHolderName(newValue) {
        this.model.copyrightHolder.name = newValue;
    }
    
    /**
     * Event: Change copyright holder URL
     */
    onChangeCopyrightHolderUrl(newValue) {
        this.model.copyrightHolder.url = newValue;
    }
    
    /**
     * Event: Change copyright year
     */
    onChangeCopyrightYear(newValue) {
        this.model.copyrightYear = newValue;
    }
}

module.exports = MediaEditor;
