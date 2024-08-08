function CMsgBox(oSpriteBg, szMsg, szButLabel, callback, oParentContainer) {
    var _oMsgStroke;
    var _oMsg;
    var _oButOk;
    var _oScoreTextStroke;
    var _oScoreText;
    var _oThis;
    var _oContainer;
    var _oParentContainer;
    var _callback;

    this._init = function (oSpriteBg, szMsg, szButLabel, callback, oParentContainer) {
        _oContainer = new createjs.Container();
        _oParentContainer = oParentContainer;
        _callback = callback;

        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        oFade.alpha = 0.5;
        oFade.on("click", function () { });
        _oContainer.addChild(oFade);

        var oBg = createBitmap(oSpriteBg);
        oBg.x = CANVAS_WIDTH * 0.5;
        oBg.y = CANVAS_HEIGHT * 0.5;
        oBg.regX = oSpriteBg.width * 0.5;
        oBg.regY = oSpriteBg.height * 0.5;
        _oContainer.addChild(oBg);

        var iWidth = 800;
        var iHeight = 500;
        var iX = CANVAS_WIDTH / 2;
        var iY = 540;
        _oMsgStroke = new CTLText(_oContainer,
            iX - iWidth / 2, iY - iHeight / 2, iWidth, iHeight,
            60, "center", "#600101", FONT, 1.2,
            2, 2,
            " ",
            true, true, true,
            false);
        _oMsgStroke.setOutline(8);
        _oMsg = new CTLText(_oContainer,
            iX - iWidth / 2, iY - iHeight / 2, iWidth, iHeight,
            60, "center", "#fff", FONT, 1.2,
            2, 2,
            " ",
            true, true, true,
            false);

        // Add score text
        iWidth = 500;
        iHeight = 80;
        iX = CANVAS_WIDTH / 2;
        iY = CANVAS_HEIGHT / 2 - 100; 

        _oScoreTextStroke = new CTLText(_oContainer,
            iX - iWidth / 2, iY - iHeight / 2, iWidth, iHeight,
            60, "center", "#600101", FONT, 1,
            2, 2,
            " ",
            true, true, false,
            false);
        _oScoreTextStroke.setOutline(8);
        _oScoreText = new CTLText(_oContainer,
            iX - iWidth / 2, iY - iHeight / 2, iWidth, iHeight,
            60, "center", "#fff", FONT, 1,
            2, 2,
            " ",
            true, true, false,
            false);

        _oButOk = new CGfxButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100, s_oSpriteLibrary.getSprite('but_exit'), _oContainer);
        _oButOk.addEventListener(ON_MOUSE_UP, this._onButOk, this);

        _oParentContainer.addChild(_oContainer);
    };

    this._onButOk = function () {
        _oThis.unload();
        _callback();
    };

    this.show = function (szMsg, iScore) { 
        _oMsgStroke.refreshText(szMsg);
        _oMsg.refreshText(szMsg);

        _oScoreTextStroke.refreshText(sprintf(TEXT_SCORE, iScore));
        _oScoreText.refreshText(sprintf(TEXT_SCORE, iScore));
    };
    
    // Add this function inside CMsgBox.js
    this.showWrongAnswer = function(iScore) {
        _oMsgStroke.refreshText(TEXT_WRONG_ANSWER);
        _oMsg.refreshText(TEXT_WRONG_ANSWER);

        _oScoreTextStroke.refreshText(sprintf(TEXT_SCORE, iScore));
        _oScoreText.refreshText(sprintf(TEXT_SCORE, iScore));

        _oButOk.unload(); // Remove the existing Play button

        // Create a new button with the "Return to Menu" label
        _oButOk = new CGfxButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100, 
                                s_oSpriteLibrary.getSprite('but_exit'), _oContainer); 
        _oButOk.addEventListener(ON_MOUSE_UP, this._onButOk, this);
    };

    this.unload = function () {
        _oButOk.unload();
        _oParentContainer.removeChild(_oContainer);
    };

    _oThis = this;
    this._init(oSpriteBg, szMsg, szButLabel, callback, oParentContainer);
}