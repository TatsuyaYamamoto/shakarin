// りんちゃん------------------------------------------------
function Player(playCharacter){


    switch(playCharacter){
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
                window.location.href = config.api.login + "?redirect_path=shakarin";
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
                window.location.href = config.api.login + "?redirect_path=shakarin";
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
                window.location.href = config.api.logout + "?redirect_path=shakarin";
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


// 設定ファイル---------------------------------

var config = {
    system: {
        FPS: 30,
        timeLength: 20000,
        gamescrean: {
            width: 640,
            height: 896
        },
        anime: {
            registrationFeedinTime: 500
        },
        difficultyLength: 0.3, 
        firstCheckFrame: 10
    },
    api:{
        login: "http://api.sokontokoro-factory.net/v1/auth/twitter/login",
        logout: "http://api.sokontokoro-factory.net/v1/auth/twitter/logout/",
        score: "http://api.sokontokoro-factory.net/v1/game/scores/shakarin/me/",
        user: "http://api.sokontokoro-factory.net/v1/game/users/me/"
    },
    link: {
        t28_twitter: "https://twitter.com/t28_tatsuya",
        sokontokoro: "http://sokontokoro-factory.net",
        sanzashi: "https://twitter.com/xxsanzashixx",
        soundeffect: "http://soundeffect-lab.info/",
        on_jin: "http://on-jin.com/"
    }
}


//定数----------------------------------------

var properties = {
    image: {
        TITLE_LOGO: {
            id : "TITLE_LOGO",
            ratioX: 0.5,
            ratioY: 0.5,
            scale: 1,
            alpha: 1
        },
        BACKGROUND: {
            id : "BACKGROUND",
            ratioX: 0.5,
            ratioY: 0.5,
            scale: 1,
            alpha: 1
        },
        GAMEOVER: {
            id : "GAMEOVER",
            ratioX: 0.5,
            ratioY: 0.35,
            scale: 1,
            alpha: 1
        },
        MENU_LOGO: {
            id : "MENU_LOGO",
            ratioX: 0.5,
            ratioY: 0.25,
            scale: 1,
            alpha: 1
        },
        BUTTON_LEFT: {
            id : "BUTTON_LR",
            ratioX: 0.1,
            ratioY: 0.6,
            scale: 1,
            alpha: 1
        },
        BUTTON_RIGHT: {
            id : "BUTTON_LR",
            ratioX: 0.9,
            ratioY: 0.6,
            scale: 1,
            alpha: 1
        },
        BUTTON_TOP: {
            id : "BUTTON_UD",
            ratioX: 0.48,
            ratioY: 0.3,
            scale: 1,
            alpha: 1
        },
        BUTTON_BOTTOM: {
            id : "BUTTON_UD",
            ratioX: 0.5,
            ratioY: 0.92,
            scale: 1,
            alpha: 1
        },
        RAMEN: {
            id : "RAMEN",
            ratioX: 0.1,
            ratioY: 0.12,
            scale: 1,
            alpha: 1
        },
        BUTTON_START: {
            id : "BUTTON_START",
            ratioX: 0.5,
            ratioY: 0.4,
            scale: 0.8,
            alpha: 1
        },
        BUTTON_HOW: {
            id : "BUTTON_HOW",
            ratioX: 0.5,
            ratioY: 0.54,
            scale: 0.8,
            alpha: 1
        },
        BUTTON_RANKING: {
            id : "BUTTON_RANKING",
            ratioX: 0.5,
            ratioY: 0.68,
            scale: 0.8,
            alpha: 1
        },
        BUTTON_CREDIT: {
            id : "BUTTON_CREDIT",
            ratioX: 0.5,
            ratioY: 0.82,
            scale: 0.8,
            alpha: 1
        },
        BUTTON_BACK_MENU_FROM_CREDIT: {
            id : "BUTTON_BACK_MENU",
            ratioX: 0.5,
            ratioY: 0.9,
            scale: 1,
            alpha: 1
        },
        BUTTON_BACK_MENU_FROM_HOW: {
            id : "BUTTON_BACK_MENU",
            ratioX: 0.15,
            ratioY: 0.9,
            scale: 1,
            alpha: 1
        },
        BUTTON_TWITTER_TOP: {
            id : "BUTTON_TWITTER_TOP",
            ratioX: 0.2,
            ratioY: 0.1,
            scale: 1,
            alpha: 1
        },
        BUTTON_TWITTER_GAMEOVER_RIN: {
            id : "BUTTON_TWITTER_GAMEOVER_RIN",
            ratioX: 0.2,
            ratioY: 0.15,
            scale: 1,
            alpha: 1
        },
        BUTTON_TWITTER_LOGIN: {
            id : "BUTTON_TWITTER_LOGIN",
            ratioX: 0.25,
            ratioY: 0.95,
            scale: 1,
            alpha: 1
        },
        BUTTON_TWITTER_LOGOUT: {
            id : "BUTTON_TWITTER_LOGOUT",
            ratioX: 0.4,
            ratioY: 0.95,
            scale: 1,
            alpha: 1
        },
        BUTTON_BACK_MENU_FROM_GAME: {
            id : "BUTTON_BACK_MENU",
            ratioX: 0.7,
            ratioY: 0.75,
            scale: 1,
            alpha: 1
        },
        BUTTON_RESTART: {
            id : "BUTTON_RESTART",
            ratioX: 0.3,
            ratioY: 0.75,
            scale: 1,
            alpha: 1
        },
        FLAG_START: {
            id : "FLAG_START",
            ratioX: 0.1,
            ratioY: 0.1,
            scale: 1,
            alpha: 1
        },
        FLAG_END: {
            id : "FLAG_END",
            ratioX: 0.9,
            ratioY: 0.1,
            scale: 1,
            alpha: 1
        }
    },
    ss: {
        RIN: {
            id : "SS_RIN",
            ratioX: 0.5,
            ratioY: 0.61,
            scale: 1,
            alpha: 1,
            frames: {
                width: 467,
                height: 467
            },
            animations: {
                N_wait: {
                    frames: [0]
                },
                R_wait: {
                    frames: [1]
                },
                R1: {
                    frames: [2]
                },
                R2: {
                    frames: [3]
                },
                L_wait: {
                    frames: [4]
                },
                L1: {
                    frames: [5]
                },
                L2: {
                    frames: [6]
                },
                T_wait: {
                    frames: [7]
                },
                T1: {
                    frames: [8]
                },
                T2: {
                    frames: [9]
                },
                B_wait: {
                    frames: [10]
                },
                B1: {
                    frames: [11]
                },
                B2: {
                    frames: [12]
                }
            },
            firstAnimation: "N_wait"
        },
        BUTTON_SOUND_SS: {
            id : "BUTTON_SOUND_SS",
            ratioX: 0.9,
            ratioY: 0.12,
            scale: 1,
            alpha: 1,
            frames:{
                width : 126,
                height : 118
            },
            animations: {
                on:{
                    frames: [1,2,3],
                    next: true,
                    speed: 0.12
                },
                off: {
                    frames: 0
                }
            },
            firstAnimation: "on"
        }
    },
    sound: {
        OK: {
            id: "SOUND_OK",
            canMute: true
        },
        BACK: {
            id: "SOUND_BACK",
            canMute: true
        },
        SHAKE: {
            id: "SOUND_SHAKE",
            canMute: true
        },
        GAME_LOOP: {
            id: "SOUND_GAME_LOOP",
            canMute: true
        },
        GAME_END: {
            id: "SOUND_GAME_END",
            canMute: true
        },
        ZENKAI: {
            id: "SOUND_ZENKAI",
            canMute: true
        },
        PI1: {
            id: "SOUND_PI1",
            canMute: true
        },
        PI2: {
            id: "SOUND_PI2",
            canMute: true
        },
        TURN_SWITCH: {
            id: "TURN_SWITCH",
            canMute: false
        }
    },
    text: {
        START: {
            ratioX: 0.5,
            ratioY: 0.93,
            size: 0.05,
            family: "Courier",
            align: "center",
            lineHeight: 0.04,
            text : "-Please tap on the display!-"
        },
        HOW_TO_PLAY: {
            ratioX: 0.5,
            ratioY: 0.05,
            size: 0.04,
            family: "Courier",
            align: "center",
            lineHeight: 0.05,
            text : "マラカスの練習中のりんちゃん！\r上下左右のボタンを向いているときにタップして\rしゃかしゃかさせよう！\r(キーボードの↑↓←→でもOK!)"
        },
        SCORE_COUNT: {
            ratioX: 0.95,
            ratioY: 0.18,
            size: 0.05,
            family: "Courier",
            align: "right",
            lineHeight: 0.04,
            text: ""
        },
        GAMESTART_COUNT: {
            ratioX: 0.5,
            ratioY: 0.2,
            size: 0.1,
            family: "Impact",
            align: "center",
            lineHeight: 0.07,
            text: ""
        },
        LINK_SOKONTOKORO: {
            ratioX: 0.5,
            ratioY: 0.15,
            size: 0.05,
            family: "Arial",
            align: "center",
            lineHeight: 0.07,
            text: "プログラム、音楽、思いつき：T28\rhttp://sokontokoro-factory.net"
        },
        LINK_SANZASHI: {
            ratioX: 0.5,
            ratioY: 0.3,
            size: 0.05,
            family: "Verdana",
            align: "center",
            lineHeight: 0.07,
            text: "イラスト：さんざし\rhttps://twitter.com/xxsanzashixx"
        },
        LINK_SOUNDEFFECT: {
            ratioX: 0.5,
            ratioY: 0.5,
            size: 0.04,
            family: "Courier",
            align: "center",
            lineHeight: 0.05,
            text: "効果音：効果音ラボ 樣\rhttp://soundeffect-lab.info/"
        },
        LINK_ONJIN: {
            ratioX: 0.5,
            ratioY: 0.6,
            size: 0.04,
            family: "Courier",
            align: "center",
            lineHeight: 0.05,
            text: "効果音：On-Jin ～音人～ 樣\rhttp://on-jin.com/"
        },
        LINK_LOVELIVE: {
            ratioX: 0.5,
            ratioY: 0.7,
            size: 0.04,
            family: "Courier",
            align: "center",
            lineHeight: 0.05,
            text: "プロジェクトラブライブ！\rhttp://www.lovelive-anime.jp"
        },
        REGISTRATION: {
            ratioX: 0.4,
            ratioY: 0.9,
            size: 0.04,
            family: "Courier",
            align: "center",
            color: "#ffffff",
            lineHeight: 0.1, 
            text: "ランキングシステム　通信完了！"
        }
    },
    api: {
        TWITTER_ICON: {
            id : "TWITTER_ICON",
            ratioX: 0,
            ratioY: 1,
            scale: 1.3,
            alpha: 1          
        }
    }
}

// 画像、音声ファイル---------------------------------
var manifest = {
    image: [
        {
            id : "TITLE_LOGO",
            src: "img/TITLE_LOGO.png"
        },
        {
            id : "BACKGROUND",
            src: "img/BACKGROUND.png"
        },
        {
            id : "MENU_LOGO",
            src: "img/MENU_LOGO.png"
        },
        {
            id : "BUTTON_START",
            src: "img/BUTTON_START.png"
        },
        {
            id : "BUTTON_HOW",
            src: "img/BUTTON_HOW.png"
        },
        {
            id : "BUTTON_CREDIT",
            src: "img/BUTTON_CREDIT.png"
        },
        {
            id : "BUTTON_RANKING",
            src: "img/BUTTON_RANKING.png"
        },
        {
            id : "BUTTON_LR",
            src: "img/BUTTON_LR.png"
        },
        {
            id : "BUTTON_UD",
            src: "img/BUTTON_UD.png"
        },
        {
            id : "BUTTON_TWITTER_TOP",
            src: "img/BUTTON_TWITTER_TOP.png"
        },
        {
            id : "RAMEN",
            src: "img/RAMEN.png"
        },
        {
            id : "GAMEOVER",
            src: "img/GAMEOVER.png"
        },
        {
            id : "BUTTON_BACK_MENU",
            src: "img/BUTTON_BACK_MENU.png"
        },
        {
            id : "BUTTON_RESTART",
            src: "img/BUTTON_RESTART.png"
        },
        {
            id : "BUTTON_TWITTER_LOGIN",
            src: "img/BUTTON_TWITTER_LOGIN.png"
        },
        {
            id : "BUTTON_TWITTER_LOGOUT",
            src: "img/BUTTON_TWITTER_LOGOUT.png"
        },
        {
            id : "BUTTON_TWITTER_GAMEOVER_RIN",
            src: "img/BUTTON_TWITTER_GAMEOVER_RIN.png"
        },
        {
            id : "FLAG_START",
            src: "img/FLAG_START.png"
        },
        {
            id : "FLAG_END",
            src: "img/FLAG_END.png"
        }
    ],
    ss:[
        {
            id : "SS_RIN",
            src: "img/SS_RIN.png"
        },
        {
            id : "BUTTON_SOUND_SS",
            src: "img/BUTTON_SOUND_SS.png"
        }
    ],
    sound: [
        {
            id : "SOUND_OK",
            src: "sound/OK.mp3"
        },
        {
            id : "SOUND_BACK",
            src: "sound/BACK.mp3"
        },
        {
            id : "SOUND_SHAKE",
            src: "sound/SHAKE.mp3"
        },
        {
            id : "SOUND_GAME_LOOP",
            src: "sound/GAME_LOOP.mp3"
        },
        {
            id : "SOUND_GAME_END",
            src: "sound/GAME_END.mp3"
        },
        {
            id : "SOUND_ZENKAI",
            src: "sound/ZENKAI.mp3"
        },
        {
            id : "SOUND_PI1",
            src: "sound/PI1.mp3"
        },
        {
            id : "SOUND_PI2",
            src: "sound/PI2.mp3"
        },
        {
            id : "TURN_SWITCH",
            src: "sound/TURN_SWITCH.mp3"
        }
    ],
    load: [
        {
            id : "LOAD_IMG",
            src: "img/LOAD_KOTORI.png"
        }
    ],
    api: [
        {
            id : "TWITTER_ICON",
            src: ""
        }
    ]
}
function preloadStart(callback){
    var _queue;

    // ローディングアニメーション
    var q = new createjs.LoadQueue();
    q.setMaxConnections(6);

    q.loadManifest(manifest.load);
    q.addEventListener("complete", function(){

        var bitmap = new createjs.Bitmap(q.getResult("LOAD_IMG"));
        bitmap.scaleY = bitmap.scaleX = _screenScale;
        bitmap.x = _gameScrean.width*0.5;
        bitmap.y = _gameScrean.height*0.5;
        bitmap.regX = bitmap.image.width/2;
        bitmap.regY = bitmap.image.height/2;
     
        createjs.Tween.get(bitmap, {loop:true})
            .to({rotation:360}, 1000);

        _gameStage.removeAllChildren();
        _gameStage.addChild(bitmap);

        _tickListener = createjs.Ticker.addEventListener("tick", function(){
            _gameStage.update();
        });
        load();
    });


    function load(){
        _queue = new createjs.LoadQueue()
        _queue.installPlugin(createjs.Sound);
        _queue.setMaxConnections(6);

        //マニフェストファイルを読み込む----------     
        _queue.loadManifest(manifest.image);
        _queue.loadManifest(manifest.ss);
        _queue.loadManifest(manifest.sound);

        _queue.addEventListener("complete", function(){

            _deferredCheckLogin.always(function(){
                // すべてのコンテンツに設定を付与する
                for(var key in properties.ss){
                    var property = properties.ss[key];
                    _ssObj[key] = getSpriteSheetContents(property);
                }
                for(var key in properties.sound){
                    var property = properties.sound[key];
                    _soundObj[key] = getSoundContent(property);
                }
                for(var key in properties.text){
                    var property = properties.text[key];
                    _textObj[key] = getTextContent(property);
                }
                for(var key in properties.image){
                    var property = properties.image[key];
                    _imageObj[key] = getImageContent(property)
                }

                // ローディングアニメーション停止  
                createjs.Ticker.removeEventListener("tick", _tickListener);
                // ロード完了後、コールバック
                callback();
            })
        });
    }

    //ロードしたコンテンツをセット------------------------------------------
    function getImageContent(property){
        var image = new createjs.Bitmap(_queue.getResult(property.id));
        image.x = _gameScrean.width * property.ratioX;
        image.y = _gameScrean.height * property.ratioY;
        image.regX = image.image.width/2;
        image.regY = image.image.height/2;
        image.scaleY = image.scaleX = _screenScale * property.scale;
        image.alpha = property.alpha;

        // if(_isLogin){
        //     _imageObj.TWITTER_ICON = new createjs.Bitmap(_user.iconURL);
        //     _imageObj.TWITTER_ICON.x = _gameScrean.width * properties.api.TWITTER_ICON.ratioX;
        //     _imageObj.TWITTER_ICON.y = _gameScrean.height * properties.api.TWITTER_ICON.ratioY;
        //     _imageObj.TWITTER_ICON.regX = 0;
        //     _imageObj.TWITTER_ICON.regY = 73;
        //     _imageObj.TWITTER_ICON.scaleY = _imageObj.TWITTER_ICON.scaleX = _screenScale * properties.api.TWITTER_ICON.scale;
        //     _imageObj.TWITTER_ICON.alpha = properties.api.TWITTER_ICON.alpha;
        // }
        return image;
    }

    function getSpriteSheetContents(property){
        var spriteSheet = new createjs.SpriteSheet({
            images:[_queue.getResult(property.id)],
            frames: property.frames,
            animations: property.animations
        });
        var ss = new createjs.Sprite(spriteSheet, property.firstAnimation);
        ss.x = _gameScrean.width * property.ratioX;
        ss.y = _gameScrean.height * property.ratioY;
        ss.regX = property.frames.width/2;
        ss.regY = property.frames.height/2;
        ss.scaleY = ss.scaleX = _screenScale;

        return ss;
    }
    function getSoundContent(property){
        var sound = createjs.Sound.createInstance(property.id);
        return sound;
    }
    function getTextContent(property){
        var text = new createjs.Text();
        text.x = _gameScrean.width * property.ratioX;
        text.y = _gameScrean.height * property.ratioY;
        text.font = _gameScrean.width * property.size + "px " + property.family;
        text.color = property.color;
        text.textAlign = property.align;
        text.lineHeight = _gameScrean.width * property.lineHeight;
        text.text = property.text;

        return text;
    }
}

//ゲーム初期化-----------------------------------------
function gameInit(){

	//honoka or erichiを作成
	//初期値はplayCharacter=honoka
	_player = new Player(_playCharacter);

	gameStatusReset();
	//ボタン無効化
    allButtonDisable();


	//キーボード用keycodeevent登録
	window.addEventListener("keydown", keyDownEvent);


	// ゲームスタートカウントスタート
    _tickListener = createjs.Ticker.addEventListener("tick", gameReady);
	
}




// ゲームスタートカウント-----------------------------------------
function gameReady(){
	_gameFrame ++;

	switch(_gameFrame){
		case 1:
		    _gameStage.addChild(_imageObj.BACKGROUND);
		    _gameStage.addChild(_player.img);
			_gameStage.update();
			break;	
		case 10:
		    _soundObj.PI1.play();
	        _textObj.GAMESTART_COUNT.text = "-2-";
		    _gameStage.addChild(_imageObj.BACKGROUND);
		    _gameStage.addChild(_textObj.GAMESTART_COUNT);
		    _gameStage.addChild(_player.img);
			_gameStage.update();
			break;
		case 30:
		    _soundObj.PI1.play();
	        _textObj.GAMESTART_COUNT.text = "-1-";
		    _gameStage.addChild(_imageObj.BACKGROUND);
		    _gameStage.addChild(_textObj.GAMESTART_COUNT);
		    _gameStage.addChild(_player.img);
			_gameStage.update();
			break;
		case 50:
		    _soundObj.PI2.play();
		    _gameStage.removeAllChildren();
	    	gameStatusReset();
		    createjs.Ticker.removeEventListener("tick", _tickListener);

			addChildren([
				_imageObj.BACKGROUND, 
				_imageObj.RAMEN, 
				_imageObj.FLAG_START,
				_imageObj.FLAG_END,
				_imageObj.BUTTON_LEFT, 
				_imageObj.BUTTON_RIGHT, 
				_imageObj.BUTTON_TOP, 
				_imageObj.BUTTON_BOTTOM, 
				_player.img, 
				_textObj.SCORE_COUNT
				]);


		    // タイマーアニメーション開始
			timerAnimation();
		    //ゲーム処理開始
			_tickListener = createjs.Ticker.addEventListener("tick", processGame);
			//キーボード用keycodeevent登録
			window.addEventListener("keydown", keyDownEvent);

			_soundObj.GAME_LOOP.play("any",0,0,-1,1,0);

			break;
	}
}

function gameStatusReset(){
	_gameFrame = 0;
	_gameScore = 0;
	_shakeCount = 0;
	_nextCheckFrame = config.system.firstCheckFrame;
}

// ゲーム処理-----------------------------------------
function processGame(){

	_gameFrame ++;


	// ボタンオブジェクトを作成


	_textObj.SCORE_COUNT.text = _shakeCount + "しゃか！";

	if (_gameFrame === _nextCheckFrame){
		_player.changeDirection();
		_nextCheckFrame = getNextCheckFrame();
		checkButtonStatus();
	}
	_gameStage.update();

}

// タイマーアニメーション---------------------------------

function timerAnimation(){
	_imageObj.RAMEN.x = _gameScrean.width * 0.1

    createjs.Tween.get(_imageObj.RAMEN)
        .to({x : _gameScrean.width * 0.9}, config.system.timeLength)
			.call(finish);
}



// 敵出現---------------------------------------
function getNextCheckFrame(){

    var i = Math.floor(Math.random() * 30) + 20;
	return _gameFrame + i;
}



// 操作ボタンの状態操作--------------------------------------------

// ボタン状態の確認
function checkButtonStatus(){

    allButtonDisable();

    switch(_player.getDirection()){
    	case "L":
			leftButtonEnable();
			break;
		case "R":
			rightButtonEnable();
			break;
		case "T":
			topButtonEnable();
			break;
		case "B":
			bottomButtonEnable();
			break;
    }
}


// 有効化
function rightButtonEnable(){
	_imageObj.BUTTON_RIGHT.mouseEnabled = true;
   	_imageObj.BUTTON_RIGHT.alpha=0.7;
}
function leftButtonEnable(){
	_imageObj.BUTTON_LEFT.mouseEnabled = true;
 	_imageObj.BUTTON_LEFT.alpha=0.7;
}
function topButtonEnable(){
	_imageObj.BUTTON_TOP.mouseEnabled = true;
	_imageObj.BUTTON_TOP.alpha=0.7;
}
function bottomButtonEnable(){
	_imageObj.BUTTON_BOTTOM.mouseEnabled = true;
	_imageObj.BUTTON_BOTTOM.alpha=0.7;
}

// 無効化
function rightButtonDisable(){
	_imageObj.BUTTON_RIGHT.mouseEnabled = false;
	_ImageObj.BUTTON_RIGHT.alpha=0.2;
}
function leftButtonDisable(){
	_imageObj.BUTTON_LEFT.mouseEnabled = false;
	_imageObj.BUTTON_LEFT.alpha=0.2;
}
function topButtonDisable(){
	_imageObj.BUTTON_TOP.mouseEnabled = false;
	_imageObj.BUTTON_TOP.alpha=0.2;
}
function downButtonDisable(){
	_imageObj.BUTTON_BOTTOM.mouseEnabled = false;
	_imageObj.BUTTON_BOTTOM.alpha=0.2;
}
function allButtonDisable(){
	_imageObj.BUTTON_RIGHT.mouseEnabled = false;
	_imageObj.BUTTON_LEFT.mouseEnabled = false;
	_imageObj.BUTTON_TOP.mouseEnabled = false;
	_imageObj.BUTTON_BOTTOM.mouseEnabled = false;
	_imageObj.BUTTON_RIGHT.alpha=0.2;
	_imageObj.BUTTON_LEFT.alpha=0.2;
	_imageObj.BUTTON_TOP.alpha=0.2;
	_imageObj.BUTTON_BOTTOM.alpha=0.2;
}


// ゲーム終了------------------------------------------------------

function finish(){

	_player.setDirection("N");
	_player.wait();

	_gameScore = _shakeCount;
	createjs.Tween.removeTweens(_imageObj.RAMEN);
    _soundObj.GAME_LOOP.stop();
	_soundObj.GAME_END.play("late",0,0,0,0.6,0);

	// createjs.Ticker.reset();
    createjs.Ticker.removeEventListener("tick", _tickListener);


	//キーボード用keycodeevent削除
	window.removeEventListener("keydown", keyDownEvent);
	//stateマシン内、ゲームオーバー状態に遷移
	gameOverState();
}


//ゲーム初期化-----------------------------------------
function howToPlayInit(){

    // りんちゃん作成
    _player = new Player(_playCharacter);
    gameStatusReset();
    allButtonDisable();

    //キーボード用keycodeevent登録
    window.addEventListener("keydown", keyDownEvent);
    
    // switch(playCharacter){
    //     case "honoka":
    //         textObj.TEXT_HOW_TO.text = text_how_to;
    //         break;
    //     case "erichi":
    //         textObj.TEXT_HOW_TO.text = text_how_to_E;
    //         break;
    // }
    // gameStage.addChild(textObj.TEXT_HOW_TO);



    addChildren([
        _imageObj.BACKGROUND, 
        _imageObj.BUTTON_LEFT, 
        _imageObj.BUTTON_RIGHT, 
        _imageObj.BUTTON_TOP, 
        _imageObj.BUTTON_BOTTOM,
        _imageObj.BUTTON_BACK_MENU_FROM_HOW, 
        _textObj.HOW_TO_PLAY,
        _player.img
        ]);

	// HowToPlayアニメーション開始
	_tickListener = createjs.Ticker.addEventListener("tick", processHowToPlay);
}

//ゲーム処理-----------------------------------------
function processHowToPlay(){

	if(_gameFrame % 20 === 0){
        _player.changeDirection();
        _player.wait();
        checkButtonStatus();
	}

	_gameFrame ++;
	_gameStage.update();
}

window.onload = function(){

	/*---------- ログインチェック ----------*/
	// 完了後にコンテンツオブジェクトのセットアップを開始する
	_deferredCheckLogin = $.Deferred();
	setUserInfo().done(function(){
		// ログイン成功通知
		alertify.log("ランキングシステム ログイン中！", "success", 3000);
		_isLogin = true;
		_deferredCheckLogin.resolve();
	}).fail(function(){
		_isLogin = false;
		_deferredCheckLogin.reject();
	});
	_deferredCheckLogin.promise();

	/*---------- ゲーム画面の初期化 ----------*/
	_gameStage = new createjs.Stage("gameScrean");
	_gameScrean = document.getElementById("gameScrean");
	initGameScreen();	// 拡大率の計算、height, widthの設定

	showText("loading...", 
		_gameScrean.width*0.5, 
		_gameScrean.height*0.5, 
		_gameScrean.width*0.04, 
		"Courier", 
		"center", 
		_gameScrean.width*0.04);

	/*---------- 基本設定 ----------*/

	//canvas要素内でのスマホでのスライドスクロール禁止
	$(_gameScrean).on('touchmove.noScroll', function(e) {
		e.preventDefault();
	});

	//canvasステージ内でのタッチイベントの有効化
	if (createjs.Touch.isSupported()) {
		createjs.Touch.enable(_gameStage);
	}

	//ゲーム用タイマーの設定
    createjs.Ticker.setFPS(config.system.FPS);
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;

	// TODO createjsにcross originの画像を読み込まない
	createjs.DisplayObject.suppressCrossDomainErrors = true;

	/*---------- preloadStateへ移行 ----------*/
	// iPhoneの場合、任意のイベントを実行前に音声を再生すると、音源が途切れる
	if(/iPhone/.test(navigator.userAgent)) {
	    _gameStage.removeAllChildren();
	    showText("-Please tap on the display!-", 
	    	_gameScrean.width*0.5, 
	    	_gameScrean.height*0.5, 
	    	_gameScrean.width*0.05, 
	    	"Courier", 
	    	"center", 
	    	_gameScrean.width*0.04);

	    window.addEventListener("touchstart", start);
	}
	else{
		// ログイン確認後ロード画面へ遷移
		preloadState();
	}

	function start(){
	    window.removeEventListener("touchstart", start);
		preloadState();
	}
}
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

    _tickListener = createjs.Ticker.addEventListener("tick", function(){
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

    _tickListener = createjs.Ticker.addEventListener("tick", function(){
        _gameStage.update();
    });
}
// ゲームスクリーンサイズ初期化用
function initGameScreen(){

    var height = config.system.gamescrean.height;   // 背景イラストの高さ
    var width = config.system.gamescrean.width;     // 背景イラストの幅

    if(window.innerHeight/window.innerWidth < height/width){
        _screenScale = window.innerHeight/height;
    }else{
        _screenScale = window.innerWidth/width;
    }

    _gameScrean.height = height * _screenScale;
    _gameScrean.width = width * _screenScale;

}

function addChildren(array){
    for(var key in array){
        _gameStage.addChild(array[key]);
    }
}

function showText(text, x, y, size, family, align, height){
    var textObj = new createjs.Text();
    textObj.x = x;
    textObj.y = y;
    textObj.font = size + "px " + family;
    textObj.textAlign = align;
    textObj.lineHeight = height;
    textObj.text = text;

    _gameStage.addChild(textObj);
    _gameStage.update();
}

function setTextProperties(target, x, y, size, family, align, height){
    target.x = x;
    target.y = y;
    target.font = size + "px " + family;
    target.textAlign = align;
    target.lineHeight = height;
}

function soundTurnOff(){
    _isSoundMute = true;
    for(var key in _soundObj){
        if(properties.sound[key].canMute){
            _soundObj[key].muted = true;
        }
    }
}

function soundTurnOn(){
    _isSoundMute = false;
    for(var key in _soundObj){
        if(properties.sound[key].canMute){
            _soundObj[key].muted = false;
        }
    }
}