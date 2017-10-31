'use strict';

/**
 * A UI helper for creating and handling common interface behaviours
 *
 * @memberof HashBrown.Client.Helpers
 */
class UIHelper {
    /**
     * Sets the content of the editor space
     *
     * @param {Array|HTMLElement} content
     * @param {String} className
     */
    static setEditorSpaceContent(content, className) {
        let $space = $('.page--environment__space--editor');

        if(className) {
            content = _.div({class: 'page--environment__space--editor__' + className}, content);
        }

        _.append($space.empty(), content);
    }

    /**
     * Creates a sortable context specific to arrays using editor fields
     *
     * @param {Array} array
     * @param {HTMLElement} field
     * @param {Function} onChange
     */
    static fieldSortableArray(array, field, onChange) {
        array = array || [];

        // Set indices on all elements
        let items = field.querySelector('.editor__field__value').children;

        for(let i = 0; i < items.length; i++) {
            if(items[i] instanceof HTMLElement === false || !items[i].classList.contains('editor__field')) { continue; }

            items[i].dataset.index = i;
        }

        // Init the sortable context
        this.fieldSortable(field, (element) => {
            if(!element) { return; }

            let oldIndex = element.dataset.index;
            let newIndex = 0;

            // Discover new index
            let items = field.querySelector('.editor__field__value').children;

            for(let i = 0; i < items.length; i++) {
                if(items[i] === element) {
                    newIndex = i;
                    break;
                }
            }

            // Swap indices
            array.splice(newIndex, 0, array.splice(oldIndex, 1)[0])

            onChange(array);
        });
    }

    /**
     * Creates a sortable context specific to objects using editor fields
     *
     * @param {Object} object
     * @param {HTMLElement} field
     * @param {Function} onChange
     */
    static fieldSortableObject(object, field, onChange) {
        object = object || {};

        this.fieldSortable(field, (element) => {
            if(!element) { return; }

            let itemSortKeyElement = element.querySelector('.editor__field__sort-key');
            let itemKey = itemSortKeyElement.value || itemSortKeyElement.innerHTML;
            let itemValue = object[itemKey];

            // Try to get the next key
            let nextKey = '';
            let nextSortKeyElement = element.nextElementSibling ? element.nextElementSibling.querySelector('.editor__field__sort-key') : null;

            if(nextSortKeyElement) {
                nextKey = nextSortKeyElement.value || nextSortKeyElement.innerHTML;
            }

            // Construct a new object based on the old one
            let newObject = {};

            for(let fieldKey in object) {
                // Omit existing key
                if(fieldKey === itemKey) { continue; }

                let fieldValue = object[fieldKey];

                // If there is a next key, and it's the same as this field key,
                // the sorted item should be inserted just before it
                if(nextKey === fieldKey) {
                    newObject[itemKey] = itemValue;
                }

                newObject[fieldKey] = fieldValue;
            }

            // If the item wasn't reinserted, insert it now
            if(!newObject[itemKey]) {
                newObject[itemKey] = itemValue;
            }

            // Assign the new object to the old one
            object = newObject;

            // Fire the change event
            onChange(newObject);
        });
    }

    /**
     * Creates a sortable context specific to fields
     *
     * @param {HTMLElement} field
     * @param {Function} onChange
     */
    static fieldSortable(field, onChange) {
        let btnSort = field.querySelector('.editor__field__key__action--sort');
        let divValue = field.querySelector('.editor__field__value');
        let isSorting = !divValue.classList.contains('sorting');

        if(this.sortable(divValue, 'editor__field', isSorting, onChange)) {
            btnSort.classList.toggle('sorting', isSorting);
            divValue.classList.toggle('sorting', isSorting);
        }
    }

