class Game_Card {
    constructor(Card) {
        this._card = Card;
        //
        this._AP = Card.ap;
        this._HP = Card.hp;
        this._color = Card.color;
        this._type = Card.type;
        this._file = Card.file;
        //
        this._state = Game_CardState.ACTIVE;
        this._face = false;
        this._select = false;

    }

    getAP() {
        return this._AP;
    }

    getHP() {
        return this._HP;
    }
    
    getColor() {
        return this._color;
    }
    
    getType() {
        return this._type;
    }
    
    getFace() {
        return this._face;
    }

    getSelect() {
        return this._select;
    }
    
    getState() {
        return this._state;
    }

    getFile() {
        return this._file;
    }
}
