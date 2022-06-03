class Sprite_Card extends Sprite {
    constructor(Game_Card) {
        super();

        this._AP = Game_Card.getAP() || 0;
        this._HP = Game_Card.getAP() || 0;
        this._color = Game_Card.getColor() || Game_CardColor.BROWN;
        this._type = Game_Card.getType() || Game_CardType.NONE;
        this._state = Game_Card.getState() || Game_CardState.ACTIVE;
        this._face = Game_Card.getFace() || true;
        this._select = Game_Card.getFace() || false;
        this._file = Game_Card.getFile() || 'index';

        this._mirrorAP = Game_Card.getAP() || 0;
        this._mirrorHP = Game_Card.getHP() || 0;

        this.initialize();
        this.setFrame(0, 0, this.cardWidth(), this.cardHeight());

    }

    cardWidth() {
        return Math.floor(Graphics.boxWidth / 8);
    }

    cardHeight() {
        return Math.floor(Graphics.boxHeight / 5);
    }

    initialize() {
        super.initialize();
        this.setup();
        this.createBackground();
        this.createFigure();
        this.createSelected();


        this.refresh();
    }

    setup() {
        this._border = new Bitmap(this.cardWidth(), this.cardHeight());
        this._background = new Bitmap(this.cardWidth(), this.cardHeight());
        this._figure = new Sprite();
        this._selected = new Sprite();
        //
        this.bitmap = new Bitmap(this.cardWidth(), this.cardHeight());
        this.bitmap.fontSize = 14;

    }

    createBackground() {
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
        
        // @tests
        // this._figure.bitmap.fillAll('red');
        
        this.addChild(this._figure);
    }

    createSelected() {
        //..
    }

    refresh() {
        if (this.isFaceUp()) {
            this.bitmap.clear();
            this.draw(this._border);
            this.draw(this._background);
            this.drawType();
            this.drawSelect();

        } else {
            //faceDown
        }
    }

    isFaceUp() {
        return this._face === true;
    }

    draw(Bitmap) {
        this.bitmap.blt(Bitmap, 0, 0, Bitmap.width, Bitmap.height, 0, 0);
    }

    drawType() {
        if(this._type === Game_CardType.BATTLE) {
            this.drawPoints();
        } else if(this._type === Game_CardType.POWER) {
            this.drawCaption('( P )');
        } else {
            this.drawCaption('?');
        }
    }

    drawSelect() {
        if(this._select) {

        }
    }

    drawPoints() {
        this.bitmap.drawText(
            `${this._AP}/${this._HP}`, 0, this.cardHeight() - 24, this.cardWidth(), 24, 'center'
        );
    }

    drawCaption(caption) {
        this.bitmap.drawText(
            `${caption}`, 0, this.cardHeight() - 24, this.cardWidth(), 24, 'center'
        );
    }

    update() {
        super.update();
        this.updatePoints();

    }

    updatePoints() {
        if(this._mirrorAP !== this._AP || this._mirrorHP !== this._HP) {
            if(this._mirrorAP > this._AP) {
                this._AP++;
            } else if (this._mirrorAP < this._AP) {
                this._AP--;
            } 
    
            if(this._mirrorHP > this._HP) {
                this._HP++;
            } else if (this._mirrorHP < this._HP) {
                this._HP--;
            } 
    
            this.refresh();
        }
    }

}
