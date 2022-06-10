class Sprite_Card extends Sprite_Base {
    constructor(Game_Card) {
        super(Game_Card);

    }

    initialize(Game_Card) {
        super.initialize();

        // attributes
        this._AP = Game_Card.getAP() || 0;
        this._HP = Game_Card.getHP() || 0;
        this._color = Game_Card.getColor() || Game_CardColor.BROWN;
        this._type = Game_Card.getType() || Game_CardType.NONE;
        this._file = Game_Card.getFile() || 'index';

        // initial states
        this._hiding = true;
        this._openness = false
        this._state = false;
        this._face = false;
        this._selected = false;

        // initial state
        this.scale.x = 0;
        
        // mirrors
        this._mirrorAP = Game_Card.getAP() || 0;
        this._mirrorHP = Game_Card.getHP() || 0;
        this._mirrorX = this.x;
        this._mirrorY = this.y;
        this._mirrorScaleX = 0;
        this._mirrorScaleY = this.scale.y;

        // counters
        this._frameCounter = 0;
        this._frameInterval = 0;
        this._frameMoving = 0;

        // behaviors
        this._pointsSpeed = 2;

        // observers
        this._actions = [];
        this._subject = null;

        this.setFrame(0, 0, this.cardWidth(), this.cardHeight());
        this.setup();
        this.createLayers();

    }

    hasActions() {
        return this._actions.length > 0;
    }

    notActions() {
        return this._actions.length <= 0;
    }

    notEquals(value, mirror) {
        return value !== mirror;
    }

    isInactive() {
        return !this._state;
    }

    isSelected() {
        return this._selected;
    }

    isOpen() {
        return this._openness;
    }
    
    isClose() {
        return !this._openness;
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
        this._frameMoving = 0.06 * times;
    }

    setTimeInterval(times) {
        this._frameInterval = 0.06 * times;
    }

    itsBusy() {
        return this._frameInterval;
    }

    notBusy() {
        return this._frameInterval <= 0;
    }

    itsMoving() {
        return this._frameMoving;
    }

    waiting() {
        return this._frameMoving <= 0;
    }

    addSubject(subject = null) {
        this._subject = subject;
    }

    noWaiting() {
        let subject = this._subject;

        if(!subject) return true;

        return subject.notActions() && subject.waiting() && subject.notBusy() && subject.noWaiting();
    }

    setRangeMove(value, mirror) {
        if (this.notEquals(value, mirror)) {
            return (value * (this._frameMoving - 1) + mirror) / this._frameMoving;
        }
        return parseFloat(value);
    }

    setRangeMoveInt(value, mirror) {
        return parseInt(this.setRangeMove(value, mirror));
    }

    setRangeMoveFloat(value, mirror) {
        return parseFloat(this.setRangeMove(value, mirror));
    }

    cardWidth() {
        return 102;
    }

    cardHeight() {
        return 124;
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

    isShow() {
        return this.visible;
    }

    refresh() {
        if (this.isFaceUp()) {
            this.drawType();
            this.drawShadow();
            this.drawSelect();
            this.drawFigure();

        } else {
            this.clearCaption();
            this.drawShadow();
            this.drawSelect();
            this.drawCover();

        }
    }

    isFaceUp() {
        return this._face;
    }

    active() {
        this._state = true;
    }

    inactive() {
        this._state = false;
    }

    turnFaceUp() {
        this._face = true;
    }

    turnFaceDown() {
        this._face = false;
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
        if(this.isInactive()) {
            this._shadow.opacity = 128;
        } else {
            this._shadow.opacity = 0;
        }
    }

    drawSelect() {
        if(this.isSelected()) {
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

    drawFigure() {
        // size card figure 96x96 
        this._figure.move(3, 3);
        this._figure.bitmap = ImageManager.loadBattlecards(this._file);

    }

    drawCover() {
        // size card cover 102x124

        this._figure.move(2, 2);
        this._figure.bitmap = ImageManager.loadBattlecards('facedown');
    }

    update() {
        super.update();

        if(this.noWaiting()) {
            this.updateInterval();
            this.updateMovement();
            this.updateOpenAndClose();

            this.updateActions();
            this.updatePoints();
            this.updateSelected();
        }

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

    intervalCounter(each) {
        this._frameCounter % each == 0;
    }

    updateSelected() {
        if(this.isSelected() && this.isOpen() && this.intervalCounter(8)) {
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

    updateInterval() {
        if (this.itsBusy()) this._frameInterval--;
    }

    updateMovement() {
        if (this.itsMoving()) {
            this.x = this.setRangeMoveInt(this.x, this._mirrorX);
            this.y = this.setRangeMoveInt(this.y, this._mirrorY);
            this.scale.x = this.setRangeMoveFloat(this.scale.x, this._mirrorScaleX);
            this.scale.y = this.setRangeMoveFloat(this.scale.y, this._mirrorScaleY);
            this._frameMoving--;
        }
    }

    updateActions() {
        if (this.hasActions() && this.waiting() && this.notBusy()) {
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
            case '_SHOW':
                this.show();
                break;
            case '_HIDE':
                this.hide();
                break;
            case '_OPEN':
                Action.duration = 200;
                this.open();
                this.setTimeMove(Action.duration || 100);
                break;
            case '_CLOSE':
                Action.duration = 200;
                this.close();
                break;
            case '_ACTIVE':
                this.active();
                break;
            case '_INACTIVE':
                this.inactive();
                break;
            case '_FACEUP':
                this.turnFaceUp();
                break;
            case '_FACEDOWN':
                this.turnFaceDown();
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
            case '_WAITFOR':
                this.addSubject(Action.subject || null);
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

        this.setTimeInterval(Action.duration || 1);
    }

}
