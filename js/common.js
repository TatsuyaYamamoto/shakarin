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




// ----------------------------------------

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

//イベントリスナー登録--------------------------------

function addAllEventListener(){
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
}

