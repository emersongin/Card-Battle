class Sprite_CardAnimation extends Sprite_Animation {
    startFlash(color, duration) {
        super.startFlash(color, duration);
        this.refeshFlashBitmap(color);

    }

    refeshFlashBitmap(color) {
        let CSSColor = Utils.rgbToCssColor(color[0], color[1], color[2]);
        let alpha = color[3];

        this._target.bitmap.clear();
        this._target.bitmap.fillRect(0, 0, this._target.width, this._target.height, CSSColor);
        this._target.opacity = alpha;
    }

    updateFlash() {
        super.updateFlash();

        if (this._flashDuration > 0) {
            let duration = this._flashDuration;

            this._target.opacity *= (duration - 1) / duration;
        }
    }

    updatePosition() {
        this.x = this._target.width / 2;

        if (this._animation.position === 0) { //head
            this.y = -40;

        } else if (this._animation.position === 2) { //foot
            this.y = this._target.height + 40;

        } else {
            this.y = this._target.height / 2;

        }

    }
    
}
