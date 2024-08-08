var CANVAS_WIDTH = 1920;
var CANVAS_HEIGHT = 1080;

var FONT = 'dimboregular';
var EDGEBOARD_X = 110;
var EDGEBOARD_Y = 70;

var FPS      = 30;
var DISABLE_SOUND_MOBILE = false;

var STATE_LOADING = 0;
var STATE_MENU    = 1;
var STATE_HELP    = 1;
var STATE_GAME    = 3;

var ON_MOUSE_DOWN  = 0;
var ON_MOUSE_UP    = 1;
var ON_MOUSE_OVER  = 2;
var ON_MOUSE_OUT   = 3;
var ON_DRAG_START  = 4;
var ON_DRAG_END    = 5;

var CELL_WIDTH = 50;
var CELL_HEIGHT = 50;
var START_X_GRID = CANVAS_WIDTH/5-25;
var START_Y_GRID = CANVAS_HEIGHT/6+10;
var NUM_ROWS = 15;
var NUM_COLS = 25;
var APPLE_ON = false;
var FRUIT_ON = false;
var TIME_FRUIT;
var APPLE_TO_EAT_ADVENTURE;
var APPLE_TO_EAT_SURVIVAL;
var SPEED;   //EVERY 300 MS THE SNAKE WILL BE MOVED
var LEVEL_TIME;
var LEVEL_NUM = 20;

var SURVIVAL_MODE = 0;
var ADVENTURE_MODE = 1;

var RIGHT_DIR = 0;
var UP_DIR = 1;
var LEFT_DIR = 2;
var DOWN_DIR = 3;
var APPLE = 4;
var BACKGROUND = 5;  


var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;