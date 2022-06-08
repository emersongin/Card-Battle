class Sprite_Cardset extends Sprite {
    constructor(Config) {
        super();

        this._cards = Config.cards || [];
        this._sprites = [];
        this._selections = [];
        this._colors = new Game_Colorset(Config.colors);

        // sistem
        this._selectionColorsCost = Config.selectionColorsCost || false;
        this._enableSelect = Config.enableSelect || false;
        this._selectionsNumber = Config.selectionsNumber || 0;

        this.initialize();
    }

    initialize() {
        super.initialize();

    }

    clearSprites() {
        if(this.children.length) {
            for (const child of this.children) {
                this.removeChild(child);
            }
        }

        this._sprites = [];
    }

    refreshSprites() {
        this.clearSprites();

        if(this._cards.length) {
            this._sprites = this._cards.map(card => new Sprite_Card(card));

            if(this._sprites.length) {
                this._sprites.forEach((sprite, index) => {
                    sprite.move(index * sprite.width + 12, 0);
                    this.addChild(sprite);
                });
            }
        }
    }

}
