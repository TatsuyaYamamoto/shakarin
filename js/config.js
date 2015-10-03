// 設定ファイル---------------------------------

var config = {
    system: {
        FPS: 30,
        timeLength: {
            x: 640 * 3,
            y: 896 * 3
        },
        gamescrean: {
            width: 640,
            height: 896
        },
        anime: {
            registrationFeedTime: 500
        },
        difficultyLength: 0.3, 
        firstCheckFrame: 10
    },
    api:{
        origin: "http://ec2-54-65-78-59.ap-northeast-1.compute.amazonaws.com:8080", 
        path: {
            login: "/api/twitter/oauth/login",
            logout: "/api/twitter/oauth/logout",
            check: "/api/twitter/users/me",
            registration_post: "/api/game/scores/honocar",
            scores_get: "/api/game/scores/honocar"
        }
    },
    link: {
        t28_twitter: "https://twitter.com/t28_tatsuya",
        sokontokoro: "http://sokontokoro-factory.net",
        sanzashi: "https://twitter.com/xxsanzashixx",
        soundeffect: "http://soundeffect-lab.info/",
        on_jin: "http://on-jin.com/"
    }
}


//定数----------------------------------------

var properties = {
    image: {
        BACKGROUND: {
            id : "BACKGROUND",
            ratioX: 0.5,
            ratioY: 0.5,
            scale: 1,
            alpha: 1
        },
        BUTTON_LEFT: {
            id : "BUTTON_LR",
            ratioX: 0.1,
            ratioY: 0.5,
            scale: 1,
            alpha: 1
        },
        BUTTON_RIGHT: {
            id : "BUTTON_LR",
            ratioX: 0.9,
            ratioY: 0.5,
            scale: 1,
            alpha: 1
        },
        BUTTON_UP: {
            id : "BUTTON_UD",
            ratioX: 0.5,
            ratioY: 0.1,
            scale: 1,
            alpha: 1
        },
        BUTTON_DOWN: {
            id : "BUTTON_UD",
            ratioX: 0.5,
            ratioY: 0.9,
            scale: 1,
            alpha: 1
        },
        RAMEN: {
            id : "RAMEN",
            ratioX: 0.1,
            ratioY: 0.1,
            scale: 0.3,
            alpha: 1
        }
    },
    ss: {
        RIN: {
            id : "SS_RIN",
            ratioX: 0.5,
            ratioY: 0.5,
            scale: 1,
            alpha: 1,
            frames: {
                width:200,
                height:200
            },
            animations: {
                N_wait: {
                    frames: [0]
                },
                R_wait: {
                    frames: [1]
                },
                R1: {
                    frames: [2]
                },
                R2: {
                    frames: [3]
                },
                L_wait: {
                    frames: [4]
                },
                L1: {
                    frames: [5]
                },
                L2: {
                    frames: [6]
                },
                U_wait: {
                    frames: [7]
                },
                U1: {
                    frames: [8]
                },
                U2: {
                    frames: [9]
                },
                D_wait: {
                    frames: [10]
                },
                D1: {
                    frames: [11]
                },
                D2: {
                    frames: [12]
                }
            },
            firstAnimation: "N_wait"
        }
    },
    sound: {
        SHAKE: {
            id: "SOUND_SHAKE",
            canMute: true
        }
    },
    text: {
        GAME_COUNT: {
            ratioX: 0.8,
            ratioY: 0.1,
            size: 0.05,
            family: "Courier",
            align: "center",
            lineHeight: 0.04
        }
    },
    api: {
        TWITTER_ICON: {
            id : "TWITTER_ICON",
            ratioX: 0,
            ratioY: 1,
            scale: 1.3,
            alpha: 1          
        }
    }
}

// 画像、音声ファイル---------------------------------
var manifest = {
    image: [
        {
            id : "BACKGROUND",
            src: "img/BACKGROUND.png"
        },
        {
            id : "BUTTON_LR",
            src: "img/BUTTON_LR.png"
        },
        {
            id : "BUTTON_UD",
            src: "img/BUTTON_UD.png"
        },
        {
            id : "RAMEN",
            src: "img/RAMEN.png"
        }
    ],
    ss:[
        {
            id : "SS_RIN",
            src: "img/SS_RIN.png"
        }
    ],
    sound: [
        {
            id : "SOUND_SHAKE",
            src: "sound/SHAKE.mp3"
        }
    ],
    api: [
        {
            id : "TWITTER_ICON",
            src: ""
        }
    ]
}