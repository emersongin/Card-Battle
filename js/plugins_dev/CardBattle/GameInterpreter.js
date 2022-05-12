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
