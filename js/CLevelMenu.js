function CLevelMenu(){
    
    var _bNumActive;
    
    var _aMode = new Array();
    var _oModeNumOff;
    var _oModeNumOn;
    
    var _oBg;
    var _oButExit;
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    this._init = function(){
        
        _bNumActive = false;
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        s_oStage.addChild(_oBg);
        
        var iWidth = 800;
        var iHeight = 80;
        var iX = CANVAS_WIDTH/2;
        var iY = 270;
        var oLevelTextStroke = new CTLText(s_oStage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    80, "center", "#600101", FONT, 1,
                    2, 2,
                    TEXT_CHOOSE_LEVEL,
                    true, true, false,
                    false );
        oLevelTextStroke.setOutline(8);
        var oLevelText = new CTLText(s_oStage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    80, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_CHOOSE_LEVEL,
                    true, true, false,
                    false );
       
        var oModePos = {x: CANVAS_WIDTH/2, y: 370};
        
        var offset_x = 0;
        var offset_y = 0;
        // trace("s_iLastLevel "+s_iLastLevel)
        for(var i = 0; i < LEVEL_NUM; i++, offset_x += 150 ){
            if(offset_x > 800){
                offset_x = 0;
                offset_y += 150;
            }

            if( i < (s_iLastLevel+1)){
                _aMode.push(new CLevelBut((oModePos.x - 375)+offset_x,oModePos.y+offset_y, s_oSpriteLibrary.getSprite('levelsprite'),true,i+1));
            }else{
                _aMode.push(new CLevelBut((oModePos.x - 375)+offset_x,oModePos.y+offset_y, s_oSpriteLibrary.getSprite('levelsprite'),false,i+1));
            }
            _aMode[i].addEventListenerWithParams(ON_MOUSE_UP, this._onClick, this, i);
            
            s_bFirstTime = true;
        }
        

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        _pStartPosAudio = {x: _pStartPosExit.x - oSprite.width - 10, y: (oSprite.height/2) + 10};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:oSprite.width/4 + 10,y:_pStartPosExit.y};
             
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
    };  
    
    this.unload = function(){
        for(var i = 0; i < LEVEL_NUM; i++ ){
            _aMode[i].unload();
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }

        _oButExit.unload();

        s_oLevelMenu = null;
        s_oStage.removeAllChildren();        
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }     
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
    };
    
    this._onNumModeToggle = function(iData){
        if(iData === NUM_ACTIVE){
            _bNumActive = true;
            _oModeNumOff.setActive(false);
            _oModeNumOn.setActive(true);
            
        }else {
            _bNumActive = false;
            _oModeNumOff.setActive(true);
            _oModeNumOn.setActive(false);
        }
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onClick = function(i){
            var level = i;
            var clickable = _aMode[i].ifClickable();
            if(clickable){
                s_oLevelMenu.unload();
                s_oMain.gotoGame(ADVENTURE_MODE, level);
            }
            
    };
    
    this._onModeAdventure = function(){
            _oMode.setActive(true);
    };
     
    this._onExit = function(){
        s_oLevelMenu.unload();
        s_oMain.gotoMenu();
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
    };   
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };


    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();

    };
    
    s_oLevelMenu = this;        
    this._init();
    
    
    
};

var s_oLevelMenu = null;