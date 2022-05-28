class Window_Title extends Window_Base {
    constructor() {
        super();

    }

    initialize() {
        let width = Graphics.boxWidth;
        let height = this.fittingHeight(1);

        super.initialize(0, 0, width, height);
        this.openness = 0;
        this._text = '';
        this._alignText = 'center';

    }

    align(position = 'start') {
        switch (position) {
            case 'top':
                this.move(0, 0, this.width, this.height);
                break;
            case 'center-top':
                this.move(0, (Graphics.boxHeight / 4 * 1) - this.height, this.width, this.height);
                break;
            case 'center':
                this.move(0, (Graphics.boxHeight / 2) - this.height, this.width, this.height);
                break;
            case 'center-bottom':
                this.move(0, (Graphics.boxHeight / 4 * 3) - this.height, this.width, this.height);
                break;
            case 'bottom':
                this.move(0, (Graphics.boxHeight - this.height), this.width, this.height);
                break;
        }
    }

    setText(text) {
        this._text = text;
        this.refresh();

    }
    
    clearText() {
        this._text = '';
    }

    switchTextColor(wheel) {
        this.contents.textColor = this.textColor(wheel) || this.textColor(0);
    }
    
    sizeText() {
        return (this.contents.fontSize * this._text.length / 2) - (this.standardPadding() + 6);
    }

    refresh() {
        this.contents.clear();
        this.drawText(this._text, 0, 0, this.width - this.sizeText(), this._alignText);
    }

}
