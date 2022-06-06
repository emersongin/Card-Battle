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
ImageManager.reserveBattlecards  = function (filename, hue, reservationId) {
    return this.reserveBitmap('img/battlecards/', filename, hue, true, reservationId);
};

ImageManager.requestBattlecards = function (filename, hue) {
    return this.requestBitmap('img/battlecards/', filename, hue, true);
};

ImageManager.loadBattlecards  = function (filename, hue) {
    return this.loadBitmap('img/battlecards/', filename, hue, false);
};

function Game_CardColor() {
    throw new Error('This is a static class');
}

Game_CardColor.WHITE = "white";
Game_CardColor.BLUE = "blue";
Game_CardColor.GREEN = "green";
Game_CardColor.RED = "red";
Game_CardColor.BLACK = "black";
Game_CardColor.BROWN = "brown";

function Game_CardType() {
    throw new Error('This is a static class');
}

Game_CardType.BATTLE = "battle";
Game_CardType.POWER = "power";
Game_CardType.NONE = "none";

class Game_Card {
    constructor(Card) {
        this._card = Card;
        //
        this._AP = Card.ap;
        this._HP = Card.hp;
        this._color = Card.color;
        this._type = Card.type;
        this._file = Card.file;
        //
        this._state = false;
        this._face = true;
        this._selected = false;

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
    
    getFace() {
        return this._face;
    }

    getSelected() {
        return this._selected;
    }
    
    getState() {
        return this._state;
    }

    getFile() {
        return this._file;
    }
}

class Sprite_Card extends Sprite {
    constructor(Game_Card) {
        super();

        this._AP = Game_Card.getAP() || 0;
        this._HP = Game_Card.getHP() || 0;
        this._color = Game_Card.getColor() || Game_CardColor.BROWN;
        this._type = Game_Card.getType() || Game_CardType.NONE;
        this._state = Game_Card.getState();
        this._face = Game_Card.getFace() || true;
        this._selected = Game_Card.getSelected();
        this._file = Game_Card.getFile() || 'index';

        this._mirrorAP = Game_Card.getAP() || 0;
        this._mirrorHP = Game_Card.getHP() || 0;

        this._frameCounter = 0;
        this._pointsSpeed = 2;

        this.initialize();
        this.setFrame(0, 0, this.cardWidth(), this.cardHeight());

    }

    isInactive() { console.log(this._state === false, this._state, false);
        return this._state === false;
    }

    isSelected() {
        return this._selected === true;
    }

    cardWidth() {
        return 102;
    }

    cardHeight() {
        return 124;
    }

    initialize() {
        super.initialize();
        this.setup();
        this.createLayers();
        this.refresh();

    }

    setup() {
        this._background = new Sprite(new Bitmap(this.cardWidth(), this.cardHeight()));
        this._figure = new Sprite(new Bitmap(this.cardWidth(), this.cardHeight()));
        this._caption = new Sprite(new Bitmap(this.cardWidth(), 24));
        this._shadow = new Sprite(new Bitmap(this.cardWidth(), this.cardHeight()));
        this._select = new Sprite(new Bitmap(this.cardWidth(), this.cardHeight()));

    }

    createLayers() {
        this._layers = {
            background: 0,
            figure: 1,
            caption: 2,
            shadow: 3,
            selected: 4
        };

        this.createBackground();
        this.createFigure();
        this.createCaption();
        this.createShadow();
        this.createSelected();

        this.addChild(this._background);
        this.addChild(this._figure);
        this.addChild(this._caption);
        this.addChild(this._shadow);
        this.addChild(this._select);
    }

    createBackground() {
        this.createBorder(this._background.bitmap, 'grey');

        this._background.bitmap.fillRect(
            2, 2, this.cardWidth() - 4, this.cardHeight() - 4, 
            this.backgroundColors(this._color)
        );
    }

    createBorder(bitmap, color) {
        const context = bitmap._context;

        let rectX = 0;
        let rectY = 0;
        let rectWidth = this.cardWidth();
        let rectHeight = this.cardHeight();
        let cornerRadius = 8;

        context.lineJoin = "round";
        context.lineWidth = cornerRadius;
        context.strokeStyle = color;
        context.strokeRect(
            rectX + (cornerRadius/2), rectY + (cornerRadius/2), 
            rectWidth - cornerRadius, rectHeight - cornerRadius
        );

    }

