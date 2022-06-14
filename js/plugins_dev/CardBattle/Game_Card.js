class Game_Card {
    constructor(Card = {}) {
        this._card = Card;
        //
        this.ap = Card.ap;
        this.hp = Card.hp;
        this.color = Card.color;
        this.type = Card.type;
        this.file = Card.file;
        this.cost = Card.cost || 0;

    }

    reset() {
        this.ap = this._card.ap;
        this.hp = this._card.hp;
        this.color = this._card.color;
        this.type = this._card.type;
        this.file = this._card.file;
        this.cost = this._card.cost || 0;
        
    }

}
