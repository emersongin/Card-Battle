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
        this._activete = Config.active || true;
        this._selectionColorsCost = Config.selectionColorsCost || false;
        this._enableSelect = Config.enableSelect || false;
        this._selectionsNumber = Config.selectionsNumber || 0;

        this.setup();

    }

    contentSize() {
        return 102 * 6;
    }
    
    paddingBetween() {
        return 2;
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
        if(this.children.length) {
            for (const child of this.children) {
                this.removeChild(child);
            }
        }

        this._sprites = [];
    }

    cardsAmount() {
        return this._cards.length;
    }

    spritesAmount() {
        return this._sprites.length;
    }

    createSprites() {
        if(this.cardsAmount()) {
            this._sprites = this._cards.map((card, index) => { 
                let sprite = new Sprite_Card(card);

                if(index) this.cardPosition(sprite, index);
                sprite.scale.x = 0;
                sprite.x += 51;

                return sprite;
            });
        }
    }

    cardPosition(sprite, index) {
        let margin = this.cardMargin() * index;
        sprite.x = margin;
        sprite._mirrorX = margin;
    }

    cardMargin() {
        let amount = this.cardsAmount();
        let size = this.contentSize();
        let padding = this.paddingBetween();
        let space = (size - (padding * amount)) / amount;

        return parseInt(space < 102 ? space : 102) + padding;
    }

    addSprites() {
        if(this.spritesAmount()) {
            this._sprites.forEach((sprite, index) => {
                this.addChild(sprite);
            });
        }
    }

    addActions() {

    }

    addActionsAlls(Actions) {
        this._sprites.forEach(sprite => {
            sprite.addActions(Actions);
        });
    }

}
