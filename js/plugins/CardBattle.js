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
"use strict";
//@ts-ignore
const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
//@ts-ignore
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'CardBattle') {
        console.log('CardBattle Start');
    }
};
 
})();


