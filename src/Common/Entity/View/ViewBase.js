'use strict';

/**
 * The base view class
 *
 * @memberof HashBrown.Common.Entity.View
 */
class ViewBase extends HashBrown.Entity.EntityBase {
    /**
     * Structure
     */
    structure() {
        this.def(Function, 'template', () => { return ''; });
        this.def(Object, 'state', {});
        this.def(Object, 'model', {});
    }

    /**
     * Gets the context
     *
     * @return {HashBrown.Entity.Context} Context
     */
    get context() {
        return null;
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
