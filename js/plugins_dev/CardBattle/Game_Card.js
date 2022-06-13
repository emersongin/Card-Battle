class Game_Card {
    constructor(Card) {
        this._card = Card;
        //
        this._AP = Card.ap;
        this._HP = Card.hp;
        this._color = Card.color;
        this._type = Card.type;
        this._file = Card.file;
        this._cost = Card.cost || 0;

    }

    reset() {
        this._AP = this._card.ap;
        this._HP = this._card.hp;
        this._color = this._card.color;
        this._type = this._card.type;
        this._file = this._card.file;
        this._cost = this._card.cost;
        
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
    
    getFile() {
        return this._file;
    }

    getCost() {
        return this._cost;
    }

}
