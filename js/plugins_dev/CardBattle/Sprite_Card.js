class Sprite_Card extends Sprite {
    constructor(Game_Card) {
        super();

        this._AP = Game_Card.getAP() || 0;
        this._HP = Game_Card.getHP() || 0;
        this._color = Game_Card.getColor() || Game_CardColor.BROWN;
        this._type = Game_Card.getType() || Game_CardType.NONE;
        this._state = Game_Card.getState() || Game_CardState.ACTIVE;
        this._face = Game_Card.getFace() || true;
        this._selected = Game_Card.getSelected() || true;
        this._file = Game_Card.getFile() || 'index';

        this._mirrorAP = Game_Card.getAP() || 0;
        this._mirrorHP = Game_Card.getHP() || 0;

        this._frameCounter = 0;
        this._pointsSpeed = 2;

        this.initialize();
        this.setFrame(0, 0, this.cardWidth(), this.cardHeight());

    }

    isSelected() {
        return this._selected;
    }

    cardWidth() {
        return 102;
    }

    cardHeight() {
        return 124;
    }

    initialize() {
        super.initialize();
        this.setup();
        this.createLayers();
        this.refresh();

    }

    setup() {
        this._background = new Sprite(new Bitmap(this.cardWidth(), this.cardHeight()));
        this._figure = new Sprite();
        this._caption = new Sprite();
        this._select = new Sprite();
        //
        this.bitmap = new Bitmap(this.cardWidth(), this.cardHeight());

    }

    createLayers() {
        this._layers = {
            background: 0,
            figure: 1,
            caption: 2,
            selected: 3
        };

        this.createBackground();
        this.createFigure();
        this.createCaption();
        this.createSelected();

        this.addChild(this._background);
        this.addChild(this._figure);
        this.addChild(this._caption);
        this.addChild(this._select);
    }

    createBackground() {
        let border = new Bitmap(this.cardWidth(), this.cardHeight());
        let background = new Bitmap(this.cardWidth(), this.cardHeight());

        this.createBorder(border, 'grey');

        background.fillRect(
            2, 2, this.cardWidth() - 4, this.cardHeight() - 4, 
            this.backgroundColors(this._color)
        );

        this._background.bitmap.blt(border, 0, 0, border.width, border.height, 0, 0);
        this._background.bitmap.blt(background, 0, 0, background.width, background.height, 0, 0);
    }

    createBorder(bitmap, color) {
        const context = bitmap._context;

        let rectX = 0;
        let rectY = 0;
        let rectWidth = this.cardWidth();
        let rectHeight = this.cardHeight();
        let cornerRadius = 8;

        context.lineJoin = "round";
        context.lineWidth = cornerRadius;
        context.strokeStyle = color;
        context.strokeRect(
            rectX + (cornerRadius/2), rectY + (cornerRadius/2), 
            rectWidth - cornerRadius, rectHeight - cornerRadius
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

        this._figure.move(4, 4);
        this._figure.bitmap = ImageManager.loadBattlecards(this._file);
        
        // @tests
        // this._figure.bitmap.fillAll('red');

    }

    createCaption() {
        this._caption.move(0, this.cardHeight() - 24);
        this._caption.bitmap = new Bitmap(this.cardWidth(), 24);
        this._caption.bitmap.fontSize = 14;
    }

    createSelected() {
        this._select.move(1, 1);
        this._select.bitmap = new Bitmap(this.cardWidth(), this.cardHeight());
        this.createBorder(this._select.bitmap, '#fff435');
        this._select.bitmap.clearRect (3, 3, this.cardWidth() - 6, this.cardHeight() - 6);

    }

    refresh() {
        if (this.isFaceUp()) {
            this.drawType();
            this.drawSelect();

        } else {
            //faceDown
        }
    }

    isFaceUp() {
        return this._face === true;
    }

    drawType() {
        if(this._type === Game_CardType.BATTLE) {
            this.drawCaption(`${this._AP}/${this._HP}`);
        } else if(this._type === Game_CardType.POWER) {
            this.drawCaption('( P )');
        } else {
            this.drawCaption('?');
        }
    }

    drawSelect() {
        if(this.isSelected()) {
            this.addChildAt(this._select, this._layers.selected);
        } else {
            this.removeChildAt(this._layers.selected);
        }
    }

    drawCaption(caption) {
        this._caption.bitmap.clear();
        this._caption.bitmap.drawText(
            `${caption}`, 0, 0, this.cardWidth(), 24, 'center'
        );
    }

    update() {
        super.update();
        this.updatePoints();
        this.updateSelected();

        this._frameCounter++;
    }

    updatePoints() {
        if(this._mirrorAP !== this._AP || this._mirrorHP !== this._HP) {
            let speed = this._pointsSpeed || 1;

            for (let times = 1; times <= speed; times++) {
                this.updatePointsOnce();
            }

            this.refresh();
        }
    }

    updatePointsOnce() {
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
    }

    updateSelected() {
        if(this.isSelected() && this._frameCounter % 8 == 0) {
            this._select.opacity = this._select.opacity == 255 ? 228 : 255;
        }

    }

}
