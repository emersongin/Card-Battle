class Sprite_Card extends Sprite_Base {
    constructor(Game_Card) {
        super(Game_Card);

    }

    initialize(Game_Card) {
        super.initialize();

        // states
        this.state = {
            ap: Game_Card.ap || 0,
            hp: Game_Card.hp || 0,
            x: this.x,
            y: this.y,
            scale: new Point(0, this.scale.y),
            zoom: new Point(1, 1),
        };

        // attributes
        this._AP = Game_Card.ap || 0;
        this._HP = Game_Card.hp || 0;
        this._color = Game_Card.color || Game_CardColor.BROWN;
        this._type = Game_Card.type || Game_CardType.NONE;
        this._file = Game_Card.file || 'index';

        // config
        this._hiding = true;
        this._openness = false
        this._zoom = '_NORMAL';
        this._status = false;
        this._face = false;
        this._selection = false;

        // external state 
        this.parentIndex = 0;
        this.scale.x = 0;

        // counters
        this._frameCounter = 0;
        this._frameInterval = 0;
        this._frameMoving = 0;

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
            animation: new Sprite_Base()
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

    setXCoord(coord) {
        this.x = coord;
        this.setStateXCoord(coord);
    }

    setYCoord(coord) {
        this.y = coord;
        this.setStateYCoord(coord);
    }

    moveTo(xCoord = this.x, yCoord = this.y) {
        this.moveXCoord(xCoord);
        this.moveYCoord(yCoord);
    }

    moveXCoord(coord) {
        this.setStateXCoord(coord);
    }

    moveYCoord(coord) {
        this.setStateYCoord(coord);
    }

    isOpen() {
        return this._openness;
    }
    
    isClose() {
        return !this._openness;
    }

    open() {
        if (this.isClose()) {
            this.setStateXCoord(this.x - (this.cardWidth() / 2));
            this.setStateXScale(1);
        }
    }
    
    close() {
        if (this.isOpen()) {
            this.setStateXCoord(this.x + (this.cardWidth() / 2));
            this.setStateXScale(0);
        }
    }

    itsZoomPlus() {
        return this._zoom === '_PLUS';
    }

    itsZoomNormal() {
        return this._zoom === '_NORMAL';
    }

    itsNoZoom() {
        return this._zoom === '_NO';
    }

    increaseZoom() {
        if (this.itsZoomNormal()) {
            this.setStateXCoord(this.x - 16);
            this.setStateYCoord(this.y - 16);
            this.setStateXScale(1.25);
            this.setStateYScale(1.25);

        } else if (this.itsNoZoom()) {
            this.setStateXCoord(this.x - 72);
            this.setStateYCoord(this.y - 72);
            this.setStateXScale(1.25);
            this.setStateYScale(1.25);

        }
    }

    normalZoom() {
        if (this.itsZoomPlus()) {
            this.setStateXCoord(this.x + 16);
            this.setStateYCoord(this.y + 16);
            this.setStateXScale(1);
            this.setStateYScale(1);

        } else if (this.itsNoZoom()) {
            this.setStateXCoord(this.x - 56);
            this.setStateYCoord(this.y - 56);
            this.setStateXScale(1);
            this.setStateYScale(1);

        }
    }

    decreaseZoom() {
        if (this.itsZoomPlus()) {
            this.setStateXCoord(this.x + 72);
            this.setStateYCoord(this.y + 72);
            this.setStateXScale(0);
            this.setStateYScale(0);

        } else if (this.itsZoomNormal()) {
            this.setStateXCoord(this.x + 56);
            this.setStateYCoord(this.y + 56);
            this.setStateXScale(0);
            this.setStateYScale(0);

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

    setStateAttackPoints(points) {
        this.state.ap = points;
    }

    setStateHealthPoints(points) {
        this.state.hp = points;
    }

    setStateXCoord(coord) {
        this.state.x = coord;
    }

    setStateYCoord(coord) {
        this.state.y = coord;
    }

    setStateXScale(scale) {
        this.state.scale.x = scale;
    }

    setStateYScale(scale) {
        this.state.scale.y = scale;
    }

    setStateXScaleZoom(scale) {
        this.state.zoom.x = scale;
    }

    setStateYScaleZoom(scale) {
        this.state.zoom.y = scale;
    }

    createLayers() {
        this.createBackground();
        this.createCaption();
        this.createShadow();
        this.createSelection();
        this.createAnimation();
    }

    addLayers() {
        this.addChild(this._layers.background);
        this.addChild(this._layers.figure);
        this.addChild(this._layers.caption);
        this.addChild(this._layers.shadow);
        this.addChild(this._layers.select);
        this.addChild(this._layers.animation);
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

    createAnimation() {
        this._layers.animation.setFrame(0, 0, this.cardWidth(), this.cardHeight());
        this._layers.animation.bitmap = new Bitmap(this.cardWidth(), this.cardHeight());
        this._layers.animation.opacity = 0;

    }

    startAnimation(animation, mirror, delay) {
        let sprite = new Sprite_CardAnimation();
        
        sprite.setup(this._layers.animation, animation, mirror, delay);
        this.parent.addChild(sprite);
        this._animationSprites.push(sprite);
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
            this.updateZoom();

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

    updateZoom() {
        if (
            (this.scale.x == 1.25 && this.scale.y == 1.25) && 
            (this.itsZoomNormal() || this.itsNoZoom())
        ) {
            this._zoom = '_PLUS';

        } else if (
            (this.scale.x == 1 && this.scale.y == 1) &&  
            (this.itsZoomPlus() || this.itsNoZoom())
        ) {
            this._zoom = '_NORMAL';

        } else if (
            (this.scale.x == 0 && this.scale.y == 0) &&
            (this.itsZoomPlus() || this.itsZoomNormal())
        ) {
            this._zoom = '_NO';

        }
    }

    updateActions() {
        if (this.hasActions() && this.noMoving() && this.noBusy()) {
            let action = this._actions.shift();

            this.takeAction(action);
        }
    }

    updatePoints() {
        let absAttackPoints = Math.abs((this.state.ap - this._AP));
        let absHealthPoints = Math.abs((this.state.hp - this._HP));

        if((absAttackPoints || absHealthPoints) && this.isOpen()) {
            let speed = this.updatePointsSpeed(absAttackPoints, absHealthPoints) || 1;

            for (let times = 1; times <= speed; times++) {
                this.updatePointsOnce();
            }

            this.refresh();
        }
    }

    updatePointsSpeed(attackPoints, healthPoints) {
        if(attackPoints > healthPoints) {
            return Math.ceil(attackPoints / 8);
        } else {
            return Math.ceil(healthPoints / 8);
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
                this.open();
                this.setTimeMove(Action.duration || 200);

                break;
            case '_CLOSE':
                this.close();
                this.setTimeMove(Action.duration || 200);

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
            case '_INCREASE':
                this.increaseZoom();
                this.setTimeMove(Action.duration || 200);

                break;
            case '_NORMAL':
                this.normalZoom();
                this.setTimeMove(Action.duration || 200);

                break;
            case '_DECREASE':
                this.decreaseZoom();
                this.setTimeMove(Action.duration || 200);

                break;
            case '_REFRESH':
                this.refresh();

                break;
            case '_ANIMATION':
                let animation = $dataAnimations[Action.animationIndex];

                Action.duration = this.animationFramesduration(animation.frames.length);

                this.startAnimation(animation);

                break;
            case '_FLASH':   
                let flash = this.flashAnimation();

                Action.duration = this.animationFramesduration(flash.frames.length);

                this.startAnimation(flash);

                break;
            case '_WAITFOR':
                this.setObservable(Action.observable || null);

                break;
            case '_TRIGGER':
                this.setObservable(Action.observable || null);

                break;
            case '_REACT':
                let observables = Action.observables;
                let actions = Action.reactions;

                if(Array.isArray(observables)) {
                    observables.forEach(observable => {
                        observable.addActions(actions);
                    });

                } else {
                    observables.addActions(actions);

                }

                break;
            case '_SELECTED':
                this.selected();

                break;
            case '_UNSELECTED':
                this.unselected();

                break;
            case '_CHECKED':
                // this.checked();

                break;
            case '_UNCHECKED':
                // this.unchecked();

                break;
            case '_MOVEUP':
                this.moveTo(this.x, this.y - 20);
                this.setTimeMove(Action.duration || 60);

                break;
            case '_MOVEDOWN':
                this.moveTo(this.x, this.y + 20);
                this.setTimeMove(Action.duration || 60);

                break;
            case '_POINTS':
                this.setStateAttackPoints(Action.attack === this._AP ? this._AP : Action.attack);
                this.setStateHealthPoints(Action.health === this._HP ? this._HP : Action.health);

                break;
            case '_WAIT':
                //waiting...
                break;
            // case 'MOVE_LEFT':
            //     this.left(action.times);
            //     break;
            // case 'MOVE_RIGHT':
            //     this.right(action.times);
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
            // case 'TRIGGERED':
            //     this.triggered();
            //     break;
            // case 'NOT_TRIGGERED':
            //     this.notTriggered();
            //     break;
        }

        this.setTimeInterval(Action.duration || 1);
    }

    flashAnimation() {
        return {
            name: "Flash",
            frames: new Array(5).fill([]),
            timings: [
                {
                    flashColor: [255, 255, 255, 255],
                    flashDuration: 4,
                    flashScope: 1,
                    frame: 0,
                    se: {
                        // name: "Thunder3", 
                        // pan: 0, 
                        // pitch: 85, 
                        // volume: 100,
                    }
                }
            ]
        };
    }

    animationFramesduration(framesAmount) {
        return ((((framesAmount * 4) + 1) * 1000) / 60);
    }

    setTimeMove(times) {
        this._frameMoving = 0.06 * times;
    }

    setTimeInterval(times) {
        this._frameInterval = 0.06 * times;
    }

}
