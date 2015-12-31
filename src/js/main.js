window.onload = function(){

	/*---------- ログインチェック ----------*/
	// 完了後にコンテンツオブジェクトのセットアップを開始する
	_deferredCheckLogin = loginSystem_deferred()
	
	/*---------- ゲーム画面の初期化 ----------*/
	_screenScale = initScreenScale(
		config.system.gamescrean.height, 
		config.system.gamescrean.width);     // 背景イラストの幅);	// 拡大率の計算
	_gameStage = new createjs.Stage("gameScrean");
	_gameScrean = getScreen(
		"gameScrean",
		config.system.gamescrean.height, 
		config.system.gamescrean.width,
		_screenScale);

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