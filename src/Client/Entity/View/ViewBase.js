'use strict';

/**
 * The base view for client side elements
 */
class ViewBase extends require('Common/Entity/View/ViewBase') {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.element = document.createElement('div');
        this.element.className = 'placeholder';

        this.update();
    }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(HTMLElement, 'element', null);
    }
  
    /**
     * Fetches the model
     */
    async fetch() {}

    /**
     * Updates the view
     */
    async update() {
        try {
            await this.fetch();

            this.render();
        
        } catch(e) {
            UI.errorModal(e);

        }
    }

    /**
     * Renders the template
     *
     * @return {HTMLElement} Element
     */
    render() {
        let wrapper = document.createElement('div');
        wrapper.innerHTML = super.render();
        let element = wrapper.firstElementChild; 

        if(this.element && this.element.parentElement) {
            this.element.parentElement.replaceChild(element, this.element); 
        }

        this.element = element;

        return this.element;
    }
}

module.exports = ViewBase;
