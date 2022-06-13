class Game_Colorset {
    constructor(Colors = {}) {
        this._white = Colors.white || 0;
        this._blue = Colors.blue || 0;
        this._green = Colors.green || 0;
        this._red = Colors.red || 0;
        this._black = Colors.black || 0;

    }

    hasPoints(color, max) {
        if(color === 'brown') return true;

        return this['_' + color] >= max;
    }

    getWhitePoints() {
        this._white;
    }

    getBluePoints() {
        this._blue;
    }

    getGreenPoints() {
        this._green;
    }

    getRedPoints() {
        this._red;
    }

    getBlackPoints() {
        this._black;
    }

}
