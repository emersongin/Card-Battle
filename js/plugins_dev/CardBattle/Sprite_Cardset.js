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
        this._selectionColorsCost = Config.selectionColorsCost || false;
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
            this._sprites = this._cards.map((card, count) => { 
                let sprite = new Sprite_Card(card);

                let position = this.cardPosition(sprite, count);
                sprite.x = position;
                sprite._mirrorScaleX = position;

                return sprite;
            });
        }
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

    addActions(order, Actions) {
        this._sprites[order].addActions(Actions);
    }

    addActionsAlls(Actions, params = { waitPrevius: false }) {
        this._sprites.forEach((sprite, index) => {
            let copy = Actions.clone();

            if(params.waitPrevius && index) {
                let subject = this.getSpriteAt(index - 1);

                copy.unshift({ type: '_WAITFOR', subject }); 
            }

            sprite.addActions(copy);
        });
    }

}
