function CNextLevel(oSpriteBg, iLevel, mode,iScore){
    
    var _oBg;
    var _oGroup;

    var _oMsgTextStroke;
    var _oMsgText;
    
    this._init = function(oSpriteBg,iScore){
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = 0;
        _oBg.y = 0;
        _oGroup.addChild(_oBg);
        
        var iWidth = 800;
        var iHeight = 200;
        var iX = CANVAS_WIDTH/2;
        var iY = CANVAS_HEIGHT/3+180;
        _oMsgTextStroke = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    60, "center", "#600101", FONT, 1.2,
                    2, 2,
                    " ",
                    true, true, true,
                    false );
        _oMsgTextStroke.setOutline(8);
        _oMsgText = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    60, "center", "#fff", FONT, 1.2,
                    2, 2,
                    " ",
                    true, true, true,
                    false );

        s_oStage.addChild(_oGroup);
        
        this.show(iLevel,iScore);
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(iLevel,iScore){
        if(mode === ADVENTURE_MODE){
            if(iLevel > 0){
                
                playSound("level_complete",1,false);
                
                
                $(s_oMain).trigger("end_level",iLevel);
            }
            
            var iWidth = 800;
            var iHeight = 110;
            var iX = CANVAS_WIDTH/2;
            var iY = CANVAS_HEIGHT/3;
            var oMsgLevelStroke = new CTLText(_oGroup, 
                        iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                        100, "center", "#600101", FONT, 1,
                        2, 2,
                        sprintf(TEXT_LEVEL, iLevel+1),
                        true, true, false,
                        false );
            oMsgLevelStroke.setOutline(8);
            var oMsgLevel = new CTLText(_oGroup, 
                        iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                        100, "center", "#fff", FONT, 1,
                        2, 2,
                        sprintf(TEXT_LEVEL, iLevel+1),
                        true, true, false,
                        false );
           
            _oMsgTextStroke.refreshText( TEXT_SCORE_FOR_NEXT_LEVEL );
            _oMsgText.refreshText( TEXT_SCORE_FOR_NEXT_LEVEL );
            
        }else if(mode === SURVIVAL_MODE){
            playSound("level_complete",1,false);
            _oMsgTextStroke.refreshText(  TEXT_SURVIVAL_HELP );
            _oMsgTextStroke.setX( CANVAS_WIDTH/2 );
            _oMsgTextStroke.setY( CANVAS_HEIGHT/3+50 );
            _oMsgText.refreshText(  TEXT_SURVIVAL_HELP );
            _oMsgText.setX( CANVAS_WIDTH/2 );
            _oMsgText.setY( CANVAS_HEIGHT/3+50 );
            
        }
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
    };
    
    this._onExit = function(){
        _oGroup.removeAllEventListeners();
        s_oStage.removeChild(_oGroup);
        
        s_oGame.onNextLevelExit();
    };
    
    this._init(oSpriteBg,iScore);
    
    return this;
}
