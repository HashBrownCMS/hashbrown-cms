'use strict';

const RequestHelper = require('Client/Helpers/RequestHelper');
const ConnectionHelper = require('Client/Helpers/ConnectionHelper');

/**
 * The editor for Connections
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class ConnectionEditor extends Crisp.View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'editor connection-editor content-editor'});

        this.fetch();
    }

    /**
     * Event: Click advanced. Routes to the JSON editor
     */
    onClickAdvanced() {
        location.hash = '/connections/json/' + this.model.id;
    }

    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        this.$saveBtn.toggleClass('saving', true);

        RequestHelper.request('post', 'connections/' + this.model.id, this.model)
        .then(() => {
            this.$saveBtn.toggleClass('saving', false);
       
            location.reload(); 
        })
        .catch(UI.errorModal);
    }

    /**
     * Renders the Template provider editor
     */
    renderTemplateProviderEditor() {
        let input = new HashBrown.Views.Widgets.Input({
            value: false,
            type: 'checkbox',
            onChange: (isProvider) => {
                ConnectionHelper.setTemplateProvider(isProvider ? this.model.id : null)
                .catch(UI.errorModal);
            }
        });

        // Set the value
        input.$element.toggleClass('working', true);

        ConnectionHelper.getTemplateProvider()
        .then((connection) => {
            if(connection && connection.id === this.model.id) {
                input.value = true;
                input.render();
            }
        
            input.$element.toggleClass('working', false);
        });

        return input.$element;
    }
    
    /**
     * Renders the Media provider editor
     */
    renderMediaProviderEditor() {
        let input = new HashBrown.Views.Widgets.Input({
            value: false,
            type: 'checkbox',
            onChange: (isProvider) => {
                ConnectionHelper.setMediaProvider(isProvider ? this.model.id : null)
                .catch(UI.errorModal);
            }
        });

        // Set the value
        input.$element.toggleClass('working', true);

        ConnectionHelper.getMediaProvider()
        .then((connection) => {
            if(connection && connection.id === this.model.id) {
                input.value = true;
                input.render();
            }
        
            input.$element.toggleClass('working', false);
        });

        return input.$element;
    }

    /**
     * Renders the title editor
     */
    renderTitleEditor() {
        return new HashBrown.Views.Widgets.Input({
            value: this.model.title,
            onChange: (newValue) => {
                this.model.title = newValue;
            }
        }).$element;
    }
    
    /**
     * Renders the URL editor
     */
    renderUrlEditor() {
        return new HashBrown.Views.Widgets.Input({
            value: this.model.url,
            onChange: (newValue) => {
                this.model.url = newValue;
            }
        }).$element;
    }
    
    /**
     * Renders the settings editor
     */
    renderSettingsEditor() {
        let editor = HashBrown.Views.Editors.ConnectionEditors[this.model.type];

        this.model.settings = this.model.settings || {};

        if(editor) {
            let $editor = new editor({
                model: this.model.settings
            }).$element;

            return $editor;

        } else {
            debug.log('No connection editor found for type alias "' + this.model.type + '"', this);
            return '';

        }
    }
    
    /**
     * Renders the type editor
     */
    renderTypeEditor() {
        return new HashBrown.Views.Widgets.Dropdown({
            value: this.model.type,
            options: Object.keys(HashBrown.Views.Editors.ConnectionEditors),
            onChange: (newValue) => {
                this.model.type = newValue;

                this.render();
            }
        }).$element;
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor editor--connection' + (this.model.isLocked ? ' locked' : '')},
            _.div({class: 'editor__header'},
                _.span({class: 'editor__header__icon fa fa-exchange'}),
                _.h4({class: 'editor__header__title'}, this.model.title)
            ),
            _.div({class: 'editor__body'},
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'}, 'Is Template provider'),
                    _.div({class: 'editor__field__value'},
                        this.renderTemplateProviderEditor()
                    )
                ),
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'}, 'Is Media provider'),
                    _.div({class: 'editor__field__value'},
                        this.renderMediaProviderEditor()
                    )
                ),
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'}, 'Title'),
                    _.div({class: 'editor__field__value'},
                        this.renderTitleEditor()
                    )
                ),
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'}, 'URL'),
                    _.div({class: 'editor__field__value'},
                        this.renderUrlEditor()
                    )
                ),
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'}, 'Type'),
                    _.div({class: 'editor__field__value'},
                        this.renderTypeEditor()
                    )
                ),
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'}, 'Settings'),
                    _.div({class: 'editor__field__value'},
                        this.renderSettingsEditor()
                    )
                )
            ),
            _.div({class: 'editor__footer'}, 
                _.div({class: 'editor__footer__buttons'},
                    _.button({class: 'widget widget--button embedded'},
                        'Advanced'
                    ).click(() => { this.onClickAdvanced(); }),
                    _.if(!this.model.isLocked, 
                        this.$saveBtn = _.button({class: 'widget widget--button editor__footer__buttons__save'},
                            _.span({class: 'widget--button__text-default'}, 'Save '),
                            _.span({class: 'widget--button__text-working'}, 'Saving ')
                        ).click(() => { this.onClickSave(); })
                    )
                )
            )
        );
    }
}

module.exports = ConnectionEditor;
