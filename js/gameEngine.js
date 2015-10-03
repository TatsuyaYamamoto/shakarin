//ゲーム初期化-----------------------------------------
function gameInit(){

	//honoka or erichiを作成
	//初期値はplayCharacter=honoka
	_player = new Player(_playCharacter);

    //フレーム数リセット
	_gameFrame = 0;
	_shakeCount = 0;
	_nextCheckFrame = config.system.firstCheckFrame;

	//ボタン無効化
    allButtonDisable();


	//キーボード用keycodeevent登録
	window.addEventListener("keydown", keyDownEvent);


	// 一時的
	addChildren([
		_imageObj.BACKGROUND, 
		_imageObj.BUTTON_LEFT, 
		_imageObj.BUTTON_RIGHT, 
		_imageObj.BUTTON_TOP, 
		_imageObj.BUTTON_BOTTOM, 
		_player.img, 
		_imageObj.RAMEN, 
		_textObj.GAME_COUNT
		])

    _soundObj.GAME_LOOP.play("any",0,0,-1,0.6,0);

	//タイマーに関数セット
    // _tickListener = createjs.Ticker.addEventListener("tick", gameReady);
	timerAnimation();

	_tickListener = createjs.Ticker.addEventListener("tick", processGame);
}




// ゲームスタートカウント-----------------------------------------
// function gameReady(){
// 	GameFrame ++;

// 	switch(gameFrame){
// 		case 1:
// 		    gameStage.addChild(imageObj.GAME_BACKGROUND);
// 		    gameStage.addChild(player.img);
// 			gameStage.update();
// 			break;	
// 		case 10:
// 		    soundObj.SOUND_PI1.play();
// 	        textObj.TETX_GAMESTART_COUNT.text = "-2-";
// 		    gameStage.addChild(imageObj.GAME_BACKGROUND);
// 		    gameStage.addChild(textObj.TETX_GAMESTART_COUNT);
// 		    gameStage.addChild(player.img);
// 			gameStage.update();
// 			break;
// 		case 30:
// 		    soundObj.SOUND_PI1.play();
// 	        textObj.TETX_GAMESTART_COUNT.text = "-1-";
// 		    gameStage.addChild(imageObj.GAME_BACKGROUND);
// 		    gameStage.addChild(textObj.TETX_GAMESTART_COUNT);
// 		    gameStage.addChild(player.img);
// 			gameStage.update();
// 			break;
// 		case 50:
// 		    soundObj.SOUND_PI2.play();
// 		    gameStage.removeAllChildren();
// 	    	gameStatusReset();
// 			drawGameScrean();
// 		    createjs.Ticker.removeEventListener("tick", _TickListener);

// 		    //ゲーム処理開始
// 			tickListener = createjs.Ticker.addEventListener("tick", processGame);
// 			//キーボード用keycodeevent登録
// 			window.addEventListener("keydown", keyDownEvent);
// 		    _SoundObj.SOUND_SUSUME_LOOP.play("late",0,0,-1,0.6,0);
// 			break;
// 	}
// }


// ゲーム処理-----------------------------------------
function processGame(){

	_gameFrame ++;

	_textObj.GAME_COUNT.text = _shakeCount + "しゃか！";

	if (_gameFrame === _nextCheckFrame){
		_player.changeDirection();
		_nextCheckFrame = getNextCheckFrame();
		checkButtonStatus();
	    _soundObj.GAME_LOOP.paused= true;
	}
	_gameStage.update();

}

function timerAnimation(){

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
	_gameScore = _shakeCount;
	_player.setDirection("N");
	_player.wait();
	checkButtonStatus()

    _soundObj.GAME_LOOP.stop();
	_soundObj.GAME_END.play("late",0,0,0,0.6,0);

	// createjs.Ticker.reset();
    createjs.Ticker.removeEventListener("tick", _tickListener);


	//キーボード用keycodeevent削除
	window.removeEventListener("keydown", keyDownEvent);
	//stateマシン内、ゲームオーバー状態に遷移

}

