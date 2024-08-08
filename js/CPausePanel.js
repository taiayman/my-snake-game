function CPausePanel(oSpriteBg){
    
    var _oBg;
    var _oGroup;

    var _oMsgTextStroke;
    var _oMsgText;
    
    this._init = function(oSpriteBg){
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = 0;
        _oBg.y = 0;
        _oGroup.addChild(_oBg);

        var iWidth = 500;
        var iHeight = 120;
        var iX = CANVAS_WIDTH/2;
        var iY = CANVAS_HEIGHT/2;
        _oMsgTextStroke = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    100, "center", "#600101", FONT, 1,
                    2, 2,
                    TEXT_PAUSE,
                    true, true, false,
                    false );
        _oMsgTextStroke.setOutline(8);
        _oMsgText = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    100, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_PAUSE,
                    true, true, false,
                    false );
       

        s_oStage.addChild(_oGroup);
        
        this.show();
    };
    
    this.unload = function(){
        _oGroup.removeAllEventListeners();
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(){
	
	playSound("game_over",1,false);
	
        
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
    };
    
    this._onExit = function(){
        _oGroup.removeAllEventListeners();
        s_oStage.removeChild(_oGroup);
        
        s_oGame.onPauseExit();
    };
    
    this._init(oSpriteBg);
    
    return this;
}
