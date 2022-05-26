class Scene_CardBattle extends Scene_Base {
    constructor() {
        super();
        this._spriteset = null;

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
        // this.createStatusWindow();
        // this.createPartyCommandWindow();
        // this.createActorCommandWindow();
    }

    createTitleWindow() {
        this._titleWindow = new Window_Title();
        this.addWindow(this._titleWindow);
        
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
