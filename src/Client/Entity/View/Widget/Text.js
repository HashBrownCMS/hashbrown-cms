'use strict';

const TAB_WIDTH = 4;

/**
 * A text input widget
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class Text extends HashBrown.Entity.View.Widget.WidgetBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/widget/text');
    }

    /**
     * Gets the cursor index
     *
     * @return {Number} Cursor index
     */
    getCursorIndex() {
        return this.element.selectionStart || 0;
    }

    /**
     * Gets the cursor index on the current line
     *
     * @return {Number} Line cursor index
     */
    getLineCursorIndex() {
        let cursorIndex = this.getCursorIndex();
        let newLineIndex = this.element.value.substring(0, cursorIndex).lastIndexOf('\n') + 1;
        
        if(newLineIndex < 0) { newLineIndex = 0; }
        
        return cursorIndex - newLineIndex;
    }

    /**
     * Insert HTML
     *
     * @param {String} html
     */
    insertHtml(html) {
        if(!html) { return; }

        this.element.value += html;
    
        this.onChange(this.element.value);
    }

    /**
     * Event: Press tab
     */
    onPressTab() {
        let cursorIndex = this.getCursorIndex();
        let lineCursorIndex = this.getLineCursorIndex();
        let columns = TAB_WIDTH;

        if(lineCursorIndex > TAB_WIDTH) {
            columns = lineCursorIndex % TAB_WIDTH;            
        } else {
            columns = TAB_WIDTH - lineCursorIndex;
        }

        if(columns < 1) {
            columns = TAB_WIDTH;
        }

        let tab = '';

        for(let i = 0; i < columns; i++) {
            tab += ' ';
        }

        this.element.value = this.element.value.slice(0, cursorIndex) + tab + this.element.value.slice(cursorIndex); 
        
        this.element.selectionStart = cursorIndex + columns;
        this.element.selectionEnd = this.element.selectionStart;
        
        this.onChange(this.element.value);
    }

    /**
     * Event: Key down
     *
     * @param {InputEvent} e
     */
    onKeyDown(e) {
        if(!this.model.code) { return; }

        switch(e.keyCode) {
            case 9:
                e.preventDefault();
                this.onPressTab();
                break;
        }
    }
}

module.exports = Text;
