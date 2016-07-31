// グローバル変数----------------------------------------
var _gameStage;
var _gameScrean;
var _screenScale;

var _gameFrame;
var _nextCheckFrame;
var _gameScore;

var _tickListener;

var _isSoundMute = false;

var _playCharacter = "rin";
var _player;
var _shakeCount;

var _deferredCheckLogin;
var _isLogin = false;

// エレメントオブジェクト-----------------------------
// 画像、スプライトシート、音声、テキスト、ユーザー情報

var _imageObj = {};
var _ssObj = {};
var _soundObj = {};
var _textObj = {};
var _user = {
    id: "",
    name: "",
    iconURL: ""
};


// システムへログイン-------------


/**
 * ログイン処理を非同期で実行する。
 * @returns {*}
 */
function requestCheckingLogging(){

    var deferred = $.Deferred();

    var ajax = $.ajax({
        type: "GET",
        url: config.api.user,
        xhrFields: {
            withCredentials: true
        }
    });

    $.when(ajax).done(function(data){
        // ログイン完了通知
        alertify.log("ランキングシステム ログイン中！", "success", 3000);

        // response body格納
        _user.id = data.id;
        _user.name = data.name;
        properties.asyncImage.TWITTER_ICON.url = data.icon_url;

        _isLogin = true;
        deferred.resolve();
    }).fail(function(){
        // 未ログインの場合は通知なし
        _isLogin = false;
        deferred.reject();
    });

    return deferred.promise()
}

/**
 * キーボードイベント
 * @param event
 */
function keyDownEvent(event){

    if(event.which == 37 && _imageObj.BUTTON_LEFT.mouseEnabled){
        _player.shake("L");
    }
    if(event.keyCode == 39 && _imageObj.BUTTON_RIGHT.mouseEnabled){
        _player.shake("R");
    }
    if(event.keyCode == 38 && _imageObj.BUTTON_TOP.mouseEnabled){
        _player.shake("T");     
    }
    if(event.keyCode == 40 && _imageObj.BUTTON_BOTTOM.mouseEnabled){
        _player.shake("B");
    }
}


/**
 * ランキング登録
 */
function registration(){

    $.ajax({
        type: "POST",
        url: config.api.score,
        xhrFields: {
            withCredentials: true
        },
        contentType:'application/json',
        data: JSON.stringify({
            'point': _gameScore
        })
    }).done(function(data, textStatus, jqXHR) {
        alertify.log("ランキングシステム　通信完了！", "success", 3000);
    }).fail(function( jqXHR, textStatus, errorThrown){
        if(textStatus == 401){
            alertify.log("ログインセッションが切れてしまいました...再ログインして下さい。", "error", 3000);
        }else{
            alertify.log("ランキングシステムへの接続に失敗しました...", "error", 3000);
        }
    });
}


// tweet文言----------------
function getTweetText(){

    switch(_playCharacter){
        case "rin":
 
            if(_gameScore == 0){
                return "凛「ちょっと寒くないかにゃー？」";
            }
            
            var textTicket = Math.floor(Math.random() * 4)
            switch(textTicket){
                case 0:
                    return "凛「ちいさなマラカス♪しゃかしゃか"+_gameScore+"しゃかー！」";
                case 1:
                    return '凛「それより今日こそ先輩のところに行って"しゃかりんやります！"って言わなきゃ！」'+_gameScore+"しゃか！";
                case 2 :
                    return "凛「待って！しゃかしゃかするなら凛が！凛が！ 凛が"+_gameScore+"しゃかするの！！」";
                case 3 :
                    return "エリチカ？「" + _gameScore+"しゃかァ？認められないわァ」";
            }

    }
    return _gameScore + "しゃか！";
}
// tickイベントadd, remove--------------------------------
function addTickEvent(listener){
    return createjs.Ticker.addEventListener("tick", listener);
}
function removeTickEvent(target){
    createjs.Ticker.removeEventListener("tick", target);
}

//キーボードイベントリスナー登録--------------------------------

