window.onload = function(){


	// ログインチェック
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


	//ゲーム画面の初期
	_gameStage = new createjs.Stage("gameScrean");
	_gameScrean = document.getElementById("gameScrean");

	//拡大縮小率の計算
	initGameScreenScale();

	var loading = new createjs.Text();
    setTextProperties(loading, _gameScrean.width*0.5, _gameScrean.height*0.5, _gameScrean.width*0.04, "Courier", "center", _gameScrean.width*0.04);
    loading.text = "loading..."
    _gameStage.addChild(loading);
    _gameStage.update();

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


	//コンテンツのロードステートに移行
	var ua = navigator.userAgent;

	if(/iPhone/.test(ua)) {
	    _gameStage.removeAllChildren();
	    var text = new createjs.Text();
	    setTextProperties(text, _gameScrean.width*0.5, _gameScrean.height*0.5, _gameScrean.width*0.05, "Courier", "center", _gameScrean.width*0.04);
	    text.text = "-Please tap on the display!-"

	    _gameStage.addChild(text);
	    _gameStage.update();

	    window.addEventListener("touchstart", start);

	}
	else{
		// ログイン確認後ロード画面へ遷移
		loadState();
	}
}


function start(){
    window.removeEventListener("touchstart", start);
	loadState();
}

