function CGame(mode, level, oData) {
    var _iTimeElaps = 0;
    var _iDir;
    var _iScore = 0;
    var _iLevelScore;
    var _iGoalNumber;
    var _iScoreForFruit = 0;
    var _iPrecDir = 24;
    var _iTimerFruitElapse;
    var _iFinalSpeed;
    var _iFruitCount = 0;
    var _iWasEating = 600;
    var _iLevel = level;
    var _iTimer = 0;
    var _iHead = 0;
    var _iNoMoreGoal = false;
    var _iFinished = 0;
    var _iCurrentOperation;
    var _iCorrectAnswer;
    var _aAnswerOptions;
    var _iGameTimer;
    var _iSurvivalTimer;
    var _aApples = [];
    var NUM_APPLES = 4;

    var _aSnakeSpeed;
    var _aGoal;
    var _aGoalEated;
    var _aGrid;
    var _aSnake;
    var _aTail;
    var _aDirIncrease;

    var _bUpdate = false;
    var _bChangeDir = false;
    var _bPressedKey = false;
    var _bEating = false;
    var _bDead = false;
    var _bCanPress = false;

    var _oApple = { x: 0, y: 0 };
    var _oCherry = { x: 0, y: 0 };
    var _oPear = { x: 0, y: 0 };
    var _oGrapes = { x: 0, y: 0 };
    var _oOrange = { x: 0, y: 0 };
    var _oStrawberry = { x: 0, y: 0 };

    var _oContainerGrid;
    var _oInterface;
    var _oEndPanel = null;
    var _oParent;

    this._init = function () {
        setVolume("soundtrack", 0.5);

        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_bottom'));
        s_oStage.addChild(oBg);

        _oContainerGrid = new createjs.Container();
        s_oStage.addChild(_oContainerGrid);

        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_top'));
        s_oStage.addChild(oBg);

        for (var i = 0; i < _iLevel; i++) {
            _iScore += s_aScores[i];
        }

        _oInterface = new CInterface(_iScore);

        _aSnakeSpeed = new Array(0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190);

        s_oLevelSetting = new CLevel(_iLevel);

        this._createGrid();
        APPLE_ON = false;

        if (!s_bMobile) {
            document.onkeydown = onKeyDown;
        }

        this._initMathOperation();
        this._initTimer();
        this._initLevel();
    };

    this._initSnake = function () {
        _aSnake = [
            { row: 1, col: 1, state: 'tail', dir: RIGHT_DIR },
            { row: 1, col: 2, state: 'body', dir: RIGHT_DIR },
            { row: 1, col: 3, state: 'body', dir: RIGHT_DIR },
            { row: 1, col: 4, state: 'body', dir: RIGHT_DIR },
            { row: 1, col: 5, state: 'body', dir: RIGHT_DIR },
            { row: 1, col: 6, state: 'head', dir: RIGHT_DIR }
        ];

        for (var i = 0; i < _aSnake.length; i++) {
            _aGrid[_aSnake[i].row][_aSnake[i].col].changeCellState(24, _aSnake[i].dir, _aSnake[i].state);
        }

        _aDirIncrease = [
            { row: 0, col: 1 },
            { row: -1, col: 0 },
            { row: 0, col: -1 },
            { row: 1, col: 0 }
        ];

        _aTail = [{ row: 0, col: 0, state: 'background', dir: 0 }];

        _iDir = 0;
    };

    this.unload = function () {
        _oInterface.unload();
        if (_oEndPanel !== null) {
            _oEndPanel.unload();
        }

        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
    };

    this._createGrid = function () {
        var iX = START_X_GRID;
        var iY = START_Y_GRID;

        _aGrid = new Array();
        for (var iRow = 0; iRow < NUM_ROWS; iRow++) {
            _aGrid[iRow] = new Array();
            for (var iCol = 0; iCol < NUM_COLS; iCol++) {
                var iValue = s_oLevelSetting.getCellValueInLevel(_iLevel, (NUM_COLS * iRow) + iCol);
                _aGrid[iRow][iCol] = new CCell(iRow, iCol, iX, iY, _oContainerGrid, iValue);
                iX += CELL_WIDTH;
            }
            iY += CELL_HEIGHT;
            iX = START_X_GRID;
        }
    };

    this._initLevel = function () {
        $(s_oMain).trigger("start_level", _iLevel);

        _iFinalSpeed = SPEED - _aSnakeSpeed[_iLevel];
        _iFruitCount = 0;
        _iTimeElaps = 0;
        _iDir = 0;
        _iScoreForFruit = 0;
        _iLevelScore = 0;
        _iPrecDir = 24;
        _iTimerFruitElapse = 0;
        _iFruitCount = 0;
        _iWasEating = 600;
        _iFinished = 0;
        _bUpdate = false;
        _bChangeDir = false;
        _bPressedKey = false;
        FRUIT_ON = false;
        _bEating = false;
        _iNoMoreGoal = false;
        APPLE_ON = false;

        s_oLevelSetting = new CLevel(_iLevel);

        if (mode === SURVIVAL_MODE) {
            _oInterface.setTimerContainerVisible(true);
            _iSurvivalTimer = 60;
            this._updateTimerDisplay();
        } else if (mode === ADVENTURE_MODE) {
            _oInterface.setTimerContainerVisible(true);
            _iTimer = LEVEL_TIME;
            _aGoal = new Array();
            _aGoalEated = new Array();
            _iGoalNumber = s_oLevelSetting.getGoalNumberInLevel(_iLevel);

            var offset_x = 120;
            var offset_y = 300;
            for (var i = 0; i < _iGoalNumber; i++, offset_y += 80) {
                _aGoal.push(s_oLevelSetting.getGoalInLevel(_iLevel, i));
                _aGoalEated.push(0);
                _oInterface.seeGoal(_aGoal[i].type, _aGoal[i].num, _aGoalEated[i], offset_x, offset_y);
            }
        }

        this._initSnake();

        this.onNextLevel(_iLevel, mode);
        this.spawnFruit();
    };

    this._initMathOperation = function () {
        _iCurrentOperation = this._generateMathOperation();
        _iCorrectAnswer = this._calculateAnswer(_iCurrentOperation);
        _aAnswerOptions = this._generateAnswerOptions(_iCorrectAnswer);
        this._displayMathOperation(_iCurrentOperation);
    };

    this._generateMathOperation = function() {
        var num1 = Math.floor(Math.random() * 10) + 1;
        var num2 = Math.floor(Math.random() * 10) + 1;
        var operations = ['+', '-', 'x']; // Replace '*' with 'x' in the operations array
        var operation = operations[Math.floor(Math.random() * operations.length)];
        return `${num1} ${operation} ${num2}`; 
      };


      this._calculateAnswer = function(operation) {
        operation = operation.replace(/x/g, '*'); // Replace all 'x' with '*'
        return eval(operation);
      };

    this._generateAnswerOptions = function (correctAnswer) {
        var options = [correctAnswer];
        while (options.length < NUM_APPLES) {
            var wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
            if (options.indexOf(wrongAnswer) === -1 && wrongAnswer > 0) {
                options.push(wrongAnswer);
            }
        }
        return this.shuffleArray(options);
    };

    this.shuffleArray = function (array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    this._displayMathOperation = function (operation) {
        _oInterface.displayMathOperation(operation);
    };

    this._initTimer = function () {
        _iGameTimer = 60;
        this._updateTimerDisplay();
    };

    this._updateTimerDisplay = function () {
        if (mode === ADVENTURE_MODE) {
            _oInterface.refreshTimeLeft(formatTime(_iTimer));
        } else if (mode === SURVIVAL_MODE) {
            var minutes = Math.floor(_iSurvivalTimer / 60);
            var seconds = Math.floor(_iSurvivalTimer % 60);
            var displayTime = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
            _oInterface.updateTimer(displayTime);
        }
    };

    function onKeyDown(evt) {
        if (!evt) {
            evt = window.event;
        }

        if (_bCanPress === true) {
            if (!_bPressedKey) {
                if (evt.keyCode === 37 && _iDir !== 0) {
                    _bPressedKey = true;
                    _iDir = 2;
                    _bChangeDir = true;
                    _iPrecDir = _aSnake[_iHead].dir;
                    _aSnake[_iHead].dir = _iDir;
                    evt.preventDefault();
                    return false;
                } else if (evt.keyCode === 38 && _iDir !== 3) {
                    _bPressedKey = true;
                    _iDir = 1;
                    _bChangeDir = true;
                    _iPrecDir = _aSnake[_iHead].dir;
                    _aSnake[_iHead].dir = _iDir;
                    evt.preventDefault();
                    return false;
                } else if (evt.keyCode === 39 && _iDir !== 2) {
                    _bPressedKey = true;
                    _iDir = 0;
                    _bChangeDir = true;
                    _iPrecDir = _aSnake[_iHead].dir;
                    _aSnake[_iHead].dir = _iDir;
                    evt.preventDefault();
                    return false;
                } else if (evt.keyCode === 40 && _iDir !== 1) {
                    _bPressedKey = true;
                    _iDir = 3;
                    _bChangeDir = true;
                    _iPrecDir = _aSnake[_iHead].dir;
                    _aSnake[_iHead].dir = _iDir;
                    evt.preventDefault();
                    return false;
                } else if (evt.keyCode === 32) {
                    evt.preventDefault();
                    return false;
                }
            }
        }
    }

    this._onButtonDirDown = function (_iDirectionSelected) {
        if (!_bPressedKey) {
            if (_iDirectionSelected === 37 && _iDir !== 0) {
                _bPressedKey = true;
                _iDir = 2;
                _bChangeDir = true;
                _iPrecDir = _aSnake[_iHead].dir;
                _aSnake[_iHead].dir = _iDir;
                _oInterface._onDirectionLeave();
            } else if (_iDirectionSelected === 38 && _iDir !== 3) {
                _bPressedKey = true;
                _iDir = 1;
                _bChangeDir = true;
                _iPrecDir = _aSnake[_iHead].dir;
                _aSnake[_iHead].dir = _iDir;
                _oInterface._onDirectionLeave();
            } else if (_iDirectionSelected === 39 && _iDir !== 2) {
                _bPressedKey = true;
                _iDir = 0;
                _bChangeDir = true;
                _iPrecDir = _aSnake[_iHead].dir;
                _aSnake[_iHead].dir = _iDir;
                _oInterface._onDirectionLeave();
            } else if (_iDirectionSelected === 40 && _iDir !== 1) {
                _bPressedKey = true;
                _iDir = 3;
                _bChangeDir = true;
                _iPrecDir = _aSnake[_iHead].dir;
                _aSnake[_iHead].dir = _iDir;
                _oInterface._onDirectionLeave();
            }
        }
    };

    this._moveSnake = function () {
        if (!_aSnake || _aSnake.length === 0) {
            console.error("Snake array is empty or undefined");
            return;
        }
    
        _iHead = _aSnake.length - 1;
        _aTail = [{ row: _aSnake[0].row, col: _aSnake[0].col, state: _aSnake[0].state, dir: _aSnake[0].dir }];
    
        for (var i = 0; i < _iHead; i++) {
            if (_aSnake[i + 1]) {
                _aSnake[i].row = _aSnake[i + 1].row;
                _aSnake[i].col = _aSnake[i + 1].col;
    
                if (_aSnake[i].state === "curves" || _aSnake[i].state === "eating") {
                    _aSnake[i].state = "body";
                }
                if (_bChangeDir && (_aSnake[i].dir !== _aSnake[i + 1].dir) && i > 0) {
                    _aSnake[i].state = "curves";
                }
                if (i > 0 && i + 1 !== _iHead) {
                    _aSnake[i].state = _aSnake[i + 1].state;
                }
    
                _aSnake[i].dir = _aSnake[i + 1].dir;
            }
        }
    
        if (_aSnake[_iHead] && _aDirIncrease[_iDir]) {
            _aSnake[_iHead].row += _aDirIncrease[_iDir].row;
            _aSnake[_iHead].col += _aDirIncrease[_iDir].col;
    
            if (_aSnake[_iHead].row >= NUM_ROWS) {
                _aSnake[_iHead].row = 0;
            } else if (_aSnake[_iHead].row < 0) {
                _aSnake[_iHead].row = NUM_ROWS - 1;
            } else if (_aSnake[_iHead].col >= NUM_COLS) {
                _aSnake[_iHead].col = 0;
            } else if (_aSnake[_iHead].col < 0) {
                _aSnake[_iHead].col = NUM_COLS - 1;
            }
        }
    
        if (_bEating === true) {
            if (_aSnake[_iHead - 1].state !== 'curves') {
                _aSnake[_iHead - 1].state = "eating";
                _aSnake[_iHead].state = "head";
            } else if (_aSnake[_iHead - 1].state === 'curves') {
                _iWasEating = _iHead - 1;
            }
            _bEating = false;
        }

        if (_iWasEating - 1 > 0 && _iWasEating !== 600) {
            _iWasEating--;
        } else if (_iWasEating - 1 === 0) {
            _aSnake[1].state = 'body';
            _aSnake = _aTail.concat(_aSnake);
            _iHead = _aSnake.length - 1;
            _iWasEating = 600;
            _aGrid[_aTail[0].row][_aTail[0].col].changeCellState(_iPrecDir, _aTail[0].dir, _aTail[0].state);
        }

        if (_aSnake[1].state === "eating") {
            _aSnake[1].state = 'body';
            _aSnake = _aTail.concat(_aSnake);
            _iHead = _aSnake.length - 1;
            _aGrid[_aTail[0].row][_aTail[0].col].changeCellState(_iPrecDir, _aTail[0].dir, _aTail[0].state);
        }
        _aTail[0].state = 'background';
        _aGrid[_aTail[0].row][_aTail[0].col].changeCellState(_iPrecDir, _aTail[0].dir, _aTail[0].state);

        _aGrid[_aSnake[0].row][_aSnake[0].col].changeCellState(_iPrecDir, _aSnake[0].dir, 'tail');

        if (_aGrid[(_aSnake[_iHead].row)][_aSnake[_iHead].col].getValue() === 'apple') {
            this.fruitEaten(_aGrid[(_aSnake[_iHead].row)][_aSnake[_iHead].col].getValue());
        } else if (_aGrid[(_aSnake[_iHead].row)][_aSnake[_iHead].col].getValue() === 'cherry') {
            this.fruitEaten(_aGrid[(_aSnake[_iHead].row)][_aSnake[_iHead].col].getValue());
        } else if (_aGrid[(_aSnake[_iHead].row)][_aSnake[_iHead].col].getValue() === 'pear') {
            this.fruitEaten(_aGrid[(_aSnake[_iHead].row)][_aSnake[_iHead].col].getValue());
        } else if (_aGrid[(_aSnake[_iHead].row)][_aSnake[_iHead].col].getValue() === 'grapes') {
            this.fruitEaten(_aGrid[(_aSnake[_iHead].row)][_aSnake[_iHead].col].getValue());
        } else if (_aGrid[(_aSnake[_iHead].row)][_aSnake[_iHead].col].getValue() === 'orange') {
            this.fruitEaten(_aGrid[(_aSnake[_iHead].row)][_aSnake[_iHead].col].getValue());
        } else if (_aGrid[(_aSnake[_iHead].row)][_aSnake[_iHead].col].getValue() === 'strawberry') {
            this.fruitEaten(_aGrid[(_aSnake[_iHead].row)][_aSnake[_iHead].col].getValue());
        } else if (_aGrid[(_aSnake[_iHead].row)][_aSnake[_iHead].col].getValue() !== 'background') {
            _bUpdate = false;
            _bDead = true;
            this.gameOver();
            return;
        }

        _aGrid[_aSnake[_iHead].row][_aSnake[_iHead].col].changeCellState(_iPrecDir, _aSnake[_iHead].dir, _aSnake[_iHead].state);
        _aGrid[_aSnake[_iHead - 1].row][_aSnake[_iHead - 1].col].changeCellState(_iPrecDir, _aSnake[_iHead - 1].dir, _aSnake[_iHead - 1].state);

        this.anyFruit(_aSnake[_iHead].row, _aSnake[_iHead].col);

        if (_bPressedKey) {
            _bPressedKey = false;
        }
    };

    this.anyFruit = function (irow, icol) {
        if ((irow + 1) < NUM_ROWS) {
            if (_aGrid[irow + 1][icol].getValue() === 'apple' || _aGrid[irow + 1][icol].getValue() === 'cherry' || _aGrid[irow + 1][icol].getValue() === 'pear' || _aGrid[irow + 1][icol].getValue() === 'grapes' || _aGrid[irow + 1][icol].getValue() === 'orange' || _aGrid[irow + 1][icol].getValue() === 'strawberry') {
                _aGrid[irow][icol].changeCellState(_iPrecDir, _aSnake[_iHead].dir, 'mouth_opened');
            }
        }
        if ((icol + 1) < NUM_COLS) {
            if (_aGrid[irow][icol + 1].getValue() === 'apple' || _aGrid[irow][icol + 1].getValue() === 'cherry' || _aGrid[irow][icol + 1].getValue() === 'pear' || _aGrid[irow][icol + 1].getValue() === 'grapes' || _aGrid[irow][icol + 1].getValue() === 'orange' || _aGrid[irow][icol + 1].getValue() === 'strawberry') {
                _aGrid[irow][icol].changeCellState(_iPrecDir, _aSnake[_iHead].dir, 'mouth_opened');
            }
        }
        if ((irow - 1) >= 0) {
            if (_aGrid[irow - 1][icol].getValue() === 'apple' || _aGrid[irow - 1][icol].getValue() === 'cherry' || _aGrid[irow - 1][icol].getValue() === 'pear' || _aGrid[irow - 1][icol].getValue() === 'grapes' || _aGrid[irow - 1][icol].getValue() === 'orange' || _aGrid[irow - 1][icol].getValue() === 'strawberry') {
                _aGrid[irow][icol].changeCellState(_iPrecDir, _aSnake[_iHead].dir, 'mouth_opened');
            }
        }
        if ((icol - 1) > 0) {
            if (_aGrid[irow][icol - 1].getValue() === 'apple' || _aGrid[irow][icol - 1].getValue() === 'cherry' || _aGrid[irow][icol - 1].getValue() === 'pear' || _aGrid[irow][icol - 1].getValue() === 'grapes' || _aGrid[irow][icol - 1].getValue() === 'orange' || _aGrid[irow][icol - 1].getValue() === 'strawberry') {
                _aGrid[irow][icol].changeCellState(_iPrecDir, _aSnake[_iHead].dir, 'mouth_opened');
            }
        }
    };

    this.fruitEaten = function (fruit) {
        var iTmpScore = 0;
        var eatenAnswer = _aGrid[_aSnake[_iHead].row][_aSnake[_iHead].col].getAnswer();
    
        if (fruit === 'apple') {
            if (eatenAnswer !== null && parseInt(eatenAnswer) === _iCorrectAnswer) {
                iTmpScore += 10;
                if (mode === SURVIVAL_MODE) {
                    this._removeAllApples();
                    this._initMathOperation();
                    this.spawnFruit();
                }
            } else {
                saveItem("wrong_answer", "true"); 
                saveItem("last_score", _iScore);  
                setTimeout(function() {
                    window.location.reload();
                }, 500);  
                return; // Stop processing fruitEaten if wrong answer
            }
            _iScoreForFruit++;
            if (mode !== SURVIVAL_MODE) {
                APPLE_ON = false;
            }
        } else if (fruit === 'cherry' || fruit === 'pear' || fruit === 'grapes' || fruit === 'orange' || fruit === 'strawberry') {
            if (mode === SURVIVAL_MODE) {
                this._deleteFruit();
            }
            iTmpScore += Math.floor((_iTimerFruitElapse + 100) / 1000 + (_aSnakeSpeed[_iLevel] / 10));
        }
    
        _iLevelScore += iTmpScore;
        _iScore += iTmpScore;
    
        playSound("eating", 1, false);
    
        var offset_x = 100;
        var offset_y = 300;
    
        for (var i = 0; i < _iGoalNumber; i++, offset_y += 100) {
            if (_aGoal[i].type === fruit) {
                if (_aGoalEated[i] < _aGoal[i].num) {
                    _aGoalEated[i] += 1;
                    if (_aGoalEated[i] === _aGoal[i].num) {
                        _iFinished++;
                    }
                    _oInterface.seeGoalLeft(_aGoal[i].num, _aGoalEated[i], i);
                }
            }
        }
        if (mode === ADVENTURE_MODE) {
            if (_iFinished === _iGoalNumber) {
                if (!_iNoMoreGoal) {
                    playSound("goal", 1, false);
                }
                _iNoMoreGoal = true;
            }
            if (_iNoMoreGoal && _iTimer > 0 && fruit === 'apple') {
                this.saveProgress();
                _oContainerGrid.removeAllChildren();
                _oInterface.resetGoalInterface(_iLevel);
    
                $(s_oMain).trigger("share_event", _iScore);
                $(s_oMain).trigger("save_score", [parseInt(_iScore), "adventure"]);
    
                this._initLevel(_iLevel);
                _iLevel++;
            }
        }
    
        _bEating = true;
    
        _oInterface.refreshScore(_iScore);
        if (mode === SURVIVAL_MODE) {
            if (_aSnakeSpeed[0] < SPEED) {
                if (_iFruitCount === APPLE_TO_EAT_SURVIVAL) {
                    _iFruitCount = 0;
                    _aSnakeSpeed[0] += 10;
                }
            }
            _iFruitCount++;
        }
    
        if (mode !== SURVIVAL_MODE || fruit !== 'apple') {
            this.spawnFruit();
        }
    }; 
    this._removeAllApples = function () {
        for (var i = 0; i < _aApples.length; i++) {
            _aGrid[_aApples[i].x][_aApples[i].y].changeCellState(24, 24, 'background');
        }
        _aApples = [];
    };

    this._removeApple = function (row, col) {
        _aGrid[row][col].changeCellState(24, 24, 'background');
        _aApples = _aApples.filter(apple => apple.x !== row || apple.y !== col);
        if (_aApples.length === 0 && mode === SURVIVAL_MODE) {
            this._initMathOperation();
            this.spawnFruit(); 
        }
    };

    this.spawnFruit = function () {
        _aApples = [];
        for (var i = 0; i < NUM_APPLES; i++) {
            do {
                var x = Math.floor(Math.random() * NUM_ROWS);
                var y = Math.floor(Math.random() * NUM_COLS);
            } while (_aGrid[x][y].getValue() !== 'background' || this._isPositionOccupied(x, y));

            var answer = _aAnswerOptions[i];
            _aGrid[x][y].changeCellState(24, 24, "apple", answer);
            _aApples.push({ x: x, y: y, answer: answer });
        }
        APPLE_ON = true;
    };

    this._isPositionOccupied = function (x, y) {
        return _aApples.some(apple => apple.x === x && apple.y === y);
    };

    this._deleteFruit = function () {
        if (mode === SURVIVAL_MODE) {
            if (_iTimerFruitElapse > 0) {
                _iScore += Math.floor(_iTimerFruitElapse / 1000 + (_aSnakeSpeed[_iLevel] / 10));
                _iLevelScore += Math.floor(_iTimerFruitElapse / 1000 + (_aSnakeSpeed[_iLevel] / 10));
            }
        }
        if (_aGrid[_oCherry.x][_oCherry.y].getValue() === 'cherry') {
            _aGrid[_oCherry.x][_oCherry.y].changeCellState(24, 24, 'background');
        }
        if (_aGrid[_oPear.x][_oPear.y].getValue() === 'pear') {
            _aGrid[_oPear.x][_oPear.y].changeCellState(24, 24, 'background');
        }
        if (_aGrid[_oOrange.x][_oOrange.y].getValue() === 'orange') {
            _aGrid[_oOrange.x][_oOrange.y].changeCellState(24, 24, 'background');
        }
        if (_aGrid[_oGrapes.x][_oGrapes.y].getValue() === 'grapes') {
            _aGrid[_oGrapes.x][_oGrapes.y].changeCellState(24, 24, 'background');
        }
        if (_aGrid[_oStrawberry.x][_oStrawberry.y].getValue() === 'strawberry') {_aGrid[_oStrawberry.x][_oStrawberry.y].changeCellState(24, 24, 'background');
    }

    FRUIT_ON = false;
    _oInterface.refreshTime('00:00');
    _iScoreForFruit = 0;
    _iTimerFruitElapse = 0;
    _oInterface.setContainerVisible(false);
};

this.onNextLevel = function (_iLevel, mode) {
    _bUpdate = false;
    _bCanPress = false;
    new CNextLevel(s_oSpriteLibrary.getSprite('msg_box'), _iLevel, mode, _iScore, s_oStage);
};

this.onNextLevelExit = function () {
    _bUpdate = true;
    _bCanPress = true;
};

this.onExit = function () {
    $(s_oMain).trigger("end_level", _iLevel);
    $(s_oMain).trigger("end_session");
    $(s_oMain).trigger("show_interlevel_ad");

    this.unload();
    s_oMain.gotoMenu();
};

this.gameOver = function () {
    _bUpdate = false;

    _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'), _iLevel, s_oStage);

    if (mode === ADVENTURE_MODE && !_bDead && _iTimer < 0 && !_iNoMoreGoal) {
        _oEndPanel.GameOverAdventure(_iScore, mode);
    } else if (mode === ADVENTURE_MODE && s_oLevelSetting.getLevelMax() === _iLevel && !_bDead && _iNoMoreGoal) {
        _oEndPanel.win(_iScore, mode);
        this.saveProgress();
    } else if (_bDead) {
        _aGrid[0][0]._deathEffect(_oContainerGrid, _oEndPanel, _iScore, mode);
        playSound("game_over", 1, false);
    }
};

this.saveProgress = function () {
    if (_iLevel < s_oLevelSetting.getLevelMax() && _iLevel >= s_iLastLevel) {
        s_iLastLevel = _iLevel + 1;
    }

    if (_iLevelScore > s_aScores[_iLevel]) {
        s_aScores[_iLevel] = _iLevelScore;
    }
    saveItem("snake_level", s_iLastLevel);
    saveItem("snake_scores", JSON.stringify(s_aScores));
};

this.onPause = function () {
    _bUpdate = false;
    new CPausePanel(s_oSpriteLibrary.getSprite('msg_box'), s_oStage); 
};

this.onPauseExit = function () {
    _bUpdate = true;
};

this.update = function () {
    if (_bUpdate) {
        _iTimeElaps += s_iTimeElaps;
        if (_iTimeElaps > SPEED - _aSnakeSpeed[_iLevel]) {
            _iTimeElaps = 0;
            this._moveSnake();
        }
        if (mode === ADVENTURE_MODE) {
            _iTimer -= s_iTimeElaps;
            if (_iTimer < 0) {
                if (!_iNoMoreGoal) {
                    this.gameOver();
                } else if (_iNoMoreGoal && s_oLevelSetting.getLevelMax() === _iLevel) {
                    this.gameOver();
                } else if (_iNoMoreGoal) {
                    this.saveProgress();
                    _oContainerGrid.removeAllChildren();
                    _oInterface.resetGoalInterface(_iLevel);

                    $(s_oMain).trigger("share_event", _iScore);
                    $(s_oMain).trigger("save_score", [parseInt(_iScore), "adventure"]);

                    this._initLevel(_iLevel++);
                }
            }
            if (_bUpdate) {
                _oInterface.refreshTimeLeft(formatTime(_iTimer));
            }
        } else if (mode === SURVIVAL_MODE) {
            _iSurvivalTimer -= s_iTimeElaps / 1000;
            if (_iSurvivalTimer <= 0) {
                _iSurvivalTimer = 0;
                this.survivalGameOver();
            } else {
                this._updateTimerDisplay();
            }
        }

    }
    if (FRUIT_ON) {
        _iTimerFruitElapse -= s_iTimeElaps;
        if (_iTimerFruitElapse <= 0) {
            this._deleteFruit();
        }
        _oInterface.refreshTime(formatTime(_iTimerFruitElapse));           
    }
};

this.survivalGameOver = function () {
    _bUpdate = false;
    console.log("Survival mode time's up! Reloading page...");
    setTimeout(function() {
        window.location.reload();
    }, 1000);
};

this._returnToMainMenu = function() {
    console.log("Returning to main menu");
    this.unload();
    s_oMain.gotoMenu();
};

s_oGame = this;
_oParent = this;

TIME_FRUIT = oData.time_fruit;
APPLE_TO_EAT_ADVENTURE = oData.apple_eat_adventure;
APPLE_TO_EAT_SURVIVAL = oData.apple_eat_survival;
SPEED = oData.starting_speed_snake;
LEVEL_TIME = oData.level_time;

this._init();
}

var s_oGame;