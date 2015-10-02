window.onload = function(){


	// ログインチェック
	// 完了後にコンテンツオブジェクトのセットアップを開始する
	_DeferredCheckLogin = $.Deferred();
	setUserInfo().done(function(){
		_IsLogin = true;
		_DeferredCheckLogin.resolve();
	}).fail(function(){
		_IsLogin = false;
		_DeferredCheckLogin.reject();
	});
	_DeferredCheckLogin.promise();


	//ゲーム画面の初期
	_GameStage = new createjs.Stage("gameScrean");
	_GameScrean = document.getElementById("gameScrean");

	//拡大縮小率の計算
	initGameScreenScale();

	var loading = new createjs.Text();
    setTextProperties(loading, _GameScrean.width*0.5, _GameScrean.height*0.5, _GameScrean.width*0.04, "Courier", "center", _GameScrean.width*0.04);
    loading.text = "loading..."
    _GameStage.addChild(loading);
    _GameStage.update();

	//canvas要素内でのスマホでのスライドスクロール禁止
	$(_GameScrean).on('touchmove.noScroll', function(e) {
		e.preventDefault();
	});

	//canvasステージ内でのタッチイベントの有効化
	if (createjs.Touch.isSupported()) {
		createjs.Touch.enable(_GameStage);
	}


	//ゲーム用タイマーの設定
    createjs.Ticker.setFPS(config.system.FPS);
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;

	// TODO createjsにcross originの画像を読み込まない
	createjs.DisplayObject.suppressCrossDomainErrors = true;


	//コンテンツのロードステートに移行
	var ua = navigator.userAgent;

	if(/iPhone/.test(ua)) {
	    _GameStage.removeAllChildren();
	    var text = new createjs.Text();
	    setTextProperties(text, _GameScrean.width*0.5, _GameScrean.height*0.5, _GameScrean.width*0.05, "Courier", "center", _GameScrean.width*0.04);
	    text.text = "-Please tap on the display!-"

	    _GameStage.addChild(text);
	    _GameStage.update();

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

