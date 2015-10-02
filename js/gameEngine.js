//ゲーム初期化-----------------------------------------
function gameInit(){

	//honoka or erichiを作成
	//初期値はplayCharacter=honoka
	_Player = new Player(_PlayCharacter);

    //フレーム数リセット
	_GameFrame = 0;
	_ShakeCount = 0;
	_nextCheckFrame = getNextCheckFrame();

	//ボタン有効化
    rightButtonEnable();
    leftButtonEnable();

	//キーボード用keycodeevent登録
	window.addEventListener("keydown", keyDownEvent);

	timerAnimation();

	// 一時的
	drawGameScrean();

	//タイマーに関数セット
    // _TickListener = createjs.Ticker.addEventListener("tick", gameReady);
	_TickListener = createjs.Ticker.addEventListener("tick", processGame);
}


function keyDownEvent(event){

	if(event.which == 37 && _ImageObj.BUTTON_LEFT.mouseEnabled){
    	_Player.shake("L");
	}
	if(event.keyCode == 39 && _ImageObj.BUTTON_RIGHT.mouseEnabled){
    	_Player.shake("R");
	}
	if(event.keyCode == 38 && _ImageObj.BUTTON_UP.mouseEnabled){
    	_Player.shake("U");		
	}
	if(event.keyCode == 40 && _ImageObj.BUTTON_DOWN.mouseEnabled){
    	_Player.shake("D");
	}
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

	if (_GameFrame == _nextCheckFrame){
		_Player.changeDirection();
		_nextCheckFrame = getNextCheckFrame();
	}
	checkButtonStatus();
	_GameStage.update();

	if(config.system.finishFrame === _GameFrame){
		finish();
	}

}

function timerAnimation(){
	
}


// 敵出現---------------------------------------
function getNextCheckFrame(){

    var i = Math.floor(Math.random() * 20) + 30;
	return _GameFrame + i;
}




// 描画処理-----------------------------------------
function drawGameScrean(){

	_GameStage.addChild(_ImageObj.BACKGROUND);
	_GameStage.addChild(_ImageObj.BUTTON_LEFT);
	_GameStage.addChild(_ImageObj.BUTTON_RIGHT);
	_GameStage.addChild(_ImageObj.BUTTON_UP);
	_GameStage.addChild(_ImageObj.BUTTON_DOWN);
    _GameStage.addChild(_Player.img);
    _GameStage.addChild(_TextObj.GAME_COUNT);
}






// 操作ボタンの状態操作系---------------------------

// ボタン状態の確認
function checkButtonStatus(){

    leftButtonDisable();
	rightButtonDisable();
    upButtonDisable();
	downButtonDisable();


    if(_Player.direction == "L"){
        leftButtonEnable();
    };
	if(_Player.direction == "R"){
        rightButtonEnable();
    }
    if(_Player.direction == "U"){
        upButtonEnable();
    }
    if(_Player.direction == "D"){
        downButtonEnable();
    }
}


// 有効化
function rightButtonEnable(){
	_ImageObj.BUTTON_RIGHT.mouseEnabled = true;
   	_ImageObj.BUTTON_RIGHT.alpha=0.5;
}
function leftButtonEnable(){
	_ImageObj.BUTTON_LEFT.mouseEnabled = true;
 	_ImageObj.BUTTON_LEFT.alpha=0.5;
}
function upButtonEnable(){
	_ImageObj.BUTTON_UP.mouseEnabled = true;
	_ImageObj.BUTTON_UP.alpha=0.5;
}
function downButtonEnable(){
	_ImageObj.BUTTON_DOWN.mouseEnabled = true;
	_ImageObj.BUTTON_DOWN.alpha=0.5;
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



function finish(){
	_gameScore = _ShakeCount;



	// createjs.Ticker.reset();
    createjs.Ticker.removeEventListener("tick", _TickListener);


	//キーボード用keycodeevent削除
	// window.removeEventListener("keydown", keyDownEvent);
	//stateマシン内、ゲームオーバー状態に遷移
	alert("asd");
}

