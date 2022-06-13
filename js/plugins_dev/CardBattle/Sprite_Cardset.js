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
        this._enableSelect = Config.enableSelect || true;
        this._selectionsNumber = Config.selectionsNumber || 0;
        this._selectionIndexAt = 0;
        this._stateSelectionIndexAt = -1;

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
        return this._selectionIndexAt;
    }

    setSelectIndex(index) {
        this._selectionIndexAt = index;
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

    spritesNotActions() {
        if(this.spritesAmount()) {
            return this.spriteset().every(sprite => sprite.notActions());
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

    spritesAreNotBusy() {
        if(this.spritesAmount()) {
            return this.spriteset().every(sprite => sprite.notBusy());
        }
        return false;
    }

    spritesNoWaiting() {
        if(this.spritesAmount()) {
            return this.spriteset().every(sprite => sprite.noWaiting());
        }
        return false;
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
        if(this.isActive()) {
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

    openSetFaceUp() {
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

        if(this.isActive() && this.spritesNotActions() && 
            this.spritesAreWaiting() && this.spritesAreNotBusy()) {

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
            sprite.selected();
            sprite.refresh();
        }
    }

    unselectSprite(index) {
        const sprite = this.spriteAt(index);

        if(sprite) {
            sprite.unselected();
            sprite.refresh();
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
        if(this._selectionIndexAt !== this._stateSelectionIndexAt) {
            this.unselectSprite(this._stateSelectionIndexAt);
            this.selectSprite(this._selectionIndexAt);
            this._stateSelectionIndexAt = this._selectionIndexAt;
        }
    }
    
}
