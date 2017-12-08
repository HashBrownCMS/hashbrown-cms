'use strict';

// Icons
let icons = require('../../icons.json').icons;

const Schema = require('Common/Models/Schema');
const SchemaHelper = require('Client/Helpers/SchemaHelper');
const ContentHelper = require('Client/Helpers/ContentHelper');
const RequestHelper = require('Client/Helpers/RequestHelper');
const JSONEditor = require('Client/Views/Editors/JSONEditor');

/**
 * The editor for schemas
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class SchemaEditor extends Crisp.View {
    constructor(params) {
        super(params);
        
        this.fetch();
    }
    
    /**
     * Event: Click advanced. Routes to the JSON editor
     */
    onClickAdvanced() {
        location.hash = location.hash.replace('/schemas/', '/schemas/json/');
    }
    
    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        if(this.jsonEditor && this.jsonEditor.isValid == false) {
            return;
        }

        this.$saveBtn.toggleClass('working', true);

        RequestHelper.request('post', 'schemas/' + this.model.id, this.model)
        .then(() => {
            this.$saveBtn.toggleClass('working', false);
        
            return RequestHelper.reloadResource('schemas');
        })
        .then(() => {
            Crisp.View.get('NavbarMain').reload();
        })
        .catch(UI.errorModal);
    }

    /**
     * Renders the icon editor
     *  
     * @return {Object} element
     */
    renderIconEditor() {
        return _.button({class: 'widget small widget--button fa fa-' + this.getIcon()})
            .click((e) => {
                let modal = new HashBrown.Views.Modals.IconModal();

                modal.on('change', (newIcon) => {
                    this.model.icon = newIcon;

                    e.currentTarget.className = 'widget small widget--button fa fa-' + this.model.icon;
                });
            });
    }

    /**
     * Renders a single field
     *
     * @param {String} label
     * @param {HTMLElement} content
     * @param {Boolean} isVertical
     *
     * @return {HTMLElement} Editor element
     */
    renderField(label, $content, isVertical) {
        if(!$content) { return; }

        return _.div({class: 'editor__field ' + (isVertical ? 'vertical' : '')},
            _.div({class: 'editor__field__key'},
                label
            ),
            _.div({class: 'editor__field__value'},
                $content
            )
        );
    }

    /**
     * Renders all fields
     *
     * @return {Object} element
     */
    renderFields() {
        let id = parseInt(this.model.id);

        let $element = _.div({class: 'editor__body'});
        
        $element.empty();

        $element.append(this.renderField('Name', new HashBrown.Views.Widgets.Input({
            value: this.model.name,
            onChange: (newValue) => { this.model.name = newValue; }
        }).$element)); 

        $element.append(this.renderField('Icon', this.renderIconEditor()));   

        $element.append(this.renderField('Parent', new HashBrown.Views.Widgets.Dropdown({
            value: this.model.parentSchemaId,
            options: resources.schemas,
            valueKey: 'id',
            labelKey: 'name',
            disabledOptions: [ { id: this.model.id, name: this.model.name } ],
            onChange: (newParent) => {
                this.model.parentSchemaId = newParent;

                this.fetch();
            }
        }).$element));
        

        return $element;
    }

    /**
     * Gets the schema icon
     *
     * @returns {String} Icon
     */
    getIcon() {
        if(this.model.icon) {
            return this.model.icon;
        }

        if(this.parentSchema && this.parentSchema.icon) {
            return this.parentSchema.icon;
        }

        return 'cogs';
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor editor--schema' + (this.model.isLocked ? ' locked' : '')},
            _.div({class: 'editor__header'},
                _.span({class: 'editor__header__icon fa fa-' + this.getIcon()}),
                _.h4({class: 'editor__header__title'}, this.model.name)
            ),
            this.renderFields(),
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

module.exports = SchemaEditor;
