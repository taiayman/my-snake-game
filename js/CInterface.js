function CInterface(iScore){
    var _bPressed;
    
    var _oAudioToggle;
    var _oButTimer;
    var _oButExit;
    var _oTimePane;
    var _oTimerLevelPane;
    var _oScorePane;
    var _oScoreNumStroke;
    var _oScoreNum;
    var _oGoalPane;
    var _oTimeNumStroke;
    var _oTimeNum;
    var _aTextStroke = new Array();
    var _aText = new Array();
    var _oTimerLevelNumStroke;
    var _oTimerLevelNum;
    var _oTimerText; // The general timer text object

    var _oMathOperationText;

    var _oContainerTimerBonus;
    var _oContainerTimerLevel;
    var _oContainerGoal;
    var _oHelpPanel=null;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _oButMovementUp;
    var _oButMovementRight;
    var _oButMovementDown;
    var _oButMovementLeft;
    var _oButMovementUp1;
    var _oButMovementRight1;
    var _oButMovementDown1;
    var _oButMovementLeft1;
        
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosButtonUp;
    var _pStartPosButtonRight;
    var _pStartPosButtonDown;
    var _pStartPosButtonLeft;
    var _pStartPosButtonUp1;
    var _pStartPosButtonRight1;
    var _pStartPosButtonDown1;
    var _pStartPosButtonLeft1;
    var _pStartPosFullscreen;
    
    this._init = function(iScore){                
        var oExitX;        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.width/2)-10, y: (oSprite.height/2)+10 };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oExitX = CANVAS_WIDTH - (oSprite.width/2)-110;
        _pStartPosAudio = {x: oExitX, y: (oSprite.height/2)+10};
        
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
        
        var oSprite = s_oSpriteLibrary.getSprite('but_timer');
        _oButTimer = new CGfxButton(_pStartPosAudio.x - 100, _pStartPosAudio.y+50, oSprite, s_oStage);
        _oButTimer.addEventListener(ON_MOUSE_UP, this._onTimer, this);
        

        var _oButPos = {x:CANVAS_WIDTH/2, y: 70};

        var oScoreSprite = s_oSpriteLibrary.getSprite('time_display');
        _oScorePane = createBitmap(oScoreSprite);
        _oScorePane.x = _oButPos.x-500;
        _oScorePane.y = _oButPos.y;
        s_oStage.addChild(_oScorePane);
        
        var iWidth = oScoreSprite.width-30;
        var iHeight = 60;
        var iX = _oButPos.x - 386;
        var iY = _oButPos.y + 45;
        _oScoreNumStroke = new CTLText(s_oStage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#600101", FONT, 1,
                    2, 2,
                    iScore.toString(),
                    true, true, false,
                    false );
        _oScoreNumStroke.setOutline(8);
        _oScoreNum = new CTLText(s_oStage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#fff", FONT, 1,
                    2, 2,
                    iScore.toString(),
                    true, true, false,
                    false );

        _oContainerTimerBonus = new createjs.Container();
        s_oStage.addChild(_oContainerTimerBonus);

        var oTimerBonusSprite = s_oSpriteLibrary.getSprite('time_display');
        _oTimePane = createBitmap(oTimerBonusSprite);
        _oTimePane.x = _oButPos.x-100;
        _oTimePane.y = _oButPos.y;
        _oContainerTimerBonus.addChild(_oTimePane);
        
        var iWidth = oScoreSprite.width-30;
        var iHeight = 60;
        var iX = _oButPos.x + 15;
        var iY = _oButPos.y + 45;
        _oTimeNumStroke = new CTLText(_oContainerTimerBonus, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#600101", FONT, 1,
                    2, 2,
                    "00:00",
                    true, true, false,
                    false );
        _oTimeNumStroke.setOutline(8);
        _oTimeNum = new CTLText(_oContainerTimerBonus, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#fff", FONT, 1,
                    2, 2,
                    "00:00",
                    true, true, false,
                    false );

       
        this.setContainerVisible( false);
        
        _oContainerTimerLevel = new createjs.Container();
        s_oStage.addChild(_oContainerTimerLevel);

        var oTimerSprite = s_oSpriteLibrary.getSprite('time_display');
        _oTimerLevelPane = createBitmap(oTimerSprite);
        _oTimerLevelPane.x = _oButPos.x +275;
        _oTimerLevelPane.y = _oButPos.y;
        _oContainerTimerLevel.addChild(_oTimerLevelPane);

        var iWidth = oScoreSprite.width-30;
        var iHeight = 60;
        var iX = _oButPos.x + 389;
        var iY = _oButPos.y + 45;
        _oTimerLevelNumStroke = new CTLText(_oContainerTimerLevel, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#600101", FONT, 1,
                    2, 2,
                    "00:00",
                    true, true, false,
                    false );
        _oTimerLevelNumStroke.setOutline(8);
        _oTimerLevelNum = new CTLText(_oContainerTimerLevel, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#fff", FONT, 1,
                    2, 2,
                    "00:00",
                    true, true, false,
                    false );

       
        this.setButVisible(true);
        
        if(s_bMobile && !isTablet()){
            var oSprite = s_oSpriteLibrary.getSprite('left_mobile');
            _pStartPosButtonLeft = {x: CANVAS_WIDTH - 335, y: oSprite.height + 880};
            _oButMovementLeft = new CGfxButton(_pStartPosButtonLeft.x, _pStartPosButtonLeft.y, oSprite, s_oStage);
            _oButMovementLeft.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'left');

            var oSprite = s_oSpriteLibrary.getSprite('up_mobile');
            _pStartPosButtonUp = {x: CANVAS_WIDTH - 200, y: oSprite.height + 745};
            _oButMovementUp = new CGfxButton(_pStartPosButtonUp.x, _pStartPosButtonUp.y, oSprite, s_oStage);
            _oButMovementUp.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'up');

            var oSprite = s_oSpriteLibrary.getSprite('right_mobile');
            _pStartPosButtonRight = {x: CANVAS_WIDTH - 65, y: oSprite.height + 880};
            _oButMovementRight = new CGfxButton(_pStartPosButtonRight.x, _pStartPosButtonRight.y, oSprite, s_oStage);
            _oButMovementRight.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'right');

            var oSprite = s_oSpriteLibrary.getSprite('down_mobile');
            _pStartPosButtonDown = {x: CANVAS_WIDTH - 200, y: oSprite.height + 880};
            _oButMovementDown = new CGfxButton(_pStartPosButtonDown.x, _pStartPosButtonDown.y, oSprite, s_oStage);
            _oButMovementDown.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'down');

            var oSprite = s_oSpriteLibrary.getSprite('left_mobile');
            _pStartPosButtonLeft1 = {x: CANVAS_WIDTH - 1850, y: oSprite.height + 880};
            _oButMovementLeft1 = new CGfxButton(_pStartPosButtonLeft1.x-1575, _pStartPosButtonLeft1.y, oSprite, s_oStage);
            _oButMovementLeft1.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'left');

            var oSprite = s_oSpriteLibrary.getSprite('up_mobile');
            _pStartPosButtonUp1 = {x: CANVAS_WIDTH - 1715, y: oSprite.height + 745};
            _oButMovementUp1 = new CGfxButton(_pStartPosButtonUp1.x, _pStartPosButtonUp1.y, oSprite, s_oStage);
            _oButMovementUp1.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'up');

            var oSprite = s_oSpriteLibrary.getSprite('right_mobile');
            _pStartPosButtonRight1 = {x: CANVAS_WIDTH - 1580, y: oSprite.height + 880};
            _oButMovementRight1 = new CGfxButton(_pStartPosButtonRight1.x, _pStartPosButtonRight1.y, oSprite, s_oStage);
            _oButMovementRight1.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'right');

            var oSprite = s_oSpriteLibrary.getSprite('down_mobile');
            _pStartPosButtonDown1 = {x: CANVAS_WIDTH - 1715, y: oSprite.height + 880};
            _oButMovementDown1 = new CGfxButton(_pStartPosButtonDown1.x, _pStartPosButtonDown1.y, oSprite, s_oStage);
            _oButMovementDown1.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'down');
            
        }else{
            var oSprite = s_oSpriteLibrary.getSprite('left');
            _pStartPosButtonLeft = {x: CANVAS_WIDTH - 275, y: oSprite.height + 900};
            _oButMovementLeft = new CGfxButton(_pStartPosButtonLeft.x, _pStartPosButtonLeft.y, oSprite, s_oStage);
            _oButMovementLeft.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'left');

            var oSprite = s_oSpriteLibrary.getSprite('up');
            _pStartPosButtonUp = {x: CANVAS_WIDTH - 170, y: oSprite.height + 795};
            _oButMovementUp = new CGfxButton(_pStartPosButtonUp.x, _pStartPosButtonUp.y, oSprite, s_oStage);
            _oButMovementUp.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'up');

            var oSprite = s_oSpriteLibrary.getSprite('right');
            _pStartPosButtonRight = {x: CANVAS_WIDTH - 65, y: oSprite.height + 900};
            _oButMovementRight = new CGfxButton(_pStartPosButtonRight.x, _pStartPosButtonRight.y, oSprite, s_oStage);
            _oButMovementRight.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'right');

            var oSprite = s_oSpriteLibrary.getSprite('down');
            _pStartPosButtonDown = {x: CANVAS_WIDTH - 170, y: oSprite.height + 900};
            _oButMovementDown = new CGfxButton(_pStartPosButtonDown.x, _pStartPosButtonDown.y, oSprite, s_oStage);
            _oButMovementDown.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'down');

            var oSprite = s_oSpriteLibrary.getSprite('left');
            _pStartPosButtonLeft1 = {x: CANVAS_WIDTH - 1850, y: oSprite.height + 900};
            _oButMovementLeft1 = new CGfxButton(_pStartPosButtonLeft1.x-1575, _pStartPosButtonLeft1.y, oSprite, s_oStage);
            _oButMovementLeft1.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'left');

            var oSprite = s_oSpriteLibrary.getSprite('up');
            _pStartPosButtonUp1 = {x: CANVAS_WIDTH - 1745, y: oSprite.height + 795};
            _oButMovementUp1 = new CGfxButton(_pStartPosButtonUp1.x, _pStartPosButtonUp1.y, oSprite, s_oStage);
            _oButMovementUp1.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'up');

            var oSprite = s_oSpriteLibrary.getSprite('right');
            _pStartPosButtonRight1 = {x: CANVAS_WIDTH - 1640, y: oSprite.height + 900};
            _oButMovementRight1 = new CGfxButton(_pStartPosButtonRight1.x, _pStartPosButtonRight1.y, oSprite, s_oStage);
            _oButMovementRight1.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'right');

            var oSprite = s_oSpriteLibrary.getSprite('down');
            _pStartPosButtonDown1 = {x: CANVAS_WIDTH - 1745, y: oSprite.height + 900};
            _oButMovementDown1 = new CGfxButton(_pStartPosButtonDown1.x, _pStartPosButtonDown1.y, oSprite, s_oStage);
            _oButMovementDown1.addEventListenerWithParams(ON_MOUSE_DOWN, this._onDirectionPressed, this, 'down');
        }
        
        _oContainerGoal = new createjs.Container();
        s_oStage.addChild(_oContainerGoal);
        
        this._initMathOperationDisplay();
        this._initTimerDisplay();
        this._enlargeMobileButtons();

        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };

    var _oMathOperationTextOutline;
    var _oMathOperationText;

    this._initMathOperationDisplay = function () {
        var oSprite = s_oSpriteLibrary.getSprite('time_display');
        var oMathOpPane = createBitmap(oSprite);
        oMathOpPane.x = CANVAS_WIDTH / 2;
        oMathOpPane.y = 70;
        oMathOpPane.regX = oSprite.width / 2;
        s_oStage.addChild(oMathOpPane);

        var iWidth = oSprite.width - 30;
        var iHeight = 60;
        var iX = oMathOpPane.x;
        var iY = oMathOpPane.y + 45; 

        _oMathOperationTextOutline = new CTLText(s_oStage,
            iX - iWidth / 2, iY - iHeight / 2, iWidth, iHeight,
            50, "center", "#600101", FONT, 1,
            2, 2,
            "",
            true, true, false,
            false);
        _oMathOperationTextOutline.setOutline(8);

        _oMathOperationText = new CTLText(s_oStage,
            iX - iWidth / 2, iY - iHeight / 2, iWidth, iHeight,
            50, "center", "#ffffff", FONT, 1, 
            2, 2,
            "", 
            true, true, false,
            false);
    };


    this._initTimerDisplay = function() {
        _oTimerText = new createjs.Text("", "24px " + FONT, "#ffffff");
        _oTimerText.x = CANVAS_WIDTH - 100;
        _oTimerText.y = 30;
        _oTimerText.textAlign = "right";
        s_oStage.addChild(_oTimerText);
    };

    this._enlargeMobileButtons = function() {
        if (s_bMobile) {
            var buttonScale = 1.5;
            _oButMovementUp.scaleX = _oButMovementUp.scaleY = buttonScale;
            _oButMovementDown.scaleX = _oButMovementDown.scaleY = buttonScale;
            _oButMovementLeft.scaleX = _oButMovementLeft.scaleY = buttonScale;
            _oButMovementRight.scaleX = _oButMovementRight.scaleY = buttonScale;
            this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
        }
    };
    
    this._onDirectionPressed = function( szDirection ){
        var _iDirection;
        if(szDirection === 'left'){
            _iDirection = 37;
            _bPressed = true;
        }else if(szDirection === 'up'){
            _iDirection = 38;
            _bPressed = true;
        }else if(szDirection === 'right'){
            _iDirection = 39;
            _bPressed = true;
        }else if(szDirection === 'down'){
            _iDirection = 40;
            _bPressed = true;
        }
        s_oGame._onButtonDirDown(_iDirection);
    };
    
    this._onDirectionLeave = function(  ){
        _bPressed = false;
    };
    
    this.seeGoal = function(szSprite, num, numEated, off_x, off_y){
        var oGoalSprite = s_oSpriteLibrary.getSprite(szSprite);
        _oGoalPane = createBitmap(oGoalSprite);
        _oGoalPane.x = off_x;
        _oGoalPane.y = off_y;
        _oContainerGoal.addChild(_oGoalPane);
        
        var iWidth = 100;
        var iHeight = 50;
        var iX = off_x + 70;
        var iY = off_y + 35;
        var oTextStroke = new CTLText(_oContainerGoal, 
                    iX, iY-iHeight/2, iWidth, iHeight, 
                    40, "left", "#600101", FONT, 1,
                    2, 2,
                    numEated+"/"+num,
                    true, true, false,
                    false );
        oTextStroke.setOutline(8);
        var oText = new CTLText(_oContainerGoal, 
                    iX, iY-iHeight/2, iWidth, iHeight, 
                    40, "left", "#fff", FONT, 1,
                    2, 2,
                    numEated+"/"+num,
                    true, true, false,
                    false );
        
        _aTextStroke.push(oTextStroke);
        _aText.push(oText);
    };
    
    this.seeGoalLeft = function( num, numEated, i){
        _aTextStroke[i].refreshText( numEated+"/"+num );
        _aText[i].refreshText( numEated+"/"+num );
    };
    
    this.resetGoalInterface = function(){
        _aTextStroke = [];
        _aText = [];
        _oContainerGoal.removeAllChildren();
        
        _oContainerTimerBonus.visible = false;
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        _oButMovementUp.unload();
        _oButMovementRight.unload();
        _oButMovementDown.unload();
        _oButMovementLeft.unload();
        _oButMovementUp1.unload();
        _oButMovementRight1.unload();
        _oButMovementDown1.unload();
        _oButMovementLeft1.unload();

        _oButTimer.unload();
        _oButExit.unload();
        if(_oHelpPanel!==null){
            _oHelpPanel.unload();
        }
        s_oInterface = null;
    };
        
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }    
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
        
        _oButTimer.setPosition((_pStartPosAudio.x)-100 - iNewX,iNewY + _pStartPosAudio.y);

        if (s_bMobile) {
            var fSpaceBetweenButtons = 30;
            _oButMovementUp.setPosition(_pStartPosButtonUp.x - iNewX, _pStartPosButtonUp.y - iNewY + _oButMovementUp.height / 2 + fSpaceBetweenButtons);
            _oButMovementRight.setPosition(_pStartPosButtonRight.x - iNewX - _oButMovementRight.width / 2 - fSpaceBetweenButtons, _pStartPosButtonRight.y - iNewY + _oButMovementRight.height / 2);
            _oButMovementDown.setPosition(_pStartPosButtonDown.x - iNewX, _pStartPosButtonDown.y - iNewY - _oButMovementDown.height / 2 - fSpaceBetweenButtons);
            _oButMovementLeft.setPosition(_pStartPosButtonLeft.x - iNewX + _oButMovementLeft.width / 2 + fSpaceBetweenButtons, _pStartPosButtonLeft.y - iNewY + _oButMovementLeft.height / 2);
            _oButMovementUp1.setPosition(_pStartPosButtonUp1.x + iNewX, _pStartPosButtonUp1.y - iNewY + _oButMovementUp1.height / 2 + fSpaceBetweenButtons);
            _oButMovementRight1.setPosition(_pStartPosButtonRight1.x + iNewX - _oButMovementRight1.width / 2 - fSpaceBetweenButtons, _pStartPosButtonRight1.y - iNewY + _oButMovementRight1.height / 2);
            _oButMovementDown1.setPosition(_pStartPosButtonDown1.x + iNewX, _pStartPosButtonDown1.y - iNewY - _oButMovementDown1.height / 2 - fSpaceBetweenButtons);
            _oButMovementLeft1.setPosition(_pStartPosButtonLeft1.x + iNewX + _oButMovementLeft1.width / 2 + fSpaceBetweenButtons, _pStartPosButtonLeft1.y - iNewY + _oButMovementLeft1.height / 2);
        } else {
            _oButMovementUp.setPosition(_pStartPosButtonUp.x - iNewX, _pStartPosButtonUp.y - iNewY);
            _oButMovementRight.setPosition(_pStartPosButtonRight.x - iNewX, _pStartPosButtonRight.y - iNewY);
            _oButMovementDown.setPosition(_pStartPosButtonDown.x - iNewX, _pStartPosButtonDown.y - iNewY);
            _oButMovementLeft.setPosition(_pStartPosButtonLeft.x - iNewX, _pStartPosButtonLeft.y - iNewY);

            _oButMovementUp1.setPosition(_pStartPosButtonUp1.x + iNewX, _pStartPosButtonUp1.y - iNewY);
            _oButMovementRight1.setPosition(_pStartPosButtonRight1.x + iNewX, _pStartPosButtonRight1.y - iNewY);
            _oButMovementDown1.setPosition(_pStartPosButtonDown1.x + iNewX, _pStartPosButtonDown1.y - iNewY);
            _oButMovementLeft1.setPosition(_pStartPosButtonLeft1.x + iNewX, _pStartPosButtonLeft1.y - iNewY);
        }
    };
    
    this.setButVisible = function(bVal){
        _oButTimer.setVisible(bVal);
    };
    
    this.setContainerVisible = function(  bVal ){
        _oContainerTimerBonus.visible = bVal;
    };
    
    this.setTimerContainerVisible = function(  bVal ){
        _oContainerTimerLevel.visible = bVal;
    };
    
    this.refreshTime = function(iValue){
        _oTimeNumStroke.refreshText( iValue );
        _oTimeNum.refreshText( iValue );
    };
    
    this.refreshTimeLeft = function(iValue){
        _oTimerLevelNumStroke.refreshText( iValue );
        _oTimerLevelNum.refreshText( iValue );
    };
    
    this.refreshScore = function(iValue){
        _oScoreNumStroke.refreshText( iValue );
        _oScoreNum.refreshText( iValue );
    };

    this.displayMathOperation = function(operation) {
        var text = operation + " = ?";
        _oMathOperationTextOutline.refreshText(text);
        _oMathOperationText.refreshText(text);
    };



    this.updateTimer = function(time) {
        _oTimerLevelNumStroke.refreshText(time);
        _oTimerLevelNum.refreshText(time);
    };


    this._onTimer = function(){
        s_oGame.onPause();
    };
    
    this._onRestart = function(){
        s_oGame.restartGame();
    };
    
    this._onButHelpRelease = function(){
        _oHelpPanel = new CHelpPanel();
    };
    
    this._onButRestartRelease = function(){
        s_oGame.restartGame();
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    this._onExit = function(){
        s_oGame.onExit();    
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
      
      
      s_oInterface = this;
      
      this._init(iScore);
      
      return this;
  }
  
  var s_oInterface = null;