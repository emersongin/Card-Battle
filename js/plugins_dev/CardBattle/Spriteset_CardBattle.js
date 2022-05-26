class Spriteset_CardBattle extends Spriteset_Base {
    constructor() {
        super();

        this._backgroundSnap = null;
        this.initialize();
    }
    createLowerLayer() {
        super.createLowerLayer();
        this.createSnapBackground();
        // this.createIntro();
        this.createBackground();
    }
    createSnapBackground() {
        this._backgroundSnap = new Sprite();
        this._backgroundSnap.bitmap = SceneManager.backgroundBitmap();
        this._baseSprite.addChild(this._backgroundSnap);
    }
    createBackground() {
        this._background = new Sprite_Background();
        this._baseSprite.addChild(this._background);
    }
}
