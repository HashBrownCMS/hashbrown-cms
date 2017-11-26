'use strict';

const Modal = require('./Modal');

/**
 * A dialog for editing publishing settings for Content nodes
 */
class PublishingSettingsModal extends Modal {
    /**
     * Constructor
     */
    constructor(params) {
        params.title = 'Publishing settings for "' + params.model.prop('title', window.language) + '"';
        params.actions = [
            {
                label: 'OK',
                onClick: () => {
                    this.trigger('change', this.value);
                }
            }
        ];

        params.value = JSON.parse(JSON.stringify(params.model.getSettings('publishing'))) || {};
        
        super(params);
    }

    /**
     * Renders the body
     *
     * @returns {HTMLElement} Body
     */
    renderBody() {
        if(this.value.governedBy) {
            let governor = HashBrown.Helpers.ContentHelper.getContentByIdSync(this.value.governedBy);

            return _.div({class: 'widget widget--label'},
                '(Settings inherited from <a href="#/content/' + governor.id + '">' + governor.prop('title', window.language) + '</a>)'
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
                        options: resources.connections,
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
