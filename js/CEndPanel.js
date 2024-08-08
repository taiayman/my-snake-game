function CEndPanel(oSpriteBg,iLevel){
    
    var _oBg;
    var _oGroup;
    
    var _oMsgTextStroke;
    var _oMsgText;
    var _oScoreTextStroke;
    var _oScoreText;
    
    this._init = function(oSpriteBg,iLevel){
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = 0;
        _oBg.y = 0;
        _oGroup.addChild(_oBg);
        
        var iWidth = 800;
        var iHeight = 80;
        var iX = CANVAS_WIDTH/2;
        var iY = CANVAS_HEIGHT/2-50;
        _oMsgTextStroke = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    70, "center", "#600101", FONT, 1,
                    2, 2,
                    " ",
                    true, true, false,
                    false );
        _oMsgTextStroke.setOutline(8);
        _oMsgText = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    70, "center", "#fff", FONT, 1,
                    2, 2,
                    " ",
                    true, true, false,
                    false );

        
        var iWidth = 800;
        var iHeight = 80;
        var iX = CANVAS_WIDTH/2;
        var iY = CANVAS_HEIGHT/2+50;
        _oScoreTextStroke = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#600101", FONT, 1,
                    2, 2,
                    " ",
                    true, true, false,
                    false );
        _oScoreTextStroke.setOutline(8);
        _oScoreText = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#fff", FONT, 1,
                    2, 2,
                    " ",
                    true, true, false,
                    false );

        s_oStage.addChild(_oGroup);
        
        $(s_oMain).trigger("end_level",iLevel);
    };
    
    this.unload = function(){
        _oGroup.removeAllEventListeners();
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(iScore, iMode){
        _oMsgTextStroke.refreshText( TEXT_GAMEOVER );
        _oMsgText.refreshText( TEXT_GAMEOVER );
        
        _oScoreTextStroke.refreshText( sprintf(TEXT_SCORE, iScore) );
        _oScoreText.refreshText( sprintf(TEXT_SCORE, iScore) );
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
        $(s_oMain).trigger("share_event",iScore);
        if(iMode === SURVIVAL_MODE){
            $(s_oMain).trigger("save_score",[parseInt(iScore), "survival"]);
        }else{
            $(s_oMain).trigger("save_score",[parseInt(iScore), "adventure"]);
        }
    };
    
    this.GameOverAdventure = function(iScore, iMode){
	playSound("game_over",1,false);
	

        _oMsgTextStroke.refreshText( TEXT_GAMEOVER_ADVENTURE );
        _oMsgTextStroke.setY(_oMsgTextStroke.getY() - 100);
        _oMsgText.refreshText( TEXT_GAMEOVER_ADVENTURE );
        _oMsgText.setY(_oMsgText.getY() - 100);
        _oScoreTextStroke.refreshText( sprintf(TEXT_SCORE, iScore) );
        _oScoreText.refreshText( sprintf(TEXT_SCORE, iScore) );
        _oScoreTextStroke.setY(_oScoreTextStroke.getY() + 150);
        _oScoreText.setY(_oScoreText.getY() + 150);

        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});

        $(s_oMain).trigger("share_event",iScore);
        if(iMode === SURVIVAL_MODE){
            $(s_oMain).trigger("save_score",[parseInt(iScore), "survival"]);
        }else{
            $(s_oMain).trigger("save_score",[parseInt(iScore), "adventure"]);
        }
    };
    
    this.win = function(iScore, iMode){
	
	playSound("level_complete",1,false);
	
        _oMsgTextStroke.refreshText( TEXT_WIN );
        _oMsgText.refreshText( TEXT_WIN );
        
        _oScoreTextStroke.refreshText( sprintf(TEXT_SCORE, iScore) );
        _oScoreText.refreshText( sprintf(TEXT_SCORE, iScore) );
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
        $(s_oMain).trigger("share_event",iScore);
        if(iMode === SURVIVAL_MODE){
            $(s_oMain).trigger("save_score",[parseInt(iScore), "survival"]);
        }else{
            $(s_oMain).trigger("save_score",[parseInt(iScore), "adventure"]);
        }
    };
    
    this._onExit = function(){
        _oGroup.removeAllEventListeners();
        s_oStage.removeChild(_oGroup);
        
        s_oGame.onExit();
    };
    
    this._init(oSpriteBg,iLevel);
    
    return this;
}