    /**
     * Creates a sortable context
     *
     * @param {HTMLElement} parentElement
     * @param {String} sortableClassName
     * @param {Boolean} isActive
     * @param {Function} onChange
     *
     * @returns {Boolean} Whether or not sorting was initialised
     */
    static sortable(parentElement, sortableClassName, isActive, onChange) {
        let children = Array.prototype.slice.call(parentElement.children || []);
        let canSort = true;
        
        children = children.filter((child) => {
            return child instanceof HTMLElement && child.classList.contains(sortableClassName);
        });

        if(!children || children.length < 1) { return false; }

        if(typeof isActive === 'undefined') {
            isActive = !parentElement.classList.contains('sorting');
        }

        _.each(children, (i, child) => {
            if(isActive) {
                child.setAttribute('draggable', true);
            } else {
                child.removeAttribute('draggable');
            }

            if(isActive) {
                child.ondrag = (e) => {
                    if(!canSort) { return; }
                    
                    _.each(children, (i, sibling) => {
                        if(sibling === child || !canSort || e.pageY < 1) { return; }

                        let cursorY = e.pageY;
                        let childY = child.getBoundingClientRect().y - document.body.getBoundingClientRect().y;
                        let siblingY = sibling.getBoundingClientRect().y - document.body.getBoundingClientRect().y;
                        let hasMoved = false;

                        // Dragging above a sibling
                        if(cursorY < siblingY && childY > siblingY) {
                            sibling.parentElement.insertBefore(child, sibling);    
                            hasMoved = true;
                        }

                        // Dragging below a sibling
                        if(cursorY > siblingY && childY < siblingY) {
                            sibling.parentElement.insertBefore(child, sibling.nextElementSibling);
                            hasMoved = true;
                        }

                        // Init transition
                        if(hasMoved) {
                            canSort = false;

                            let newChildY = child.getBoundingClientRect().y - document.body.getBoundingClientRect().y;
                            let newSiblingY = sibling.getBoundingClientRect().y - document.body.getBoundingClientRect().y;

                            child.style.transform = 'translateY(' + (childY - newChildY) + 'px)';
                            sibling.style.transform = 'translateY(' + (siblingY - newSiblingY) + 'px)';

                            setTimeout(() => {
                                child.removeAttribute('style');
                                sibling.removeAttribute('style');
                                canSort = true;
                            }, 100);
                        }
                    });
                };

                child.ondragend = (e) => {
                    onChange(child);
                };

                child.ondragcancel = (e) => {
                    onChange(child);
                };

            } else {
                child.ondragstart = null;
                child.ondrag = null;
                child.ondragstop = null;
                child.ondragcancel = null;
            }
        });
        
        parentElement.classList.toggle('sorting', isActive);

        return true;
    }


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
        let $input;

        let $element = _.div({class: 'switch', 'data-checked': initialValue},
            $input = _.input({
                id: id,
                class: 'form-control switch',
                type: 'checkbox'
            }).change(function() {
                this.parentElement.dataset.checked = this.checked;

                if(onChange) {
                    onChange(this.checked);
                }
            }),
            _.label({for: id})
        );

        $element.on('set', (e, newValue) => {
            $input[0].checked = newValue;
        });

        if(initialValue) {
            $input.attr('checked', true);
        }

