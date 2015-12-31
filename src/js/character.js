// りんちゃん------------------------------------------------
function Player(playCharacter){


    switch(_playCharacter){
        case "rin":
            this.img = _ssObj.RIN;
            break;
    }

    this.img.gotoAndPlay("N");
    this.direction = "N";
    this.wait();

}

Player.prototype.shake = function(direction){

    _shakeCount ++;
    _soundObj.SHAKE.play("none",0,0,0,1,0);
    var i = _shakeCount % 2 + 1;    // ex. L1 or L2
    this.img.gotoAndPlay(direction + i);

}
Player.prototype.wait = function(){
    this.img.gotoAndPlay(this.direction + "_wait");
}

Player.prototype.setDirection = function(direction){
    this.direction = direction;    
}

Player.prototype.getDirection = function(){
    return this.direction;
}

Player.prototype.changeDirection = function(){

    var lastDirection = this.direction;

    //ランダムに方向が決定
    var i = Math.floor(Math.random() * 4);
    switch(i){
        case 0:
            this. direction = "L";
            break;
        case 1:
            this. direction = "R";
            break;
        case 2:
            this. direction = "T";
            break;
        case 3:
            this. direction = "B";
            break;
    }
    // directionに変更がなければwaitアニメなし
    if(this.direction !== lastDirection){
        _player.wait();
    }
}

Player.prototype.finish = function(){
    this.img.gotoAndPlay("FINISH");
}