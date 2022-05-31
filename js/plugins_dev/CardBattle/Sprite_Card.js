class Sprite_Card extends Sprite {
    constructor(Game_Card) {
        super();

        this._AP = Game_Card.getAP();
        this._HP = Game_Card.getHP();
        this._color = Game_Card.getColor();
        this._type = Game_Card.getType();
        this._face = Game_Card.getFace();
        this._state = Game_Card.getState();
        this._figure = Game_Card.getFigure();

        this.initialize();
    }

    initialize() {
        super.initialize();
        this.setFrame(0, 0, this.cardWidth(), this.cardHeight());
        this._border = null;
        this._background = null;
        this._figure = null;
        this.bitmap = new Bitmap(this.cardWidth(), this.cardHeight());
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
        this._figure = ImageManager.loadBattlecards('Slime');
    }

    refresh() {
        if (true) { //this.isFaceUp()
            // this.bitmap.blt(this._background, 0, 0, this.cardWidth(), this.cardHeight(), 2, 2);
            this.bitmap.blt(this._figure, 0, 0, this.cardWidth(), this.cardHeight(), 2, 2);
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



}
