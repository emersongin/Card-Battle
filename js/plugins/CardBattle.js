// bundle-js .\js\plugins_dev\CardBattle\index.js --dest .\js\plugins\CardBattle.js --disable-beautify

//=============================================================================
// CardBattle.js
//=============================================================================

/*:
 * @plugindesc New Scene Gamge to Card Battle Game.
 * @author Emerson Andrey
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {
ImageManager.reserveBattlecards  = function (filename, hue, reservationId) {
    return this.reserveBitmap('img/battlecards/', filename, hue, true, reservationId);
};

ImageManager.requestBattlecards = function (filename, hue) {
    return this.requestBitmap('img/battlecards/', filename, hue, true);
};

ImageManager.loadBattlecards  = function (filename, hue) {
    return this.loadBitmap('img/battlecards/', filename, hue, false);
};

function Game_CardColor() {
    throw new Error('This is a static class');
}

Game_CardColor.WHITE = "white";
Game_CardColor.BLUE = "blue";
Game_CardColor.GREEN = "green";
Game_CardColor.RED = "red";
Game_CardColor.BLACK = "black";
Game_CardColor.BROWN = "brown";

class Game_Colorset {
    constructor(Colors = {}) {
        this.white = Colors.white || 0;
        this.blue = Colors.blue || 0;
        this.green = Colors.green || 0;
        this.red = Colors.red || 0;
        this.black = Colors.black || 0;

    }

    hasPoints(colorName, points = 0) {
        if(colorName === 'brown') return true;

        return this[colorName] >= points;
    }

}

function Game_CardType() {
    throw new Error('This is a static class');
}

Game_CardType.BATTLE = "battle";
Game_CardType.POWER = "power";
Game_CardType.NONE = "none";

class Game_Card {
    constructor(Card = {}) {
        this._card = Card;
        //
        this.ap = Card.ap;
        this.hp = Card.hp;
        this.color = Card.color;
        this.type = Card.type;
        this.file = Card.file;
        this.cost = Card.cost || 0;

    }

    reset() {
        this.ap = this._card.ap;
        this.hp = this._card.hp;
        this.color = this._card.color;
        this.type = this._card.type;
        this.file = this._card.file;
        this.cost = this._card.cost || 0;
        
    }

}

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
        };

        // attributes
        this._AP = Game_Card.ap || 0;
        this._HP = Game_Card.hp || 0;
        this._color = Game_Card.color || Game_CardColor.BROWN;
        this._type = Game_Card.type || Game_CardType.NONE;
        this._file = Game_Card.file || 'index';

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

    moveTo(coordX = this.x, coordY = this.y) {
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
            case '_SELECTED':
                this.selected();

                break;
            case '_UNSELECTED':
                this.unselected();

                break;
            case '_MOVEUP':
                this.moveTo(this.x, this.y - 20);
                this.setTimeMove(Action.duration || 60);

                break;
            case '_MOVEDOWN':
                this.moveTo(this.x, this.y + 20);
                this.setTimeMove(Action.duration || 60);

                break;
            case '_WAIT':
                break;
            // case 'PLUS':
            //     this.plus(action.times);
            //     break;
            // case 'LESS':
            //     this.less(action.times);
            //     break;
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

class Spriteset_Card extends Sprite {
    constructor(Config) {
        super(Config);

    }

    initialize(Config) {
        super.initialize();

        // state
        this.state = {
            selectionIndex: -1,
        };

        this._cards = Config.cards || [];
        this._sprites = [];
        this._selections = [];
        this._colors = new Game_Colorset(Config.colors);

        // config actions
        this._active = Config.active || true;
        this._colorsCost = Config.colorsCost || true;
        this._enableSelect = Config.enableSelect || true;
        this._selectionsNumber = Config.selectionsNumber || 0;
        this._selectionIndex = 0;

        this.setup();

    }

    isActive() {
        return this._active;
    }

    isSelectionEnabled() {
        return this._enableSelect;
    }

    contentSize() {
        return 612;
    }
    
    paddingBetween() {
        return 2;
    }

    cardsAmount() {
        return this._cards.length;
    }

    selectIndex(index) {
        return this._selectionIndex;
    }

    setSelectIndex(index) {
        this._selectionIndex = index;
    }

    spriteAt(index) {
        return this._sprites[index];
    }

    spriteset() {
        return this._sprites;
    }

    spritesAmount() {
        return this.spriteset().length;
    }

    spritesHasActions() {
        if(this.spritesAmount()) {
            return this.spriteset().some(sprite => sprite.hasActions());
        }
        return false;
    }

    spritesNoActions() {
        if(this.spritesAmount()) {
            return this.spriteset().every(sprite => sprite.noActions());
        }
        return false;
    }

    spritesAreMoving() {
        if(this.spritesAmount()) {
            return this.spriteset().some(sprite => sprite.itsMoving());
        }
        return false;
    }
    
    spritesAreWaiting() {
        if(this.spritesAmount()) {
            return this.spriteset().every(sprite => sprite.waiting());
        }
        return false;
    } 
    
    spritesAreBusy() {
        if(this.spritesAmount()) {
            return this.spriteset().some(sprite => sprite.itsBusy());
        }
        return false;
    }

    spritesAreNoBusy() {
        if(this.spritesAmount()) {
            return this.spriteset().every(sprite => sprite.noBusy());
        }
        return false;
    }

    spritesNoMoving() {
        if(this.spritesAmount()) {
            return this.spriteset().every(sprite => sprite.noMoving());
        }
        return false;
    }

    setup() {
        this.clearSprites();
        this.createSprites();
        this.addSprites();
    }

    clearSprites() {
        while (this.spritesAmount()) {
            this.removeChild(this._sprites.shift());
        }
    }

    createSprites() {
        if(this.cardsAmount()) {
            this._sprites = this._cards.map((card, index) => { 
                let sprite = new Sprite_Card(card);
                let coord = this.cardPosition(sprite, index);

                this.setSpriteActive(card, sprite);
                this.setSpriteXCoord(sprite, coord);
                this.setSpriteParentIndex(sprite, index);

                return sprite;
            });
        }
    }

    setSpriteActive(card, sprite) {
        if(this.isActive()) {
            this.spriteActiveCost(card, sprite);
        } else {
            sprite.inactivate();
        }
    }

    spriteActiveCost(card, sprite) {
        if(this._colorsCost) {
            this.activeColorCost(card, sprite);
        } else {
            sprite.activate();
        }
    }

    activeColorCost(card, sprite) {
        if(this.hasColorCost(card)) {
            sprite.activate();
        } else {
            sprite.inactivate();
        }
    }

    hasColorCost(card) {
        return this.hasColorPoints(card.color, card.cost);
    }

    hasColorPoints(color, cost) {
        return this._colors.hasPoints(color, cost);
    }

    setSpriteXCoord(sprite, coord) {
        sprite.setCoordX(coord);
    }

    setSpriteParentIndex(sprite, index) {
        sprite.setParentIndex(index);
    }

    cardPosition(sprite, count) {
        return (this.margin() * count) + (sprite.width / 2);
    }

    margin() {
        let amount = this.cardsAmount();
        let size = this.contentSize();
        let padding = this.paddingBetween();
        let space = (size - (padding * amount)) / amount;

        return parseInt((space < 102 ? space : 102) + padding);
    }

    addSprites() {
        if(this.spritesAmount()) {
            this._sprites.forEach((sprite, index) => {
                this.addChild(sprite);
            });
        }
    }

    openSetUp() {
        this.addActionsTrigger([
            { type: '_TURNUP' },
            { type: '_REFRESH' },
            { type: '_SHOW' },
            { type: '_OPEN' },
        ]);
    }

    openSetDown() {
        this.addActionsTrigger([
            { type: '_TURNDOWN' },
            { type: '_REFRESH' },
            { type: '_SHOW' },
            { type: '_OPEN' },
        ]);
    }

    addActionsAlls(Actions, params = { waitPrevius: false }) {
        this._sprites.forEach((sprite, index) => {
            let actionsCopy = Actions.clone();

            if(params.waitPrevius && index) {
                let subject = this.spriteAt(index - 1);

                actionsCopy.unshift({ 
                    type: '_WAITFOR', 
                    subject 
                }); 
            }

            sprite.addActions(actionsCopy);
        });
    }

    addActionsTrigger(Actions) {
        let actionsCopy = Actions.clone();
        let sprites = this._sprites;
        let limit = sprites.length;

        actionsCopy.unshift(
            { type: '_WAIT' }, 
            { 
                type: '_TRIGGER', 
                sprites, 
                actions: actionsCopy, 
                limit 
            }
        ); 

        this._sprites[0].addActions(actionsCopy);
    }

    update() {
        super.update();

        if(this.isActive() && this.spritesNoActions() && 
            this.spritesAreWaiting() && this.spritesAreNoBusy()) {

            this.updateSelection();

        }

    }

    updateSelection() {
        if(this.isSelectionEnabled()) {
            this.updateSelector();
            this.updateSpriteSelected();
            
        }
    }

    selectSprite(index) {
        const sprite = this.spriteAt(index);

        if(sprite) {
            this.removeChild(sprite);
            this.addChild(sprite);
            sprite.addActions([
                { type: '_SELECTED' },
                { type: '_REFRESH' },
                { type: '_MOVEUP' },
            ]);
        }
    }

    unselectSprite(index) {
        const sprite = this.spriteAt(index);

        if(sprite) {
            this.removeChild(sprite);
            this.addChildAt(sprite, index);
            sprite.addActions([
                { type: '_UNSELECTED' },
                { type: '_REFRESH' },
                { type: '_MOVEDOWN' },
            ]);
        }
    }

    updateSelector() {
        let index = this.selectIndex();
        
        if(index > 0 && Input.isTriggered('left')) {
            this.setSelectIndex(index - 1);

        } else if (index < (this.spritesAmount() - 1) && Input.isTriggered('right')) {
            this.setSelectIndex(index + 1);

        }
    }

    updateSpriteSelected() {
        if(this._selectionIndex !== this.state.selectionIndex) {
            this.unselectSprite(this.state.selectionIndex);
            this.selectSprite(this._selectionIndex);
            this.state.selectionIndex = this._selectionIndex;
        }
    }
    
}

class Sprite_Background extends Sprite {
    constructor(Bitmap) {
        super(Bitmap);
    }

    initialize(Bitmap) {
        super.initialize();

        this._active = false;
        this._sprites = [];
        this._limite = 624;
        this._speed = 1;

        this.createSpritesParallax();

    }

    activate() {
        this._baseSprite.visible = true;
        this._active = true;
    }

    deactivate() {
        this._baseSprite.visible = false;
        this._active = false;
    }

    createSpritesParallax() {
        const images = [
            { x: 0, y: 0, name: 'BlueSky' },
            { x: -this._limite, y: 0, name: 'BlueSky' },
            { x: 0, y: -this._limite, name: 'BlueSky' },
            { x: -this._limite, y: -this._limite, name: 'BlueSky' },
        ];

        this._baseSprite = new Sprite();
        this._baseSprite.visible = false;

        for (const image of images) {
            let sprite = new Sprite(ImageManager.loadParallax(image.name));

            sprite.initPositionX = image.x;
            sprite.initPositionY = image.y;

            sprite.move(sprite.initPositionX, sprite.initPositionY);
            
            this._sprites.push(sprite);
            this._baseSprite.addChild(sprite);
        }

        this.addChild(this._baseSprite);
    }

    update() {
        super.update();
        this.updateSprites();
    }

    updateSprites() {
        if(this._active) {
            this._sprites.forEach(sprite => {
                let x = sprite.x + this._speed;
                let y = sprite.y + this._speed;
    
                if(x >= (sprite.initPositionX + this._limite)) x = x - this._limite;
                if(y >= (sprite.initPositionY + this._limite)) y = y - this._limite;
    
                sprite.move(x, y);
    
            });
        }

    }
    
}

class Sprite_Intro extends Sprite {
    constructor() {
        super();
    }

    initialize() {
        super.initialize();

        this._active = false;
        this._speed = 6;
        this._picture = null;
        this._clearRectangle = null;
        this._blackRectangles = [];
        
        this.bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
        
        this.createPicture();

    }

    activate() {
        this.createClearRect();
        this.createBlackRects();
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    createClearRect() {
        this._clearRectangle = {
            x: 0, y: 0,
            width: Graphics.boxWidth,
            height: Graphics.boxHeight
        };
    }

    createBlackRects() {
        this._blackRectangles = [
            { 
                x: Graphics.boxWidth, 
                y: 0, 
                color: 'black', 
                direction: 'left',
                width: Graphics.boxWidth, 
                height: Graphics.boxHeight 
            },
            { 
                x: - Graphics.boxWidth, 
                y: 0, 
                color: 'black', 
                direction: 'right',
                width: Graphics.boxWidth, 
                height: Graphics.boxHeight 
            }
        ];

    }

    createPicture() {
        const image = { name: 'Ocean1' };

        this._picture = ImageManager.loadParallax(image.name);

    }

    update() {
        if (this._active) {
            let rect = this._clearRectangle;

            super.update();
            this.refresh();
            this.updateClearRectangle();

            if (rect.x >= (Graphics.boxWidth / 2) || rect.y >= (Graphics.boxHeight / 2) ) {
                this.refresh({ clearRect: false, blackReacts: true });
                this.updateBlackRectangles();

                if(this._blackRectangles[0].x <= 0) this.deactivate();
            }

        }

    }

    updateClearRectangle() {
        this._clearRectangle.x = this._clearRectangle.x + this._speed;
        this._clearRectangle.y = this._clearRectangle.y + this._speed;
        this._clearRectangle.width = this._clearRectangle.width - (this._speed * 2);
        this._clearRectangle.height = this._clearRectangle.height - (this._speed * 2);
    }

    updateBlackRectangles() {
        this._blackRectangles.forEach(rect => {
            rect.x = rect.direction == 'left' ? rect.x - (this._speed * 2) : rect.x + (this._speed * 2);
        });
    }

    refresh(params = { clearRect: true, blackReacts: false }) {
        let rect = this._clearRectangle;

        this.bitmap.clear();
        this.bitmap.blt(this._picture, 0, 0, Graphics.boxWidth, Graphics.boxHeight, 0, 0);
        if (params.clearRect) this.bitmap.clearRect(rect.x, rect.y, rect.width, rect.height);

        if (params.blackReacts) {
            this._blackRectangles.forEach(rect => {
                this.bitmap.fillRect(rect.x, rect.y, rect.width, rect.height, rect.color);
            });
        }

    }

}

class Spriteset_CardBattle extends Spriteset_Base {
    constructor() {
        super();
    }

    initialize() {
        super.initialize();

        this._backgroundSnap = null;
        this._background = null;
        this._layerIntro = null;

    }

    createLowerLayer() {
        super.createLowerLayer();
        this.createSnapBackground();
        this.createIntro();
        this.createBackground();
    }

    createSnapBackground() {
        this._backgroundSnap = new Sprite();
        this._backgroundSnap.bitmap = SceneManager.backgroundBitmap();
        this._baseSprite.addChild(this._backgroundSnap);

    }

    createIntro() {
        this._layerIntro = new Sprite_Intro();
        this._baseSprite.addChild(this._layerIntro);

    }
    
    createBackground() {
        this._background = new Sprite_Background();
        this._baseSprite.addChild(this._background);

    }

}
 
class Window_Title extends Window_Base {
    constructor() {
        super();

    }

    initialize() {
        const width = Graphics.boxWidth;
        const height = this.fittingHeight(1);

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

    setTextColor(wheel) {
        this.contents.textColor = this.textColor(wheel) || this.textColor(0);
    }

    refresh() {
        this.contents.clear();
        this.drawText(this._text, 0, 0, this.width, this._alignText);
    }

}

class Window_FoldersCommand extends Window_Command {
    constructor() {
        super();

    }

    initialize() {
        const y = this.windowHeight() / 2;

        super.initialize(0, y);
        this.openness = 0;
        this.action = 'OPTION_FOLDER_';
        this.deactivate();

    }

    open() {
        this.refresh();
        this.activate();
        super.open();

    }
    
    windowWidth() {
        return Graphics.boxWidth;
    }

    windowHeight() {
        return Graphics.boxHeight / 2;
    }
    
    numVisibleRows() {
        return 3;
    }

    itemHeight() {
        return Math.floor((this.height - (this.padding * 2)) / this.numVisibleRows());
    }

    makeCommandList() {
        for (const folder of [
            {id: 1, name: 'folder 1'},
            {id: 2, name: 'folder 2'},
            {id: 3, name: 'folder 3'},
        ]) {
            this.addCommand(folder.name, `${this.action}${folder.id}`);
        }
    }

    drawItem(index) {
        let rect = this.itemRectForText(index);
        let yColorItems = rect.y + this.itemHeight() / 2;

        this.drawTextEx(this.commandName(index), rect.x, rect.y);
        this.drawTextEx(this.drawColorsItems(index), rect.x, yColorItems);

    }

    drawColorsItems(index) {
        let items = [
            { id: 1, value: 0 },
            { id: 2, value: 0 },
            { id: 3, value: 0 },
        ];

        let label = '';
        let indexIcon = 20;

        for (const [index, item] of items.entries()) {
            let space = index > 0 ? ' ' : '';
            let value = item.value.toString().padZero(2);

            label += `${space}\\I[${indexIcon}] ${value}`;

            indexIcon++;
        }

        return label;
    }
}

class Window_MessageCardBattle extends Window_Base {
    constructor() {
        super();

    }

    initialize() {
        const width = Graphics.boxWidth;
        const height = this.fittingHeight(2);

        super.initialize(0, 0, width, height);
        this.openness = 0;
        this._text = '';
        this._color = '';
        this._alignText = 'left';

    }

    align(position = 'start') {
        switch (position) {
            case 'top':
                this.move(0, 0, this.width, this.height);
                break;
            case 'center-top':
                this.move(0, (Graphics.boxHeight / 4 * 1), this.width, this.height);
                break;
            case 'center':
                this.move(0, (Graphics.boxHeight / 2), this.width, this.height);
                break;
            case 'center-bottom':
                this.move(0, (Graphics.boxHeight / 4 * 3), this.width, this.height);
                break;
            case 'bottom':
                this.move(0, (Graphics.boxHeight - this.height), this.width, this.height);
                break;
        }
    }

    setLinesText(textLine1 = '', textLine2 = '') {
        this._text = `${this._color}${textLine1}\n${textLine2}`;
        this.refresh();
    }

    clearTexts() {
        this._text = '';
    }

    setTextColor(wheel) {
        this._color = `\\c[${wheel}]`;
    }
    
    refresh() {
        this.contents.clear();
        this.drawTextEx(this._text, 0, 0);
    }

}

class Scene_CardBattle extends Scene_Base {
    constructor() {
        super();
        this._spriteset = null;
        this._titleWindow = null;
        this._messageWindow = null;
        this._foldersWindow = null;

    }

    create() {
        super.create();
        this.createDisplayObjects();
        
    }

    createDisplayObjects() {
        this.createSpriteset();
        this.createWindowLayer();
        this.createAllWindows();
    }

    createSpriteset() {
        this._spriteset = new Spriteset_CardBattle();
        this.addChild(this._spriteset);
        
        this.testCardBattle();
    }

    testCardBattle() {
        let cards = [
            new Game_Card({ap: 50,hp: 50,color: Game_CardColor.WHITE,type: Game_CardType.BATTLE, file: 'example', cost: 1}),
            new Game_Card({ap: 99,hp: 999,color: Game_CardColor.BLUE,type: Game_CardType.POWER, file: 'example'}),
            new Game_Card({ap: 99,hp: 999,color: Game_CardColor.GREEN,type: Game_CardType.NONE, file: 'example'}),
            new Game_Card({ap: 99,hp: 999,color: Game_CardColor.RED,type: Game_CardType.BATTLE, file: 'example', cost: 3}),
            new Game_Card({ap: 99,hp: 999,color: Game_CardColor.BLACK,type: Game_CardType.BATTLE, file: 'example'}),
            new Game_Card({ap: 99,hp: 999,color: Game_CardColor.BROWN,type: Game_CardType.BATTLE, file: 'example', cost: 0}),
        ];

        for (let i = 2; i <= 10; i++) {
            let card = new Game_Card({ap: 99,hp: 99,color: Game_CardColor.WHITE,type: Game_CardType.BATTLE, file: 'example'});
            cards.push(card);
        }

        let cardSet = new Spriteset_Card({ cards });

        cardSet.move(40, 250);

        this.addChild(cardSet);

        cardSet.openSetUp();

        // cardSet.addActions(9, [
        //     { type: '_ACTIVE' },
        //     { type: '_FACEUP' },
        //     { type: '_REFRESH' },
        //     { type: '_SHOW' },
        //     { type: '_OPEN' },
        // ]);

        // cardSet.addActions(10, [
        //     { type: '_WAITFOR', subject: cardSet.spriteAt(9) },
        //     { type: '_ACTIVE' },
        //     { type: '_FACEUP' },
        //     { type: '_REFRESH' },
        //     { type: '_SHOW' },
        //     { type: '_OPEN' },
        // ]);

        // cardSet.addActionsAlls([
        //     // { type: '_WAIT', duration: 2000 },
        //     { type: '_ACTIVE' },
        //     { type: '_FACEUP' },
        //     { type: '_REFRESH' },
        //     { type: '_SHOW' },
        //     { type: '_OPEN' },
        // ], { waitPrevius: true });

        // this._c0 = cardSet.spriteAt(0);
        // this._c1 = cardSet.spriteAt(1);
        

    }

    createAllWindows() {
        this.createTitleWindow();
        this.createMessageWindow();
        this.createFoldersCommandWindow();

    }

    createTitleWindow() {
        this._titleWindow = new Window_Title();
        this.addWindow(this._titleWindow);

        // this._titleWindow.align('center-top');
        // this._titleWindow.setTextColor(1);
        // this._titleWindow.setText('Choose a folder');

        // this._titleWindow.open();
        
    }

    createMessageWindow() {
        this._messageWindow = new Window_MessageCardBattle();
        this.addWindow(this._messageWindow);

        // this._messageWindow.align('center');
        // this._messageWindow.setTextColor(1);
        // this._messageWindow.setLinesText('Emerson Andrey', '29');

        // this._messageWindow.open();
    }

    createFoldersCommandWindow() {
        this._foldersWindow = new Window_FoldersCommand();
        this.addWindow(this._foldersWindow);

        // this._foldersWindow.setHandler(this._foldersWindow.action + 1, () => this.action('1'));
        // this._foldersWindow.setHandler(this._foldersWindow.action + 2, () => this.action('2'));
        // this._foldersWindow.setHandler(this._foldersWindow.action + 3, () => this.action('3'));

        // this._foldersWindow.open();

    }

    action(text) {
        this._foldersWindow.close();
    }

    start() {
        super.start();
    }

    update() {
        super.update();

    }

    stop() {
        super.stop();
    }
    
    terminate() {
        super.terminate();
    }
}
 

const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === 'CardBattle') {
        SceneManager.goto(Scene_CardBattle);
        
    }
};
 
Scene_Boot.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
        DataManager.setupBattleTest();
        SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
        DataManager.setupEventTest();
        SceneManager.goto(Scene_Map);
    } else {
        this.checkPlayerLocation();
        DataManager.setupNewGame();

        SceneManager.goto(Scene_CardBattle);
        
        Window_TitleCommand.initCommandPosition();
    }
    this.updateDocumentTitle();
};


})();


