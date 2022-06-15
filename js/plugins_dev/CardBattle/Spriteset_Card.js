class Spriteset_Card extends Sprite {
    constructor(Config) {
        super(Config);

    }

    initialize(Config) {
        super.initialize();

        //attr
        this._paddingBetweenCards = Config.paddingBetweenCards || 2;
        this._contentCards = 612;

        // stores
        this._cards = Config.cards || [];
        this._sprites = [];
        this._selections = [];
        this._colors = new Game_Colorset(Config.colors);

        // config
        this._active = false;
        this._enableSelect = Config.enableSelect || false;
        this._selectionsNumber = Config.selectionsNumber || 0;
        this._selectionTargetIndex = -1;

        // states
        this.state = {
            selectionTargetIndex: 0,
        };
        
        // rules
        this._rules = {
            typeCardsOnly: Config.typeCardsOnly || 'none',
            colorsCost: Config.colorsCost || false,
        };

    }

    isActive() {
        return this._active;
    }

    isInactive() {
        return !this._active;
    }

    activate() {
        this._active = true;
        this.setup();
    }

    inactivate() {
        this._active = false;
    }

    isEnabledSelection() {
        return this._enableSelect;
    }

    isDisabledSelection() {
        return !this._enableSelect;
    }

    enableSelection() {
        this._enableSelect = true;
    }

    disableSelection() {
        this._enableSelect = false;
    }

    contentSize() {
        return this._contentCards;
    }

    paddingBetween() {
        return this._paddingBetweenCards;
    }

    setPaddingBetwwenCards(padding) {
        this._paddingBetweenCards = padding;
    }

    selectionIndex() {
        return this.state.selectionTargetIndex;
    }

    setStateSelectionIndex(index) {
        this.state.selectionTargetIndex = index;
    }

    cardset() {
        return this._cards;
    }

    indexCard(index) {
        return this._cards[index];
    }

    cardsAmount() {
        return this._cards.length;
    }

    spriteset() {
        return this._sprites;
    }

    setSpriteset(sprites) {
        return this._sprites = sprites;
    }

    indexSprite(index) {
        return this._sprites[index];
    }

    spritesAmount() {
        return this.spriteset().length;
    }

    spritesetHasActions() {
        if(this.spritesAmount()) {
            return this.spriteset().some(sprite => sprite.hasActions());
        }
        return false;
    }

    spritesetNoActions() {
        if(this.spritesAmount()) {
            return this.spriteset().every(sprite => sprite.noActions());
        }
        return false;
    }

    spritesetAreMoving() {
        if(this.spritesAmount()) {
            return this.spriteset().some(sprite => sprite.itsMoving());
        }
        return false;
    }

    spritesetNoMoving() {
        if(this.spritesAmount()) {
            return this.spriteset().every(sprite => sprite.noMoving());
        }
        return false;
    }
    
    spritesetAreBusy() {
        if(this.spritesAmount()) {
            return this.spriteset().some(sprite => sprite.itsBusy());
        }
        return false;
    }

    spritesetAreNoBusy() {
        if(this.spritesAmount()) {
            return this.spriteset().every(sprite => sprite.noBusy());
        }
        return false;
    }

    spritesetAreWaiting() {
        if(this.spritesAmount()) {
            return this.spriteset().every(sprite => sprite.waiting());
        }
        return false;
    } 

    setup() {
        this.clearSpriteset();
        this.createSpriteset();
        this.addSpriteset();
    }

    clearSpriteset() {
        while (this.spritesAmount()) {
            this.removeChild(this.spriteset().shift());
        }
    }

    createSpriteset() {
        if(this.cardsAmount()) {
            let sprites = this.cardset().map((card, index) => { 
                let sprite = new Sprite_Card(card);
                let coord = this.cardPosition(sprite, index);

                this.setSpriteActive(card, sprite);
                this.setSpriteXCoord(sprite, coord);
                this.setSpriteParentIndex(sprite, index);

                return sprite;
            });

            this.setSpriteset(sprites);
        }
    }

    addSpriteset() {
        if(this.spritesAmount()) {
            this._sprites.forEach((sprite, index) => {
                this.addChild(sprite);
            });
        }
    }

    cardPosition(sprite, count) {
        return (this.cardMargin() * count) + (sprite.width / 2);
    }

    cardMargin() {
        let amount = this.cardsAmount();
        let size = this.contentSize();
        let padding = this.paddingBetween();
        let space = (size - (padding * amount)) / amount;

        return parseInt((space < 102 ? space : 102) + padding);
    }

    setSpriteActive(card, sprite) {
        if(
            this.isActive() &&
            this.rulesCardTypeOnly(card) &&
            this.rulesCardColorCost(card) 
        ) {
            sprite.activate();

        } else {
            sprite.inactivate();

        }
    }

    rulesCardTypeOnly(card) {
        return this._rules.typeCardsOnly != 'none' ? this.isCardType(card) : true;
    }

    isCardType(card) {
        return card.type == this._rules.typeCardsOnly ? true : false;
    }

    rulesCardColorCost(card) {
        console.log(this._rules.colorsCost);
        return this._rules.colorsCost ? this.hasCardColorCost(card) : true;
    }

    hasCardColorCost(card) {
        return this.hasColorPoints(card.color, card.cost);
    }

    hasColorPoints(color, cost) {
        return this._colors.hasPoints(color, cost);
    }

    setSpriteXCoord(sprite, coord) {
        sprite.setXCoord(coord);
    }

    setSpriteYCoord(sprite, coord) {
        sprite.setYCoord(coord);
    }

    setSpriteParentIndex(sprite, index) {
        sprite.setParentIndex(index);
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

    // spriteset parallel actions
    addActionsAlls(Actions, params = { waitPrevius: false }) {
        this.spriteset().forEach((sprite, index) => {
            let actionsClone = Actions.clone();
            let previusIndex = (index - 1);

            if(index && params.waitPrevius) {
                let observable = this.indexSprite(previusIndex);

                actionsClone.unshift(
                    { type: '_WAITFOR', observable }
                ); 
            }

            sprite.addActions(actionsClone);
        });
    }

    // spriteset wait interval actions
    addActionsTrigger(Actions) {
        let actionsClone = Actions.clone();
        let spriteset = this.spriteset();
        let limit = this.spritesAmount();
        let startSprite = spriteset[0];

        actionsClone.unshift(
            { type: '_WAIT' }, 
            { 
                type: '_TRIGGER', 
                spriteset, 
                triggerActions: actionsClone, 
                limit 
            }
        ); 

        startSprite.addActions(actionsClone);
    }

    update() {
        super.update();

        if(
            this.isActive() && 
            this.spritesetNoActions() && 
            this.spritesetAreWaiting() && 
            this.spritesetAreNoBusy()
        ) {
            this.updateSelection();

        }

    }

    updateSelection() {
        if(this.isEnabledSelection()) {
            this.updateSelector();
            this.updateSpriteSelected();
            
        }
    }

    updateSelector() {
        let index = this.selectionIndex();
        
        if(index > 0 && Input.isTriggered('left')) {
            this.setStateSelectionIndex(index - 1);

        } else if (index < (this.spritesAmount() - 1) && Input.isTriggered('right')) {
            this.setStateSelectionIndex(index + 1);

        }
    }

    updateSpriteSelected() {
        if(this._selectionTargetIndex !== this.state.selectionTargetIndex) {
            this.unselectSprite(this._selectionTargetIndex);
            this.selectSprite(this.state.selectionTargetIndex);
            this._selectionTargetIndex = this.state.selectionTargetIndex;

        }
    }

    selectSprite(index) {
        const sprite = this.indexSprite(index);

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
        const sprite = this.indexSprite(index);

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

}
