class Sprite_Intro extends Sprite {
    constructor() {
        super();
    }

    initialize() {
        
        this._picture = null;
        this._speed = 6;
        super.initialize();
        this.createPicture();

    }

    activate() {
        this.createClearRect();
        this.active = true;
    }

    createClearRect() {
        this.clearRectangle = {
            x: 0, y: 0,
            width: Graphics.boxWidth,
            height: Graphics.boxHeight
        };
    }

    createPicture() {
        const image = { name: 'Ocean1' };

        this._picture = ImageManager.loadParallax(image.name);

    }

    update() {
        if (this.active) {
            let rect = this.clearRectangle;

            super.update();
            this.refreshPicture();
            this.updateClearRectangle();

            if (rect.x >= (Graphics.boxWidth / 2) || rect.y >= (Graphics.boxHeight / 2) ) {
                this.active = false;
                this.refreshPicture({ clearRect: false });

            }

        }

    }

    updateClearRectangle() {
        this.clearRectangle.x = this.clearRectangle.x + this._speed;
        this.clearRectangle.y = this.clearRectangle.y + this._speed;
        this.clearRectangle.width = this.clearRectangle.width - (this._speed * 2);
        this.clearRectangle.height = this.clearRectangle.height - (this._speed * 2);
    }

    refreshPicture(params = { clearRect: true }) {
        let rect = this.clearRectangle;

        this.bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
        this.bitmap.blt(this._picture, 0, 0, Graphics.boxWidth, Graphics.boxHeight, 0, 0);
        if (params.clearRect) this.bitmap.clearRect(rect.x, rect.y, rect.width, rect.height);

    }

}
