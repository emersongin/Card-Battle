class Scene_CardBattle extends Scene_Base {
    constructor() {
        super();
        this._spriteset = null;
        this._titleWindow = null;
        this._messageWindow = null;

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
    }

    createAllWindows() {
        this.createTitleWindow();
        this.createMessageWindow();
        // this.createPartyCommandWindow();
        // this.createActorCommandWindow();
    }

    createTitleWindow() {
        this._titleWindow = new Window_Title();
        this.addWindow(this._titleWindow);

        this._titleWindow.align('center');
        this._titleWindow.switchTextColor(1);
        this._titleWindow.setText('Start');

        this._titleWindow.open();
        
    }

    createMessageWindow() {
        this._messageWindow = new Window_MessageCardBattle();
        this.addWindow(this._messageWindow);

        this._messageWindow.align('center');
        this._messageWindow.switchTextColor(1);
        this._messageWindow.setLinesText('Emerson Andrey', '29');

        this._messageWindow.open();
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
