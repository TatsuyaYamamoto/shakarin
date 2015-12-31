//ゲーム初期化-----------------------------------------
function gameInit(){

	//honoka or erichiを作成
	//初期値はplayCharacter=honoka
	_player = new Player(_playCharacter);

	gameStatusReset();
	//ボタン無効化
    allButtonDisable();


	//キーボード用keycodeevent登録
	window.addEventListener("keyup", keyDownEvent);


	// ゲームスタートカウントスタート
    // ランキング登録用トークン取得
    if(_isLogin){
		getSkntkrToken_deferred().done(function(){
		    _tickListener = createjs.Ticker.addEventListener("tick", gameReady);
		})
    }else{
	    _tickListener = createjs.Ticker.addEventListener("tick", gameReady);	
    }
	
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

			_soundObj.GAME_LOOP.play("any",0,0,0,1,0);

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

	// _player.setDirection("N");
	// _player.wait();
	_player.finish();

	_gameScore = _shakeCount;
	createjs.Tween.removeTweens(_imageObj.RAMEN);
    // _soundObj.GAME_LOOP.stop();
	// _soundObj.GAME_END.play("late",0,0,0,0.6,0);

	// createjs.Ticker.reset();
    createjs.Ticker.removeEventListener("tick", _tickListener);


	//キーボード用keycodeevent削除
	window.removeEventListener("keyup", keyDownEvent);
	//stateマシン内、ゲームオーバー状態に遷移
	gameOverState();
}

