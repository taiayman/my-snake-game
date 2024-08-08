function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage, true);
		
	s_bMobile = isMobile();
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	    createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
    };
    
    this.preloaderReady = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        this._loadImages();
        _bUpdate = true;
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._initSounds = function(){
        Howler.mute(!s_bAudioActive);
        
        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        s_aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'appear_fruit',loop:false,volume:1, ingamename: 'appear_fruit'});
        s_aSoundsInfo.push({path: './sounds/',filename:'eating',loop:false,volume:1, ingamename: 'eating'});
        s_aSoundsInfo.push({path: './sounds/',filename:'goal',loop:false,volume:1, ingamename: 'goal'});
        s_aSoundsInfo.push({path: './sounds/',filename:'level_complete',loop:false,volume:1, ingamename: 'level_complete'});
        s_aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        
        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
        
    };  
    
    this.tryToLoadSound = function(oSoundInfo, bDelay){
        
       setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({ 
                                                            src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: oSoundInfo.loop, 
                                                            volume: oSoundInfo.volume,
                                                            onload: s_oMain.soundLoaded,
                                                            onloaderror: function(szId,szMsg){
                                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                         s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                                                                                         break;
                                                                                     }
                                                                                }
                                                                        },
                                                            onplayerror: function(szId) {
                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                          s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                                                                            s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                                                                          });
                                                                                         break;
                                                                                     }
                                                                                 }
                                                                       
                                                            } 
                                                        });

            
        }, (bDelay ? 200 : 0) );
    };


    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_top","./sprites/bg_top.png");
        s_oSpriteLibrary.addSprite("bg_bottom","./sprites/bg_bottom.jpg");
        
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("survival","./sprites/survival.png");
        s_oSpriteLibrary.addSprite("adventure","./sprites/adventure.png");
        s_oSpriteLibrary.addSprite("levelsprite","./sprites/levelsprite.png");

        s_oSpriteLibrary.addSprite("time_display","./sprites/time_display.png");
        s_oSpriteLibrary.addSprite("but_timer","./sprites/but_pause.png");
        s_oSpriteLibrary.addSprite("environment_sprites","./sprites/environment_sprites.png");
        s_oSpriteLibrary.addSprite("snake_sprites","./sprites/snake_sprites.png");
        s_oSpriteLibrary.addSprite("fruit_sprites","./sprites/fruit_sprites.png");
        
        s_oSpriteLibrary.addSprite("left","./sprites/left.png");
        s_oSpriteLibrary.addSprite("up","./sprites/up.png");
        s_oSpriteLibrary.addSprite("down","./sprites/down.png");
        s_oSpriteLibrary.addSprite("right","./sprites/right.png");
        
        s_oSpriteLibrary.addSprite("left_mobile","./sprites/left_mobile.png");
        s_oSpriteLibrary.addSprite("up_mobile","./sprites/up_mobile.png");
        s_oSpriteLibrary.addSprite("down_mobile","./sprites/down_mobile.png");
        s_oSpriteLibrary.addSprite("right_mobile","./sprites/right_mobile.png");
        
        s_oSpriteLibrary.addSprite("cherry","./sprites/cherry.png");
        s_oSpriteLibrary.addSprite("pear","./sprites/pear.png");
        s_oSpriteLibrary.addSprite("grapes","./sprites/grapes.png");
        s_oSpriteLibrary.addSprite("orange","./sprites/orange.png");
        s_oSpriteLibrary.addSprite("strawberry","./sprites/strawberry.png");
        s_oSpriteLibrary.addSprite("logo_credits","./sprites/logo_credits.png");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);
    };
    
    this._onAllImagesLoaded = function(){
        
    };

    
    this._onAllResourcesLoaded = function(){
        try{
            saveItem("ls_available","ok");
        }catch(evt){
            // localStorage not defined
            s_bStorageAvailable = false;
        }
        
        if (s_bStorageAvailable && getItem("snake_level") !== null) {
            s_iLastLevel = parseInt(getItem("snake_level"));
            s_aScores = JSON.parse(getItem("snake_scores"));
        }else{
            this.resetArrayScores();
        }
      
        _oPreloader.unload();
            
        s_oSoundTrack = playSound("soundtrack", 1, true);
        setVolume("soundtrack", 0.5);
    
        // Check for wrong answer state after resources load
        if (getItem("wrong_answer") === "true") {
            var iLastScore = getItem("last_score");
            new CMsgBox(s_oSpriteLibrary.getSprite('msg_box'), TEXT_WRONG_ANSWER, 
                        TEXT_RETURN_MENU, s_oMain.gotoMenu, s_oStage).showWrongAnswer(iLastScore);
    
            saveItem("wrong_answer", "false"); // Reset the flag
            saveItem("last_score", 0); // Reset the last score
    
        } else {
            this.gotoMenu(); 
        } 
    };
        
    this.resetArrayScores = function () {
        s_aScores = new Array();
        for (var i = 0; i < LEVEL_NUM; i++) {
            s_aScores[i] = 0;
        }
    };
    
    this.gotoLevelMenu = function(){
        
        s_oLevelMenu = new CLevelMenu();
        
        _iState = STATE_MENU;
    };    
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    }; 
    this.gotoGame = function(iMode, iLevel){
        s_iMode = iMode;
        
        _oGame = new CGame(iMode, iLevel,_oData);   						
        _iState = STATE_GAME;
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }
        
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(s_bAudioActive){
                Howler.mute(false);
            }
        }
        
    };
    
    this._update = function(event){
        if(_bUpdate === false){
                return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }

        if(_iState === STATE_GAME){
            _oGame.update();
        }

        s_oStage.update(event);
       
    };
    
    s_oMain = this;
    
    _oData = oData;
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    
    s_bAudioActive = oData.audio_enable_on_startup;
    
    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_iMode;
var s_iLastLevel = 0;
var s_aScores;
var s_szImage;
var s_oLevelMenu;
var s_oLevelSetting;
var s_bFirstTime = false;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oCanvas;
var s_oSoundTrack = null;
var s_aSounds;
var s_aSoundsInfo;
var s_bStorageAvailable = true;