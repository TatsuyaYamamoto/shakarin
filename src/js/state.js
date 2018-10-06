export default {
    gameStage: null,
    gameScrean: null,
    screenScale: null,

    gameFrame: 0,
    nextCheckFrame: 0,
    gameScore: 0,

    tickListener: null,

    isSoundMute: false,

    playCharacter: "rin",
    player: null,
    shakeCount: null,

    deferredCheckLogin: null,
    isLogin: false,

    user: {
        id: "",
        name: "",
        iconURL: ""
    },
    object: {
        image: {},
        ss: {},
        sound: {},
        text: {}
    }
};