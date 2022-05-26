class Scene_CardBattle extends Scene_Base {
    constructor() {
        super();
        this._spriteset = null;
        this.initialize();

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
        // this.createLogWindow();
        // this.createStatusWindow();
        // this.createPartyCommandWindow();
        // this.createActorCommandWindow();
    }
    createLogWindow() {
        // this._logWindow = new Window_BattleLog();
        // this.addWindow(this._logWindow);
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
