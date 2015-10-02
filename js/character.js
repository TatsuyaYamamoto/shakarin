// りんちゃん------------------------------------------------
function Player(playCharacter){


    switch(playCharacter){
        case "rin":
            this.img = _SSObj.RIN;
            break;
    }

    this.img.gotoAndPlay("kihon");

}

Player.prototype.shake = function(direction){

    _ShakeCount ++;

    var i = _ShakeCount % 2 + 1;    // ex. L1 or L2
    this.img.gotoAndPlay(direction + i);

}
Player.prototype.wait = function(direction){

    this.img.gotoAndPlay(direction + "_wait");
}


