class Game_Card {
    constructor(Card) {
        this._card = Card;

        this._AP = Card.ap;
        this._HP = Card.hp;
        this._color = Card.color;
        this._type = Card.type;
        this._face = false;
        this._state = Game_CardState.ACTIVE;

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
    
    getState() {
        return this._state;
    }
}
