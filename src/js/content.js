function loadAnimation(){
    


    var q = new createjs.LoadQueue();
    q.setMaxConnections(6);

    q.loadManifest([
        {
            id : "LOAD_KOTORI",
            src: "img/LOAD_KOTORI.png"
        }
    ]);
    q.addEventListener("complete", function(){

        var bitmap = new createjs.Bitmap(q.getResult("LOAD_KOTORI"));
        bitmap.scaleY = bitmap.scaleX = _screenScale;


        bitmap.x = _gameScrean.width*0.5;
        bitmap.y = _gameScrean.height*0.5;
        bitmap.regX = bitmap.image.width/2;
        bitmap.regY = bitmap.image.height/2;
     
        createjs.Tween.get(bitmap, {loop:true})
            .to({rotation:360}, 1000);

        _gameStage.removeAllChildren();
        _gameStage.addChild(bitmap);

        _tickListener = createjs.Ticker.addEventListener("tick", function(){
            _gameStage.update();
        });
        loadContent();
    });



}

function loadContent(){

    _queue = new createjs.LoadQueue()
    _queue.installPlugin(createjs.Sound);
    _queue.setMaxConnections(6);
    _queue.addEventListener("complete", handleComplete);


    //マニフェストファイルを読み込む----------     
    _queue.loadManifest(manifest.image);
    _queue.loadManifest(manifest.ss);
    _queue.loadManifest(manifest.sound);
}

// ロードイベント -----------------------------------

function handleComplete() {



    _deferredCheckLogin.always(function(){
        setImageContent();
        setSpriteSheetContents();
        setSoundContent();
        setTextContent();
        createjs.Ticker.removeEventListener("tick", _tickListener);

        addAllEventListener();
        topState();

    })

}


//ロードしたコンテンツをセット------------------------------------------
function setImageContent(){

    for(var key in properties.image){
        _imageObj[key] = new createjs.Bitmap(_queue.getResult(properties.image[key].id));
        _imageObj[key].x = _gameScrean.width * properties.image[key].ratioX;
        _imageObj[key].y = _gameScrean.height * properties.image[key].ratioY;
        _imageObj[key].regX = _imageObj[key].image.width/2;
        _imageObj[key].regY = _imageObj[key].image.height/2;
        _imageObj[key].scaleY = _imageObj[key].scaleX = _screenScale * properties.image[key].scale;
        _imageObj[key].alpha = properties.image[key].alpha;
    }

    if(_isLogin){
        _imageObj.TWITTER_ICON = new createjs.Bitmap(_user.iconURL);
        _imageObj.TWITTER_ICON.x = _gameScrean.width * properties.api.TWITTER_ICON.ratioX;
        _imageObj.TWITTER_ICON.y = _gameScrean.height * properties.api.TWITTER_ICON.ratioY;
        _imageObj.TWITTER_ICON.regX = 0;
        _imageObj.TWITTER_ICON.regY = 73;
        _imageObj.TWITTER_ICON.scaleY = _imageObj.TWITTER_ICON.scaleX = _screenScale * properties.api.TWITTER_ICON.scale;
        _imageObj.TWITTER_ICON.alpha = properties.api.TWITTER_ICON.alpha;
    }
}

function setSpriteSheetContents(){

    for(var key in properties.ss){

        var spriteSheet = new createjs.SpriteSheet({
            images:[_queue.getResult(properties.ss[key].id)],
            frames: properties.ss[key].frames,
            animations: properties.ss[key].animations
        });

        _ssObj[key] = new createjs.Sprite(spriteSheet, properties.ss[key].firstAnimation);
        _ssObj[key].x = _gameScrean.width * properties.ss[key].ratioX;
        _ssObj[key].y = _gameScrean.height * properties.ss[key].ratioY;
        _ssObj[key].regX = properties.ss[key].frames.width/2;
        _ssObj[key].regY = properties.ss[key].frames.height/2;
        _ssObj[key].scaleY = _ssObj[key].scaleX = _screenScale;
    }
}


function setSoundContent(){

    for(var key in properties.sound){
        _soundObj[key] = createjs.Sound.createInstance(properties.sound[key].id);
    }
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


function setTextProperties(target, x, y, size, family, align, height){
    target.x = x;
    target.y = y;
    target.font = size + "px " + family;
    target.textAlign = align;
    target.lineHeight = height;
}


function setTextContent(){

    for(var key in properties.text){
        _textObj[key] = new createjs.Text();
        _textObj[key].x = _gameScrean.width * properties.text[key].ratioX;
        _textObj[key].y = _gameScrean.height * properties.text[key].ratioY;
        _textObj[key].font = _gameScrean.width * properties.text[key].size + "px " + properties.text[key].family;
        _textObj[key].color = properties.text[key].color;
        _textObj[key].textAlign = properties.text[key].align;
        _textObj[key].lineHeight = _gameScrean.width * properties.text[key].lineHeight;
        _textObj[key].text = properties.text[key].text;
    }
}



