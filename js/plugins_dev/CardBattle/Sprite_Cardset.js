class Sprite_Cardset extends Sprite {
    constructor(Config) {
        super(Config);

    }

    initialize(Config) {
        super.initialize();

        this._cards = Config.cards || [];
        this._sprites = [];
        this._selections = [];
        this._colors = new Game_Colorset(Config.colors);

        // config actions
        this._active = Config.active || true;
        this._colorsCost = Config.colorsCost || true;
        this._enableSelect = Config.enableSelect || false;
        this._selectionsNumber = Config.selectionsNumber || 0;

        this.setup();

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

    getSpriteAt(index) {
        return this._sprites[index];
    }

    spritesAmount() {
        return this._sprites.length;
    }

    setup() {
        this.clearSprites();
        this.createSprites();
        this.addSprites();
    }

    initialCardsPosition() {

    }

    initialCardsStates() {

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
        if(this._active) {
            this.spriteActiveCost(card, sprite);
        } else {
            sprite.inactive();
        }
    }

    spriteActiveCost(card, sprite) {
        if(this._colorsCost) {
            this.activeColorCost(card, sprite);
        } else {
            sprite.active();
        }
    }

    activeColorCost(card, sprite) {
        if(this.hasColorCost(card)) {
            sprite.active();
        } else {
            sprite.inactive();
        }
    }

    hasColorCost(card) {
        return this.hasColorPoints(card.getColor(), card.getCost());
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

    openSetFaceUp(faceup = false) {
        this.addActionsTrigger([
            { type: '_FACEUP' },
            { type: '_REFRESH' },
            { type: '_SHOW' },
            { type: '_OPEN' },
        ]);
    }

    openSetFaceDown() {
        this.addActionsTrigger([
            { type: '_FACEDOWN' },
            { type: '_REFRESH' },
            { type: '_SHOW' },
            { type: '_OPEN' },
        ]);
    }

    addActions(order, Actions) {
        this._sprites[order].addActions(Actions);
    }

    addActionsAlls(Actions, params = { waitPrevius: false }) {
        this._sprites.forEach((sprite, index) => {
            let actionsCopy = Actions.clone();

            if(params.waitPrevius && index) {
                let subject = this.getSpriteAt(index - 1);

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

}
