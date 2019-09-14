'use strict';

/**
 * The base view class
 */
class ViewBase extends HashBrown.Entity.EntityBase {
    /**
     * Structure
     */
    structure() {
        this.def(Object, 'model', {});
        this.def(Function, 'template', () => { return ''; });
    }

    /**
     * Scope
     *
     * @return {Object} Scope
     */
    scope() { return {} }

    /**
     * Renders the template
     *
     * @return {String} HTML
     */
    render() {
        if(typeof this.template !== 'function') { return ''; }

        return this.template(this.scope(), this.model);
    }
}

module.exports = ViewBase;
