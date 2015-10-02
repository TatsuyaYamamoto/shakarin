//ゲーム初期化-----------------------------------------
function gameInit(){

	//honoka or erichiを作成
	//初期値はplayCharacter=honoka
	_Player = new Player(_PlayCharacter);

    //フレーム数リセット
	_GameFrame = 0;
	_ShakeCount = 0;
	//ボタン有効化
    rightButtonEnable();
    leftButtonEnable();

	//タイマーに関数セット
    // _TickListener = createjs.Ticker.addEventListener("tick", gameReady);
	_TickListener = createjs.Ticker.addEventListener("tick", processGame);

	//キーボード用keycodeevent登録
	window.addEventListener("keydown", keyDownEvent);

	// 一時的
	drawGameScrean();
}


function keyDownEvent(event){
	if(event.which == 37 && _ImageObj.BUTTON_LEFT.mouseEnabled){
		clickButtonLeft();
	}
	if(event.keyCode == 39 && _ImageObj.BUTTON_RIGHT.mouseEnabled){
		clickButtonRight();			
	}
	if(event.keyCode == 38 && _ImageObj.BUTTON_UP.mouseEnabled){
		clickButtonUp();			
	}
	if(event.keyCode == 40 && _ImageObj.BUTTON_DOWN.mouseEnabled){
		clickButtonDown();			
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

	_GameStage.update();

}

// 描画処理-----------------------------------------
function drawGameScrean(){

	_GameStage.addChild(_ImageObj.GAME_BACKGROUND);
	_GameStage.addChild(_ImageObj.BUTTON_LEFT);
	_GameStage.addChild(_ImageObj.BUTTON_RIGHT);
	_GameStage.addChild(_ImageObj.BUTTON_UP);
	_GameStage.addChild(_ImageObj.BUTTON_DOWN);
    _GameStage.addChild(_Player.img);

}






// 操作ボタンの状態操作系---------------------------

// ボタン状態の確認
function checkButton(){
    if(_Player.lane == 0){
        leftButtonDisable();
    };
	if(_Player.lane == 1){
        leftButtonEnable();
    }
    if(_Player.lane == 2){
        rightButtonEnable();
    }
    if(_Player.lane == 3){
        rightButtonDisable();
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

// 無効化
function rightButtonDisable(){
	_ImageObj.BUTTON_RIGHT.mouseEnabled = false;
	_ImageObj.BUTTON_RIGHT.alpha=0.2;
}
function leftButtonDisable(){
	_ImageObj.BUTTON_LEFT.mouseEnabled = false;
	_ImageObj.BUTTON_LEFT.alpha=0.2;
}



// イベント処理-------------------------------------

function clickButtonRight(){
    _SoundObj.SHAKE.play("none",0,0,0,1,0);
	checkButton();
}

function clickButtonLeft(){

    _SoundObj.SHAKE.play("none",0,0,0,1,0);
	checkButton();
}
function clickButtonUp(){

    _SoundObj.SHAKE.play("none",0,0,0,1,0);
	checkButton();
}
function clickButtonDown(){

    _SoundObj.SHAKE.play("none",0,0,0,1,0);
	checkButton();
}


