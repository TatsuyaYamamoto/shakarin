import State from '../state.js';
import Util from '../util.js'
import { properties } from '../config.js'

export default class TopEngine {
    constructor(callbackMenuGameState){
        this.callbackMenuGameState = callbackMenuGameState;

        this.handleLinkButtonEventListener().add();
    }

    start(){
        Util.addChildren([
            State.object.image.BACKGROUND,
            TopEngine.getTitleLogChild(State.playCharacter),
            State.object.text.START
        ]);
        State.gameStage.update();

        if(State.object.sound.ZENKAI.playState != createjs.Sound.PLAY_SUCCEEDED){
            State.object.sound.ZENKAI.play("none",0,0,-1,0.4,0);
        }
    }

    static getTitleLogChild(playCharacter){
        switch(playCharacter){
            case properties.player.RIN:
                return State.gameStage.addChild(State.object.image.TITLE_LOGO);
        }
    }

    /*******************************
     * 画面遷移ボタンイベント
     * @returns {{add: add, remove: remove}}
     */
    handleLinkButtonEventListener(){
        const goToMenu= ()=>{
            this.handleLinkButtonEventListener().remove();
            State.object.sound.OK.play("none",0,0,0,1,0);

            this.callbackMenuGameState();
        };

        return {
            add: ()=> {
                State.object.image.BACKGROUND.addEventListener('mousedown', goToMenu);
            },
            remove: ()=> {
                State.object.image.BACKGROUND.removeAllEventListeners('mousedown');
            }
        };
    }
}