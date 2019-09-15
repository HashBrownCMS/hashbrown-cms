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
        this.def(Object, 'state', {});
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

        return this.template(this.scope(), this.model, this.state);
    }
}

module.exports = ViewBase;
