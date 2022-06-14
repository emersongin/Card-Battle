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
