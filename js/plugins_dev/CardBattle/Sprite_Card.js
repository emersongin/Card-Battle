class Sprite_Card extends Sprite {
    constructor(Game_Card) {
        super();

        this._AP = Game_Card.getAP();
        this._HP = Game_Card.getHP();
        this._color = Game_Card.getColor();
        this._type = Game_Card.getType();
        this._face = Game_Card.getFace() || true;
        this._state = Game_Card.getState();
        this._file = Game_Card.getFile();

        this.initialize();
        this.setFrame(0, 0, this.cardWidth(), this.cardHeight());

    }

    initialize() {
        super.initialize();
        this.bitmap = new Bitmap(this.cardWidth(), this.cardHeight());
        this.bitmap.fontSize = 14;
        this._border = null;
        this._background = null;
        this._figure = new Sprite();
        this.createBackground();
        this.createFigure();
        this.refresh();

    }

    createBackground() {
        this._border = new Bitmap(this.cardWidth(), this.cardHeight());
        this._background = new Bitmap(this.cardWidth(), this.cardHeight());

        const context = this._border._context;

        let rectX = 0;
        let rectY = 0;
        let rectWidth = this.cardWidth();
        let rectHeight = this.cardHeight();
        let cornerRadius = 8;

        context.lineJoin = "round";
        context.lineWidth = cornerRadius;
        context.strokeStyle = 'gray';
        context.strokeRect(
            rectX + (cornerRadius/2), rectY + (cornerRadius/2), 
            rectWidth - cornerRadius, rectHeight - cornerRadius
        );

        this._background.fillRect( 
            rectX + 2, rectY + 2, 
            rectWidth - 4, rectHeight - 4, 
            this.backgroundColors(this._color)
        );

    }

    backgroundColors(color) {
        switch (color) {
            case 'white':
                return '#edfff5';
                break;
            case 'blue':
                return '#777ae3';
                break;
            case 'green':
                return '#5dee57';
                break;
            case 'red':
                return '#f33434';
                break;
            case 'black':
                return '#414141';
                break;
            case 'brown':
                return '#915f2d';
                break;
        }
    }

    createFigure() {
        // size card figure 96x96

        this._figure.move(3, 4);
        this._figure.bitmap = ImageManager.loadBattlecards(this._file);
        // this._figure.bitmap.fillAll('red');
        
    }

    drawBlock(Bitmap) {
        this.bitmap.blt(Bitmap, 0, 0, Bitmap.width, Bitmap.height, 0, 0);

    }

    drawPoints() {
        this.bitmap.drawText(`${this._AP}/${this._HP}`, 0, this.cardHeight() - 24, this.cardWidth(), 24, 'center');
    }

    refresh() {
        if (this.isFaceUp()) {
            this.bitmap.clear();
            this.drawBlock(this._border);
            this.drawBlock(this._background);
            this.drawPoints();
            this.addChild(this._figure);

        } else {

        }
        
    }

    isFaceUp() {
        return this._face == true;
    }

    cardWidth() {
        return Math.floor(Graphics.boxWidth / 8);
    }

    cardHeight() {
        return Math.floor(Graphics.boxHeight / 5);
    }

    update() {
        super.update();
        this.refresh();

    }

}
