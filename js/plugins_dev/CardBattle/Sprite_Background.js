class Sprite_Background extends Sprite {
    constructor() {
        super();
        this._sprites = null;
        this.initialize();
    }
    initialize() {
        super.initialize();
        this.createSpritesParallax();
    }
    createSpritesParallax() {
        console.log(this._sprites);
        const images = [
            { x: 0, y: 0, name: 'BlueSky' },
            { x: 624, y: 0, name: 'BlueSky' },
            { x: 0, y: 624, name: 'BlueSky' },
            { x: 624, y: 624, name: 'BlueSky' },
        ];
        this._baseSprite = new Sprite();
        for (const image of images) {
            let sprite = new Sprite(ImageManager.loadParallax(image.name));
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
        this._sprites.forEach(sprite => {
            let x = sprite.x + 1;
            let y = sprite.y + 1;
            sprite.move(x, y);
        });
    }
}
