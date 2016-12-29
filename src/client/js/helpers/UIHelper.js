'use strict';

class UIHelper {
    /**
     * Creates a switch
     *
     * @param {Boolean} initialValue
     * @param {Function} onChange
     *
     * @returns {HTMLElement} Switch element
     */
    static inputSwitch(initialValue, onChange) {
        let id = 'switch-' + (10000 + Math.floor(Math.random() * 10000));

        return _.div({class: 'switch', 'data-checked': initialValue},
            _.input({
                id: id,
                class: 'form-control switch',
                type: 'checkbox',
                checked: initialValue
            }).change(function() {
                this.parentElement.dataset.checked = this.checked;

                if(onChange) {
                    onChange(this.checked);
                }
            }),
            _.label({for: id})
        );
    }

    /**
     * Creates a group of chips
     *
     * @param {Array} items
     * @param {Array} dropdownItems
     * @param {Function} onChange
     *
     * @returns {HtmlElement} Chip group element
     */
    static inputChipGroup(items, dropdownItems, onChange) {
        let $element = _.div({class: 'chip-group'});

        function render() {
            _.append($element.empty(),

                // Render individual chips
                _.each(items, (itemIndex, item) => {
                    let $chip = _.div({class: 'chip'},

                        // Dropdown
                        _.if(Array.isArray(dropdownItems),
                            _.div({class: 'chip-label dropdown'},
                                _.button({class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
                                    item.label || item.name || item.title || item 
                                ),
                                _.if(onChange,
                                    _.ul({class: 'dropdown-menu'},
                                        _.each(dropdownItems, (dropdownItemIndex, dropdownItem) => {
                                            return _.li(
                                                _.a({href: '#'},
                                                    dropdownItem.label || dropdownItem.name || dropdownItem.title || dropdownItem
                                                ).click(function(e) {
                                                    e.preventDefault();
                                                        
                                                    items[itemIndex] = dropdownItem;

                                                    render();
                                
                                                    if(typeof onChange === 'function') {
                                                        onChange(items);
                                                    }
                                                })
                                            );
                                        })
                                    )
                                )
                            )
                        ),

                        // Regular string
                        _.if(!Array.isArray(dropdownItems),
                            _.if(!onChange,
                                _.p({class: 'chip-label'}, item)
                            ),
                            _.if(onChange,
                                _.input({type: 'text', class: 'chip-label', value: item})
                                    .change((e) => {
                                        items[itemIndex] = e.target.value;
                                    })
                            )
                        ),

                        // Remove button
                        _.if(onChange,
                            _.button({class: 'btn chip-remove'},
                                _.span({class: 'fa fa-remove'})
                            ).click(() => {
                                items.splice(itemIndex, 1);

                                render();

                                if(typeof onChange === 'function') {
                                    onChange(items);
                                }
                            })
                        )
                    );
                    
                    return $chip;
                }),

                // Add button
                _.if(onChange,
                    _.button({class: 'btn chip-add'},
                        _.span({class: 'fa fa-plus'})
                    ).click(() => {
                        if(Array.isArray(dropdownItems)) {
                            items.push(dropdownItems[0]);
                        
                        } else if(typeof dropdownItems === 'string') {
                            items.push(dropdownItems);

                        } else {
                            items.push('New item');

                        }

                        render(); 

                        if(typeof onChange === 'function') {
                            onChange(items);
                        }
                    })
                )
            );
        };

        render();

        return $element;
    }

    /**
     * Renders a dropdown
     *
     * @param {String} label
     * @param {Array|Number} options
     * @param {Function} onClick
     *
     * @returns {HtmlElement} Dropdown element
     */
    static inputDropdown(label, options, onClick) {
        let $button;

        if(typeof options === 'number') {
            let amount = options;

            options = [];

            for(let i = 0; i < amount; i++) {
                options[options.length] = { label: i.toString(), value: i };
            }
        }

        let $element = _.div({class: 'dropdown'},
            $button = _.button({class: 'btn btn-primary dropdown-toggle', type: 'button', 'data-toggle': 'dropdown'},
                label,
                _.span({class: 'caret'})
            ),
            _.ul({class: 'dropdown-menu'}, 
                _.each(options, (i, option) => {
                    let optionLabel = option.label || option.id || option.name || option.toString();

                    return _.li(
                        _.button(optionLabel)
                            .on('click', (e) => {
                                onClick(option.value || optionLabel);

                                _.append($button.empty(),
                                    optionLabel,
                                    _.span({class: 'caret'})
                                );

                                $button.click();
                            })
                    );
                })
            )
        );

        return $element;
    }

    /**
     * Brings up an error modal
     *
     * @param {String|Error} error
     * @param {Function} onClickOK
     */
    static errorModal(error, onClickOK) {
        if(error instanceof String) {
            error = new Error(error);
        
        } else if (error && error instanceof Object) {
            if(error.responseText) {
                error = new Error(error.responseText);
            }
        }

        let modal = messageModal('<span class="fa fa-warning"></span> Error', error.message + '<br /><br />Please check server log for details', onClickOK);

        modal.$element.toggleClass('error-modal', true);

        throw error;
    }

    /**
     * Brings up a message modal
     *
     * @param {String} title
     * @param {String} body
     */
    static messageModal(title, body, onSubmit) {
        return new MessageModal({
            model: {
                title: title,
                body: body,
                onSubmit: onSubmit
            }
        });
    }

    /**
     * Brings up a confirm modal
     *
     * @param {String} type
     * @param {String} title
     * @param {String} body
     * @param {Function} onSubmit
     */
    static confirmModal(type, title, body, onSubmit, onCancel) {
        let submitClass = 'btn-primary';

        type = (type || '').toLowerCase();

        switch(type) {
            case 'delete': case 'remove': case 'discard': case 'clear':
                submitClass = 'btn-danger';
                break;
        }

        return new MessageModal({
            model: {
                title: title,
                body: body,
                onSubmit: onSubmit
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: onCancel
                },
                {
                    label: type,
                    class: submitClass,
                    callback: onSubmit
                }
            ]
        });
    }
}

window.errorModal = UIHelper.errorModal;
window.messageModal = UIHelper.messageModal;
window.confirmModal = UIHelper.confirmModal;

module.exports = UIHelper;
