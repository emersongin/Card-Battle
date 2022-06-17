
const _Scene_CardBattle_createSpriteset = Scene_CardBattle.prototype.createSpriteset;

Scene_CardBattle.prototype.createSpriteset = function() {
    _Scene_CardBattle_createSpriteset.call(this);

    let cards = [
        new Game_Card({ap: 999,hp: 999,color: Game_CardColor.WHITE,type: Game_CardType.BATTLE, file: 'example', cost: 1}),
        new Game_Card({ap: 99,hp: 999,color: Game_CardColor.BLUE,type: Game_CardType.POWER, file: 'example'}),
        new Game_Card({ap: 99,hp: 999,color: Game_CardColor.GREEN,type: Game_CardType.NONE, file: 'example'}),
        new Game_Card({ap: 99,hp: 999,color: Game_CardColor.RED,type: Game_CardType.BATTLE, file: 'example', cost: 3}),
        new Game_Card({ap: 99,hp: 999,color: Game_CardColor.BLACK,type: Game_CardType.BATTLE, file: 'example'}),
        new Game_Card({ap: 99,hp: 999,color: Game_CardColor.BROWN,type: Game_CardType.BATTLE, file: 'example', cost: 0}),
    ];

    for (let i = 2; i <= 1; i++) {
        let card = new Game_Card({ap: 99,hp: 99,color: Game_CardColor.WHITE,type: Game_CardType.BATTLE, file: 'example'});
        cards.push(card);
    }

    let cardSet = new Spriteset_Card({ 
        cards,
        // enableSelect: false,
        // typeCardsOnly: 'power',
        // colorsCost: false,
    });

    this.addChild(cardSet);

    cardSet.move(40, 250);
    cardSet.activate();
    cardSet.openSetUp();

    // cardSet.addActions(0, [
    //     { type: '_ACTIVE' },
    //     { type: '_FACEUP' },
    //     { type: '_REFRESH' },
    //     { type: '_SHOW' },
    //     { type: '_OPEN' },
    // ]);

    // cardSet.addActions(1, [
    //     { type: '_WAITFOR', observable: cardSet.indexSprite(0) },
    //     { type: '_ACTIVE' },
    //     { type: '_FACEUP' },
    //     { type: '_REFRESH' },
    //     { type: '_SHOW' },
    //     { type: '_OPEN' },
    // ]);

    // cardSet.addActions(0, [
    //     { type: '_TURNUP' },
    //     { type: '_REFRESH' },
    //     { type: '_SHOW' },
    //     { type: '_OPEN' },
    //     { 
    //         type: '_REACT', 
    //         observables: cardSet.indexSprite(1), 
    //         reactions: [
    //             { type: '_TURNUP' },
    //             { type: '_REFRESH' },
    //             { type: '_SHOW' },
    //             { type: '_OPEN' },
    //             { type: '_ANIMATION', animationIndex: 77 },
    //         ] 
    //     },
    // ]);

    // cardSet.addActionsAlls([
    //     // { type: '_WAIT', duration: 2000 },
    //     { type: '_ACTIVE' },
    //     { type: '_FACEUP' },
    //     { type: '_REFRESH' },
    //     { type: '_SHOW' },
    //     { type: '_OPEN' },
    // ], { waitPrevius: true });

}