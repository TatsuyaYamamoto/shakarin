// ゲームスクリーンサイズ初期化用
function initGameScreen(){

    var height = config.system.gamescrean.height;   // 背景イラストの高さ
    var width = config.system.gamescrean.width;     // 背景イラストの幅

    if(window.innerHeight/window.innerWidth < height/width){
        _screenScale = window.innerHeight/height;
    }else{
        _screenScale = window.innerWidth/width;
    }

    _gameScrean.height = height * _screenScale;
    _gameScrean.width = width * _screenScale;

}

function addChildren(array){
    for(var key in array){
        _gameStage.addChild(array[key]);
    }
}

function showText(text, x, y, size, family, align, height){
    var textObj = new createjs.Text();
    textObj.x = x;
    textObj.y = y;
    textObj.font = size + "px " + family;
    textObj.textAlign = align;
    textObj.lineHeight = height;
    textObj.text = text;

    _gameStage.addChild(textObj);
    _gameStage.update();
}

function setTextProperties(target, x, y, size, family, align, height){
    target.x = x;
    target.y = y;
    target.font = size + "px " + family;
    target.textAlign = align;
    target.lineHeight = height;
}

function soundTurnOff(){
    _isSoundMute = true;
    for(var key in _soundObj){
        if(properties.sound[key].canMute){
            _soundObj[key].muted = true;
        }
    }
}

function soundTurnOn(){
    _isSoundMute = false;
    for(var key in _soundObj){
        if(properties.sound[key].canMute){
            _soundObj[key].muted = false;
        }
    }
}