    backgroundColors(color) {
        switch (color) {
            case 'white':
                return '#edfff5';
                break;
            case 'blue':
                return '#777ae3';
                break;
            case 'green':
                return '#5dee57';
                break;
            case 'red':
                return '#f33434';
                break;
            case 'black':
                return '#414141';
                break;
            case 'brown':
                return '#915f2d';
                break;
        }
    }

    createFigure() {
        // size card figure 96x96

        this._figure.move(3, 3);
        this._figure.bitmap = ImageManager.loadBattlecards(this._file);
        
        // @tests
        // this._figure.bitmap.fillAll('red');

    }

    createCaption() {
        this._caption.move(0, this.cardHeight() - 24);
        this._caption.bitmap.fontSize = 14;

    }

    createShadow() {
        this.createBorder(this._shadow.bitmap, 'black');
        this._shadow.bitmap.fillRect(2, 2, this.cardWidth() - 4, this.cardHeight() - 4, 'black');
        this._shadow.opacity = 128;

    }

    createSelected() {
        this.createBorder(this._select.bitmap, '#fff435');
        this._select.bitmap.clearRect (3, 3, this.cardWidth() - 6, this.cardHeight() - 6);

    }

    refresh() {
        if (this.isFaceUp()) {
            this.drawType();
            this.drawShadow();
            this.drawSelect();

        } else {
            //faceDown
        }
    }

    isFaceUp() {
        return this._face === true;
    }

    drawType() {
        if(this._type === Game_CardType.BATTLE) {
            this.drawCaption(`${this._AP}/${this._HP}`);
        } else if(this._type === Game_CardType.POWER) {
            this.drawCaption('( P )');
        } else {
            this.drawCaption('?');
        }
    }

    drawShadow() {
        if(this.isInactive()) {
            this._shadow.opacity = 128;
        } else {
            this._shadow.opacity = 0;
        }
    }

    drawSelect() {
        if(this.isSelected()) {
            this._select.opacity = 255;
        } else {
            this._select.opacity = 0;
        }
    }

    drawCaption(caption) {
        this._caption.bitmap.clear();
        this._caption.bitmap.drawText(
            `${caption}`, 0, 0, this.cardWidth(), 24, 'center'
        );
    }

    update() {
        super.update();
        this.updatePoints();
        this.updateSelected();

        this._frameCounter++;
    }

    updatePoints() {
        if(this._mirrorAP !== this._AP || this._mirrorHP !== this._HP) {
            let speed = this._pointsSpeed || 1;

            for (let times = 1; times <= speed; times++) {
                this.updatePointsOnce();
            }

            this.refresh();
        }
    }

    updatePointsOnce() {
        if(this._mirrorAP > this._AP) {
            this._AP++;
        } else if (this._mirrorAP < this._AP) {
            this._AP--;
        } 

        if(this._mirrorHP > this._HP) {
            this._HP++;
        } else if (this._mirrorHP < this._HP) {
            this._HP--;
        }
    }

