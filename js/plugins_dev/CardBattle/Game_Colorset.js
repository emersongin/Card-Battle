class Game_Colorset {
    constructor(Colors = {}) {
        this.white = Colors.white || 0;
        this.blue = Colors.blue || 0;
        this.green = Colors.green || 0;
        this.red = Colors.red || 0;
        this.black = Colors.black || 0;

    }

    hasPoints(colorName, points = 0) {
        if(colorName === 'brown') return true;

        return this[colorName] >= points;
    }

}
