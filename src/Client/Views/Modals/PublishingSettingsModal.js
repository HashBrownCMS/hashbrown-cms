'use strict';

/**
 * A dialog for editing publishing settings for Content nodes
 *
 * @memberof HashBrown.Client.Views.Modals
 */
class PublishingSettingsModal extends HashBrown.Views.Modals.Modal {
    /**
     * Constructor
     */
    constructor(params) {
        params.title = 'Publishing settings for "' + params.model.prop('title', HashBrown.Context.language) + '"';
        params.actions = [
            {
                label: 'OK',
                onClick: () => {
                    this.trigger('change', this.value);
                }
            }
        ];

        super(params);
    }

    /**
     * Fetches the model
     */
    async fetch() {
        try {
            this.value = await this.model.getSettings('publishing') || {};
            
            if(this.value.governedBy) {
                this.governingContent = await HashBrown.Helpers.ContentHelper.getContentById(this.value.governedBy);
            }

            super.fetch();

        } catch(e) {
            UI.errorModal(e);

        }
    }

    /**
     * Renders the body
     *
     * @returns {HTMLElement} Body
     */
    renderBody() {
        if(this.governingContent) {
            return _.div({class: 'widget widget--label'},
                '(Settings inherited from <a href="#/content/' + this.governingContent.id + '">' + this.governingContent.prop('title', HashBrown.Context.language) + '</a>)'
            );
        
        } else {
            return _.div({class: 'settings-publishing'},
                // Apply to children switch
                _.div({class: 'widget-group'},      
                    _.label({class: 'widget widget--label'}, 'Apply to children'),
                    new HashBrown.Views.Widgets.Input({
                        type: 'checkbox',
                        value: this.value.applyToChildren === true,
                        onChange: (newValue) => {
                            this.value.applyToChildren = newValue;   
                        }
                    }).$element
                ),

                // Connection picker
                _.div({class: 'widget-group'},      
                    _.label({class: 'widget widget--label'}, 'Connection'),
                    new HashBrown.Views.Widgets.Dropdown({
                        options: HashBrown.Helpers.ConnectionHelper.getAllConnections(),
                        value: this.value.connectionId,
                        valueKey: 'id',
                        labelKey: 'title',
                        useClearButton: true,
                        onChange: (newValue) => {
                            this.value.connectionId = newValue;
                        }
                    }).$element
                )
            );
        }
    }
}

module.exports = PublishingSettingsModal;
