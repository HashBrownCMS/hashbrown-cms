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
        super(params);

        this.title = 'Publishing settings for "' + this.model.prop('title', window.language) + '"';
        this.actions = [
            {
                label: 'OK',
                onClick: () => {
                    this.trigger('change', this.value);
                }
            }
        ];

        this.value = JSON.parse(JSON.stringify(this.model.getSettings('publishing')));
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
                        value: publishing.connectionId,
                        valueKey: 'id',
                        labelKey: 'name',
                        onChange: (newValue) => {
                            publishing.connectionId = newValue;
                        }
                    }).$element
                )
            );
        }
    }
}

module.exports = PublishingSettingsModal;
