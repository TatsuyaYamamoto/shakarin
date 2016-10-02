import State from '../state.js';
import loadImageBase64 from '../loadImageBase64.js'
import { properties, manifest } from '../config.js';

export default class PreloadState{
    constructor(tick, callback){
        this.tick = tick;
        this.callback = callback;
    }

    /*****************************
     * ContentStateのエントリーメソッド
     */
    start(){
        this.loadAnimeImage = this.getLoadAnimeImage();
        createjs.Tween.get(this.loadAnimeImage, {loop:true}).to({rotation:360}, 1000);
        this.loadAnimeText = this.getLoadAnimeText();

        State.gameStage.removeAllChildren();
        State.gameStage.addChild(this.loadAnimeImage);
        State.gameStage.addChild(this.loadAnimeText);

        /* アニメーション用tickを開始して、読み込み開始 */
        this.tick.add(()=>{
            State.gameStage.update();
        });

        this.getLoadingQueue().load();
    }

    onComplete(queue){
        // すべてのコンテンツに設定を付与する
        Object.keys(properties.ss).forEach((key)=> {
            const prop = properties.ss[key];
            State.object.ss[key] = this.getSpriteSheetContents(prop, queue.getResult(prop.id));
        });
        Object.keys(properties.sound).forEach((key)=> {
            State.object.sound[key] = this.getSoundContent(properties.sound[key]);
        });
        Object.keys(properties.text).forEach((key)=> {
            State.object.text[key] = this.getTextContent(properties.text[key]);
        });
        Object.keys(properties.image).forEach((key)=> {
            const prop = properties.image[key];
            State.object.image[key] = this.getImageContent(prop, queue.getResult(prop.id));
        });

        State.deferredCheckLogin.then(
            (response)=>{
                Object.keys(properties.asyncImage).forEach((key)=> {
                    State.object.image[key] = this.getAsyncImageContent(properties.asyncImage[key]);
                });
                this.tick.remove();
                this.callback();
            },
            (error)=>{
                this.tick.remove();
                this.callback();
            });
    }

    onProgress(event){
        this.loadAnimeText.text = `loading...${Math.floor(event.loaded * 100)}%`
    }

    // preload engine用queueの構築 -----------------------------------
    getLoadingQueue(){
        const queue = new createjs.LoadQueue();

        queue.installPlugin(createjs.Sound);
        queue.setMaxConnections(6);

        queue.loadManifest(manifest.image, false);
        queue.loadManifest(manifest.ss, false);
        queue.loadManifest(manifest.sound, false);

        queue.on("progress", (event)=>{
            this.onProgress(event);
        }, this);
        queue.on("complete", ()=>{
            this.onComplete(queue);
        }, this);

        return queue;
    }

    getLoadAnimeImage(){
        const loadImage = new createjs.Bitmap(loadImageBase64);
        loadImage.scaleY = loadImage.scaleX = State.screenScale;
        loadImage.x = State.gameScrean.width * 0.5;
        loadImage.y = State.gameScrean.height * 0.5;
        loadImage.regX = loadImage.image.width * 0.5;
        loadImage.regY = loadImage.image.height * 0.5;

        return loadImage;
    }
    getLoadAnimeText(){
        const loadText = new createjs.Text();
        loadText.x = State.gameScrean.width * 1/2;
        loadText.y = State.gameScrean.height * 7/8;
        loadText.font = State.gameScrean.width * 0.05 + "px " + "Courier";
        loadText.textAlign = "center";

        return loadText;
    }

    //ロードしたコンテンツをセット------------------------------------------
    getImageContent(property, loadedImage){
        var image = new createjs.Bitmap(loadedImage);
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
        image.scaleY = image.scaleX = State.screenScale * property.scale;
        image.alpha = property.alpha;

        return image;
    }

    getSpriteSheetContents(property, loadedImage){
        var spriteSheet = new createjs.SpriteSheet({
            images:[loadedImage],
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