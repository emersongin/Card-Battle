class Sprite_Card extends Sprite_Base {
    constructor(Game_Card) {
        super();

        this._AP = Game_Card.getAP() || 0;
        this._HP = Game_Card.getHP() || 0;
        this._color = Game_Card.getColor() || Game_CardColor.BROWN;
        this._type = Game_Card.getType() || Game_CardType.NONE;
        this._state = Game_Card.getState();
        this._face = Game_Card.getFace();
        this._selected = Game_Card.getSelected();
        this._file = Game_Card.getFile() || 'index';
        // mirrors
        this._mirrorAP = Game_Card.getAP() || 0;
        this._mirrorHP = Game_Card.getHP() || 0;
        this._mirrorX = this.x;
        this._mirrorY = this.y;
        this._mirrorScaleX = this.scale.x;
        this._mirrorScaleY = this.scale.y;
        // frames
        this._frameCounter = 0;
        this._frameInterval = 0;
        // behaviors
        this._pointsSpeed = 2;
        this._openness = true;
        
        this._actions = [];

        this.initialize();
        this.setFrame(0, 0, this.cardWidth(), this.cardHeight());

    }

    hasActions() {
        return this._actions.length > 0;
    }

    notEquals(value, mirror) {
        return value !== mirror;
    }

    isInactive() {
        return this._state === false;
    }

    isSelected() {
        return this._selected === true;
    }

    isOpen() {
        return this._openness;
    }
    
    isClose() {
        return this._openness === false;
    }

    open(force = false) {
        if (this.isClose() || force) {
            this._mirrorX = this.x - (this.cardWidth() / 2);
            this._mirrorScaleX = 1;
        }
    }
    
    close(force = false) {
        if (this.isOpen() || force) {
            this._mirrorX = this.x + (this.cardWidth() / 2);
            this._mirrorScaleX = 0;
        }
    }

    setTimeMove(times) {
        this._frameInterval = 0.06 * times;
    }

    itsMoving() {
        return this._frameInterval;
    }

    waiting() {
        return this._frameInterval <= 0;
    }

    setRange(value, mirror) {
        if (this.notEquals(value, mirror)) {
            return (value * (this._frameInterval - 1) + mirror) / this._frameInterval;
        }
        return value;
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
        this._figure = new Sprite(new Bitmap(this.cardWidth(), this.cardHeight()));
        this._caption = new Sprite(new Bitmap(this.cardWidth(), 24));
        this._shadow = new Sprite(new Bitmap(this.cardWidth(), this.cardHeight()));
        this._select = new Sprite(new Bitmap(this.cardWidth(), this.cardHeight()));

    }

    createLayers() {
        this._layers = {
            background: 0,
            figure: 1,
            caption: 2,
            shadow: 3,
            selected: 4
        };

        this.createBackground();
        this.createFigure();
        this.createCaption();
        this.createShadow();
        this.createSelected();

        this.addChild(this._background);
        this.addChild(this._figure);
        this.addChild(this._caption);
        this.addChild(this._shadow);
        this.addChild(this._select);
    }

    createBackground() {
        this.createBorder(this._background.bitmap, 'grey');

        this._background.bitmap.fillRect(
            2, 2, this.cardWidth() - 4, this.cardHeight() - 4, 
            this.backgroundColors(this._color)
        );
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
            rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), 
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
        // size card figure 96x96 and facedown 102x124

        if(this.isFaceUp()) {
            this._figure.move(3, 3);
            this._figure.bitmap = ImageManager.loadBattlecards(this._file);

        } else {
            this._figure.move(2, 2);
            this._figure.bitmap = ImageManager.loadBattlecards('facedown');

        }

    }

    createCaption() {
        this._caption.move(0, this.cardHeight() - 24);
        this._caption.bitmap.fontSize = 14;

    }

    createShadow() {
        this.createBorder(this._shadow.bitmap, 'black');
        this._shadow.bitmap.fillRect(2, 2, this.cardWidth() - 4, this.cardHeight() - 4, 'black');
        this._shadow.opacity = 128;

    }

    createSelected() {
        this.createBorder(this._select.bitmap, '#fff435');
        this._select.bitmap.clearRect (3, 3, this.cardWidth() - 6, this.cardHeight() - 6);

    }

    refresh() {
        if (this.isFaceUp()) {
            this.drawType();
            this.drawShadow();
            this.drawSelect();

        } else {
            this.clearCaption();
            this.createFigure();

        }
    }

    isFaceUp() {
        return this._face === true;
    }

    turnFace(force) {
        if (this.isFaceUp()) {
            this._face = false;
        } else {
            this._face = true;
        }
        this._face = force === null ? this._face :  force;
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

    drawShadow() {
        if(this.isInactive() && this.isFaceUp()) {
            this._shadow.opacity = 128;
        } else {
            this._shadow.opacity = 0;
        }
    }

    drawSelect() {
        if(this.isSelected() && this.isFaceUp()) {
            this._select.opacity = 255;
        } else {
            this._select.opacity = 0;
        }
    }

    drawCaption(caption) {
        this.clearCaption();
        this._caption.bitmap.drawText(
            `${caption}`, 0, 0, this.cardWidth(), 24, 'center'
        );
    }

    clearCaption() {
        this._caption.bitmap.clear();
    }

    update() {
        super.update();

        this.updateMovement();
        this.updateOpenAndClose();

        this.updateActions();
        this.updatePoints();
        this.updateSelected();

        this._frameCounter++;
    }

    updatePoints() {
        if(this._mirrorAP !== this._AP || this._mirrorHP !== this._HP && this.isOpen()) {
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
        if(this.isSelected() && this.isOpen() && this._frameCounter % 8 == 0) {
            this._select.opacity = this._select.opacity == 255 ? 228 : 255;
        }

    }

    updateOpenAndClose() {
        if (this.scale.x === 1 && this.isClose()) {
            this._openness = true;
        } else if (this.scale.x === 0 && this.isOpen()) {
            this._openness = false;
        }
    }

    updateMovement() {
        if (this.itsMoving()) {
            this.x = this.setRange(this.x, this._mirrorX);
            this.y = this.setRange(this.y, this._mirrorY);
            this.scale.x = this.setRange(this.scale.x, this._mirrorScaleX);
            this.scale.y = this.setRange(this.scale.y, this._mirrorScaleY);
            this._frameInterval--;
        }
    }

    updateActions() {
        if (this.hasActions() && this.waiting()) {
            let action = this._actions.shift();

            this.takeAction(action);
        }
    }

    addActions(actions = []) {
        if(Array.isArray(actions)) {
            this._actions = [...this._actions, ...actions];
        } else {
            this._actions.push(action);
        }
    }

    takeAction(Action) {
        switch (Action.type) {
            case '_OPEN':
                Action.duration = 200;

                this.open();
                break;
            case '_CLOSE':
                Action.duration = 200;

                this.close();
                break;
            case '_FACEUP':
                this.turnFace(true);
                this.refresh();
                break;
            case '_FACEDOWN':
                this.turnFace(false);
                this.refresh();
                break;
            case '_REFRESH':
                this.refresh();
                break;
            case '_ANIMATION':
                let animation = $dataAnimations[Action.params[0]];
                let duration = ((((animation.frames.length * 4) + 1) * 1000) / 60);

                Action.duration = duration;

                this.startAnimation($dataAnimations[Action.params[0]]);

                break;
            case '_WAIT':
                break;
            // case 'PLUS':
            //     this.plus(action.times);
            //     break;
            // case 'LESS':
            //     this.less(action.times);
            //     break;
            // case 'MOVE_UP':
            //     this.up(action.times);
            //     break;
            // case 'MOVE_DOWN':
            //     this.down(action.times);
            //     break;
            // case 'MOVE_LEFT':
            //     this.left(action.times);
            //     break;
            // case 'MOVE_RIGHT':
            //     this.right(action.times);
            //     break;
            // case 'SELECT':
            //     this.select();
            //     break;
            // case 'UNSELECT':
            //     this.unselect();
            //     break;
            // case 'LIKE':
            //     this.like();
            //     break;
            // case 'UNLIKE':
            //     this.unlike();
            //     break;
            // case 'TAKE':
            //     this.take();
            //     break;
            // case 'UNTAKE':
            //     this.untake();
            //     break;
            // case 'ENABLE':
            //     this.enable();
            //     break;
            // case 'DISABLE':
            //     this.disable();
            //     break;
            // case 'TRIGGERED':
            //     this.triggered();
            //     break;
            // case 'NOT_TRIGGERED':
            //     this.notTriggered();
            //     break;
            // case 'BLOCK':
            //     this.block();
            //     break;
            // case 'UNBLOCK':
            //     this.unblock();
            //     break;
            // case 'ATTACK':
            //     this.setAttack(action.points);
            //     break;
            // case 'HEALTH':
            //     this.setHealth(action.points);
            //     break;
        }

        this.setTimeMove(Action.duration || 1);
    }
    // updateReverse() {
    //     if(this._reversalInterval) {
    //         let frame = this._reversalInterval;

    //         if(frame < 20) {
    //             // this.x = ((this.x * (frame - 1)) + 0) / frame;
    //             this.scale.x = (1 * (frame - 1)) / frame;
    
    //         } else {
    //             // this.x = ((this.x * ((frame - 20) - 1)) + (this.width / 2)) / (frame - 20);
    //             this.scale.x = (0 * ((frame - 20) - 1)) / (frame - 20);
    
    //         }

    //         this._reversalInterval--;
    //     }
    // }

}
