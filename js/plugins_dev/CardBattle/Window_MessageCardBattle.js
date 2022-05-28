class Window_MessageCardBattle extends Window_Base {
    constructor() {
        super();

    }

    initialize() {
        let width = Graphics.boxWidth;
        let height = this.fittingHeight(2);

        super.initialize(0, 0, width, height);
        this.openness = 0;
        this._text = '';
        this._color = '';
        this._alignText = 'left';

    }

    align(position = 'start') {
        switch (position) {
            case 'top':
                this.move(0, 0, this.width, this.height);
                break;
            case 'center-top':
                this.move(0, (Graphics.boxHeight / 4 * 1), this.width, this.height);
                break;
            case 'center':
                this.move(0, (Graphics.boxHeight / 2), this.width, this.height);
                break;
            case 'center-bottom':
                this.move(0, (Graphics.boxHeight / 4 * 3), this.width, this.height);
                break;
            case 'bottom':
                this.move(0, (Graphics.boxHeight - this.height), this.width, this.height);
                break;
        }
    }

    setLinesText(textLine1 = '', textLine2 = '') {
        this._text = `${this._color}${textLine1}\n${textLine2}`;
        this.refresh();
    }

    clearTexts() {
        this._text = '';
    }

    switchTextColor(wheel) {
        this._color = `\\c[${wheel}]`;
    }
    
    sizeText() {
        return (this.contents.fontSize * this._text.length / 2) - (this.standardPadding() + 6);
    }

    refresh() {
        this.contents.clear();
        this.drawTextEx(this._text, 0, 0);
    }

}
