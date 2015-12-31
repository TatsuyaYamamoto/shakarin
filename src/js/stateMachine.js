// ロード画面------------------------------------------
function preloadState(){
    // ロード完了後、topStateへ移行
    preloadStart(topState);
}

// TOP画面------------------------------------------
function topState(){
    // 全イベントを登録
    addAllEventListener();
    
    switch(_playCharacter){
        case "rin":
            var titleLogo = _gameStage.addChild(_imageObj.TITLE_LOGO);
            break;
    }
    _gameStage.removeAllChildren();
    addChildren([
        _imageObj.BACKGROUND,
        titleLogo,
        _textObj.START
    ])
    _gameStage.update();

    if(_soundObj.ZENKAI.playState != createjs.Sound.PLAY_SUCCEEDED){
        _soundObj.ZENKAI.play("none",0,0,-1,0.4,0);
    }
    _imageObj.BACKGROUND.addEventListener("click", gotoMenu);

    function gotoMenu(){
        _soundObj.OK.play("none",0,0,0,1,0);
        _imageObj.BACKGROUND.removeEventListener("click", gotoMenu);
        menuState();
    }
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

    _tickListener = addTickEvent(function(){
        _gameStage.update();
    });
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

//操作説明画面------------------------------------------
function howToPlayState(){  
    _gameStage.removeAllChildren();
    howToPlayInit();
}
// ゲーム画面------------------------------------------
function gameState(){
    _gameStage.removeAllChildren();
    gameInit();
}
// GAMEOVER画面------------------------------------------
function gameOverState(){
    // フィニッシュアニメーション
    _player.finish();
    
    _gameStage.removeAllChildren();
    addChildren([
        _imageObj.BACKGROUND,
        _player.img,
        _imageObj.BUTTON_BACK_MENU_FROM_GAME,
        _imageObj.BUTTON_RESTART,
        _textObj.SCORE_COUNT,
        _imageObj.GAMEOVER
    ]);
    switch(_playCharacter){
        case "rin":
            _gameStage.addChild(_imageObj.BUTTON_TWITTER_GAMEOVER_RIN);
            break;
    }
    if(_isLogin){
        registration(); // ランキング登録
    }

    _tickListener = addTickEvent(function(){
        _gameStage.update();
    });
}