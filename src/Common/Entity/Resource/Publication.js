'use strist';

/**
 * The publication class
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class Publication extends HashBrown.Entity.Resource.ResourceBase {
    static get icon() { return 'newspaper-o'; }
    static get category() { return 'publications'; }
    
    /**
     * Structure
     */
    structure() {
        super.structure();
        
        this.def(String, 'name', 'New publication');
        this.def(Array, 'rootContents', []);
        this.def(Boolean, 'includeRoot', false);
        this.def(Array, 'allowedSchemas', []);
    }

    /**
     * Gets the human readable name
     *
     * @return {String} Name
     */
    getName() {
        return this.name || this.id;
    }
}

module.exports = Publication;