    updateSelected() {
        if(this.isSelected() && this._frameCounter % 8 == 0) {
            this._select.opacity = this._select.opacity == 255 ? 228 : 255;
        }

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
        this.bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
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
            this.refresh();
            this.updateClearRectangle();

            if (rect.x >= (Graphics.boxWidth / 2) || rect.y >= (Graphics.boxHeight / 2) ) {
                this.refresh({ clearRect: false, blackReacts: true });
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

    refresh(params = { clearRect: true, blackReacts: false }) {
        let rect = this._clearRectangle;

        this.bitmap.clear();
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
 
class Window_Title extends Window_Base {
    constructor() {
        super();

    }

    initialize() {
        const width = Graphics.boxWidth;
        const height = this.fittingHeight(1);

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

    setTextColor(wheel) {
        this.contents.textColor = this.textColor(wheel) || this.textColor(0);
    }

    refresh() {
        this.contents.clear();
        this.drawText(this._text, 0, 0, this.width, this._alignText);
    }

}

class Window_FoldersCommand extends Window_Command {
    constructor() {
        super();

    }

    initialize() {
        const y = this.windowHeight() / 2;

        super.initialize(0, y);
        this.openness = 0;
        this.action = 'OPTION_FOLDER_';
        this.deactivate();

    }

    open() {
        this.refresh();
        this.activate();
        super.open();

    }
    
    windowWidth() {
        return Graphics.boxWidth;
    }

    windowHeight() {
        return Graphics.boxHeight / 2;
    }
    
    numVisibleRows() {
        return 3;
    }

    itemHeight() {
        return Math.floor((this.height - (this.padding * 2)) / this.numVisibleRows());
    }

    makeCommandList() {
        for (const folder of [
            {id: 1, name: 'folder 1'},
            {id: 2, name: 'folder 2'},
            {id: 3, name: 'folder 3'},
        ]) {
            this.addCommand(folder.name, `${this.action}${folder.id}`);
        }
    }

    drawItem(index) {
        let rect = this.itemRectForText(index);
        let yColorItems = rect.y + this.itemHeight() / 2;

        this.drawTextEx(this.commandName(index), rect.x, rect.y);
        this.drawTextEx(this.drawColorsItems(index), rect.x, yColorItems);

    }

    drawColorsItems(index) {
        let items = [
            { id: 1, value: 0 },
            { id: 2, value: 0 },
            { id: 3, value: 0 },
        ];

        let label = '';
        let indexIcon = 20;

        for (const [index, item] of items.entries()) {
            let space = index > 0 ? ' ' : '';
            let value = item.value.toString().padZero(2);

            label += `${space}\\I[${indexIcon}] ${value}`;

            indexIcon++;
        }

        return label;
    }
}

class Window_MessageCardBattle extends Window_Base {
    constructor() {
        super();

    }

    initialize() {
        const width = Graphics.boxWidth;
        const height = this.fittingHeight(2);

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

    setTextColor(wheel) {
        this._color = `\\c[${wheel}]`;
    }
    
    refresh() {
        this.contents.clear();
        this.drawTextEx(this._text, 0, 0);
    }

}

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
            new Game_Card({ap: 99,hp: 99,color: Game_CardColor.WHITE,type: Game_CardType.BATTLE, file: 'example'}),
            // new Game_Card({ap: 99,hp: 999,color: Game_CardColor.BLUE,type: Game_CardType.POWER, file: 'example'}),
            // new Game_Card({ap: 99,hp: 999,color: Game_CardColor.GREEN,type: Game_CardType.NONE, file: 'example'}),
            // new Game_Card({ap: 99,hp: 999,color: Game_CardColor.RED,type: Game_CardType.BATTLE, file: 'example'}),
            // new Game_Card({ap: 99,hp: 999,color: Game_CardColor.BLACK,type: Game_CardType.BATTLE, file: 'example'}),
            // new Game_Card({ap: 99,hp: 999,color: Game_CardColor.BROWN,type: Game_CardType.BATTLE, file: 'example'}),
            // new Game_Card({ap: 99,hp: 999,color: Game_CardColor.GREEN,type: Game_CardType.NONE, file: 'example'}),
            // new Game_Card({ap: 99,hp: 999,color: Game_CardColor.RED,type: Game_CardType.BATTLE, file: 'example'}),
        ];
        let sprites = [];

        cards.forEach(card => sprites.push(new Sprite_Card(card)));
        sprites.forEach((sprite, index) => {
            sprite.move(index * sprite.width, 0);
            this.addChild(sprite);
        });

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
        console.log('teste ' + text);
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
 

const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === 'CardBattle') {
        SceneManager.goto(Scene_CardBattle);
        
    }
};
 
Scene_Boot.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
        DataManager.setupBattleTest();
        SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
        DataManager.setupEventTest();
        SceneManager.goto(Scene_Map);
    } else {
        this.checkPlayerLocation();
        DataManager.setupNewGame();

        SceneManager.goto(Scene_CardBattle);
        
        Window_TitleCommand.initCommandPosition();
    }
    this.updateDocumentTitle();
};


})();


