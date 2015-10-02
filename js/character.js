// りんちゃん------------------------------------------------
function Player(playCharacter){


    switch(playCharacter){
        case "rin":
            this.img = _SSObj.RIN;
            break;
    }

    this.img.gotoAndPlay("N");
    this.direction = "N";

}

Player.prototype.shake = function(direction){

    _ShakeCount ++;
    _SoundObj.SHAKE.play("none",0,0,0,1,0);
    var i = _ShakeCount % 2 + 1;    // ex. L1 or L2
    this.img.gotoAndPlay(direction + i);

}
Player.prototype.wait = function(direction){
    this.img.gotoAndPlay(direction + "_wait");
}


Player.prototype.changeDirection = function(){

    //ランダムに方向が決定
    var i = Math.floor(Math.random() * 4);
    switch(i){
        case 0:
            direction = "L";
            break;
        case 1:
            direction = "R";
            break;
        case 2:
            direction = "U";
            break;
        case 3:
            direction = "D";
            break;
    }

    // directionに変更がなければwaitアニメなし
    if(this.direction !== direction){
        _Player.wait(direction);
    }
    this.direction = direction;    
}
