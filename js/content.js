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
        bitmap.scaleY = bitmap.scaleX = _ScreenScale;

        bitmap.x = _GameScrean.width*0.5;
        bitmap.y = _GameScrean.height*0.5;
        bitmap.regX = bitmap.image.width/2;
        bitmap.regY = bitmap.image.height/2;
     
        createjs.Tween.get(bitmap, {loop:true})
            .to({rotation:360}, 1000);

        _GameStage.removeAllChildren();
        _GameStage.addChild(bitmap);

        _TickListener = createjs.Ticker.addEventListener("tick", function(){
            _GameStage.update();
        });

        loadContent();
    });

}

function loadContent(){

    _Queue = new createjs.LoadQueue(false)
    _Queue.installPlugin(createjs.Sound);
    _Queue.setMaxConnections(6);
    _Queue.addEventListener("complete", handleComplete);


    //マニフェストファイルを読み込む----------     
    _Queue.loadManifest(manifest.image);
    _Queue.loadManifest(manifest.ss);
    _Queue.loadManifest(manifest.sound);
}

// ロードイベント -----------------------------------

function handleComplete() {

    _DeferredCheckLogin.always(function(){
        setImageContent();
        setSpriteSheetContents();
        setSoundContent();
        setTextContent();
        createjs.Ticker.removeEventListener("tick", _TickListener);

        addAllEventListener();
        //開発用、topState()
        gameState();

    })

}


//ロードしたコンテンツをセット------------------------------------------
function setImageContent(){

    for(var key in properties.image){
        _ImageObj[key] = new createjs.Bitmap(_Queue.getResult(properties.image[key].id));
        _ImageObj[key].x = _GameScrean.width * properties.image[key].ratioX;
        _ImageObj[key].y = _GameScrean.height * properties.image[key].ratioY;
        _ImageObj[key].regX = _ImageObj[key].image.width/2;
        _ImageObj[key].regY = _ImageObj[key].image.height/2;
        _ImageObj[key].scaleY = _ImageObj[key].scaleX = _ScreenScale * properties.image[key].scale;
        _ImageObj[key].alpha = properties.image[key].alpha;
    }

    if(_IsLogin){
        _ImageObj.TWITTER_ICON = new createjs.Bitmap(user.iconURL);
        _ImageObj.TWITTER_ICON.x = _GameScrean.width * properties.api.TWITTER_ICON.ratioX;
        _ImageObj.TWITTER_ICON.y = _GameScrean.height * properties.api.TWITTER_ICON.ratioY;
        _ImageObj.TWITTER_ICON.regX = 0;
        _ImageObj.TWITTER_ICON.regY = 73;
        _ImageObj.TWITTER_ICON.scaleY = _ImageObj.TWITTER_ICON.scaleX = _ScreenScale * properties.api.TWITTER_ICON.scale;
        _ImageObj.TWITTER_ICON.alpha = properties.api.TWITTER_ICON.alpha;
    }
}

function setSpriteSheetContents(){

    for(var key in properties.ss){

        var spriteSheet = new createjs.SpriteSheet({
            images:[_Queue.getResult(properties.ss[key].id)],
            frames: properties.ss[key].frames,
            animations: properties.ss[key].animations
        });

        _SSObj[key] = new createjs.Sprite(spriteSheet, properties.ss[key].firstAnimation);
        _SSObj[key].x = _GameScrean.width * properties.ss[key].ratioX;
        _SSObj[key].y = _GameScrean.height * properties.ss[key].ratioY;
        _SSObj[key].regX = properties.ss[key].frames.width/2;
        _SSObj[key].regY = properties.ss[key].frames.height/2;
        _SSObj[key].scaleY = _SSObj[key].scaleX = _ScreenScale;
    }
}


function setSoundContent(){

    for(var key in properties.sound){
        _SoundObj[key] = createjs.Sound.createInstance(properties.sound[key].id);
    }
}

function soundTurnOff(){
    _IsSoundMute = true;
    for(var key in soundObj){
        if(properties.sound[key].canMute){
            _SoundObj[key].muted = true;
        }
    }
}

function soundTurnOn(){

    _IsSoundMute = false;
    for(var key in soundObj){
        if(properties.sound[key].canMute){
            _SoundObj[key].muted = false;
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
        _TextObj[key] = new createjs.Text();
        _TextObj[key].x = _GameScrean.width * properties.text[key].ratioX;
        _TextObj[key].y = _GameScrean.height * properties.text[key].ratioY;
        _TextObj[key].font = _GameScrean.width * properties.text[key].size + "px " + properties.text[key].family;
        _TextObj[key].color = properties.text[key].color;
        _TextObj[key].textAlign = properties.text[key].align;
        _TextObj[key].lineHeight = _GameScrean.width * properties.text[key].lineHeight;
    }


    // _TextObj.START.text = "-Please tap on the display!-"

}



