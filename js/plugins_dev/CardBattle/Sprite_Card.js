class Sprite_Card extends Sprite_Base {
    constructor(Game_Card) {
        super(Game_Card);

    }

    initialize(Game_Card) {
        super.initialize();

        // states
        this.state = {
            ap: Game_Card.getAP() || 0,
            hp: Game_Card.getHP() || 0,
            x: this.x,
            y: this.y,
            scale: new Point(0, this.scale.y),
        };

        // attributes
        this._AP = Game_Card.getAP() || 0;
        this._HP = Game_Card.getHP() || 0;
        this._color = Game_Card.getColor() || Game_CardColor.BROWN;
        this._type = Game_Card.getType() || Game_CardType.NONE;
        this._file = Game_Card.getFile() || 'index';

        // initial states
        this._hiding = true;
        this._openness = false
        this._status = false;
        this._face = false;
        this._selection = false;

        // external initial state 
        this.parentIndex = 0;
        this.scale.x = 0;

        // counters
        this._frameCounter = 0;
        this._frameInterval = 0;
        this._frameMoving = 0;

        // behaviors
        this._pointsSpeed = 2;

        // observers
        this._actions = [];
        this._observable = null;

        // layers
        this._layers = {
            background: new Sprite(new Bitmap(this.cardWidth(), this.cardHeight())),
            figure: new Sprite(new Bitmap(this.cardWidth(), this.cardHeight())),
            caption: new Sprite(new Bitmap(this.cardWidth(), 24)),
            shadow: new Sprite(new Bitmap(this.cardWidth(), this.cardHeight())),
            select: new Sprite(new Bitmap(this.cardWidth(), this.cardHeight())),
        };

        this.setFrame(0, 0, this.cardWidth(), this.cardHeight());
        this.createLayers();
        this.addLayers();

    }

    cardWidth() {
        return 102;
    }

    cardHeight() {
        return 124;
    }

    isActive() {
        return this._status;
    }

    isInactive() {
        return !this._status;
    }

    activate() {
        this._status = true;
    }

    inactivate() {
        this._status = false;
    }

    isSelect() {
        return this._selection;
    }

    isUnselect() {
        return !this._selection;
    }

    selected() {
        this._selection = true;
    }

    unselected() {
        this._selection = false;
    }

    isUp() {
        return this._face;
    }

    isDown() {
        return !this._face;
    }

    turnUp() {
        this._face = true;
    }

    turnDown() {
        this._face = false;
    }

    setCoordY(coordY) {
        this.y = coordY;
        this.state.y = coordY;
    }

    setCoordX(coordX) {
        this.x = coordX;
        this.state.x = coordX;
    }

    moveTo(coordX, coordY) {
        this.moveCoordX(coordX);
        this.moveCoordY(coordY);
    }

    moveCoordX(coordX) {
        this.state.x = coordX;
    }

    moveCoordY(coordY) {
        this.state.y = coordY;
    }

    isOpen() {
        return this._openness;
    }
    
    isClose() {
        return !this._openness;
    }

    open() {
        if (this.isClose()) {
            this.state.x = (this.x - (this.cardWidth() / 2));
            this.state.scale.x = 1;
        }
    }
    
    close() {
        if (this.isOpen()) {
            this.state.x = (this.x + (this.cardWidth() / 2));
            this.state.scale.x = 0;
        }
    }

    hasActions() {
        return this._actions.length > 0;
    }

    noActions() {
        return this._actions.length <= 0;
    }

    itsBusy() {
        return this._frameInterval > 0;
    }

    noBusy() {
        return this._frameInterval <= 0;
    }

    itsMoving() {
        return this._frameMoving > 0;
    }

    noMoving() {
        return this._frameMoving <= 0;
    }

    waiting() {
        let obs = this._observable;

        if(!obs) return true;

        return obs.noActions() && obs.noMoving() && obs.noBusy() && obs.waiting();
    }

    setObservable(observable) {
        this._observable = observable;
    }

    setParentIndex(index) {
        this.parentIndex = index;
    }

    createLayers() {
        this.createBackground();
        this.createCaption();
        this.createShadow();
        this.createSelection();
    }

    addLayers() {
        this.addChild(this._layers.background);
        this.addChild(this._layers.figure);
        this.addChild(this._layers.caption);
        this.addChild(this._layers.shadow);
        this.addChild(this._layers.select);
    }

    createBackground() {
        this.createBorder(this._layers.background.bitmap, 'grey');

        this._layers.background.bitmap.fillRect(
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
        this._layers.caption.move(0, this.cardHeight() - 24);
        this._layers.caption.bitmap.fontSize = 14;

    }

    createShadow() {
        this.createBorder(this._layers.shadow.bitmap, 'black');
        this._layers.shadow.bitmap.fillRect(2, 2, this.cardWidth() - 4, this.cardHeight() - 4, 'black');
        this._layers.shadow.opacity = 128;

    }

    createSelection() {
        this.createBorder(this._layers.select.bitmap, '#fff435');
        this._layers.select.bitmap.clearRect (3, 3, this.cardWidth() - 6, this.cardHeight() - 6);

    }

    refresh() {
        if (this.isUp()) {
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
            this._layers.shadow.opacity = 128;
        } else {
            this._layers.shadow.opacity = 0;
        }
    }

    drawSelect() {
        if(this.isSelect()) {
            this._layers.select.opacity = 255;
        } else {
            this._layers.select.opacity = 0;
        }
    }

    drawCaption(caption) {
        this.clearCaption();
        this._layers.caption.bitmap.drawText(
            `${caption}`, 0, 0, this.cardWidth(), 24, 'center'
        );
    }

    clearCaption() {
        this._layers.caption.bitmap.clear();
    }

    drawFigure() {
        // size card figure 96x96 
        this._layers.figure.move(3, 3);
        this._layers.figure.bitmap = ImageManager.loadBattlecards(this._file);

    }

    drawCover() {
        // size card cover 102x124

        this._layers.figure.move(2, 2);
        this._layers.figure.bitmap = ImageManager.loadBattlecards('facedown');
    }

    update() {
        super.update();

        if(this.waiting()) {
            this.updateInterval();
            this.updateMovement();
            this.updateOpenness();

            this.updateActions();
            this.updatePoints();
            this.updateSelected();
        }

        this._frameCounter++;
    }

    updateInterval() {
        if (this.itsBusy()) this._frameInterval--;
    }

    updateMovement() {
        if (this.itsMoving()) {
            this.x = this.setRangeMove(this.x, this.state.x);
            this.y = this.setRangeMove(this.y, this.state.y);
            this.scale.x = this.setRangeScale(this.scale.x, this.state.scale.x);
            this.scale.y = this.setRangeScale(this.scale.y, this.state.scale.y);
            this._frameMoving--;
        }
    }

    setRangeMove(current, state) {
        if (current !== state) {
            return parseInt((current * (this._frameMoving - 1) + state) / this._frameMoving);
        }
        return parseInt(current);
    }

    setRangeScale(current, state) {
        if (current !== state) {
            return parseFloat((current * (this._frameMoving - 1) + state) / this._frameMoving).toFixed(2);
        }
        return parseFloat(current).toFixed(2);
    }

    updateOpenness() {
        if (this.scale.x == 1 && this.isClose()) {
            this._openness = true;

        } else if (this.scale.x == 0 && this.isOpen()) {
            this._openness = false;

        }
    }

    updateActions() {
        if (this.hasActions() && this.noMoving() && this.noBusy()) {
            let action = this._actions.shift();

            this.takeAction(action);
        }
    }

    updatePoints() {
        if(this.state.ap !== this._AP || this.state.hp !== this._HP && this.isOpen()) {
            let speed = this._pointsSpeed || 1;

            for (let times = 1; times <= speed; times++) {
                this.updatePointsOnce();
            }

            this.refresh();
        }
    }

    updatePointsOnce() {
        if(this.state.ap > this._AP) {
            this._AP++;
        } else if (this.state.ap < this._AP) {
            this._AP--;
        } 

        if(this.state.hp > this._HP) {
            this._HP++;
        } else if (this.state.hp < this._HP) {
            this._HP--;
        }
    }

    updateSelected() {
        if(this.isSelect() && this.isOpen() && this.intervalCounter(8)) {
            this._layers.select.opacity = this._layers.select.opacity == 255 ? 128 : 255;
        }
    }

    intervalCounter(each) {
        return this._frameCounter % each == 0;
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
                this.setTimeMove(Action.duration || 100);
                break;
            case '_ACTIVE':
                this.activate();
                break;
            case '_INACTIVE':
                this.inactivate();
                break;
            case '_TURNUP':
                this.turnUp();
                break;
            case '_TURNDOWN':
                this.turnDown();
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
                this.setObservable(Action.subject || null);
                break;
            case '_TRIGGER':
                let actions = Action.actions;
                let next = this.parentIndex + 1;

                if(Action.limit <= next) return false;

                actions[0] = { 
                    type: '_WAIT', 
                    duration: 100 
                };

                Action.sprites[next].addActions(actions);

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

    setTimeMove(times) {
        this._frameMoving = 0.06 * times;
    }

    setTimeInterval(times) {
        this._frameInterval = 0.06 * times;
    }

}
