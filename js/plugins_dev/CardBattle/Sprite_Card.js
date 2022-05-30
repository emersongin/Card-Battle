class Sprite_Card extends Sprite {
    constructor(Game_Card) {
        super();

        this._AP = Game_Card.getAP();
        this._HP = Game_Card.getHP();
        this._color = Game_Card.getColor();
        this._type = Game_Card.getType();
        this._face = Game_Card.getFace();
        this._state = Game_Card.getState();

        this.initialize();
    }

    initialize() {
        super.initialize();
        this.setFrame(0, 0, this.cardWidth(), this.cardHeight());
        this.bitmap = new Bitmap(this.cardWidth(), this.cardHeight());
        this.createBackground();

    }

    createBackground() {
        const context = this.bitmap._context;

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

        this.bitmap.fillRect( rectX + 2, rectY + 2, rectWidth - 4, rectHeight - 4, this._color);

    }

    cardWidth() {
        return Math.floor(Graphics.boxWidth / 8);
    }

    cardHeight() {
        return Math.floor(Graphics.boxHeight / 5);
    }



}
