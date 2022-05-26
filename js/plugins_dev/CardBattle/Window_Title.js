class Window_Title extends Window_Base {
    constructor() {
        super();

    }

    initialize(numLines) {
        let width = Graphics.boxWidth;
        let height = this.fittingHeight(numLines || 1);

        super.initialize(0, 0, width, height);
        this.openness = 0;
        this._text = '';
        this.align('end');
        this.open();

    }

    align(position = 'start') {
        switch (position) {
            case 'start':
                this.move(0, 0, this.width, this.height);
                break;
            case 'center':
                this.move(0, Graphics.boxHeight / 2 - this.height, this.width, this.height);
                break;
            case 'end':
                this.move(0, Graphics.boxHeight - this.height, this.width, this.height);
                break;
        }
    }

    setText(text) {
        if (this._text !== text) {
            this._text = text;
            this.refresh();

        }
    }
    
    clearText() {
        this._text = '';
    }
        
    refresh() {
        this.contents.clear();
        this.drawTextEx(this._text, this.textPadding(), 0);
    }

}
