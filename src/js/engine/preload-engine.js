import State from '../state.js';
import { config, properties, manifest } from '../config.js';

export default class PreloadState{
    constructor(callback){
        this.queue = new createjs.LoadQueue();
        this.callback = callback;
    }

    /*****************************
     * ContentStateのエントリーメソッド
     */
    start(){
        // ローディングアニメーション
        var q = new createjs.LoadQueue();
        q.setMaxConnections(6);

        q.loadManifest(manifest.load);
        q.addEventListener("complete", ()=>{

            var bitmap = new createjs.Bitmap(q.getResult("LOAD_IMG"));
            bitmap.scaleY = bitmap.scaleX = State.screenScale;
            bitmap.x = State.gameScrean.width*0.5;
            bitmap.y = State.gameScrean.height*0.5;
            bitmap.regX = bitmap.image.width/2;
            bitmap.regY = bitmap.image.height/2;

            createjs.Tween.get(bitmap, {loop:true})
                .to({rotation:360}, 1000);

            State.gameStage.removeAllChildren();
            State.gameStage.addChild(bitmap);

            this.loadContents();
        });
    }


    loadContents(){
        this.queue.installPlugin(createjs.Sound);
        this.queue.setMaxConnections(6);

        //マニフェストファイルを読み込む----------
        this.queue.loadManifest(manifest.image);
        this.queue.loadManifest(manifest.ss);
        this.queue.loadManifest(manifest.sound);

        this.queue.addEventListener("complete", ()=>{
            // すべてのコンテンツに設定を付与する
            Object.keys(properties.ss).forEach((key)=> {
                State.object.ss[key] = this.getSpriteSheetContents(properties.ss[key]);
            });
            Object.keys(properties.sound).forEach((key)=> {
                State.object.sound[key] = this.getSoundContent(properties.sound[key]);
            });
            Object.keys(properties.text).forEach((key)=> {
                State.object.text[key] = this.getTextContent(properties.text[key]);
            });
            Object.keys(properties.image).forEach((key)=> {
                State.object.image[key] = this.getImageContent(properties.image[key]);
            });

            State.deferredCheckLogin.then(
                (response)=>{
                    Object.keys(properties.asyncImage).forEach((key)=> {
                        State.object.image[key] = this.getAsyncImageContent(properties.asyncImage[key]);
                    });
                    this.callback();
                },
                (error)=>{
                    this.callback();
                });
        });
    }




    //ロードしたコンテンツをセット------------------------------------------
    getImageContent(property){
        var image = new createjs.Bitmap(this.queue.getResult(property.id));
        image.x = State.gameScrean.width * property.ratioX;
        image.y = State.gameScrean.height * property.ratioY;
        image.regX = image.image.width/2;
        image.regY = image.image.height/2;
        image.scaleY = image.scaleX = State.screenScale * property.scale;
        image.alpha = property.alpha;
        return image;
    }

    getAsyncImageContent(property){

        var image = new createjs.Bitmap(property.url);
        image.x = State.gameScrean.width * property.ratioX;
        image.y = State.gameScrean.height * property.ratioY;
        // image.regX = image.width/2;
        // image.regY = image.height/2;
        image.scaleY = image.scaleX = State.screenScale * property.scale;
        image.alpha = property.alpha;

        // _imageObj.TWITTER_ICON.regX = 0;
        // _imageObj.TWITTER_ICON.regY = 73;

        return image;
    }

    getSpriteSheetContents(property){
        var spriteSheet = new createjs.SpriteSheet({
            images:[this.queue.getResult(property.id)],
            frames: property.frames,
            animations: property.animations
        });
        var ss = new createjs.Sprite(spriteSheet, property.firstAnimation);
        ss.x = State.gameScrean.width * property.ratioX;
        ss.y = State.gameScrean.height * property.ratioY;
        ss.regX = property.frames.width/2;
        ss.regY = property.frames.height/2;
        ss.scaleY = ss.scaleX = State.screenScale;

        return ss;
    }

    getSoundContent(property){
        return createjs.Sound.createInstance(property.id);
    }
    getTextContent(property){
        var text = new createjs.Text();
        text.x = State.gameScrean.width * property.ratioX;
        text.y = State.gameScrean.height * property.ratioY;
        text.font = State.gameScrean.width * property.size + "px " + property.family;
        text.color = property.color;
        text.textAlign = property.align;
        text.lineHeight = State.gameScrean.width * property.lineHeight;
        text.text = property.text;

        return text;
    }
}