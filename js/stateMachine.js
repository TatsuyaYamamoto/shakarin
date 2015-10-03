// ロード画面------------------------------------------
function loadState(){


    _textObj.TEXT_LOADING_STATUS = new createjs.Text("", _gameScrean.width*0.1+"20px Impact", "");
    _textObj.TEXT_LOADING_STATUS.x = _gameScrean.width/2;
    _textObj.TEXT_LOADING_STATUS.y = _gameScrean.height/2;
    _textObj.TEXT_LOADING_STATUS.textAlign = "center";

    _gameStage.addChild(_textObj.TEXT_LOADING_STATUS);
    loadAnimation();


}

// TOP画面------------------------------------------
function topState(){

    _gameStage.removeAllChildren();
    _gameStage.addChild(_imageObj.BACKGROUND);

    switch(_playCharacter){
        case "rin":
            _gameStage.addChild(_imageObj.TITLE_LOGO);
            break;
    }

    _gameStage.addChild(_textObj.START);

    _gameStage.update();

    if(_soundObj.ZENKAI.playState != createjs.Sound.PLAY_SUCCEEDED){
        _soundObj.ZENKAI.play("none",0,0,-1,0.4,0);
    }

    function gotoMenu(){
        _soundObj.OK.play("none",0,0,0,1,0);
        menuState();
        _imageObj.BACKGROUND.removeEventListener("click", gotoMenu);
    }

    _imageObj.BACKGROUND.addEventListener("click", gotoMenu);

}


// MENU画面------------------------------------------
function menuState(){

    _gameStage.removeAllChildren();
    _gameStage.addChild(_imageObj.BACKGROUND);

    if(_isLogin){
        _gameStage.addChild(_imageObj.BUTTON_TWITTER_LOGOUT);
        _gameStage.addChild(_imageObj.TWITTER_ICON);
    }else{
        _gameStage.addChild(_imageObj.BUTTON_TWITTER_LOGIN);
    }


    addChildren([
        _imageObj.BUTTON_START,
        _imageObj.BUTTON_HOW,
        _imageObj.BUTTON_RANKING,
        _imageObj.BUTTON_CREDIT,
        _imageObj.BUTTON_TWITTER_TOP,
        _ssObj.BUTTON_SOUND_SS,
        _imageObj.MENU_LOGO
    ]);


    // ssObj.BUTTON_CHANGE_CHARA.gotoAndPlay(playCharacter);
    // gameStage.addChild(ssObj.BUTTON_CHANGE_CHARA);

    if(_soundObj.ZENKAI.playState != createjs.Sound.PLAY_SUCCEEDED){
        _soundObj.ZENKAI.play("none",0,0,-1,0.4,0);
    }

    _tickListener = createjs.Ticker.addEventListener("tick", function(){
        _gameStage.update();
    });


}
//操作説明画面------------------------------------------
function howToPlayState(){  

    gameStage.removeAllChildren();

    howToPlayInit();

}
//クレジット画面------------------------------------------
function creditState(){

    _gameStage.removeAllChildren();

    addChildren([
        _imageObj.BACKGROUND, 
        _imageObj.BUTTON_BACK_MENU_FROM_CREDIT,
        _textObj.LINK_SOKONTOKORO, 
        _textObj.LINK_SANZASHI, 
        _textObj.LINK_LOVELIVE, 
        _textObj.LINK_SOUNDEFFECT, 
        _textObj.LINK_ONJIN
    ]);

    _gameStage.update();
}

// ゲーム画面------------------------------------------
function gameState(){

    _gameStage.removeAllChildren();
    gameInit();

}
// GAMEOVER画面------------------------------------------
function gameOverState(){


    _gameStage.removeAllChildren();


    addChildren([
        _imageObj.BACKGROUND,
        _player.img,
        _imageObj.BUTTON_BACK_MENU_FROM_GAME,
        _imageObj.BUTTON_RESTART,
        _textObj.GAME_COUNT,
        _imageObj.GAMEOVER
    ]);

    switch(_playCharacter){
        case "rin":
            _gameStage.addChild(_imageObj.BUTTON_TWITTER_GAMEOVER_RIN);
            break;
    }



    if(_isLogin){
        // ランキング登録
        registration();
    }

    _tickListener = createjs.Ticker.addEventListener("tick", function(){
        _gameStage.update();
    });


}

