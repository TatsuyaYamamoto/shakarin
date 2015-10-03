// グローバル変数----------------------------------------
var _GameStage;
var _GameScrean;
var _ScreenScale;

var _GameFrame;
var _nextCheckFrame;
var _gameScore;

var _TickListener;

var _Queue;
var _IsSoundMute = false;

var _PlayCharacter = "rin";
var _Player;
var _ShakeCount;

var _IsLogin = false;
var _DeferredCheckLogin;


// エレメントオブジェクト-----------------------------
// 画像、スプライトシート、音声、テキスト、ユーザー情報

var _ImageObj = {};
var _SSObj = {};
var _SoundObj = {};
var _TextObj = {};
var _User = {
    id: "",
    name: "",
    iconURL: ""
}




//初期化----------------------------------------

var TWITTER_ICON_URL;
var screen_name;
//テキスト

var TEXT_HOW_TO;
var TEXT_GAME_COUNT;
var TEXT_START;

var TEXT_RANKING;

var TEXT_LINK_LOVELIVE;
var TEXT_LINK_ME;
var TEXT_LINK_SAN;
var TEXT_LINK_1;
var TEXT_LINK_2;

var text_how_to = "車道ど真ん中の穂乃果ちゃんを車が容赦なく襲う！\r \rなかなか始まらないススメ→トゥモロウを尻目に\r穂乃果ちゃんを助けてあげなくちゃ！\r \r \r \r \r \r \r \r \r \r \r \r \r \r \rLEFT, RIGHTボタン(キーボードの←→でも可！)\rで、かわせ！ホノカチャン！\r \r「私、やっぱりやる！やるったらやる！」"
var text_how_to_E = "車道ど真ん中の生徒会長を車が容赦なく襲う！\r \rなかなか始まらないススメ→トゥモロウを尻目に\rエリチカを助けてあげなくちゃ！\r \r \r \r \r \r \r \r \r \r \r \r \r \r \rLEFT, RIGHTボタン(キーボードの←→でも可！)\rで、かしこく！かわせ！エリーチカ！！(KKE)\r \r「生徒会の許可ぁ？認められないチカ！」"
var text_game_count_L = "よけたー : "
var text_game_count_R = "台"


//ゲームスクリーンサイズ初期化用-----------------------
function initGameScreenScale(){

	if(window.innerHeight/window.innerWidth < config.system.gamescrean.height　/　config.system.gamescrean.width){
		_ScreenScale = window.innerHeight/config.system.gamescrean.height;
	}else{
		_ScreenScale = window.innerWidth/config.system.gamescrean.width;
	}

	_GameScrean.height = config.system.gamescrean.height * _ScreenScale;
	_GameScrean.width = config.system.gamescrean.width * _ScreenScale;

}

function addChildren(array){
    for(var key in array){
        _GameStage.addChild(array[key]);
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

        user.id = data1[0].user_id;
        user.name = data1[0].user_name;
        user.iconURL = data2[0].profile_image_url.replace("_normal", "_bigger");

        d.resolve();
    }).fail(function(){
        d.reject();
    });
    return d.promise();
}

// キーボードキー
function keyDownEvent(event){

    if(event.which == 37 && _ImageObj.BUTTON_LEFT.mouseEnabled){
        _Player.shake("L");
    }
    if(event.keyCode == 39 && _ImageObj.BUTTON_RIGHT.mouseEnabled){
        _Player.shake("R");
    }
    if(event.keyCode == 38 && _ImageObj.BUTTON_TOP.mouseEnabled){
        _Player.shake("T");     
    }
    if(event.keyCode == 40 && _ImageObj.BUTTON_BOTTOM.mouseEnabled){
        _Player.shake("B");
    }
}

//イベントリスナー登録--------------------------------

function addAllEventListener(){
    _ImageObj.BUTTON_LEFT.addEventListener("mousedown", function() {
    	_Player.shake("L");
    });

    _ImageObj.BUTTON_RIGHT.addEventListener("mousedown", function() {
    	_Player.shake("R");
    });
    _ImageObj.BUTTON_TOP.addEventListener("mousedown", function() {
    	_Player.shake("T");
    });

    _ImageObj.BUTTON_BOTTOM.addEventListener("mousedown", function() {
    	_Player.shake("B");
    });
}

