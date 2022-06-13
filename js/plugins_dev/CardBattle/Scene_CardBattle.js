class Scene_CardBattle extends Scene_Base {
    constructor() {
        super();
        this._spriteset = null;
        this._titleWindow = null;
        this._messageWindow = null;
        this._foldersWindow = null;

    }

    create() {
        super.create();
        this.createDisplayObjects();
        
    }

    createDisplayObjects() {
        this.createSpriteset();
        this.createWindowLayer();
        this.createAllWindows();
    }

    createSpriteset() {
        this._spriteset = new Spriteset_CardBattle();
        this.addChild(this._spriteset);
        
        this.testCardBattle();
    }

    testCardBattle() {
        let cards = [
            new Game_Card({ap: 50,hp: 50,color: Game_CardColor.WHITE,type: Game_CardType.BATTLE, file: 'example', cost: 1}),
            // new Game_Card({ap: 99,hp: 999,color: Game_CardColor.BLUE,type: Game_CardType.POWER, file: 'example'}),
            // new Game_Card({ap: 99,hp: 999,color: Game_CardColor.GREEN,type: Game_CardType.NONE, file: 'example'}),
            new Game_Card({ap: 99,hp: 999,color: Game_CardColor.RED,type: Game_CardType.BATTLE, file: 'example', cost: 3}),
            // new Game_Card({ap: 99,hp: 999,color: Game_CardColor.BLACK,type: Game_CardType.BATTLE, file: 'example'}),
            new Game_Card({ap: 99,hp: 999,color: Game_CardColor.BROWN,type: Game_CardType.BATTLE, file: 'example', cost: 0}),
        ];

        for (let i = 2; i <= 10; i++) {
            let card = new Game_Card({ap: 99,hp: 99,color: Game_CardColor.WHITE,type: Game_CardType.BATTLE, file: 'example'});
            cards.push(card);
        }

        let cardSet = new Sprite_Cardset({ cards });

        this.addChild(cardSet);

        cardSet.openSetFaceUp();

        // cardSet.addActions(9, [
        //     { type: '_ACTIVE' },
        //     { type: '_FACEUP' },
        //     { type: '_REFRESH' },
        //     { type: '_SHOW' },
        //     { type: '_OPEN' },
        // ]);

        // cardSet.addActions(10, [
        //     { type: '_WAITFOR', subject: cardSet.getSpriteAt(9) },
        //     { type: '_ACTIVE' },
        //     { type: '_FACEUP' },
        //     { type: '_REFRESH' },
        //     { type: '_SHOW' },
        //     { type: '_OPEN' },
        // ]);

        // cardSet.addActionsAlls([
        //     // { type: '_WAIT', duration: 2000 },
        //     { type: '_ACTIVE' },
        //     { type: '_FACEUP' },
        //     { type: '_REFRESH' },
        //     { type: '_SHOW' },
        //     { type: '_OPEN' },
        // ], { waitPrevius: true });

        // this._c0 = cardSet.getSpriteAt(0);
        // this._c1 = cardSet.getSpriteAt(1);
        

    }

    createAllWindows() {
        this.createTitleWindow();
        this.createMessageWindow();
        this.createFoldersCommandWindow();

    }

    createTitleWindow() {
        this._titleWindow = new Window_Title();
        this.addWindow(this._titleWindow);

        // this._titleWindow.align('center-top');
        // this._titleWindow.setTextColor(1);
        // this._titleWindow.setText('Choose a folder');

        // this._titleWindow.open();
        
    }

    createMessageWindow() {
        this._messageWindow = new Window_MessageCardBattle();
        this.addWindow(this._messageWindow);

        // this._messageWindow.align('center');
        // this._messageWindow.setTextColor(1);
        // this._messageWindow.setLinesText('Emerson Andrey', '29');

        // this._messageWindow.open();
    }

    createFoldersCommandWindow() {
        this._foldersWindow = new Window_FoldersCommand();
        this.addWindow(this._foldersWindow);

        // this._foldersWindow.setHandler(this._foldersWindow.action + 1, () => this.action('1'));
        // this._foldersWindow.setHandler(this._foldersWindow.action + 2, () => this.action('2'));
        // this._foldersWindow.setHandler(this._foldersWindow.action + 3, () => this.action('3'));

        // this._foldersWindow.open();

    }

    action(text) {
        this._foldersWindow.close();
    }

    start() {
        super.start();
    }

    update() {
        super.update();

    }

    stop() {
        super.stop();
    }
    
    terminate() {
        super.terminate();
    }
}
