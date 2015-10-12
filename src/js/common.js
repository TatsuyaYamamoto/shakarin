// グローバル変数----------------------------------------
var _gameStage;
var _gameScrean;
var _screenScale;

var _gameFrame;
var _nextCheckFrame;
var _gameScore;

var _tickListener;

var _queue;
var _isSoundMute = false;

var _playCharacter = "rin";
var _player;
var _shakeCount;

var _isLogin = false;
var _deferredCheckLogin;


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
}


//ゲームスクリーンサイズ初期化用-----------------------
function initGameScreenScale(){

	if(window.innerHeight/window.innerWidth < config.system.gamescrean.height　/　config.system.gamescrean.width){
		_screenScale = window.innerHeight/config.system.gamescrean.height;
	}else{
		_screenScale = window.innerWidth/config.system.gamescrean.width;
	}

	_gameScrean.height = config.system.gamescrean.height * _screenScale;
	_gameScrean.width = config.system.gamescrean.width * _screenScale;

}

function addChildren(array){
    for(var key in array){
        _gameStage.addChild(array[key]);
    }
}


// アイコン画像URL取得-------------

function setUserInfo(){

    var d = $.Deferred();

    var dfd1 = $.ajax({
        type: "GET",
        url: config.api.origin + "/api/game/users/me",
        xhrFields: {
            withCredentials: true
        }
    });
    var dfd2 = $.ajax({
        type: "GET",
        url: config.api.origin + "/api/twitter/users/me",
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        }
    });

    $.when(dfd1, dfd2).done(function(data1,data2){

        _user.id = data1[0].user_id;
        _user.name = data1[0].user_name;
        _user.iconURL = data2[0].profile_image_url.replace("_normal", "_bigger");

        d.resolve();
    }).fail(function(){
        d.reject();
    });
    return d.promise();
}

// キーボードキー
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

// ランキング登録-------------
function registration(){

    $.ajax({
        type: "POST",
        url: config.api.origin + "/api/game/scores/shakarin",
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json',
        data: JSON.stringify({
            category: "",
            point: _gameScore
        })
    }).done(function(data, status, xhr) {
        alertify.log("ランキングシステム　通信完了！", "success", 3000);
        // drowRegistrationInfo();
    }).fail(function(){

        alertify.confirm("ログインセッションが無効になっています。再ログインします。", function(result){
            if(result){
                window.location.href = config.api.origin + config.api.path.login + "?game_name=shakarin";
            }
        })
    });
}


function drowRegistrationInfo(){
    // Graphicsのインスタンスを作成します。
    var graphics = new createjs.Graphics();
    graphics.beginFill("#55acee");

    var height = _textObj.REGISTRATION.getMeasuredHeight();
    var width = _textObj.REGISTRATION.getMeasuredWidth()*1.5;

    graphics
         .moveTo(0,0)
         .lineTo(width,0)
         .lineTo(width,height)
         .lineTo(0,height)
         .closePath();

    var shape = new createjs.Shape(graphics);
    shape.regX = _textObj.REGISTRATION.getMeasuredWidth()/2;
    shape.regY = _textObj.REGISTRATION.getMeasuredHeight()/2;
    shape.x = _textObj.REGISTRATION.x * 0.5;
    shape.y = _textObj.REGISTRATION.y + _textObj.REGISTRATION.getMeasuredHeight()/4;

    shape.alpha = 0;
    _textObj.REGISTRATION.alpha = 0;

    _gameStage.addChild(shape);
    _gameStage.addChild(_textObj.REGISTRATION);

    // フェードインアニメーション
    createjs.Tween.get(shape).to({alpha:1}, config.system.anime.registrationFeedTime);
    createjs.Tween.get(_textObj.REGISTRATION).to({alpha:1}, config.system.anime.registrationFeedinTime);
}



//イベントリスナー登録--------------------------------

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
        createjs.Ticker.removeEventListener("tick", _tickListener);
        _soundObj.ZENKAI.stop();
        _soundObj.OK.play("none",0,0,0,1,0);
        gameState();
    });

    // メニュー --> HOW TO PLAY
    _imageObj.BUTTON_HOW.addEventListener("mousedown", function() {
        createjs.Ticker.removeEventListener("tick", _tickListener);
        _soundObj.OK.play("none",0,0,0,1,0);
        howToPlayState();
    });

    // メニュー --> クレジット
    _imageObj.BUTTON_CREDIT.addEventListener("mousedown",function(){
        createjs.Ticker.removeEventListener("tick", _tickListener);
        _soundObj.OK.play("none",0,0,0,1,0);
        creditState();      
    })

    // HOW --> メニュー
    _imageObj.BUTTON_BACK_MENU_FROM_HOW.addEventListener("mousedown",function(){
        createjs.Ticker.removeEventListener("tick", _tickListener);
        _soundObj.BACK.play("none",0,0,0,1,0);
        //キーボード用keycodeevent削除
        window.removeEventListener("keydown", keyDownEvent);
        menuState();    
    })

    // クレジッド --> メニュー
    _imageObj.BUTTON_BACK_MENU_FROM_CREDIT.addEventListener( 'mousedown', function() {
        _soundObj.BACK.play("none",0,0,0,1,0);
        menuState();
    });

    // ゲームオーバー --> メニュー
    _imageObj.BUTTON_BACK_MENU_FROM_GAME.addEventListener( 'mousedown', function() {
        createjs.Ticker.removeEventListener("tick", _tickListener);
        _soundObj.BACK.play("none",0,0,0,1,0);
        menuState();
    });

    // ゲームリスタート
    _imageObj.BUTTON_RESTART.addEventListener( 'mousedown', function() {
        createjs.Ticker.removeEventListener("tick", _tickListener);
        _soundObj.BACK.play("none",0,0,0,1,0);
        gameState();
    });


    /* ログイン */
    _imageObj.BUTTON_TWITTER_LOGIN.addEventListener("mousedown", function(){
        _soundObj.OK.play("none",0,0,0,1,0);
        alertify.confirm("ランキングシステムにログインします！", function(result){
            if(result){
                _soundObj.OK.play("none",0,0,0,1,0);
                window.location.href = config.api.origin + config.api.path.login + "?game_name=shakarin";
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
                window.location.href = config.api.origin + config.api.path.logout + "?game_name=shakarin";
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
    // _imageObj.BUTTON_TWITTER_TOP.addEventListener("mousedown", function(){
    //     window.location.href=config.link.t28_twitter;
    // });
    // _ssObj.BUTTON_TWITTER_GAMEOVER.addEventListener("mousedown", function(){
    //     window.location.href="https://twitter.com/intent/tweet?hashtags=しゃかりん！&text="+getTweetText()+"&url=http://games.sokontokoro-factory.net/shakarin/";
    // });

    _imageObj.BUTTON_RANKING.addEventListener("mousedown",function(){
        window.location.href = "http://games.sokontokoro-factory.net/ranking/?game_name=shakarin"
    })

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

