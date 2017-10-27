'use strict';

/**
 * A navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class Pane {
    /**
     * Init
     */
    static init() {
        HashBrown.Views.Navigation.NavbarMain.addTabButton('My pane', '/my-route', 'question');
    }

    /**
     * Event: Click copy item id
     */
    static onClickCopyItemId() {
        let id = $('.context-menu-target').data('id');

        copyToClipboard(id);
    }

    /**
     * Event: Click refresh resource
     *
     * @param {String} resource
     */
    static onClickRefreshResource(resource) {
        HashBrown.Helpers.RequestHelper.reloadResource(resource)
        .then(() => {
            HashBrown.Views.Navigation.NavbarMain.reload();
        });
    }

    /**
     * Event: Change directory
     *
     * @param {String} id
     * @param {String} newParent
     */
    static onChangeDirectory(id, newParent) {

    }
    
    /**
     * Event: Change sort index
     *
     * @param {String} id
     * @param {Number} newIndex
     * @param {String} newParent
     */
    static onChangeSortIndex(id, newIndex, newParent) {

    }

    /**
     * Event: Click move item
     */
    static onClickMoveItem() {
        let id = $('.context-menu-target').data('id');
        let navbar = Crisp.View.get('NavbarMain');
        let $pane = navbar.$element.find('.navbar-main__pane.active');

        $pane.find('.navbar-main__pane__item a[data-id="' + id + '"]').parent().toggleClass('moving-item', true);
        $pane.toggleClass('select-dir', true);
        
        // Reset
        function reset(newPath) {
            $pane.find('.navbar-main__pane__item[data-id="' + id + '"]').toggleClass('moving-item', false);
            $pane.toggleClass('select-dir', false);
            $pane.find('.navbar-main__pane__move-button').off('click');
            $pane.find('.navbar-main__pane__item__content').off('click');
            $pane.find('.moving-item').toggleClass('moving-item', false);
        }
        
        // Cancel by escape key
        $(document).on('keyup', (e) => {
            if(e.which == 27) {
                reset();
            }
        });

        // Click existing directory
        $pane.find('.navbar-main__pane__item[data-is-directory="true"]:not(.moving-item)').each((i, element) => {
            $(element).children('.navbar-main__pane__item__content').on('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                let newPath = $(element).attr('data-media-folder') || $(element).attr('data-content-id');

                reset(newPath);

                this.onChangeDirectory(id, newPath);
            });
        }); 

        // Click below item
        $pane.find('.navbar-main__pane__item__insert-below').click((e) => {
            e.preventDefault();
            e.stopPropagation();

            // Create new sort index based on the container we clicked below
            let $container = $(e.target).parent();
            let containerIndex = parseInt($container.data('sort') || 0)

            let newIndex = containerIndex + 1;

            // Reset the move state
            reset();

            // Fetch the parent id as well, in case that changed
            let $parentItem = $container.parents('.navbar-main__pane__item');
            let newPath = $parentItem.length > 0 ? ($parentItem.attr('data-media-folder') || $parentItem.attr('data-content-id')) : null;

            // Trigger sort change event
            this.onChangeSortIndex(id, newIndex, newPath);
        });

        // Click "move to root" button
        $pane.find('.navbar-main__pane__move-button--root-dir').on('click', (e) => {
            let newPath = '/';

            reset(newPath);

            this.onChangeDirectory(id, newPath);
        });
        
        $pane.find('.navbar-main__pane__move-button--new-dir').toggle(this.canCreateDirectory == true);

        if(this.canCreateDirectory) {
            $pane.find('.navbar-main__pane__move-button--new-dir').on('click', () => {
                HashBrown.Helpers.MediaHelper.getMediaById(id)
                .then((item) => {
                    let messageModal = new HashBrown.Views.Modals.Modal({
                        title: 'Move item',
                        body: _.div({class: 'widget-group'},
                            _.input({class: 'widget widget--input text', value: (item.folder || item.parentId || ''), placeholder: '/path/to/media/'}),
                            _.div({class: 'widget widget--label'}, (item.name || item.title || item.id))
                        ),
                        actions: [
                            {
                                label: 'OK',
                                onClick: () => {
                                    let newPath = messageModal.$element.find('.widget--input').val();
                                    
                                    reset(newPath);

                                    this.onChangeDirectory(item.id, newPath);
                                }
                            }
                        ]
                    });
                })
                .catch(UI.errorModal);
            });
        }
    }
}

module.exports = Pane;
