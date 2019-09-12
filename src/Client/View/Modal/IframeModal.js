'use strict';

/**
 * A modal for showng iframes
 *
 * @memberof HashBrown.Client.View.Modal
 */
class IframeModal extends HashBrown.View.Modal.Modal {
    /**
     * Post render
     */
    postrender() {
        this.element.classList.toggle('modal--iframe', true);
    }

    /**
     * Render body
     */
    renderBody() {
        return _.iframe({class: 'modal--iframe__iframe', src: this.url});
    }
}

module.exports = IframeModal;
