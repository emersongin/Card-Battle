// bundle-js .\js\plugins_dev\CardBattle\index.js --dest .\js\plugins\CardBattle.js --disable-beautify

//=============================================================================
// CardBattle.js
//=============================================================================

/*:
 * @plugindesc New Scene Gamge to Card Battle Game.
 * @author Emerson Andrey
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {

const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === 'CardBattle') {
        SceneManager.goto(Scene_CardBattle);
        
    }
};
 
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
 
class Spriteset_CardBattle extends Spriteset_Base {
    constructor() {
        super();

        this._backgroundSnap = null;
        this.initialize();
    }
    createLowerLayer() {
        super.createLowerLayer();
        this.createSnapBackground();
        // this.createIntro();
        this.createBackground();
    }
    createSnapBackground() {
        this._backgroundSnap = new Sprite();
        this._backgroundSnap.bitmap = SceneManager.backgroundBitmap();
        this._baseSprite.addChild(this._backgroundSnap);
    }
    createBackground() {
        this._background = new Sprite_Background();
        this._baseSprite.addChild(this._background);
    }
}
 
class Sprite_Background extends Sprite {
    constructor() {
        super();
        this._sprites = null;
        this.initialize();
    }
    initialize() {
        super.initialize();
        this.createSpritesParallax();
    }
    createSpritesParallax() {
        console.log(this._sprites);
        const images = [
            { x: 0, y: 0, name: 'BlueSky' },
            { x: 624, y: 0, name: 'BlueSky' },
            { x: 0, y: 624, name: 'BlueSky' },
            { x: 624, y: 624, name: 'BlueSky' },
        ];
        this._baseSprite = new Sprite();
        for (const image of images) {
            let sprite = new Sprite(ImageManager.loadParallax(image.name));
            this._sprites.push(sprite);
            this._baseSprite.addChild(sprite);
        }
        this.addChild(this._baseSprite);
    }
    update() {
        super.update();
        this.updateSprites();
    }
    updateSprites() {
        this._sprites.forEach(sprite => {
            let x = sprite.x + 1;
            let y = sprite.y + 1;
            sprite.move(x, y);
        });
    }
}
 
})();