        return $element;
    }

    /**
     * Creates a group of chips
     *
     * @param {Array} items
     * @param {Array} dropdownItems
     * @param {Function} onChange
     * @param {Boolean} isDropdownUnique
     *
     * @returns {HtmlElement} Chip group element
     */
    static inputChipGroup(items, dropdownItems, onChange, isDropdownUnique) {
        let $element = _.div({class: 'chip-group'});

        if(!items) { items = []; }

        function render() {
            _.append($element.empty(),

                // Render individual chips
                _.each(items, (itemIndex, item) => {
                    let label = item.label || item.name || item.title;
                    
                    if(!label) {
                        for(let dropdownItem of dropdownItems) {
                            let value = dropdownItem.id || dropdownItem.value || dropdownItem;

                            if(value === item) {
                                label = dropdownItem.label || dropdownItem.name || dropdownItem.title || dropdownItem;
                            }
                        }
                    }

                    if(!label) { 
                        label = item;
                    }

                    let $chip = _.div({class: 'chip'},

                        // Dropdown
                        _.if(Array.isArray(dropdownItems),
                            _.div({class: 'chip-label dropdown'},
                                _.button({class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
                                    label
                                ),
                                _.if(onChange,
                                    _.ul({class: 'dropdown-menu'},
                                        _.each(dropdownItems, (dropdownItemIndex, dropdownItem) => {
                                            // Look for unique dropdown items
                                            if(isDropdownUnique) {
                                                for(let item of items) {
                                                    if(item == dropdownItem) {
                                                        return;
                                                    }
                                                }
                                            }

                                            return _.li(
                                                _.a({href: '#'},
                                                    dropdownItem.label || dropdownItem.name || dropdownItem.title || dropdownItem
                                                ).click(function(e) {
                                                    e.preventDefault();
                                                        
                                                    items[itemIndex] = dropdownItem.value || dropdownItem.id || dropdownItem;

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
                            if(isDropdownUnique) {
                                for(let dropdownItem of dropdownItems) {
                                    let isSelected = false;

                                    for(let item of items) {
                                        if(item == dropdownItem) {
                                            isSelected = true;
                                            break;
                                        }
                                    }

                                    if(!isSelected) {
                                        items.push(dropdownItem.value || dropdownItem);
                                        break;
                                    }
                                }
                            } else {
                                items.push(dropdownItems[0].value || dropdownItems[0]);
                            }
                        
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
     * Renders a carousel
     *
     * @param {Array} items
     * @param {Boolean} useIndicators
     * @param {Boolean} useControls
     * @param {String} height
     *
     * @returns {HtmlElement} Carousel element
     */
    static carousel(items, useIndicators, useControls, height) {
        let id = 'carousel-' + (10000 + Math.floor(Math.random() * 10000));
        
        return _.div({class: 'carousel slide', id: id, 'data-ride': 'carousel', 'data-interval': 0},
            _.if(useIndicators,
                _.ol({class: 'carousel-indicators'},
                    _.each(items, (i, item) => {
                        return _.li({'data-target': '#' + id, 'data-slide-to': i, class: i == 0 ? 'active' : ''});
                    })
                )
            ),
            _.div({class: 'carousel-inner', role: 'listbox'},
                _.each(items, (i, item) => {
                    return _.div({class: 'item' + (i == 0? ' active': ''), style: 'height:' + (height || '500px')},
                        item
                    );
                })
            ),
            _.if(useControls,
                _.a({href: '#' + id, role: 'button', class: 'left carousel-control', 'data-slide': 'prev'},
                    _.span({class: 'fa fa-arrow-left'})
                ),
                _.a({href: '#' + id, role: 'button', class: 'right carousel-control', 'data-slide': 'next'},
                    _.span({class: 'fa fa-arrow-right'})
                )
            )
        );
    }

    /**
     * Brings up an error modal
     *
     * @param {String|Error} error
     * @param {Function} onClickOK
     */
    static errorModal(error, onClickOK) {
        if(!error) { return; }

        if(error instanceof String) {
            error = new Error(error);
        
        } else if(error instanceof Object) {
            if(error.responseText) {
                error = new Error(error.responseText);
            }
        
        } else if(error instanceof Error == false) {
            error = new Error(error.toString());

        }

        console.log(error.stack);
        
        return UIHelper.messageModal('<span class="fa fa-warning"></span> Error', error.message, onClickOK, 'error');
    }
    
    /**
     * Brings up a warning modal
     *
     * @param {String} warning
     * @param {Function} onClickOK
     */
    static warningModal(warning, onClickOK) {
        if(!warning) { return; }

        return UIHelper.messageModal('<span class="fa fa-warning"></span> Warning', warning, onClickOK, 'warning');
    }

    /**
     * Brings up a message modal
     *
     * @param {String} title
     * @param {String} body
     * @param {Function} onClickOK
     * @param {String} group
     */
    static messageModal(title, body, onClickOK, group) {
        let modal = new HashBrown.Views.Modals.Modal({
            title: title,
            group: group,
            body: body
        });

        modal.on('ok', onClickOK);

        return modal;
    }

    /**
     * Brings up an iframe modal
     *
     * @param {String} title
     * @param {String} url
     */
    static iframeModal(title, url) {
        let modal = new HashBrown.Views.Modals.IframeModal({
            title: title,
            url: url
        });

        modal.on('cancel', onCancel);
        modal.on('ok', onSubmit);
       
        return modal;
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
        let modal = new HashBrown.Views.Modals.ConfirmModal({
            type: type ? type.toLowerCase() : null,
            title: title,
            body: body
        });

        modal.on('cancel', onCancel);
        modal.on('ok', onSubmit);

        return modal;
    }

    /**
     * Creates a context menu
     */
    static context(element, items) {
        let openContextMenu = (e) => {
            // Find any existing context menu targets and remove their classes
            let clearTargets = () => {
                let targets = document.querySelectorAll('.context-menu-target');
            
                if(targets) {
                    for(let i = 0; i < targets.length; i++) {
                        targets[i].classList.remove('context-menu-target');
                    }
                }
            };

            clearTargets();

            // Set new target
            element.classList.toggle('context-menu-target', true);
            
            // Remove existing dropdowns
            let existingMenu = _.find('.widget--dropdown.context-menu');

            if(existingMenu) { existingMenu.remove(); }

            // Init new dropdown
            let dropdown = new HashBrown.Views.Widgets.Dropdown({
                options: items,
                reverseKeys: true,
                onChange: (pickedItem) => {
                    if(typeof pickedItem !== 'function') { return; }

                    pickedItem();
                }
            });

            // Prevent the toggle button from blocking new context menu events
            let toggle = dropdown.element.querySelector('.widget--dropdown__toggle');

            toggle.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                dropdown.toggle(false);
            });

            // Set cancel event
            dropdown.on('cancel', () => {
                dropdown.remove();

                // Wait a bit before removing the classes, as they are often used as references in the functions executed by the context menu
                setTimeout(() => {
                    clearTargets();
                }, 100);
            });

            // Set styles
            dropdown.element.classList.toggle('context-menu', true);
            dropdown.element.style.top = e.touches ? e.touches[0].pageY : e.pageY;
            dropdown.element.style.left = e.touches ? e.touches[0].pageX : e.pageX;

            // Open it
            dropdown.toggle(true);

            // Append to body
            document.body.appendChild(dropdown.element);
        };
        
        let touchTimeout = null;

        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
                
            openContextMenu(e);
        });

        element.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if(e.which === 3 || e.ctrlKey) {
                openContextMenu(e);
            }
        });
        
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();

            touchTimeout = setTimeout(() => {
                openContextMenu(e);
            }, 400);
        });

        element.addEventListener('touchend', (e) => {
            if(touchTimeout) {
                clearTimeout(touchTimeout);
            }
        });
    }
}

module.exports = UIHelper;
