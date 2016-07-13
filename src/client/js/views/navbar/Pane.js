'use strict';

class Pane {
    /**
     * Event: Click copy item id
     */
    static onClickCopyItemId() {
        let id = $('.context-menu-target-element').data('id');

        copyToClipboard(id);
    }
}

module.exports = Pane;
