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
