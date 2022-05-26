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
class Sprite_Background extends Sprite {
    constructor() {
        super();
    }

    initialize() {
        this._active = false;
        this._sprites = [];
        this._limite = 624;
        this._speed = 1;

        super.initialize();
        this.createSpritesParallax();

    }

    activate() {
        this._baseSprite.visible = true;
        this._active = true;
    }

    createSpritesParallax() {
        const images = [
            { x: 0, y: 0, name: 'BlueSky' },
            { x: -this._limite, y: 0, name: 'BlueSky' },
            { x: 0, y: -this._limite, name: 'BlueSky' },
            { x: -this._limite, y: -this._limite, name: 'BlueSky' },
        ];

        this._baseSprite = new Sprite();
        this._baseSprite.visible = false;

        for (const image of images) {
            let sprite = new Sprite(ImageManager.loadParallax(image.name));

            sprite.initPositionX = image.x;
            sprite.initPositionY = image.y;

            sprite.move(sprite.initPositionX, sprite.initPositionY);
            
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
        if(this._active) {
            this._sprites.forEach(sprite => {
                let x = sprite.x + this._speed;
                let y = sprite.y + this._speed;
    
                if(x >= (sprite.initPositionX + this._limite)) x = x - this._limite;
                if(y >= (sprite.initPositionY + this._limite)) y = y - this._limite;
    
                sprite.move(x, y);
    
            });
        }

    }
}

class Sprite_Intro extends Sprite {
    constructor() {
        super();
    }

    initialize() {
        
        this._picture = null;
        this._speed = 6;
        super.initialize();
        this.createPicture();

    }

    activate() {
        this.createClearRect();
        this.active = true;
    }

    createClearRect() {
        this.clearRectangle = {
            x: 0, y: 0,
            width: Graphics.boxWidth,
            height: Graphics.boxHeight
        };
    }

    createPicture() {
        const image = { name: 'Ocean1' };

        this._picture = ImageManager.loadParallax(image.name);

    }

    update() {
        if (this.active) {
            let rect = this.clearRectangle;

            super.update();
            this.refreshPicture();
            this.updateClearRectangle();

            if (rect.x >= (Graphics.boxWidth / 2) || rect.y >= (Graphics.boxHeight / 2) ) {
                this.active = false;
                this.refreshPicture({ clearRect: false });

            }

        }

    }

    updateClearRectangle() {
        this.clearRectangle.x = this.clearRectangle.x + this._speed;
        this.clearRectangle.y = this.clearRectangle.y + this._speed;
        this.clearRectangle.width = this.clearRectangle.width - (this._speed * 2);
        this.clearRectangle.height = this.clearRectangle.height - (this._speed * 2);
    }

    refreshPicture(params = { clearRect: true }) {
        let rect = this.clearRectangle;

        this.bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
        this.bitmap.blt(this._picture, 0, 0, Graphics.boxWidth, Graphics.boxHeight, 0, 0);
        if (params.clearRect) this.bitmap.clearRect(rect.x, rect.y, rect.width, rect.height);

    }

}

class Spriteset_CardBattle extends Spriteset_Base {
    constructor() {
        super();
    }

    initialize() {
        this._backgroundSnap = null;
        this._background = null;
        this._layerIntro = null;
        super.initialize();

    }

    createLowerLayer() {
        super.createLowerLayer();
        this.createSnapBackground();
        this.createIntro();
        this.createBackground();
    }

    createSnapBackground() {
        this._backgroundSnap = new Sprite();
        this._backgroundSnap.bitmap = SceneManager.backgroundBitmap();
        this._baseSprite.addChild(this._backgroundSnap);
    }

    createIntro() {
        this._layerIntro = new Sprite_Intro();
        this._baseSprite.addChild(this._layerIntro);

        this._layerIntro.activate();
    }
    
    createBackground() {
        this._background = new Sprite_Background();
        this._baseSprite.addChild(this._background);
        this._background.activate();
    }

}
 
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
 

const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === 'CardBattle') {
        SceneManager.goto(Scene_CardBattle);
        
    }
};
 

})();