function addAllEventListener(){

    /* ゲーム操作用 */
    _imageObj.BUTTON_LEFT.addEventListener("mousedown", function() {
    	_player.shake("L");
    });

    _imageObj.BUTTON_RIGHT.addEventListener("mousedown", function() {
    	_player.shake("R");
    });
    _imageObj.BUTTON_TOP.addEventListener("mousedown", function() {
    	_player.shake("T");
    });

    _imageObj.BUTTON_BOTTOM.addEventListener("mousedown", function() {
        _player.shake("B");
    });

    /* 画面遷移用 */

    // メニュー --> ゲーム開始
    _imageObj.BUTTON_START.addEventListener("mousedown", function() {

        removeTickEvent(_tickListener);
        _soundObj.ZENKAI.stop();
        _soundObj.OK.play("none",0,0,0,1,0);
        gameState();
    });

    // メニュー --> HOW TO PLAY
    _imageObj.BUTTON_HOW.addEventListener("mousedown", function() {
        removeTickEvent(_tickListener);
        _soundObj.OK.play("none",0,0,0,1,0);
        howToPlayState();
    });

    // メニュー --> クレジット
    _imageObj.BUTTON_CREDIT.addEventListener("mousedown",function(){
        removeTickEvent(_tickListener);
        _soundObj.OK.play("none",0,0,0,1,0);
        creditState();      
    })

    // HOW --> メニュー
    _imageObj.BUTTON_BACK_MENU_FROM_HOW.addEventListener("mousedown",function(){
        endHowToPlay();
        _soundObj.BACK.play("none",0,0,0,1,0);
        menuState();    
    })

    // クレジッド --> メニュー
    _imageObj.BUTTON_BACK_MENU_FROM_CREDIT.addEventListener( 'mousedown', function() {
        _soundObj.BACK.play("none",0,0,0,1,0);
        menuState();
    });

    // ゲームオーバー --> メニュー
    _imageObj.BUTTON_BACK_MENU_FROM_GAME.addEventListener( 'mousedown', function() {
        removeTickEvent(_tickListener);
        _soundObj.BACK.play("none",0,0,0,1,0);
        menuState();
    });

    // ゲームリスタート
    _imageObj.BUTTON_RESTART.addEventListener( 'mousedown', function() {
        removeTickEvent(_tickListener);
        _soundObj.BACK.play("none",0,0,0,1,0);
        gameState();
    });


    /* ログイン */
    _imageObj.BUTTON_TWITTER_LOGIN.addEventListener("mousedown", function(){
        _soundObj.OK.play("none",0,0,0,1,0);
        alertify.confirm("ランキングシステムにログインします！", function(result){
            if(result){
                _soundObj.OK.play("none",0,0,0,1,0);
                window.location.href = config.api.login;
            }else{
                _soundObj.BACK.play("none",0,0,0,1,0);
            }
        })
    });

    _imageObj.BUTTON_TWITTER_LOGOUT.addEventListener("mousedown", function(){
        _soundObj.OK.play("none",0,0,0,1,0);
        alertify.confirm("ログアウトします。ランキング登録はログイン中のみ有効です。", function(result){
            if(result){
                _soundObj.OK.play("none",0,0,0,1,0);
                window.location.href = config.api.logout + "?redirect=shakarin";
            }else{
                _soundObj.BACK.play("none",0,0,0,1,0);
            }
        })
    });

    /* リンク */

    _textObj.LINK_SOUNDEFFECT.addEventListener("mousedown", function(){
        window.location.href = config.link.soundeffect;
    });
    _textObj.LINK_ONJIN.addEventListener("mousedown", function(){
        window.location.href = config.link.on_jin;
    });
    _textObj.LINK_SOKONTOKORO.addEventListener("mousedown", function(){
        window.location.href = config.link.sokontokoro;
    });
    _textObj.LINK_SANZASHI.addEventListener("mousedown", function(){
        window.location.href = config.link.sanzashi;
    });

    // メニュー画面　twitter home リンク
    _imageObj.BUTTON_TWITTER_TOP.addEventListener("mousedown", function(){
        window.location.href=config.link.t28_twitter;
    });

    // メニュー画面　ランキングページ　リンク
    _imageObj.BUTTON_RANKING.addEventListener("mousedown",function(){
        window.location.href = "http://games.sokontokoro-factory.net/ranking/?game=shakarin"
    })

    // ゲームオーバー画面のつぶやきリンク
    _imageObj.BUTTON_TWITTER_GAMEOVER_RIN.addEventListener("mousedown", function(){
        window.location.href="https://twitter.com/intent/tweet?hashtags=しゃかりん！&text="+getTweetText()+"&url=http://games.sokontokoro-factory.net/shakarin/";
    });

    /* サウンド用イベント */
    window.addEventListener("blur", function(){
        soundTurnOff();
        createjs.Ticker.setPaused(true);
    });
    window.addEventListener("focus", function(){      
        soundTurnOn();
        createjs.Ticker.setPaused(false);
    });
    _ssObj.BUTTON_SOUND_SS.addEventListener("mousedown", function(){
        _soundObj.TURN_SWITCH.play("none",0,0,0,1,0);
        if(_isSoundMute){
            _ssObj.BUTTON_SOUND_SS.gotoAndPlay("on");
            soundTurnOn();
        }else{
            _ssObj.BUTTON_SOUND_SS.gotoAndPlay("off");
            soundTurnOff(); 
        }
    });
}

