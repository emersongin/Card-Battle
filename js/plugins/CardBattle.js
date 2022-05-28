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
class Window_Title extends Window_Base {
    constructor() {
        super();

    }

    initialize() {
        let width = Graphics.boxWidth;
        let height = this.fittingHeight(1);

        super.initialize(0, 0, width, height);
        this.openness = 0;
        this._text = '';
        this._alignText = 'center';

    }

    align(position = 'start') {
        switch (position) {
            case 'top':
                this.move(0, 0, this.width, this.height);
                break;
            case 'center-top':
                this.move(0, (Graphics.boxHeight / 4 * 1) - this.height, this.width, this.height);
                break;
            case 'center':
                this.move(0, (Graphics.boxHeight / 2) - this.height, this.width, this.height);
                break;
            case 'center-bottom':
                this.move(0, (Graphics.boxHeight / 4 * 3) - this.height, this.width, this.height);
                break;
            case 'bottom':
                this.move(0, (Graphics.boxHeight - this.height), this.width, this.height);
                break;
        }
    }

    setText(text) {
        this._text = text;
        this.refresh();

    }
    
    clearText() {
        this._text = '';
    }

    switchTextColor(wheel) {
        this.contents.textColor = this.textColor(wheel) || this.textColor(0);
    }
    
    sizeText() {
        return (this.contents.fontSize * this._text.length / 2) - (this.standardPadding() + 6);
    }

    refresh() {
        this.contents.clear();
        this.drawText(this._text, 0, 0, this.width - this.sizeText(), this._alignText);
    }

}

class Window_MessageCardBattle extends Window_Base {
    constructor() {
        super();

    }

    initialize() {
        let width = Graphics.boxWidth;
        let height = this.fittingHeight(2);

        super.initialize(0, 0, width, height);
        this.openness = 0;
        this._text = '';
        this._color = '';
        this._alignText = 'left';

    }

    align(position = 'start') {
        switch (position) {
            case 'top':
                this.move(0, 0, this.width, this.height);
                break;
            case 'center-top':
                this.move(0, (Graphics.boxHeight / 4 * 1), this.width, this.height);
                break;
            case 'center':
                this.move(0, (Graphics.boxHeight / 2), this.width, this.height);
                break;
            case 'center-bottom':
                this.move(0, (Graphics.boxHeight / 4 * 3), this.width, this.height);
                break;
            case 'bottom':
                this.move(0, (Graphics.boxHeight - this.height), this.width, this.height);
                break;
        }
    }

    setLinesText(textLine1 = '', textLine2 = '') {
        this._text = `${this._color}${textLine1}\n${textLine2}`;
        this.refresh();
    }

    clearTexts() {
        this._text = '';
    }

    switchTextColor(wheel) {
        this._color = `\\c[${wheel}]`;
    }
    
    sizeText() {
        return (this.contents.fontSize * this._text.length / 2) - (this.standardPadding() + 6);
    }

    refresh() {
        this.contents.clear();
        this.drawTextEx(this._text, 0, 0);
    }

}

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

    deactivate() {
        this._baseSprite.visible = false;
        this._active = false;
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
        this._active = false;
        this._speed = 6;
        this._picture = null;
        this._clearRectangle = null;
        this._blackRectangles = [];
        super.initialize();
        this.createPicture();

    }

    activate() {
        this.createClearRect();
        this.createBlackRects();
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    createClearRect() {
        this._clearRectangle = {
            x: 0, y: 0,
            width: Graphics.boxWidth,
            height: Graphics.boxHeight
        };
    }

    createBlackRects() {
        this._blackRectangles = [
            { 
                x: Graphics.boxWidth, 
                y: 0, 
                color: 'black', 
                direction: 'left',
                width: Graphics.boxWidth, 
                height: Graphics.boxHeight 
            },
            { 
                x: - Graphics.boxWidth, 
                y: 0, 
                color: 'black', 
                direction: 'right',
                width: Graphics.boxWidth, 
                height: Graphics.boxHeight 
            }
        ];

    }

    createPicture() {
        const image = { name: 'Ocean1' };

        this._picture = ImageManager.loadParallax(image.name);

    }

    update() {
        if (this._active) {
            let rect = this._clearRectangle;

            super.update();
            this.refreshPicture();
            this.updateClearRectangle();

            if (rect.x >= (Graphics.boxWidth / 2) || rect.y >= (Graphics.boxHeight / 2) ) {
                this.refreshPicture({ clearRect: false, blackReacts: true });
                this.updateBlackRectangles();

                if(this._blackRectangles[0].x <= 0) this.deactivate();
            }

        }

    }

    updateClearRectangle() {
        this._clearRectangle.x = this._clearRectangle.x + this._speed;
        this._clearRectangle.y = this._clearRectangle.y + this._speed;
        this._clearRectangle.width = this._clearRectangle.width - (this._speed * 2);
        this._clearRectangle.height = this._clearRectangle.height - (this._speed * 2);
    }

    updateBlackRectangles() {
        this._blackRectangles.forEach(rect => {
            rect.x = rect.direction == 'left' ? rect.x - (this._speed * 2) : rect.x + (this._speed * 2);
        });
    }

    refreshPicture(params = { clearRect: true, blackReacts: false }) {
        let rect = this._clearRectangle;

        this.bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
        this.bitmap.blt(this._picture, 0, 0, Graphics.boxWidth, Graphics.boxHeight, 0, 0);
        if (params.clearRect) this.bitmap.clearRect(rect.x, rect.y, rect.width, rect.height);

        if (params.blackReacts) {
            this._blackRectangles.forEach(rect => {
                this.bitmap.fillRect(rect.x, rect.y, rect.width, rect.height, rect.color);
            });
        }

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

    }
    
    createBackground() {
        this._background = new Sprite_Background();
        this._baseSprite.addChild(this._background);

    }

}
 
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
 

const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === 'CardBattle') {
        SceneManager.goto(Scene_CardBattle);
        
    }
};
 

})();


