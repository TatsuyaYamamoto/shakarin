//ゲーム初期化-----------------------------------------
function gameInit(){

	//honoka or erichiを作成
	//初期値はplayCharacter=honoka
	_Player = new Player(_PlayCharacter);

    //フレーム数リセット
	_GameFrame = 0;
	_ShakeCount = 0;
	_nextCheckFrame = config.system.firstCheckFrame;

	//ボタン無効化
    allButtonDisable();


	//キーボード用keycodeevent登録
	window.addEventListener("keydown", keyDownEvent);


	// 一時的
	addChildren([
		_ImageObj.BACKGROUND, 
		_ImageObj.BUTTON_LEFT, 
		_ImageObj.BUTTON_RIGHT, 
		_ImageObj.BUTTON_UP, 
		_ImageObj.BUTTON_DOWN, 
		_Player.img, 
		_ImageObj.RAMEN, 
		_TextObj.GAME_COUNT
		])

    _SoundObj.GAME_LOOP.play("any",0,0,-1,0.6,0);

	//タイマーに関数セット
    // _TickListener = createjs.Ticker.addEventListener("tick", gameReady);
	timerAnimation();

	_TickListener = createjs.Ticker.addEventListener("tick", processGame);
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

	_GameFrame ++;

	_TextObj.GAME_COUNT.text = _ShakeCount + "しゃか！";

	if (_GameFrame === _nextCheckFrame){
		_Player.changeDirection();
		_nextCheckFrame = getNextCheckFrame();
		checkButtonStatus();
	    _SoundObj.GAME_LOOP.paused= true;
	}
	_GameStage.update();

}

function timerAnimation(){

    createjs.Tween.get(_ImageObj.RAMEN)
        .to({x : _GameScrean.width * 0.9}, config.system.timeLength)
            .to({y : _GameScrean.height * 0.9}, config.system.timeLength.y)
                .to({x : _GameScrean.width * 0.1}, config.system.timeLength.x)
                    .to({y : _GameScrean.height * 0.1}, config.system.timeLength.y)
                        .call(finish);
}


// 敵出現---------------------------------------
function getNextCheckFrame(){

    var i = Math.floor(Math.random() * 40) + 30;
	return _GameFrame + i;
}



// 操作ボタンの状態操作--------------------------------------------

// ボタン状態の確認
function checkButtonStatus(){

    allButtonDisable();

    switch(_Player.getDirection()){
    	case "L":
			leftButtonEnable();
			break;
		case "R":
			rightButtonEnable();
			break;
		case "U":
			upButtonEnable();
			break;
		case "D":
			downButtonEnable();
			break;
    }
}


// 有効化
function rightButtonEnable(){
	_ImageObj.BUTTON_RIGHT.mouseEnabled = true;
   	_ImageObj.BUTTON_RIGHT.alpha=0.7;
}
function leftButtonEnable(){
	_ImageObj.BUTTON_LEFT.mouseEnabled = true;
 	_ImageObj.BUTTON_LEFT.alpha=0.7;
}
function upButtonEnable(){
	_ImageObj.BUTTON_UP.mouseEnabled = true;
	_ImageObj.BUTTON_UP.alpha=0.7;
}
function downButtonEnable(){
	_ImageObj.BUTTON_DOWN.mouseEnabled = true;
	_ImageObj.BUTTON_DOWN.alpha=0.7;
}

// 無効化
function rightButtonDisable(){
	_ImageObj.BUTTON_RIGHT.mouseEnabled = false;
	_ImageObj.BUTTON_RIGHT.alpha=0.2;
}
function leftButtonDisable(){
	_ImageObj.BUTTON_LEFT.mouseEnabled = false;
	_ImageObj.BUTTON_LEFT.alpha=0.2;
}
function upButtonDisable(){
	_ImageObj.BUTTON_UP.mouseEnabled = false;
	_ImageObj.BUTTON_UP.alpha=0.2;
}
function downButtonDisable(){
	_ImageObj.BUTTON_DOWN.mouseEnabled = false;
	_ImageObj.BUTTON_DOWN.alpha=0.2;
}
function allButtonDisable(){
	_ImageObj.BUTTON_RIGHT.mouseEnabled = false;
	_ImageObj.BUTTON_LEFT.mouseEnabled = false;
	_ImageObj.BUTTON_UP.mouseEnabled = false;
	_ImageObj.BUTTON_DOWN.mouseEnabled = false;
	_ImageObj.BUTTON_RIGHT.alpha=0.2;
	_ImageObj.BUTTON_LEFT.alpha=0.2;
	_ImageObj.BUTTON_UP.alpha=0.2;
	_ImageObj.BUTTON_DOWN.alpha=0.2;
}


// ゲーム終了------------------------------------------------------

function finish(){
	_gameScore = _ShakeCount;
	_Player.setDirection("N");
	_Player.wait();
	checkButtonStatus()

    _SoundObj.GAME_LOOP.stop();
	_SoundObj.GAME_END.play("late",0,0,0,0.6,0);

	// createjs.Ticker.reset();
    createjs.Ticker.removeEventListener("tick", _TickListener);


	//キーボード用keycodeevent削除
	window.removeEventListener("keydown", keyDownEvent);
	//stateマシン内、ゲームオーバー状態に遷移

}

