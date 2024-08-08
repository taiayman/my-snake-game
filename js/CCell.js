function CCell(iRow, iCol, iX, iY, oParentContainer, state) {
    var _iRow;
    var _iCol;
    var _iX;
    var _iY;
    var _szValue;
    var _oSourceImage;
    
    var _oCell;
    var _oContainer;
    var _oAnswerText;
    
    this._init = function(iRow, iCol, iX, iY, oParentContainer, state) {
        _iRow = iRow;
        _iCol = iCol;
        _iX = iX;
        _iY = iY;

        var aSprites = [
            s_oSpriteLibrary.getSprite("environment_sprites"),
            s_oSpriteLibrary.getSprite("snake_sprites"),
            s_oSpriteLibrary.getSprite("fruit_sprites")
        ];
        
        var oData = {   
            images: aSprites, 
            frames: {width: CELL_WIDTH, height: CELL_HEIGHT, regX: CELL_WIDTH/2, regY: CELL_HEIGHT/2}, 
            animations: {
                background:[0], wall1:[1], wall2:[2], wall3:[3], wall4:[4], wall5:[5], 
                head:[6], body:[7], tail:[8], curves:[9], eating:[10], mouth_opened:[11], 
                apple:[12], cherry:[13], pear:[14], orange:[15], grapes:[16], strawberry:[17]
            }
        };
                    
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oCell = new createjs.Sprite(oSpriteSheet, state);
        _oCell.x = 0;
        _oCell.y = 0;
        _oCell.rotation = 0;
        _szValue = state;

        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oContainer.addChild(_oCell);
        
        _oAnswerText = new createjs.Text("", "30px " + FONT, "#FFFFFF");  
        _oAnswerText.textAlign = "center";
        _oAnswerText.textBaseline = "middle";
        _oAnswerText.x = CELL_WIDTH / 2;
        _oAnswerText.y = CELL_HEIGHT / 2;
        _oContainer.addChild(_oAnswerText);

        oParentContainer.addChild(_oContainer);
    };
    
    this.changeCellState = function(iPrecDir, _iDir, szState, answer) {
        _oCell.gotoAndStop(szState);
        
        if (_iDir === RIGHT_DIR) {       
            _oCell.rotation = 0;
            if(iPrecDir === DOWN_DIR && szState === 'curves'){
                _oCell.scaleY = -1;
            }else if(iPrecDir === UP_DIR && szState === 'curves'){
                _oCell.scaleY = 1;
            }
        } else if (_iDir === UP_DIR) {     
            _oCell.rotation = 270;
            if(iPrecDir === RIGHT_DIR && szState === 'curves'){
                _oCell.scaleY = -1;
            }else if(iPrecDir === LEFT_DIR && szState === 'curves'){
                _oCell.scaleY = 1;
            }
        } else if (_iDir === LEFT_DIR) {   
            _oCell.rotation = 180;
            if(iPrecDir === UP_DIR && szState === 'curves'){
                _oCell.scaleY = -1;
            }else if(iPrecDir === DOWN_DIR && szState === 'curves'){
                _oCell.scaleY = 1;
            }
        } else if (_iDir === DOWN_DIR) {   
            _oCell.rotation = 90;
            if(iPrecDir === LEFT_DIR && szState === 'curves'){
                _oCell.scaleY = -1;
            }else if(iPrecDir === RIGHT_DIR && szState === 'curves'){
                _oCell.scaleY = 1;
            }
        } else if (szState === 'apple' || szState === 'cherry' || szState === 'pear' || 
                   szState === 'grapes' || szState === 'orange' || szState === 'strawberry') {  
            _oCell.rotation = 0;
            _oCell.scaleY = 1;
            _oCell.scaleX = 1;
        } else if (szState === 'background') {                         
            _oCell.rotation = 0;
            _oCell.scaleY = 1;
            _oCell.scaleX = 1;
        }
        
        if (szState === 'apple' && answer !== undefined) {
            _oAnswerText.text = answer.toString();
            _oAnswerText.visible = true;
        } else if ((szState === 'cherry' || szState === 'pear' || 
                    szState === 'grapes' || szState === 'orange' || szState === 'strawberry') && answer !== undefined) {
            _oAnswerText.text = answer;
            _oAnswerText.visible = true;
        } else {
            _oAnswerText.visible = false;
        }

        _szValue = szState;
    };
    
    this.getValue = function() {
        return _szValue;
    };

    this.getAnswer = function() {
        return _oAnswerText.text ? parseInt(_oAnswerText.text) : null;
    };

    this._deathEffect = function(oContainer, oEndPanel, iScore, mode) {
        var aActiveCells = new Array();
        for(var i=0; i<NUM_COLS; i++){
            for(var j=0; j<NUM_ROWS; j++){
                if(_aGrid[i][j].getValue() === 'background' || _aGrid[i][j].getValue() === 'apple'){
                    aActiveCells.push({row: i, col: j});
                }
            }
        }
        
        var iLength = aActiveCells.length;
        
        var iStartTimer = 0;
        var iRandomNr = Math.floor(Math.random()*iLength);
        oContainer.children[iRandomNr].visible = false;
        
        var iTimer = setInterval(function(){
            if(iStartTimer<iLength){
                iRandomNr = Math.floor(Math.random()*iLength);
                oContainer.children[iRandomNr].visible = false;
                iStartTimer++;
            }else{
                clearInterval(iTimer);
                oEndPanel.GameOver(iScore, mode);
            }
        }, 20);
    };
    
    this._init(iRow, iCol, iX, iY, oParentContainer, state);
}