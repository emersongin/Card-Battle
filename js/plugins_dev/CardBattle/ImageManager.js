ImageManager.loadBattlecards = function(filename, hue) {
    return this.loadBitmap('img/battlecards/', filename, hue, true);
};

ImageManager.requestBattlecards = function(filename, hue) {
    return this.requestBitmap('img/battlecards/', filename, hue, false);
};

ImageManager.reserveBattlecards  = function (filename, hue, reservationId) {
    return this.reserveBitmap('img/battlecards/', filename, hue, true, reservationId);
};
