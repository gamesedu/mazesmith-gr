/*
###########################################################
# Mazesmith
# Version: 0.7.0 _jmod02a(arrowkeys)20150501
# Author:  Robert
# Email:   brathna@gmail.com
# Website: http://mazesmith.sourceforge.net/
###########################################################
# Mazesmith, creates a perfect maze.
# Copyright (C) Robert Klein
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the
# Free Software Foundation, Inc.
# 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
# or visit the following website:
# http://www.opensource.org/licenses/gpl-license.php
###########################################################
*/

/*
Set configPanel to 0 (zero) if you want the script show a maze
instead of the config panel when you first visit the page.
*/

var configPanel = 1;

/*
Set the main title that appears above the config panel title.
*/

var mainTitle = 'Mazesmith';

/*
Set the config panel title that appears below the main title.
*/

var configPanelTitle = '[Options]';

/*
Set the background color of the config panel.  If you set it to
equal nothing, '', the config panel will be transparent.
*/

var configBackground = 'white';

/*
Set the default keys.
(left, right, up, down, pause, solve, hint, save, header, reload)
*/

var keys = new Array('j','l','i','k','q','s','h','y','c','r');

/*
Set the default start and end icons
*/

var startIcon = 'human.gif';
var endIcon = 'end.gif';

/*
Set the CSS used by the script.
*/

var e = ' \
<style type="text/css"> \
  a:hover { text-decoration:underline; } \
\
  #title { \
    font-size:18px; \
    font-weight:bold; \
    font-family:Arial,Sans; \
  } \
  #title2 { \
    font-size:13px; \
    cursor:crosshair; \
    font-family:Arial,Sans; \
  } \
\
  .big-button { \
    border: 1px solid black; \
    width: 200px; \
    background: #EEE; \
    margin-left: auto; \
    margin-right: auto; \
    cursor: crosshair; \
    font-size: 13px; \
  } \
\
  .small-button { \
    border: 1px solid black; \
    width: 120px; \
    background: #EEE; \
    margin-left: auto; \
    margin-right: auto; \
    cursor: crosshair; \
    font-size: 13px; \
  } \
\
  .extra { \
    cursor:crosshair; \
  } \
\
  .help { \
    font-size:12px; \
    cursor:crosshair; \
  } \
\
</style> \
';


/*******************************************************************/
document.write(e);
document.write('<script type="text/javascript" src="mazesmith_themes.js"></script>');


var cell = 1;
var seconds = 0;
var minutes = 0;
var won = 0;
var moves = 0;
var back = new Array();
var backtrack = 0;
var paused = 0;
var time = 0;
var finish = 0;
var marked = new Array();
var createdMain = '';
var timeout = 0;
var timeout2 = 0;
var startingCell = 1;
var focusObj;
var solveStack = new Array();
var hints = 0;
var left,top,right,bottom = new Array();
var _trail = new Array();
var _backt = new Array();
var kCode = new Array();
var conType = 'conBasic';

var t = (document.cookie.indexOf('savedSettings') != -1) ? GetCookie('savedSettings').split('&') : '';

if(t!='') {
  var rows = parseInt(t[0]);
  var cols = parseInt(t[1]);
  var path = parseFloat(t[2]);
  var border = parseFloat(t[3]);
  var version = parseInt(t[4]);
  var print = t[5];
  var randomStart = t[6];
  var background = unescape(t[7]);
  var borderColor = unescape(t[8]);
  var pathColor = unescape(t[9]);
  var markerColor = unescape(t[10]);
  var trailColor = unescape(t[11]);
  var backtrackColor = unescape(t[12]);
  var randomEnd = t[13];
  var randomEndSeconds = parseInt(t[14]);
  var shape = shapeNo = t[15];
  var length = t[16];
  var hideEnd = t[17];
  var braid = (t[18]) ? t[18] : '0';
  var bias = (t[19]!='') ? t[19] : 4;
  if(t.length>20) var keys = t[20].split(',');
  var markerImage = (t[21]) ? t[21] : 'false';
  // t[22] is the theme
  var conType = (t[23]!='') ? t[23] : 'conBasic';
}

function createMainTable(load) {

  if(createdMain) document.getElementById('mazeDiv').removeChild(createdMain);

  var echoThis = '<div id="main" style="text-align:center;width:100%;"><table cellpadding="0" cellspacing="0" style="margin-left:auto;margin-right:auto;"><tr><td><table cellpadding="0" cellspacing="0" style="border:0px;">';

  _trail = new Array();
  _backt = new Array();

  if(load) {
    var temp = document.getElementById('loadMazeArea').value.split(' / ');
    var t = temp[0].split('&');
    rows = parseInt(t[0]);
    cols = parseInt(t[1]);
    path = parseFloat(t[2]);
    border = parseFloat(t[3]);
    version = parseInt(t[4]);
    print = t[5];
    randomStart = t[6];
    background = unescape(t[7]);
    borderColor = unescape(t[8]);
    pathColor = unescape(t[9]);
    markerColor = unescape(t[10]);
    trailColor = unescape(t[11]);
    backtrackColor = unescape(t[12]);
    randomEnd = t[13];
    randomEndSeconds = parseInt(t[14]);
    shape = shapeNo = t[15];
    length = t[16];
    hideEnd = t[17];
    braid = t[18];
    bias = t[19];

    t = temp[1].split('&');
    cell = startingCell = t[0];
    finish = t[1];
    seconds = t[2];
    minutes = t[3];
    moves = t[4];
    back = t[5].split(',');
    backtrack = t[6];
    hints = t[7];
    _trail = t[8].split(',');
    _backt = t[9].split(',');

    left = temp[3].split(',');
    top = temp[4].split(',');
    right = temp[5].split(',');
    bottom = temp[6].split(',');

    solveStack = new Array();
    won = 0;

    if(temp[2]!='0') {
      shape = new Array();
      shape = temp[2].split(',');
      rows = parseInt(shape[1]);
      cols = parseInt(shape[2]);
      startingCell = shape[5];
      shapeNo = '2';

      var u = shape[0].length;
      for(var a=0;a<=u;a++) {
        if(shape[0].charAt(a)=='0') {
          marked[(a+1)]=9;
        }
      }
    }

  } else {

  rows = parseInt(document.getElementById('rows').value);
  cols = parseInt(document.getElementById('cols').value);
  path = parseInt(document.getElementById('path').value);
  border = parseFloat(document.getElementById('border').value);
  version = parseInt(document.getElementById('version').options[document.getElementById('version').selectedIndex].value);
  print = document.getElementById('print').checked.toString();
  randomStart = document.getElementById('randomStart').checked.toString();
  background = document.getElementById('background').value;
  borderColor = document.getElementById('borderColor').value;
  pathColor = document.getElementById('pathColor').value;
  markerColor = document.getElementById('markerColor').value;
  trailColor = document.getElementById('trailColor').value;
  backtrackColor = document.getElementById('backtrackColor').value;
  randomEnd = document.getElementById('randomEnd').checked.toString();
  randomEndSeconds = document.getElementById('randomEndSeconds').value;
  shape = shapeNo = document.getElementById('shape').options[document.getElementById('shape').selectedIndex].value;
  length = document.getElementById('length').value;
  hideEnd = document.getElementById('hideEnd').checked.toString();
  braid = document.getElementById('braid').value;
  bias = document.getElementById('bias').options[document.getElementById('bias').selectedIndex].value;

  if(version==4) shape = shapeNo = 1;

  if(shape=='custom') {
    var temp = prompt('Enter your custom shape below');
    shape = new Array();
    shape = temp.split(',');
    rows = parseInt(shape[1]);
    cols = parseInt(shape[2]);
    shapeNo = '2';

  } else if(shape!='1') {
    if(shape=='2')       shape = new Array("000000000000111000000000000000000000111111111000000000000000011111111111110000000000001111111111111111100000000011111111111111111110000000111111111111111111111000000111111111111111111111000001111111111111111111111100001111111111111111111111100011111111111111111111111110011111111111111111111111110011111111111111111111111110111111111111111111111111111111111111111111111111111111111111111111111111111111111011111111111111111111111110011111111111111111111111110011111111111111111111111110001111111111111111111111100001111111111111111111111100000111111111111111111111000000111111111111111111111000000011111111111111111110000000001111111111111111100000000000011111111111110000000000000000111111111000000000000000000000111000000000000",27,27,0,0);
    else if(shape=='3')  shape = new Array("0000000001100000000000000000111100000000000000011111100000000000001111111100000000000111111111100000000011111111111100000001111111111111100000111111111111111100011111111111111111101111111111111111111111111111111111111111011111111111111111100011111111111111110000011111111111111000000011111111111100000000011111111110000000000011111111000000000000011111100000000000000011110000000000000000011000000000",20,20,0,0);
    else if(shape=='4')  shape = new Array("1111000000000000111111111000000000011111111111000000001111111111111000000111111101111111000011111110001111111001111111000001111111111111100000001111111111110000000001111111111000000000001111111100000000000011111111000000000001111111111000000000111111111111000000011111111111111000001111111001111111000111111100001111111011111110000001111111111111000000001111111111100000000001111111110000000000001111",20,20,0,0);
    else if(shape=='5')  shape = new Array("11111111111100000111111000000100001111111000000111100000001000011111111000000110000000010000111111110011001100000000100001111111100110011000000001111111111111111111111110000011111111111111111111111111000111111111111111111111111110001111111111111111111111111100011111111111111111111111111000111111111111111111111111100001111111111111111111111111000011111111111111111111111110000111111111111111111111111110001111111111111111111111111110011111111111111111111111111110111111111111111111111111111110001111101111101111101111100000001110001110001110001110000",19,29,0,0);
    else if(shape=='6')  shape = new Array("0001110000000000000111000001111110000000001111110001111111110000011111111100111111111000001111111110011111111110001111111111001111111111000111111111100111111111110111111111110001111111111111111111111000011111111111111111111000000011111111111111100000000000001111111110000000000000011111111111110000000000011111111111111100000000111111111111111111100000111111111111111111111000011111111111111111111100011111111111111111111111001111111110111011111111100111111111011101111111110011111111001110011111111001111111000111000111111100011111000011100001111100000111000001110000011100000000000000111000000000000000000000011100000000000",25,25,0,0);
    else if(shape=='7')  shape = new Array("000000000000111000000000000000000000111111111000000000000000011111111111110000000000001111111111111111100000000011111111111111111110000000111111111111111111111000000111111111111111111111000001111110001111100011111100001111110001111100011111100011111111111111111111111110011111111111111111111111110011111111111111111111111110111111111111111111111111111111111111111111111111111111111111111111111111111111111011110111111111111111011110011110011111111111110011110011111001111111111100111110001111100000000000001111100001111110000000000011111100000111111111111111111111000000111111111111111111111000000011111111111111111110000000001111111111111111100000000000011111111111110000000000000000111111111000000000000000000000111000000000000",27,27,0,0);
    else if(shape=='8')  shape = new Array("111111000000000000000000111111111111000000000000000000111111011111100000000000000001111110011111100000000000000001111110001111110000000000000011111100001111110000000000000011111100000111111000000000000111111000000111111000000000000111111000000011111100000000001111110000000011111100000000001111110000000001111110000000011111100000000001111110000000011111100000000000111111000000111111000000000000111111000000111111000000000000011111100001111110000000000000011111100001111110000000000000001111110011111100000000000000001111110011111100000000000000000111111111111000000000000000000111111111111000000000000000000011111111110000000000000000000011111111110000000000000000000001111111100000000000000000000001111111100000000000000000000000111111000000000000000000000000111111000000000000000000000000011110000000000000000000000000011110000000000000",28,30,1,30);
    else if(shape=='9')  shape = new Array("000000000000001100000000000000000000000000001100000000000000000000000000011110000000000000000000000000011110000000000000000000000000111111000000000000000000000000111111000000000000000000000001111111100000000000000000000001111111100000000000000000000011111111110000000000000000000011111111110000000000000000000111111111111000000000000000000111111111111000000000000000001111111111111100000000000000001111111111111100000000000000011111111111111110000000000000011111111111111110000000000000111111111111111111000000000000111111111111111111000000000001111111111111111111100000000001111111111111111111100000000011111111111111111111110000000011111111111111111111110000000111111111111111111111111000000111111111111111111111111000001111111111111111111111111100001111111111111111111111111100011111111111111111111111111110011111111111111111111111111110111111111111111111111111111111111111111111111111111111111111",30,30,0,0);
    else if(shape=='10') shape = new Array("1111111111111111111111111111111111111111111111111101010101010101010101010101010101010101010101010111111111111111111111111111111111111111111111111111010101010101010101010101010101010101010101010101111111111111111111111111111111111111111111111111110101010101010101010101010101010101010101010101011111111111111111111111111111111111111111111111111101010101010101010101010101010101010101010101010111111111111111111111111111111111111111111111111111010101010101010101010101010101010101010101010101111111111111111111111111111111111111111111111111110101010101010101010101010101010101010101010101011111111111111111111111111111111111111111111111111101010101010101010101010101010101010101010101010111111111111111111111111111111111111111111111111111010101010101010101010101010101010101010101010101111111111111111111111111111111111111111111111111110101010101010101010101010101010101010101010101011111111111111111111111111111111111111111111111111101010101010101010101010101010101010101010101010111111111111111111111111111111111111111111111111111010101010101010101010101010101010101010101010101111111111111111111111111111111111111111111111111110101010101010101010101010101010101010101010101011111111111111111111111111111111111111111111111111101010101010101010101010101010101010101010101010111111111111111111111111111111111111111111111111111010101010101010101010101010101010101010101010101111111111111111111111111111111111111111111111111110101010101010101010101010101010101010101010101011111111111111111111111111111111111111111111111111101010101010101010101010101010101010101010101010111111111111111111111111111111111111111111111111111010101010101010101010101010101010101010101010101111111111111111111111111111111111111111111111111110101010101010101010101010101010101010101010101011111111111111111111111111111111111111111111111111101010101010101010101010101010101010101010101010111111111111111111111111111111111111111111111111111010101010101010101010101010101010101010101010101111111111111111111111111111111111111111111111111110101010101010101010101010101010101010101010101011111111111111111111111111111111111111111111111111101010101010101010101010101010101010101010101010111111111111111111111111111111111111111111111111111010101010101010101010101010101010101010101010101111111111111111111111111111111111111111111111111110101010101010101010101010101010101010101010101011111111111111111111111111111111111111111111111111",49,49,0,0);
    else if(shape=='11') shape = new Array("0000000000000000000000011110000000000000000000000000000000000000000001111111111110000000000000000000000000000000000011111111111111111100000000000000000000000000000011111111111111111111110000000000000000000000000011111111111111111111111111000000000000000000000011111111111111111111111111111100000000000000000001111111111111111111111111111111100000000000000000111111111111111111111111111111111100000000000000011111111111111111111111111111111111100000000000001111111111111111111111111111111111111100000000000111111111111111111111111111111111111111100000000001111111111111111111111111111111111111111000000000111111111111111111111111111111111111111111000000001111111111111111111111111111111111111111110000000111111111111111111111111111111111111111111110000001111111111111111111111111111111111111111111100000111111111111111111111111111111111111111111111100001111111111111111111111111111111111111111111111000011111111111111111111111111111111111111111111110001111111111111111111111111111111111111111111111110011111111111111111111111111111111111111111111111100111111111111111111111111111111111111111111111111001111111111111111111111111111111111111111111111110111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110111111111111111111111111111111111111111111111111001111111111111111111111111111111111111111111111110011111111111111111111111111111111111111111111111100111111111111111111111111111111111111111111111111000111111111111111111111111111111111111111111111100001111111111111111111111111111111111111111111111000011111111111111111111111111111111111111111111110000011111111111111111111111111111111111111111111000000111111111111111111111111111111111111111111110000000111111111111111111111111111111111111111111000000001111111111111111111111111111111111111111110000000001111111111111111111111111111111111111111000000000011111111111111111111111111111111111111110000000000011111111111111111111111111111111111111000000000000011111111111111111111111111111111111100000000000000011111111111111111111111111111111110000000000000000011111111111111111111111111111111000000000000000000011111111111111111111111111111100000000000000000000001111111111111111111111111100000000000000000000000000111111111111111111111100000000000000000000000000000011111111111111111100000000000000000000000000000000000111111111111000000000000000000000000000000000000000000111100000000000000000000000",50,50,0,0);
    else if(shape=='12') shape = new Array("0000000000000000000000001100000000000000000000000000000000000000000000000011000000000000000000000000000000000000000000000001111000000000000000000000000000000000000000000000011110000000000000000000000000000000000000000000001111110000000000000000000000000000000000000000000011111100000000000000000000000000000000000000000001111111100000000000000000000000000000000000000000011111111000000000000000000000000000000000000000001111111111000000000000000000000000000000000000000011111111110000000000000000000000000000000000000001111111111110000000000000000000000000000000000000011111111111100000000000000000000000000000000000001111111111111100000000000000000000000000000000000011111111111111000000000000000000000000000000000001111111111111111000000000000000000000000000000000011111111111111110000000000000000000000000000000001111111111111111110000000000000000000000000000000011111111111111111100000000000000000000000000000001111111111111111111100000000000000000000000000000011111111111111111111000000000000000000000000000001111111111111111111111000000000000000000000000000011111111111111111111110000000000000000000000000001111111111111111111111110000000000000000000000000011111111111111111111111100000000000000000000000001111111111111111111111111100000000000000000000000011111111111111111111111111000000000000000000000001111111111111111111111111111000000000000000000000011111111111111111111111111110000000000000000000001111111111111111111111111111110000000000000000000011111111111111111111111111111100000000000000000001111111111111111111111111111111100000000000000000011111111111111111111111111111111000000000000000001111111111111111111111111111111111000000000000000011111111111111111111111111111111110000000000000001111111111111111111111111111111111110000000000000011111111111111111111111111111111111100000000000001111111111111111111111111111111111111100000000000011111111111111111111111111111111111111000000000001111111111111111111111111111111111111111000000000011111111111111111111111111111111111111110000000001111111111111111111111111111111111111111110000000011111111111111111111111111111111111111111100000001111111111111111111111111111111111111111111100000011111111111111111111111111111111111111111111000001111111111111111111111111111111111111111111111000011111111111111111111111111111111111111111111110001111111111111111111111111111111111111111111111110011111111111111111111111111111111111111111111111101111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",50,50,0,0);
    rows = shape[1];
    cols = shape[2];
  }

  if(shapeNo!='1') {
    t = shape[0].length;
    for(var a=0;a<=t;a++) {
      if(shape[0].charAt(a)=='0') {
        marked[(a+1)]=9;
      }
    }
  }

  var cellStack = new Array();
  var totalCells = (rows*cols);
  var temp = new Array();
  var a = '';
  var currentCell = 1;
  var dir = 0;
  var dirA = 0;
  var visited = 1;
  var borders = new Array();

  left = new Array();
  top = new Array();
  right = new Array();
  bottom = new Array();

  won = 0;
  seconds = 0;
  minutes = 0;
  moves = 0;
  backtrack = 0;
  back = new Array();
  solveStack = new Array();
  hints = 0;

  if(braid>0) {
    for(var a=1;a<=totalCells;a++) borders[a] = 4;
  }

  if(shape=='1') {
    currentCell = Math.ceil(Math.random()*(totalCells+1));
  } else {
    for(a=Math.ceil(Math.random()*(totalCells+1));a<=shape[0].length;a++) {
      if(shape[0].charAt(a-1)=='1') break;
    }
    currentCell = a;
  }

  if(version==3) {
    for(var b=1;b<=totalCells;b++) {
      if(marked[b]!=9) marked[b]=3;
    }
  }

  marked[currentCell] = 1;

if(version==3) {

  var frontier = new Array();

  do {
    var biasA = '';

    a = (currentCell-cols);
    if(marked[a]==3 && a>0) {
      frontier.push(a);
      marked[a]=2;
    }

    a = (currentCell+1);
    if((Math.ceil(currentCell/cols))==(Math.ceil(a/cols)) && a<=totalCells) {
      if(marked[a]==3) {
        frontier.push(a);
        marked[a]=2;
      }
    }

    a = (currentCell+cols);
    if(marked[a]==3 && a<=totalCells) {
      frontier.push(a);
      marked[a]=2;
    }

    a = (currentCell-1);
    if((Math.ceil(currentCell/cols))==(Math.ceil(a/cols)) && a>0) {
      if(marked[a]==3) {
        frontier.push(a);
        marked[a]=2;
      }
    }

    a = Math.ceil(Math.random()*frontier.length)-1;
    currentCell = frontier[a];
    frontier.splice(a,1);

    dirA = 0;

    a = (currentCell-cols);
    if(marked[a]==1 && a>0) {
      temp.push(a+'|'+1);
      if(dir=='1') dirA = a+'|'+1;
      if(bias<0 && Math.ceil(Math.random()*4)<(-1*bias)) biasA = a+'|'+1;
    }

    a = (currentCell+1);
    if((Math.ceil(currentCell/cols))==(Math.ceil(a/cols)) && a<=totalCells) {
      if(marked[a]==1) {
        temp.push(a+'|'+2);
        if(dir=='2') dirA = a+'|'+2;
        if(bias>0 && Math.ceil(Math.random()*4)<bias) biasA = a+'|'+2;
      }
    }

    a = (currentCell+cols);
    if(marked[a]==1 && a<=totalCells) {
      temp.push(a+'|'+3);
      if(dir=='3') dirA = a+'|'+3;
      if(bias<0 && Math.ceil(Math.random()*4)<(-1*bias)) { if(biasA!=0) { biasA += ','; } biasA += a+'|'+3 }
    }

    a = (currentCell-1);
    if((Math.ceil(currentCell/cols))==(Math.ceil(a/cols)) && a>0) {
      if(marked[a]==1) {
        temp.push(a+'|'+4);
        if(dir=='4') dirA = a+'|'+4;
        if(bias>0 && Math.ceil(Math.random()*4)<bias) { if(biasA!=0) { biasA += ','; } biasA += a+'|'+4 };
      }
    }

    if(bias!=0 && biasA!=0) {
      temp = biasA.split(',');
      dirA = Math.floor(Math.random()*temp.length);
      a = temp[dirA].split('|');
    } else if(dirA!=0 && length!=0) {
      if((Math.ceil(Math.random()*100))>(100-length)) { a = dirA.split('|'); }
      else {
      a = Math.ceil(Math.random()*temp.length)-1;
      a = temp[a].split('|');
      }
    } else {
      a = Math.ceil(Math.random()*temp.length)-1;
      a = temp[a].split('|');
    }
    var tCell = a[0];
    dir = a[1];

    switch(dir) {
    case '1':
      top[currentCell] = 0;
      bottom[tCell] = 0;
      marked[currentCell] = 1;
      borders[currentCell]--;
      borders[tCell]--;
      visited++;
      break;
    case '2':
      right[currentCell] = 0;
      left[tCell] = 0;
      marked[currentCell] = 1;
      borders[currentCell]--;
      borders[tCell]--;
      visited++;
      break;
    case '3':
      bottom[currentCell] = 0;
      top[tCell] = 0;
      marked[currentCell] = 1;
      borders[currentCell]--;
      borders[tCell]--;
      visited++;
      break;
    case '4':
      left[currentCell] = 0;
      right[tCell] = 0;
      marked[currentCell] = 1;
      borders[currentCell]--;
      borders[tCell]--;
      visited++;
      break;
    }

    temp = new Array();

  } while(frontier.length!=0);
} else {

if(version==4) {

  currentCell = totalCells;

  do {
    a = (currentCell-cols);
    if((a>0 && marked[a]!=9 && Math.ceil(Math.random()*2)==1) || (currentCell-1)%cols==0) {
      top[currentCell] = 0;
      borders[currentCell]--;
      bottom[currentCell-cols] = 0;
      borders[currentCell-cols]--;
      visited++;
    } else {
      a = (currentCell-1);
      if((Math.ceil(currentCell/cols))==(Math.ceil(a/cols)) && a>0) {
        if(marked[a]!=9) {
          left[currentCell] = 0;
          borders[currentCell]--;
          right[currentCell-1] = 0;
          borders[currentCell-1]--;
          visited++;
        }
      }
    }
    currentCell--;
  } while(currentCell!=1);
}
else {

  do {

    var biasA = '';

    dirA = 0;
    a = (currentCell-cols);
    if(marked[a]!=1 && a>0 && marked[a]!=9) {
      temp.push('1');
      if(dir=='1') dirA = 1;
        if(bias<0 && Math.ceil(Math.random()*4)<(-1*bias)) biasA = '1';
    }

    a = (currentCell+1);
    if((Math.ceil(currentCell/cols))==(Math.ceil(a/cols)) && a<=totalCells) {
      if(marked[a]!=1 && marked[a]!=9) {
        temp.push('2');
        if(dir=='2') dirA = 1;
        if(bias>0 && Math.ceil(Math.random()*4)<bias) biasA = '2';
      }
    }

    a = (currentCell+cols);
    if(marked[a]!=1 && a<=totalCells && marked[a]!=9) {
      temp.push('3');
      if(dir=='3') dirA = 1;
        if(bias<0 && Math.ceil(Math.random()*4)<(-1*bias)) biasA += '3';
    }

    a = (currentCell-1);
    if((Math.ceil(currentCell/cols))==(Math.ceil(a/cols)) && a>0) {
      if(marked[a]!=1 && marked[a]!=9) {
        temp.push('4');
        if(dir=='4') dirA = 1;
        if(bias>0 && Math.ceil(Math.random()*4)<bias) biasA += '4';
      }
    }

    if(temp!='') {

      if(bias!=0 && biasA!=0) {
        dir = biasA.charAt(Math.floor(Math.random()*biasA.length));
      } else if(dirA==1 && length!=0) {
        if((Math.ceil(Math.random()*100))<(100-length)) { dir = Math.ceil(Math.random()*temp.length)-1; dir = temp[dir]; }
      } else {
        dir = Math.ceil(Math.random()*temp.length)-1;
        dir = temp[dir];
      }

      switch (dir) {
      case '1':
        cellStack.push(currentCell);
        visited++;
        top[currentCell] = 0;
        borders[currentCell]--;
        currentCell = (currentCell-cols);
        bottom[currentCell] = 0;
        borders[currentCell]--;
        marked[currentCell] = 1;
        break;
      case '2':
        cellStack.push(currentCell);
        visited++;
        right[currentCell] = 0;
        borders[currentCell]--;
        currentCell++;
        left[currentCell] = 0;
        borders[currentCell]--;
        marked[currentCell] = 1;
        break;
      case '3':
        cellStack.push(currentCell);
        visited++;
        bottom[currentCell] = 0;
        borders[currentCell]--;
        currentCell = (currentCell+cols);
        top[currentCell] = 0;
        borders[currentCell]--;
        marked[currentCell] = 1;
        break;
      case '4':
        cellStack.push(currentCell);
        visited++;
        left[currentCell] = 0;
        borders[currentCell]--;
        currentCell--;
        right[currentCell] = 0;
        borders[currentCell]--;
        marked[currentCell] = 1;
        break;
      }
    } else {
      if(version==1) {
        a = cellStack.length;
        a = Math.ceil(Math.random()*a)-1;
        currentCell = cellStack[a];
        cellStack.splice(a,1);
      } else {
        currentCell = cellStack.pop();
      }
    }
    temp = new Array();

    if(visited==totalCells) break;

  } while(cellStack.length!=0);
}

}

if(braid>0) {
  for(var a=1,currentCell=1;a<=rows;a++) {
    for(var b=1;b<=cols;b++,currentCell++) {
      temp = new Array();
      if(borders[currentCell]==3 && Math.ceil(Math.random()*100)>(100-braid) && marked[currentCell]!=9) {
        if(b!=1 && left[currentCell]!=0 && marked[currentCell-1]!=9) temp.push('1');
        if(a!=1 && top[currentCell]!=0 && marked[currentCell-cols]!=9) temp.push('2');
        if(b!=cols && right[currentCell]!=0 && marked[currentCell+1]!=9) temp.push('3');
        if(a!=rows && bottom[currentCell]!=0 && marked[currentCell+cols]!=9) temp.push('4');
        dir = Math.ceil(Math.random()*temp.length)-1;
        dir = temp[dir];
        switch(dir) {
        case '1':
          left[currentCell] = 0;
          right[currentCell-1] = 0;
          break;
        case '2':
          top[currentCell] = 0;
          bottom[currentCell-cols] = 0;
          break;
        case '3':
          right[currentCell] = 0;
          left[currentCell+1] = 0;
          break;
        case '4':
          bottom[currentCell] = 0;
          top[currentCell+cols] = 0;
          break;
        }
      }
    }
  }
}

  marked = '';
  visited = '';
  cellStack = '';

  if(randomStart=='true' && shape=='1') {
    a = Math.ceil(Math.random()*rows)-1;
    a = (a*cols)+1;
  } else {
    if(shape=='1') {
      a = 1;
    } else {
      if(shape[3]==0) {
        for(a=1;a<=shape[0].length;a++) {
          if(shape[0].charAt(a-1)=='1') break;
        }
      } else { a = shape[3]; }
    }
  }

  cell = startingCell = a;

  if(randomStart=='true' && shape=='1') {
    a = Math.ceil(Math.random()*rows);
    a = (a*cols);
  } else {
    if(shape=='1') {
      a = (rows*cols);
    } else {
      if(shape[4]==0) {
        for(a=shape[0].length;a>0;a--) {
          if(shape[0].charAt(a-1)=='1') break;
        }
      } else { a = shape[4]; }
    }
  }
  finish = a;

  marked = new Array();
  cellStack = new Array();

  dir = 0;
}

  for(var a=1,c=0;a<=rows;a++) {
    echoThis += '<tr>';
    for(var b=1;b<=cols;b++,c++) {
      if(shapeNo!='1') {
        if(shape[0].charAt(c)=='0') {
          hide = 'visibility:hidden;';
        }
        else { hide = ''; }
      }
      else { hide = ''; }

      var bStyles = (left[(c+1)]=='0') ? 'border-left:0px;' : 'border-left:'+border+'px solid '+borderColor+';';
      bStyles += (top[(c+1)]=='0') ? 'border-top:0px;' : 'border-top:'+border+'px solid '+borderColor+';';
      bStyles += (right[(c+1)]=='0') ? 'border-right:0px;' : 'border-right:'+border+'px solid '+borderColor+';';
      bStyles += (bottom[(c+1)]=='0') ? 'border-bottom:0px;' : 'border-bottom:'+border+'px solid '+borderColor+';';

      echoThis += '<td style="background:'+pathColor+';'+bStyles+';width:'+path+'px;line-height:'+path+'px;'+hide+'" id="_'+(c+1)+'">&nbsp;</td>';
    }
    echoThis += '</tr>';
  }
  echoThis += '</table></td></tr></table></div>';

  createdMain = document.createElement("DIV");
  createdMain.id = "mainTable";
  createdMain.innerHTML = echoThis;
  document.getElementById('mazeDiv').appendChild(createdMain);

  document.bgColor = background;
  document.getElementById('title').style.color = borderColor;
  document.getElementById('title2').style.color = borderColor;
  document.getElementById('main').style.display = 'none';

  if(print!='true') display();
  else window.status = '';

  finishMaze();
}

function createEllerMaze() {
  rows = parseInt(document.getElementById('rows').value);
  cols = parseInt(document.getElementById('cols').value);
  path = parseInt(document.getElementById('path').value);

  var ellerWin = null;
  w = (screen.width) ? (screen.width-50) : 800;
  h = (screen.height) ? (screen.height-100) : 600;
  LeftPosition=(screen.width)?(screen.width-w)/2:100;TopPosition=0;
  settings='width='+w+',height='+h+',top='+TopPosition+',left='+LeftPosition+',scrollbars=yes,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=yes';
  ellerWin=window.open('','ellerMazeWin',settings);

  doc = ellerWin.document;
  doc.open('text/html');

  var le = new Array();
  var ri = new Array();

  doc.write('<pre style="font-size:'+path+'px;">');

  for(var a=1;a<=cols;a++) { le[a] = a; ri[a] = a; doc.write(' _'); }

  for(var a=1;a<rows;a++) {
    doc.write('<br />');
    if(a!=1) doc.write('|'); else doc.write(' ');
    for(var b=1;b<=cols;b++) {

      if(Math.ceil(Math.random()*5)>2 && b!=cols && ri[b] != b+1) {
        le[ri[b]] = le[b+1];
        ri[le[b+1]] = ri[b];
        ri[b] = b+1;
        le[b+1] = b;
        right = ' ';
      } else {
        right = '|';
      }

      if(Math.ceil(Math.random()*5)>2 && ri[b] != b) {
        le[ri[b]] = le[b];
        ri[le[b]] = ri[b];
        le[b] = ri[b] = b;
        down = '_';
      } else {
        down = ' ';
      }

      doc.write(down+right);

    }
  }

  doc.write('<br />|');

  for(var b=1;b<=cols;b++) {
    if(ri[b] != b+1) {
      le[ri[b]] = le[b+1];
      ri[le[b+1]] = ri[b];
      ri[b] = b+1;
      le[b+1] = b;
      right = ' ';
    } else {
      right = '|';
    }
    doc.write('_'+right);
  }

  doc.write('</pre>');
  doc.close();
}

function solveMaze(hint) {
  if(solveStack=='' || randomEnd=='true') {
    var cellStack = new Array();
    var currentCell = parseInt(startingCell);
    var totalCells = (rows*cols);
    var temp = new Array();
    var marked = new Array();
    var dir = 0;
    var visited = 1;
    if(!hint) {
      window.clearTimeout(timeout);
      window.clearTimeout(timeout2);
    }

    if(!hint) document.getElementById('_'+currentCell).style.backgroundColor = 'red';

    marked[currentCell] = 1;

    do {
      a = (currentCell-cols);
      if(marked[a]!=1 && document.getElementById('_'+currentCell).style.borderTop.substring(0,3)=='0px') {
        temp.push('1');
      }

      a = (currentCell+1);
      if(marked[a]!=1 && document.getElementById('_'+currentCell).style.borderRight.substring(0,3)=='0px') {
        temp.push('2');
      }

      a = (currentCell+cols);
      if(marked[a]!=1 && document.getElementById('_'+currentCell).style.borderBottom.substring(0,3)=='0px') {
        temp.push('3');
      }

      a = (currentCell-1);
      if(marked[a]!=1 && document.getElementById('_'+currentCell).style.borderLeft.substring(0,3)=='0px') {
        temp.push('4');
      }

      if(temp!='') {

        dir = Math.ceil(Math.random()*temp.length)-1;
        dir = temp[dir];

        switch (dir) {
        case '1':
          cellStack.push(currentCell);
          visited++;
          currentCell = (currentCell-cols);
          marked[currentCell] = 1;
          break;
        case '2':
          cellStack.push(currentCell);
          visited++;
          currentCell++;
          marked[currentCell] = 1;
          break;
        case '3':
          cellStack.push(currentCell);
          visited++;
          currentCell = (currentCell+cols);
          marked[currentCell] = 1;
          break;
        case '4':
          cellStack.push(currentCell);
          visited++;
          currentCell--;
          marked[currentCell] = 1;
          break;
        }
      } else {
        currentCell = cellStack.pop();
      }
      temp = new Array();

      if(visited==totalCells) break;

    } while(currentCell!=finish);
    solveStack = cellStack;
  }

  if(!hint) {
    for(var a=solveStack.length;a>0;a--) document.getElementById('_'+solveStack[(a-1)]).style.backgroundColor = 'red';
    document.getElementById('_'+finish).style.backgroundColor = 'red';
    won = 1;
  } else {
    var l = solveStack.length;
    for(var a=1,b=1;;a++) {
      if(b>5 || a>l) break;
      if(document.getElementById('_'+solveStack[(a-1)]).style.backgroundColor==pathColor) {
        document.getElementById('_'+solveStack[(a-1)]).style.backgroundColor = 'red';
        b++;
      }
    }
    hints++;
  }

  cellStack = '';
  marked = '';
  visited = '';
}

function eventHandle() {
  document.onkeypress=move;
  
  
  document.onkeydown=move; //added by jon 20150501
}

function move(e) {
  var code;
  var currentCell = cell;
  var cellColor = '';
  if (!e) var e = window.event;
  if (e.keyCode) code = e.keyCode;
  else if (e.which) code = e.which;

  if(code==13 && print!='true' && configPanel==1) {
    code = 'a';
    document.getElementById('submit').onclick();
  }

  if(code==kCode[4] && print!='true' && configPanel==0) {
    if(!paused) {
      paused = 1;
      document.getElementById('main').style.display = 'none';
      document.getElementById('paused').style.display = 'block';
    } else {
      paused = 0;
      document.getElementById('main').style.display = 'block';
      document.getElementById('paused').style.display = 'none';
    }
  }

  if(configPanel==0 && !paused) {
    if(code==kCode[8]) {
      if(document.getElementById('controls').style.display == 'none') document.getElementById('controls').style.display = 'block';
      else document.getElementById('controls').style.display = 'none';
    } else if(code==kCode[9]) {
      if(confirm('Are you sure you want to reload the maze?')) {
        code = 'a';
        document.getElementById('submit').onclick();
      }
    }
  }

  if(configPanel==0 && print!='true' && !paused && !won) {
    if(code==kCode[7]) {
      saveMaze();
    } else if(code==kCode[5]) {
      paused = 1;
      if(confirm('Are you sure you want to solve the maze?\n\nThis might take a while depending on the size of the maze and what version used.')) solveMaze(0);
      paused = 0;
    } else if(code==kCode[6]) {
      paused = 1;
      if(confirm('Are you sure you want to get a hint?\n\nThis might take a while depending on the size of the maze and what version used.')) solveMaze(1);
      paused = 0;
    } else if(code==kCode[0] || code==37 ) { //LEFT key
      if(document.getElementById('_'+currentCell).style.borderLeft.substring(0,3)=='0px') {
        if(back[currentCell]==1) { document.getElementById('_'+currentCell).style.backgroundColor = backtrackColor; _backt[currentCell] = 1; _trail[currentCell] = 0; }
        else { document.getElementById('_'+currentCell).style.backgroundColor = trailColor; _trail[currentCell] = 1; _backt[currentCell] = 0; }
        document.getElementById('_'+currentCell).style.backgroundImage = '';
        back[currentCell] = 1;
        currentCell--;
        if(back[currentCell]==1) { cellColor = backtrackColor; backtrack++; }
        else { cellColor = pathColor; }
        if(finish==currentCell) wonMaze();
        else if(document.getElementById('markerImage').checked!=true) document.getElementById('_'+currentCell).style.backgroundColor = markerColor;
        else document.getElementById('_'+currentCell).style.background = cellColor +' url('+startIcon+') center center no-repeat';
        moves++;
      }
    } else if(code==kCode[2] || code==38 ) { //upKey
      if(document.getElementById('_'+currentCell).style.borderTop.substring(0,3)=='0px') {
        if(back[currentCell]==1) { document.getElementById('_'+currentCell).style.backgroundColor = backtrackColor; _backt[currentCell] = 1; _trail[currentCell] = 0; }
        else { document.getElementById('_'+currentCell).style.backgroundColor = trailColor; _trail[currentCell] = 1; _backt[currentCell] = 0; }
        document.getElementById('_'+currentCell).style.backgroundImage = '';
        back[currentCell] = 1;
        currentCell = (currentCell - cols);
        if(back[currentCell]==1) { cellColor = backtrackColor; backtrack++; }
        else { cellColor = pathColor; }
        if(finish==currentCell) wonMaze();
        else if(document.getElementById('markerImage').checked!=true) document.getElementById('_'+currentCell).style.backgroundColor = markerColor;
        else document.getElementById('_'+currentCell).style.background = cellColor +' url('+startIcon+') center center no-repeat';
        moves++;
      }
    } else if(code==kCode[1] || code==39 ) { //rightKey
      if(document.getElementById('_'+currentCell).style.borderRight.substring(0,3)=='0px') {
        if(back[currentCell]==1) { document.getElementById('_'+currentCell).style.backgroundColor = backtrackColor; _backt[currentCell] = 1; _trail[currentCell] = 0; }
        else { document.getElementById('_'+currentCell).style.backgroundColor = trailColor; _trail[currentCell] = 1; _backt[currentCell] = 0; }
        document.getElementById('_'+currentCell).style.backgroundImage = '';
        back[currentCell] = 1;
        currentCell++;
        if(back[currentCell]==1) { cellColor = backtrackColor; backtrack++; }
        else { cellColor = pathColor; }
        if(finish==currentCell) wonMaze();
        else if(document.getElementById('markerImage').checked!=true) document.getElementById('_'+currentCell).style.backgroundColor = markerColor;
        else document.getElementById('_'+currentCell).style.background = cellColor +' url('+startIcon+') center center no-repeat';
        moves++;
      }
    } else if(code==kCode[3] || code==40 ) { //downKey
      if(document.getElementById('_'+currentCell).style.borderBottom.substring(0,3)=='0px') {
        if(back[currentCell]==1) { document.getElementById('_'+currentCell).style.backgroundColor = backtrackColor; _backt[currentCell] = 1; _trail[currentCell] = 0; }
        else { document.getElementById('_'+currentCell).style.backgroundColor = trailColor; _trail[currentCell] = 1; _backt[currentCell] = 0; }
        document.getElementById('_'+currentCell).style.backgroundImage = '';
        back[currentCell] = 1;
        currentCell = (currentCell + cols);
        if(back[currentCell]==1) { cellColor = backtrackColor; backtrack++; }
        else { cellColor = pathColor; }
        if(finish==currentCell) wonMaze();
        else if(document.getElementById('markerImage').checked!=true) document.getElementById('_'+currentCell).style.backgroundColor = markerColor;
        else document.getElementById('_'+currentCell).style.background = cellColor +' url('+startIcon+') center center no-repeat';
        moves++;
      }
    }
    if(!paused && code!='a') {
      cell = currentCell;
      window.status = 'Moves: '+moves+' - Backtracked: '+backtrack+' - Hints: '+hints+' - Time: '+time;
    }
  }
}

function saveMaze() {
  configPanel=2;
  paused=1;
  document.getElementById('main').style.display='none';
  document.getElementById('saveMazeDiv').style.display = 'block';
  var settings = saveData() + ' / ' + cell + '&' + finish + '&' + seconds + '&' + minutes + '&' + moves + '&' + back + '&' + backtrack + '&' + hints + '&' + _trail + '&' + _backt;
  document.getElementById('saveMazeArea').value = settings + ' / ' + ((shapeNo!=1) ? shape + ',' + startingCell : '0') + ' / ' + left + ' / ' + top + ' / ' + right + ' / ' + bottom;
}

function wonMaze() {
  won = 1;
  if(minutes>0) {
    if(minutes==1) var minPlural = "minute"; else var minPlural = "minutes";
    if(seconds==1) var secPlural = "second"; else var secPlural = "seconds";
    time = minutes+' '+minPlural+' '+seconds+' '+secPlural;
  } else { time = seconds+' seconds'; }

  alert('Congratulations\n\nTime: '+time+'\n\nMoves: '+moves+'\n\nBacktrack: '+backtrack+'\n\nHints: '+hints);
}

function display() {
  if(!paused && !won) seconds++;
  if(seconds==60) { minutes++;seconds=0; }
  if(!won) timeout = setTimeout("display()",1000);

  if(minutes>0) {
    if(minutes==1) var minPlural = "minute"; else var minPlural = "minutes";
    if(seconds==1) var secPlural = "second"; else var secPlural = "seconds";
    time = minutes+' '+minPlural+' '+seconds+' '+secPlural;
  } else { time = seconds+' seconds'; }

  window.status = 'Moves: '+moves+' - Backtracked: '+backtrack+' - Hints: '+hints+' - Time: '+time;
}

// Cookie Functions - Second Helping (21-Jan-96)
// Written by: Bill Dortch, hIdaho Design - bdortch@netw.com

function getCookieVal (offset) {
  var endstr = document.cookie.indexOf (";", offset);
  if (endstr == -1) endstr = document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr));
}

function GetCookie (name) {
  var arg = name + "=";
  var alen = arg.length;
  var clen = document.cookie.length;
  var i = 0;
  while (i < clen) {
    var j = i + alen;
    if (document.cookie.substring(i, j) == arg) return getCookieVal (j);
    i = document.cookie.indexOf(" ", i) + 1;
    if (i == 0) break; 
  }
  return null;
}

function colorTable(fieldID) {
  var cP = null;
  w = 250;
  h = 250;
  LeftPosition=(screen.width)?(screen.width-w)/2:100;
  TopPosition=(screen.height)?(screen.height-h)/2:100;
  settings='width='+w+',height='+h+',top='+TopPosition+',left='+LeftPosition+',scrollbars=yes,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=yes';
  cP=window.open('','cP',settings);

  doc = cP.document;
  doc.open('text/html');
  doc.write('<html><head><title>Mazesmith Color Picker</title></head><body style="background-color:white;font-family:Arial;">');

// HTML Color Picker
// Author: Jean-Luc Antoine
// http://www.interclasse.com/scripts/colorpicker.php

  var echo = ' \
<form name="recherche" method="post" action="yourpage.html"> \
<input type="hidden" name="rgb" value="123"> \
<table style="background-color:#f6f6f6;border:1px solid #666;padding:5px;margin:0px auto;"> \
<tr> \
<td style="border:1px outset #CCF;background-color:#ffe;width=150px"> \
<div id="temoin" style="float:right;width:20px;height:128px;"> </div> \
\
<script type="text/javascript"> \
var total=1657;var X=Y=j=RG=B=0; \
var aR=new Array(total);var aG=new Array(total);var aB=new Array(total); \
for (var i=0;i<256;i++){ \
aR[i+510]=aR[i+765]=aG[i+1020]=aG[i+5*255]=aB[i]=aB[i+255]=0; \
aR[510-i]=aR[i+1020]=aG[i]=aG[1020-i]=aB[i+510]=aB[1530-i]=i; \
aR[i]=aR[1530-i]=aG[i+255]=aG[i+510]=aB[i+765]=aB[i+1020]=255; \
if(i<255){aR[i/2+1530]=127;aG[i/2+1530]=127;aB[i/2+1530]=127;} \
} \
function p(){var jla=document.getElementById(\'choix\');jla.innerHTML=artabus;jla.style.backgroundColor=artabus;document.forms[\'recherche\'].rgb.value=artabus} \
var hexbase=new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"); \
var i=0;var jl=new Array(); \
for(x=0;x<16;x++)for(y=0;y<16;y++)jl[i++]=hexbase[x]+hexbase[y]; \
document.write(\'<table border="0" cellspacing="0" cellpadding="0" onMouseover="t(event)" onClick="p()">\'); \
var H=W=63; \
for (Y=0;Y<=H;Y++){ \
	s=\'<tr height=2>\';j=Math.round(Y*(510/(H+1))-255); \
	for (X=0;X<=W;X++){ \
		i=Math.round(X*(total/W)); \
		R=aR[i]-j;if(R<0)R=0;if(R>255||isNaN(R))R=255; \
		G=aG[i]-j;if(G<0)G=0;if(G>255||isNaN(G))G=255; \
		B=aB[i]-j;if(B<0)B=0;if(B>255||isNaN(B))B=255; \
		s=s+\'<td width=2 bgcolor=#\'+jl[R]+jl[G]+jl[B]+\'><\'+\'/td>\'; \
	} \
	document.write(s+\'</tr>\'); \
} \
document.write(\'</table>\'); \
var ns6=document.getElementById&&!document.all; \
var ie=document.all; \
var artabus=\'\'; \
function t(e){ \
source=ie?event.srcElement:e.target; \
if(source.tagName=="TABLE")return; \
while(source.tagName!="TD" && source.tagName!="HTML")source=ns6?source.parentNode:source.parentElement; \
document.getElementById(\'temoin\').style.backgroundColor=artabus=source.bgColor; \
} \
</script> \
<div id="choix" style="height:20px;" onClick="document.forms[\'recherche\'].rgb.value=\'\';this.style.backgroundColor=\'\'"> </div><td></tr> \
</table> \
</form> \
<div style="text-align:center;"><input type="button" value="OK" onclick="window.opener.document.getElementById(\''+fieldID+'Span\').style.backgroundColor=window.opener.document.getElementById(\''+fieldID+'\').value = document.forms[\'recherche\'].rgb.value;window.close();" /></div> \
';
  doc.write(echo);
  doc.write('</body></html>');
  doc.close();
}

function help() {
  var help = null;
  w = 800;
  h = 600;
  LeftPosition=(screen.width)?(screen.width-w)/2:100;
  TopPosition=(screen.height)?(screen.height-h)/2:100;
  settings='width='+w+',height='+h+',top='+TopPosition+',left='+LeftPosition+',scrollbars=yes,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=yes';
  help=window.open('','help',settings);

  doc = help.document;
  doc.open('text/html');
  doc.write('<html><head><title>Mazesmith help</title></head><body style="background-color:white;font-family:Arial;">');
echo = ' \
  <div style="text-align:justify;"> \
  <div style="font-weight:bold">Information:</div><br /> \
  The bigger the maze, the slower it will take to create. It might even seem that your browser has frozen - give it time and it should complete. There isn\'t a limit on the size of the maze as the size is all dependent on how much memory your computer has and how fast it is.<br /><br /> \
  Internet Explorer seems to render mazes much slower than Firefox. On a 1.8GHz Athlon with 512MB RAM, it takes me 1 minute 20 seconds to make a 100x100 maze with IE, Firefox takes 13 seconds, and Opera takes 8 seconds.<br /><br /> \
  <div style="font-weight:bold">Path length:</div><br /> \
  The higher the number set here, the longer the paths become. This number is a percentage. So, setting it to 50 would mean there would be 50% longer paths.<br /><br /> \
  <div style="font-weight:bold">Braid:</div><br /> \
  The higher the number set here will increase the probability of the script removing a dead-end creating a loop. This option doesn\'t work very well with the Prim version. Also, the solve option works, but doesn\'t necessarily pick the shortest path.<br /><br /> \
  <div style="font-weight:bold">Direction bias:</div><br /> \
  The more you go in a given direction, the more the script will have a bias in that direction. For example, if you pick \'-4\', the maze will be more vertical, or if you pick \'4\', the maze will be more horizontal.<br /><br /> \
  <div style="font-weight:bold">Versions:</div><br /> \
  Grow: More longer dead-ends than DFS, a little harder maze.<br /><br /> \
  DFS: More direct, but longer, solution, short dead-ends with a few very long ones, easier to solve than Grow.<br /><br /> \
  Prim: Very low windy solution, a lot of very short dead-ends. Easy to solve.<br /><br /> \
  Binary: Lowest windy solution, a lot of long and short dead-ends. The easiest to solve than the others. This version doesn\'t support shapes other than squares, nor does it support direction bias, or path length.<br /><br /> \
  Eller: High windy solution, with long dead-ends. This version is print-only, only supports width and height, opens up in a new window, and is capable of creating some of the longest mazes in the world.<br /><br /> \
  <div style="font-weight:bold">How to create a custom shape:</div><ol> \
  <li>On the config panel, click on the Make custom button, and a new window will popup (so make sure you set your popup blocker to allow for this), which is called the Shape toolkit.</li> \
  <li>At the top of the toolkit, set the Width, Height, and Path width to your liking and click on the Make new button.</li> \
  <li>There are 2 ways to start marking out your shape:</li><ol> \
  <li>Using the J I L K keys (unless you change them), move the green marker to where you want to start drawing your shape, then click on the Start marking button at the top of the window.</li> \
  <li>Using your mouse and left-click on a square to mark it.</li></ol> \
  <li>If you wish to erase a cell, left-click on it with your mouse.</li> \
  <li>After marking out your shape, you have the option of selecting a start and an end to your shape. Just click on the Select start & end button, and left-click on a spot in your shape where you want the start, then left-click on a spot you want the end. If you don\'t select a start and end, the script will automatically choose the first top-left spot and the last bottom-right spot for the start and end.</li> \
  <li>When you are done, copy the code in the textbox, and close the toolkit window.</li> \
  <li>Back to the config panel, select Custom in the Shape dropdown and click on New maze at the bottom.</li> \
  <li>A prompt will appear where you will paste the code you copied in step 6, and click Ok.</li> \
  </ol><div style="font-weight:bold">Changing end:</div><br /> \
  Changing end is where the end will keep changing depending on how many seconds you put in the text box to the right of the check box. Changing end and Random start/end are disabled for custom shapes for now.<br /><br /> \
  <div style="font-weight:bold">About:</div><br /> \
  Mazesmith is written by Robert<br /> \
  Email: brathna at gmail dot com<br /> \
  Address: <a href="http://mazesmith.sourceforge.net/" target="_blank">http://mazesmith.sourceforge.net/</a><br /> \
';
  doc.write(echo);
  doc.write('</body></html>');
  doc.close();
}

function makeCustom() {
  var mC = null;
  w = (screen.width) ? screen.width : 800;
  h = (screen.height) ? screen.height : 600;
  LeftPosition=(screen.width)?(screen.width-w)/2:100;TopPosition=(screen.height)?(screen.height-h)/2:100;
  settings='width='+w+',height='+h+',top='+TopPosition+',left='+LeftPosition+',scrollbars=yes,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=yes';
  mC=window.open('','makeCustomWin',settings);

  doc = mC.document;
  doc.open('text/html');
  doc.write('<html><head><title>Mazesmith custom shape toolkit</title>');

var echo = ' \
  <script type="text/javascript"> \
\
  var cell = 1; \
  var startMarking = 0; \
  var cols = parseInt(window.opener.document.getElementById(\'cols\').value); \
  var rows = parseInt(window.opener.document.getElementById(\'rows\').value); \
  var path = window.opener.document.getElementById(\'path\').value; \
  var prev = \'white\'; \
  var code = \'\'; \
  var codeArray = new Array(); \
  var createThis = 0; \
  var startBegEnd = 0; \
  var beg = 0; \
  var end = 0; \
  var custom = new Array(); \
\
  function createMainTable() { \
    if(startMarking==1) document.getElementById(\'startMarking\').onclick(); \
    prev = \'white\'; \
    cols = parseInt(document.getElementById(\'cols\').value); \
    rows = parseInt(document.getElementById(\'rows\').value); \
    path = document.getElementById(\'path\').value; \
    cell = 1; \
    code = \'\'; \
    codeArray = new Array(); \
\
    if(document.getElementById(\'loadShape\').checked==true) { \
      var temp = prompt(\'Enter your custom shape below\'); \
      custom = temp.split(\',\'); \
      rows = custom[1]; \
      cols = custom[2]; \
      beg = custom[3]; \
      end = custom[4]; \
    } \
\
    var l = (rows*cols); \
    for(var i=0;i<l;i++) { codeArray[i]=\'0\'; } \
\
    if(createThis) document.body.removeChild(createThis); \
    createThis = document.createElement("DIV"); \
    createThis.id = "mainTable"; \
\
    var echoThis = \'<div id="main" style="text-align:center;position:absolute;left:0px;top:150px;width:100%;"><table cellpadding="0" cellspacing="0" style="height:99%;margin-left:auto;margin-right:auto;"><tr><td><table cellpadding="0" cellspacing="0" style="border:0px;">\'; \
\
    for(var a=1,c=1;a<=rows;a++) { \
      echoThis += \'<tr>\'; \
      for(var b=1;b<=cols;b++,c++) { \
        if(c==1) var t = \'green\'; else var t = \'white\'; \
        echoThis += \'<td onmouseover="mouseDisplay(\'+c+\');" onmousedown="if(startBegEnd==1) begEnd(\'+c+\'); else mark(\'+c+\');" style="background:\'+t+\';border:1px solid black;width:\'+path+\'px;line-height:\'+path+\'px;" id="_\'+c+\'">&nbsp;</td>\'; \
      } \
      echoThis += \'</tr>\'; \
    } \
    echoThis += \'</table></td></tr></table></div>\'; \
\
    createThis.innerHTML = echoThis; \
    document.body.appendChild(createThis); \
\
    if(custom!=\'\') { \
      var l = custom[0].length; \
      for(var a=0;a<l;a++) { \
        if(custom[0].charAt(a)==\'1\') { \
          document.getElementById(\'_\'+(a+1)).style.backgroundColor = \'red\'; codeArray[a] = 1; \
        } \
      } \
      if(custom[3]!=0) document.getElementById(\'_\'+custom[3]).style.backgroundColor = \'#0000FF\'; \
      if(custom[4]!=0) document.getElementById(\'_\'+custom[4]).style.backgroundColor = \'#9999FF\'; \
      display(); \
    } \
    custom = new Array(); \
\
    display(); \
  } \
\
  function display() { \
    code = codeArray.join(\'\'); \
    document.getElementById(\'code\').value = code +\',\'+ rows +\',\'+ cols + \',\' + beg + \',\' + end; \
  } \
\
  function eventHandle() { document.onkeypress=move; } \
\
  function move(e) { \
    var code; \
    var currentCell = cell; \
    if (!e) var e = window.event; \
    if (e.keyCode) code = e.keyCode; \
    else if (e.which) code = e.which; \
\
    if(code==13) { \
      code = \'a\'; \
      document.getElementById(\'rows\').blur(); \
      document.getElementById(\'cols\').blur(); \
      document.getElementById(\'path\').blur(); \
      document.getElementById(\'makeNew\').onclick(); \
    } \
    else if(code==window.opener.kCode[0]) { \
      document.getElementById(\'_\'+currentCell).style.backgroundColor = prev; \
      x = Math.ceil(currentCell/cols); \
      y = (cols - ((x*cols)-currentCell)); \
      y--; \
      currentCell = (((x-1)*cols)+y); \
      if(startMarking==1) { codeArray[currentCell-1]=1; document.getElementById(\'_\'+currentCell).style.backgroundColor = \'red\'; } \
      prev = document.getElementById(\'_\'+currentCell).style.backgroundColor; \
      document.getElementById(\'_\'+currentCell).style.backgroundColor = \'green\'; \
      window.status = "X: "+x+" Y: "+y; \
    } else if(code==window.opener.kCode[2]) { \
      document.getElementById(\'_\'+currentCell).style.backgroundColor = prev; \
      x = Math.ceil(currentCell/cols); \
      y = (cols - ((x*cols)-currentCell)); \
      x--; \
      if(x==0) { x = rows; y--; } \
      currentCell = (((x-1)*cols)+y); \
      if(startMarking==1) { codeArray[currentCell-1]=1; document.getElementById(\'_\'+currentCell).style.backgroundColor = \'red\'; } \
      prev = document.getElementById(\'_\'+currentCell).style.backgroundColor; \
      document.getElementById(\'_\'+currentCell).style.backgroundColor = \'green\'; \
      window.status = "X: "+x+" Y: "+y; \
    } else if(code==window.opener.kCode[1]) { \
      document.getElementById(\'_\'+currentCell).style.backgroundColor = prev; \
      x = Math.ceil(currentCell/cols); \
      y = (cols - ((x*cols)-currentCell)); \
      y++; \
      currentCell = (((x-1)*cols)+y); \
      if(startMarking==1) { codeArray[currentCell-1]=1; document.getElementById(\'_\'+currentCell).style.backgroundColor = \'red\'; } \
      prev = document.getElementById(\'_\'+currentCell).style.backgroundColor; \
      document.getElementById(\'_\'+currentCell).style.backgroundColor = \'green\'; \
      window.status = "X: "+x+" Y: "+y; \
    } else if(code==window.opener.kCode[3]) { \
      document.getElementById(\'_\'+currentCell).style.backgroundColor = prev; \
      x = Math.ceil(currentCell/cols); \
      y = (cols - ((x*cols)-currentCell)); \
      x++; \
      if(x>rows) { x = 1; y++; } \
      currentCell = (((x-1)*cols)+y); \
      if(startMarking==1) { codeArray[currentCell-1]=1; document.getElementById(\'_\'+currentCell).style.backgroundColor = \'red\'; } \
      prev = document.getElementById(\'_\'+currentCell).style.backgroundColor; \
      document.getElementById(\'_\'+currentCell).style.backgroundColor = \'green\'; \
      window.status = "X: "+x+" Y: "+y; \
    } \
    if(code!=\'a\') { \
      cell = currentCell; \
      display(); \
    } \
  } \
\
  function mouseDisplay(c) { \
    x = Math.ceil(c/cols); \
    y = (cols - ((x*cols)-c)); \
    window.status = "X: "+x+" Y: "+y; \
  } \
\
  function markFirst() { \
    codeArray[cell-1]=1; \
    document.getElementById(\'_\'+cell).style.backgroundColor = \'red\'; \
    prev = document.getElementById(\'_\'+cell).style.backgroundColor; \
    document.getElementById(\'_\'+cell).style.backgroundColor = \'green\'; \
    display(); \
  } \
\
  function mark(c) { \
    if(document.getElementById(\'_\'+c).style.backgroundColor == \'red\') erase(c); \
    else { document.getElementById(\'_\'+c).style.backgroundColor = \'red\'; codeArray[c-1] = 1; display(); } \
  } \
\
  function erase(c) { \
    document.getElementById(\'_\'+c).style.backgroundColor = \'white\'; \
    codeArray[c-1] = 0; \
    display(); \
  } \
\
  function begEnd(c) { \
    if(beg==0) { beg = c; document.getElementById(\'_\'+c).style.backgroundColor = \'#0000FF\'; } \
    else { end = c; startBegEnd = 0; document.getElementById(\'_\'+c).style.backgroundColor = \'#9999FF\'; } \
  } \
\
  function shiftUp() { \
    var t = document.getElementById(\'code\').value.split(\',\'); \
    var l = t[0].length; \
\
    t[0] = t[0].substr((document.getElementById(\'cols\').value*document.getElementById(\'shift\').value),(l-1)); \
    for(var i=1;i<=(document.getElementById(\'cols\').value*document.getElementById(\'shift\').value);i++) t[0] += \'0\'; \
\
    for(var a=0;a<l;a++) { \
      if(t[0].charAt(a)==\'1\') { \
        document.getElementById(\'_\'+(a+1)).style.backgroundColor = \'red\'; codeArray[a] = \'1\'; \
      } else { \
        document.getElementById(\'_\'+(a+1)).style.backgroundColor = \'white\'; codeArray[a] = \'0\'; \
      } \
    } \
    if(t[3]!=0) document.getElementById(\'_\'+t[3]).style.backgroundColor = \'#0000FF\'; \
    if(t[4]!=0) document.getElementById(\'_\'+t[4]).style.backgroundColor = \'#9999FF\'; \
\
    document.getElementById(\'code\').value = t; \
  } \
\
  function shiftDown() { \
    var t = document.getElementById(\'code\').value.split(\',\'); \
    var l = t[0].length; \
    var u = \'\'; \
\
    t[0] = t[0].substr(0,(l-(document.getElementById(\'cols\').value*document.getElementById(\'shift\').value))); \
    for(var i=1;i<=(document.getElementById(\'cols\').value*document.getElementById(\'shift\').value);i++) u += \'0\'; \
    t[0] = u + t[0]; \
\
    for(var a=0;a<l;a++) { \
      if(t[0].charAt(a)==\'1\') { \
        document.getElementById(\'_\'+(a+1)).style.backgroundColor = \'red\'; codeArray[a] = \'1\'; \
      } else { \
        document.getElementById(\'_\'+(a+1)).style.backgroundColor = \'white\'; codeArray[a] = \'0\'; \
      } \
    } \
    if(t[3]!=0) document.getElementById(\'_\'+t[3]).style.backgroundColor = \'#0000FF\'; \
    if(t[4]!=0) document.getElementById(\'_\'+t[4]).style.backgroundColor = \'#9999FF\'; \
\
    document.getElementById(\'code\').value = t; \
  } \
\
  function shiftLeft() { \
    var t = document.getElementById(\'code\').value.split(\',\'); \
    var l = t[0].length; \
    var u = \'\'; \
\
    for(var i=0;i<document.getElementById(\'rows\').value;i++) { \
      u += t[0].substr(((document.getElementById(\'rows\').value*i)+parseInt(document.getElementById(\'shift\').value)),(document.getElementById(\'cols\').value-document.getElementById(\'shift\').value)); \
      for(var h=1;h<=document.getElementById(\'shift\').value;h++) u += \'0\'; \
    } \
    t[0] = u; \
\
    for(var a=0;a<l;a++) { \
      if(t[0].charAt(a)==\'1\') { \
        document.getElementById(\'_\'+(a+1)).style.backgroundColor = \'red\'; codeArray[a] = \'1\'; \
      } else { \
        document.getElementById(\'_\'+(a+1)).style.backgroundColor = \'white\'; codeArray[a] = \'0\'; \
      } \
    } \
    if(t[3]!=0) document.getElementById(\'_\'+t[3]).style.backgroundColor = \'#0000FF\'; \
    if(t[4]!=0) document.getElementById(\'_\'+t[4]).style.backgroundColor = \'#9999FF\'; \
\
    document.getElementById(\'code\').value = t; \
  } \
\
  function shiftRight() { \
    var t = document.getElementById(\'code\').value.split(\',\'); \
    var l = t[0].length; \
    var u = \'\'; \
    var v = \'\'; \
\
    for(var i=0;i<document.getElementById(\'rows\').value;i++) { \
      for(var h=1;h<=document.getElementById(\'shift\').value;h++) v += \'0\'; \
      u += v + t[0].substr((document.getElementById(\'rows\').value*i),(document.getElementById(\'cols\').value-document.getElementById(\'shift\').value)); \
      v = \'\'; \
    } \
    t[0] = u; \
\
    for(var a=0;a<l;a++) { \
      if(t[0].charAt(a)==\'1\') { \
        document.getElementById(\'_\'+(a+1)).style.backgroundColor = \'red\'; codeArray[a] = \'1\'; \
      } else { \
        document.getElementById(\'_\'+(a+1)).style.backgroundColor = \'white\'; codeArray[a] = \'0\'; \
      } \
    } \
    if(t[3]!=0) document.getElementById(\'_\'+t[3]).style.backgroundColor = \'#0000FF\'; \
    if(t[4]!=0) document.getElementById(\'_\'+t[4]).style.backgroundColor = \'#9999FF\'; \
\
    document.getElementById(\'code\').value = t; \
  } \
\
  </script> \
';

  doc.write(echo);
  doc.write('</head>\n<body onload="eventHandle();createMainTable();">');

var echo = ' \
  <div id="controls" style="text-align:center;width:100%;position:absolute;left:0px;top:0px;"> \
    Width: <input id="cols" size="2" value="20" /> Height: <input id="rows" size="2" value="20" /> Path width: <input id="path" size="2" value="20" /> Load: <input type="checkbox" id="loadShape" /> <input type="button" id="makeNew" onclick="createMainTable();" value="Make" /> <input type="button" id="startMarking" value="Start marking" onclick="startMarking=!startMarking; if(startMarking==1) { markFirst(); document.getElementById(\'startMarking\').value = \'Stop marking\'; } else { document.getElementById(\'startMarking\').value = \'Start marking\'; }" /> <input type="button" id="begEnd" onclick="beg=end=0;startBegEnd=1;" value="Select Start & End" /> \
    <br /><div style="text-align:center;">Shift<br /><input type="button" value="Up" onclick="shiftUp();" /><br /><input type="button" value="Left" onclick="shiftLeft();" /> <input type="text" id="shift" size="2" value="1"> <input type="button" value="Right" onclick="shiftRight();" /><br /><input type="button" value="Down" onclick="shiftDown();" /> \
    <br />Copy this code when you\'re done: <input type="text" id="code" size="20" /> \
  </div> \
  <script type="text/javascript"> \
    document.getElementById(\'cols\').value = cols; \
    document.getElementById(\'rows\').value = rows; \
    document.getElementById(\'path\').value = path; \
  </script> \
';

  doc.write(echo);
  doc.write('</body></html>');
  doc.close();
}

function saveSettings(x) {
  var today = new Date();
  var expires = (x==1) ? new Date(today.getTime()-1) : new Date(today.getTime() + (365 * 86400000));
  var save = saveData();
  document.cookie = "savedSettings" + "=" + save + ";expires="+expires.toGMTString();
}

function saveData() {
  var save = document.getElementById('rows').value+'&'+document.getElementById('cols').value+'&'+document.getElementById('path').value+'&'+document.getElementById('border').value+'&'+document.getElementById('version').options[document.getElementById('version').selectedIndex].value+'&'+document.getElementById('print').checked+'&'+document.getElementById('randomStart').checked+'&'+escape(document.getElementById('background').value)+'&'+escape(document.getElementById('borderColor').value)+'&'+escape(document.getElementById('pathColor').value)+'&'+escape(document.getElementById('markerColor').value)+'&'+escape(document.getElementById('trailColor').value)+'&'+escape(document.getElementById('backtrackColor').value)+'&'+document.getElementById('randomEnd').checked+'&'+document.getElementById('randomEndSeconds').value+'&'+document.getElementById('shape').options[document.getElementById('shape').selectedIndex].value+'&'+document.getElementById('length').value+'&'+document.getElementById('hideEnd').checked+'&'+document.getElementById('braid').value+'&'+document.getElementById('bias').selectedIndex+'&'+
document.getElementById('leftKey').value+','+document.getElementById('rightKey').value+','+document.getElementById('upKey').value+','+document.getElementById('downKey').value+','+document.getElementById('pauseKey').value+','+document.getElementById('solveKey').value+','+document.getElementById('hintKey').value+','+document.getElementById('saveKey').value+','+document.getElementById('headerKey').value+','+document.getElementById('reloadKey').value+'&'+document.getElementById('markerImage').checked+'&'+document.getElementById('theme').selectedIndex+'&'+conType;
  return save;
}

function finishMaze() {
  if(print=='true') document.getElementById('_'+cell).style.borderLeft = '0px';
  if(print!='true') {
    if(document.getElementById('markerImage').checked!=true) document.getElementById('_'+cell).style.backgroundColor = markerColor;
    else document.getElementById('_'+cell).style.background = pathColor +' url('+startIcon+') center center no-repeat';
  }

  pathColor = document.getElementById('_'+finish).style.backgroundColor;

  if(randomEnd=='true' && shape=='1' && print!='true') { _randomEnd(0,0); }
  else {
    if(print=='true') document.getElementById('_'+finish).style.borderRight = '0px';
    if(print!='true' && hideEnd!='true') {
      if(document.getElementById('markerImage').checked!=true) document.getElementById('_'+finish).style.backgroundColor = markerColor;
      else document.getElementById('_'+finish).style.background = pathColor +' url('+endIcon+') center center no-repeat';
    }
  }

  document.getElementById('main').style.display = 'block';

  if(print=='true') document.getElementById('controls').style.display = 'none';
}

function _randomEnd(prev,prevColor) {
  if(!won && randomEnd=='true' && shape=='1') {
    if(!paused) {
      do {
        a = Math.ceil(Math.random()*rows);
        a = (a*cols);
        if(prev==a) a=1;
        if(a==cell) a=1;
      } while(a==1);

      if(prev) {
        aColor = document.getElementById('_'+a).style.backgroundColor;
        document.getElementById('_'+prev).style.borderRight = '1px solid '+borderColor;
        if(document.getElementById('markerImage').checked!=true) document.getElementById('_'+prev).style.backgroundColor = prevColor;
        else document.getElementById('_'+finish).style.background = prevColor;
      } else { aColor = pathColor; }

      finish = a;

      if(print=='true') document.getElementById('_'+a).style.borderRight = '0px';
      if(hideEnd!='true') {
        if(document.getElementById('markerImage').checked!=true) document.getElementById('_'+a).style.backgroundColor = markerColor;
        else document.getElementById('_'+finish).style.background = aColor +' url('+endIcon+') center center no-repeat';
      }
    }
    timeout2 = setTimeout("_randomEnd(a,aColor)",randomEndSeconds*1000);
  }
}

function submitFunc() {
  if(focusObj) document.getElementById(focusObj).blur();
  document.getElementById('paused').style.display = 'none';
  window.clearTimeout(timeout);
  window.clearTimeout(timeout2);
  paused=0;
  if(document.getElementById('version').options[document.getElementById('version').selectedIndex].value==5) { createEllerMaze(); configPanel=1; }
  else { document.getElementById(conType).style.display = 'none'; createMainTable(0); configPanel=0; }
}

function loadFunc() {
  if(focusObj) document.getElementById(focusObj).blur();
  document.getElementById(conType).style.display = 'none';
  document.getElementById('paused').style.display = 'none';
  document.getElementById('loadMazeDiv').style.display = 'none';
  window.clearTimeout(timeout);
  window.clearTimeout(timeout2);
  configPanel=0;
  paused=0;
  createMainTable(1);

  for(var a=_trail.length;a>0;a--) {
    if(_trail[a]=='1') document.getElementById('_'+a).style.backgroundColor = trailColor;
  }
  for(var a=_backt.length;a>0;a--) {
    if(_backt[a]=='1') document.getElementById('_'+a).style.backgroundColor = backtrackColor;
  }
}

function setKeys() {
  document.getElementById('leftKey').value = keys[0];
  document.getElementById('rightKey').value = keys[1];
  document.getElementById('upKey').value = keys[2];
  document.getElementById('downKey').value = keys[3];
  document.getElementById('pauseKey').value = keys[4];
  document.getElementById('solveKey').value = keys[5];
  document.getElementById('hintKey').value = keys[6];
  document.getElementById('saveKey').value = keys[7];
  document.getElementById('headerKey').value = keys[8];
  document.getElementById('reloadKey').value = keys[9];
}

function setKCode() {
  kCode[0] = keys[0].charCodeAt(0);//leftKey
  kCode[1] = keys[1].charCodeAt(0);//rightKey
  kCode[2] = keys[2].charCodeAt(0);//upKey
  kCode[3] = keys[3].charCodeAt(0);//downKey
  kCode[4] = keys[4].charCodeAt(0);
  kCode[5] = keys[5].charCodeAt(0);
  kCode[6] = keys[6].charCodeAt(0);
  kCode[7] = keys[7].charCodeAt(0);
  kCode[8] = keys[8].charCodeAt(0);
  kCode[9] = keys[9].charCodeAt(0);
}

function customKeysFunc() {
  keys[0] = document.getElementById('leftKey').value;
  keys[1] = document.getElementById('rightKey').value;
  keys[2] = document.getElementById('upKey').value;
  keys[3] = document.getElementById('downKey').value;
  keys[4] = document.getElementById('pauseKey').value;
  keys[5] = document.getElementById('solveKey').value;
  keys[6] = document.getElementById('hintKey').value;
  keys[7] = document.getElementById('saveKey').value;
  keys[8] = document.getElementById('headerKey').value;
  keys[9] = document.getElementById('reloadKey').value;
  setKCode();
}

function configPanelFunc() {
  document.getElementById('loadMazeDiv').style.display='none';
  document.getElementById('customKeysDiv').style.display='none';
  document.getElementById(conType).style.display='block';
  configPanel=1;
  paused = 1;
  document.getElementById('main').style.display = 'none';
}

function configPanelClose() {
  document.getElementById(conType).style.display='none';
  configPanel=0;
  paused = 0;
  document.getElementById('main').style.display = 'block';
}

function cTheme() {
  if(document.getElementById('theme').options[document.getElementById('theme').selectedIndex].value!='none') {
    startIcon = theme['startIcon'+document.getElementById('theme').selectedIndex];
    endIcon = theme['endIcon'+document.getElementById('theme').selectedIndex];
    document.getElementById('background').value = theme['background'+document.getElementById('theme').selectedIndex];
    document.getElementById('borderColor').value = theme['borderColor'+document.getElementById('theme').selectedIndex];
    document.getElementById('pathColor').value = theme['pathColor'+document.getElementById('theme').selectedIndex];
    document.getElementById('markerColor').value = theme['markerColor'+document.getElementById('theme').selectedIndex];
    document.getElementById('trailColor').value = theme['trailColor'+document.getElementById('theme').selectedIndex];
    document.getElementById('backtrackColor').value = theme['backtrackColor'+document.getElementById('theme').selectedIndex];
  } else {
    startIcon = 'human.gif';
    endIcon = 'home.gif';
  }
  document.getElementById('backgroundSpan').style.backgroundColor = document.getElementById('background').value;
  document.getElementById('borderColorSpan').style.backgroundColor = document.getElementById('borderColor').value;
  document.getElementById('pathColorSpan').style.backgroundColor = document.getElementById('pathColor').value;
  document.getElementById('markerColorSpan').style.backgroundColor = document.getElementById('markerColor').value;
  document.getElementById('trailColorSpan').style.backgroundColor = document.getElementById('trailColor').value;
  document.getElementById('backtrackColorSpan').style.backgroundColor = document.getElementById('backtrackColor').value;
}

function cVersion() {
  document.getElementById('length').disabled = false;
  document.getElementById('bias').disabled = false;
  document.getElementById('shape').disabled = false;
  document.getElementById('border').disabled = false;
  document.getElementById('braid').disabled = false;
  document.getElementById('shape').disabled = false;
  document.getElementById('randomStart').disabled = false;
  document.getElementById('randomEnd').disabled = false;
  document.getElementById('randomEndSeconds').disabled = false;
  document.getElementById('hideEnd').disabled = false;
  document.getElementById('print').disabled = false;
  document.getElementById('background').disabled = false;
  document.getElementById('borderColor').disabled = false;
  document.getElementById('pathColor').disabled = false;
  document.getElementById('markerColor').disabled = false;
  document.getElementById('trailColor').disabled = false;
  document.getElementById('backtrackColor').disabled = false;
  document.getElementById('theme').disabled = false;
  document.getElementById('markerImage').disabled = false;

  if(document.getElementById('version').options[document.getElementById('version').selectedIndex].value==4) {
    document.getElementById('length').disabled = true;
    document.getElementById('bias').disabled = true;
    document.getElementById('shape').disabled = true;
  } else if(document.getElementById('version').options[document.getElementById('version').selectedIndex].value==5) {
    document.getElementById('length').disabled = true;
    document.getElementById('bias').disabled = true;
    document.getElementById('shape').disabled = true;
    document.getElementById('border').disabled = true;
    document.getElementById('braid').disabled = true;
    document.getElementById('shape').disabled = true;
    document.getElementById('randomStart').disabled = true;
    document.getElementById('randomEnd').disabled = true;
    document.getElementById('randomEndSeconds').disabled = true;
    document.getElementById('hideEnd').disabled = true;
    document.getElementById('print').disabled = true;
    document.getElementById('background').disabled = true;
    document.getElementById('borderColor').disabled = true;
    document.getElementById('pathColor').disabled = true;
    document.getElementById('markerColor').disabled = true;
    document.getElementById('trailColor').disabled = true;
    document.getElementById('backtrackColor').disabled = true;
    document.getElementById('theme').disabled = true;
    document.getElementById('markerImage').disabled = true;
  }
}

window.onload = function() {

  mazesmithMain = document.createElement("DIV");
  mazesmithMain.id = "mainSmithMain";
  mazesmithMain.innerHTML = echo + echoBasic;
  document.getElementById('mazesmith').appendChild(mazesmithMain);

  eventHandle();
  setKeys();
  setKCode();

  if(t!='') {
    document.getElementById('rows').value = rows;
    document.getElementById('cols').value = cols;
    document.getElementById('path').value = path;
    document.getElementById('length').value = length;
    document.getElementById('border').value = border;
    document.getElementById('braid').value = braid;
    document.getElementById('bias').options[(bias)].selected = true;
    document.getElementById('version').options[(version-1)].selected = true;
    document.getElementById('background').value = background;
    document.getElementById('borderColor').value = borderColor;
    document.getElementById('pathColor').value = pathColor;
    document.getElementById('markerColor').value = markerColor;
    document.getElementById('trailColor').value = trailColor;
    document.getElementById('backtrackColor').value = backtrackColor;
    if(randomStart=='true') document.getElementById('randomStart').checked = true;
    if(randomEnd=='true') document.getElementById('randomEnd').checked = true;
    document.getElementById('randomEndSeconds').value = randomEndSeconds;
    document.getElementById('shape').options[(shapeNo-1)].selected = true;
    if(hideEnd=='true') document.getElementById('hideEnd').checked = true;
    if(markerImage=='true') document.getElementById('markerImage').checked = true;

    document.bgColor = background;
    document.getElementById('title').style.color = borderColor;
    document.getElementById('title2').style.color = borderColor;

    cVersion();
  }

  document.getElementById('backgroundSpan').style.backgroundColor = document.getElementById('background').value;
  document.getElementById('borderColorSpan').style.backgroundColor = document.getElementById('borderColor').value;
  document.getElementById('pathColorSpan').style.backgroundColor = document.getElementById('pathColor').value;
  document.getElementById('markerColorSpan').style.backgroundColor = document.getElementById('markerColor').value;
  document.getElementById('trailColorSpan').style.backgroundColor = document.getElementById('trailColor').value;
  document.getElementById('backtrackColorSpan').style.backgroundColor = document.getElementById('backtrackColor').value;

  for(var a=0;a<=themes.length-1;a++) {
    var optionName = new Option(themes[a], a, true, true);
    document.getElementById('theme').options[document.getElementById('theme').length] = optionName;
  }
  var optionName = new Option('None', 'none', true, true);
  document.getElementById('theme').options[document.getElementById('theme').length] = optionName;

  if(t.length>22) { document.getElementById('theme').options[t[22]].selected = true; startIcon = theme['startIcon'+t[22]]; endIcon = theme['endIcon'+t[22]]; }

  if(configPanel==1) document.getElementById(conType).style.display = 'block';
  else createMainTable();
}

var echo = ' \
<div id="controls" style="text-align:center;width:100%;"> \
  <span id="title">'+mainTitle+'</span>'+((mainTitle!='') ? '<br />' : '')+' \
  <span id="title2" onclick="configPanelFunc();">'+configPanelTitle+'</span> \
</div> \
\
<div id="paused" style="display:none;text-align:center;"><br />Paused</div> \
\
<div style="text-align:center;width:100%;"><br /> \
  <div style="margin-left:auto;margin-right:auto;display:none;background:'+configBackground+';border:2px solid black;padding:10px;height:500px;width:600px;" id="con"> \
    <table cellpadding="0" cellspacing="0" style="border:0px solid black;width:100%;height:100%;"><tr><td style="border-right:2px dashed black;"> \
      <table cellpadding="0" cellspacing="5" style="border:0px solid black;width:280px;height:100%;"> \
        <tr><td><span class="help" onclick="alert(\'The different types of versions offer different maze styles.\\n\\nGrow is a typical maze, and Eller gives you the option to create a huge maze.\')">(?)</span> Version</td><td style="text-align:right;"><select id="version" onfocus="focusObj = this.id;" onchange="cVersion();"><option value="1">Grow</option><option value="2">DFS</option><option value="3">Prim</option><option value="4">Binary</option><option value="5">Eller</option></select></td></tr> \
        <tr><td><span class="help" onclick="alert(\'The width of the maze.\')">(?)</span> Width</td><td style="text-align:right;"><input type="text" id="cols" size="2" value="20" onfocus="focusObj = this.id;" /></td></tr> \
        <tr><td><span class="help" onclick="alert(\'The height of the maze.\')">(?)</span> Height</td><td style="text-align:right;"><input type="text" id="rows" size="2" value="20" onfocus="focusObj = this.id;" /></td></tr> \
        <tr><td><span class="help" onclick="alert(\'The width of the path of the maze.\')">(?)</span> Path width</td><td style="text-align:right;"><input type="text" id="path" size="2" value="20" onfocus="focusObj = this.id;" /></td></tr> \
        <tr><td><span class="help" onclick="alert(\'The higher the number the longer the paths become in a certain direction.\\n\\nSo setting this to 50% would mean 50% longer paths.\')">(?)</span> Path length</td><td style="text-align:right;"><input type="text" id="length" size="2" value="0" onfocus="focusObj = this.id;" /></td></tr> \
        <tr><td><span class="help" onclick="alert(\'The width of the borders.\')">(?)</span> Border width</td><td style="text-align:right;"><input type="text" id="border" size="2" value="1" onfocus="focusObj = this.id;" /></td></tr> \
        <tr><td><span class="help" onclick="alert(\'The higher the number the higher the chance for the script to remove a dead-end.\')">(?)</span> Braid</td><td style="text-align:right;"><input type="text" id="braid" size="2" value="0" onfocus="focusObj = this.id;" /></td></tr> \
\
        <tr><td><span class="help" onclick="alert(\'The higher the number the more the maze will go in the given direction.\')">(?)</span> Direction bias</td><td style="text-align:right;"><select id="bias" onfocus="focusObj = this.id;"><option value="-4">-4 (vertical)</option><option value="-3">-3</option><option value="-2">-2</option><option value="-1">-1</option><option value="0" selected="selected">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4 (horizontal)</option></select></td></tr> \
        <tr><td><span class="help" onclick="alert(\'Predifined shapes\')">(?)</span> Shape</td><td style="text-align:right;"><select style="font-size:12px;" id="shape" onfocus="focusObj = this.id;"><option value="1">Square</option><option value="2">27x27 Circle</option><option value="3">20x20 Diamond</option><option value="4">20x20 X</option><option value="5">19x29 Train</option><option value="6">25x25 Clover</option><option value="7">27x27 Smile</option><option value="8">28x30 V</option><option value="9">30x30 Triangle</option><option value="10">49x49 Jigsaw</option><option value="11">50x50 Circle</option><option value="12">50x50 Triangle</option><option value="custom">Custom</option></select> \
          <br /><div onclick="makeCustom();" class="small-button" style="font-size:12px;text-align:center;">Make custom</div></td></tr> \
\
        <tr><td><span class="help" onclick="alert(\'Randomly choose a start and end.\')">(?)</span> Random start/end</td><td style="text-align:right;"><input type="checkbox" id="randomStart" onfocus="focusObj = this.id;" /></td></tr> \
        <tr><td><span class="help" onclick="alert(\'The script will continuely change the end while you\'re playing it.\')">(?)</span> Changing end</td><td style="text-align:right;"><input type="checkbox" id="randomEnd" onfocus="focusObj = this.id;" /> <input type="text" value="10" id="randomEndSeconds" size="2" onfocus="focusObj = this.id;" /></td></tr> \
        <tr><td><span class="help" onclick="alert(\'The end will not be shown.\')">(?)</span> Hide end</td><td style="text-align:right;"><input type="checkbox" id="hideEnd" onfocus="focusObj = this.id;" /></td></tr> \
        <tr><td><span class="help" onclick="alert(\'This will remove the markers, instead showing a typical start and end, and remove the options panel.\')">(?)</span> Print</td><td style="text-align:right;"><input type="checkbox" id="print" onfocus="focusObj = this.id;" /></td></tr> \
      </table> \
    </td><td> \
      <table cellpadding="0" cellspacing="5" style="border:0px solid black;width:280px;height:100%;padding-left:10px;"> \
        <tr><td><span class="help" onclick="alert(\'Predefined themes for all of the below colors.\')">(?)</span> Theme</td><td style="text-align:right;"><select id="theme" onfocus="focusObj = this.id;" onchange="cTheme();"></select></td></tr> \
        <tr><td><span class="help" onclick="alert(\'Instead of using color markers, this option will use images.\')">(?)</span> Use images for markers</td><td style="text-align:right;"><input type="checkbox" id="markerImage" onfocus="focusObj = this.id;" /> \
        <tr><td colspan="2" style="text-align:center">Colors:</td></tr> \
        <tr><td class="extra" onclick="colorTable(\'background\');" title="Click here to show the color table for Background">Background</td><td style="text-align:right;"><span id="backgroundSpan">&nbsp;</span> <input type="text" id="background" size="8" value="white" onfocus="focusObj = this.id;" onblur="document.getElementById(\'backgroundSpan\').style.backgroundColor = this.value;" /></td></tr> \
        <tr><td class="extra" onclick="colorTable(\'borderColor\');" title="Click here to show the color table for Border">Border</td><td style="text-align:right;"><span id="borderColorSpan">&nbsp;</span> <input type="text" id="borderColor" size="8" value="black" onfocus="focusObj = this.id;" onblur="document.getElementById(\'borderColorSpan\').style.backgroundColor = this.value;" /></td></tr> \
        <tr><td class="extra" onclick="colorTable(\'pathColor\');" title="Click here to show the color table for Path">Path</td><td style="text-align:right;"><span id="pathColorSpan">&nbsp;</span> <input type="text" id="pathColor" size="8" value="white" onfocus="focusObj = this.id;" onblur="document.getElementById(\'pathColorSpan\').style.backgroundColor = this.value;" /></td></tr> \
        <tr><td class="extra" onclick="colorTable(\'markerColor\');" title="Click here to show the color table for Marker">Marker</td><td style="text-align:right;"><span id="markerColorSpan">&nbsp;</span> <input type="text" id="markerColor" size="8" value="green" onfocus="focusObj = this.id;" onblur="document.getElementById(\'markerColorSpan\').style.backgroundColor = this.value;" /></td></tr> \
        <tr><td class="extra" onclick="colorTable(\'trailColor\');" title="Click here to show the color table for Trail">Trail</td><td style="text-align:right;"><span id="trailColorSpan">&nbsp;</span> <input type="text" id="trailColor" size="8" value="#CCFFCC" onfocus="focusObj = this.id;" onblur="document.getElementById(\'trailColorSpan\').style.backgroundColor = this.value;" /></td></tr> \
        <tr><td class="extra" onclick="colorTable(\'backtrackColor\');" title="Click here to show the color table for Backtrack">Backtrack</td><td style="text-align:right;"><span id="backtrackColorSpan">&nbsp;</span> <input type="text" id="backtrackColor" size="8" value="#FFCCCC" onfocus="focusObj = this.id;" onblur="document.getElementById(\'backtrailColorSpan\').style.backgroundColor = this.value;" /></td></tr> \
\
        <tr><td colspan="2" style="text-align:center"><br /><div class="big-button" onclick="submitFunc();" id="submit">New maze</div></td></tr> \
        <tr><td colspan="2" style="text-align:center"><div class="big-button" onclick="document.getElementById(\'loadMazeDiv\').style.display=\'block\';document.getElementById(conType).style.display = \'none\';">Load maze</div></td></tr> \
        <tr><td colspan="2" style="text-align:center"><div class="big-button" onclick="conType=\'conBasic\';document.getElementById(\'con\').style.display=\'none\';document.getElementById(\'conBasic\').style.display = \'block\';">Basic</div></td></tr> \
        <tr><td colspan="2" style="text-align:center"><div class="big-button" onclick="document.getElementById(conType).style.display=\'none\';document.getElementById(\'customKeysDiv\').style.display=\'block\';">Change keys</div></div></td></tr> \
        <tr><td colspan="2" style="text-align:center"><div class="big-button" onclick="saveSettings(0);alert(\'Settings have been saved\');">Save settings</div></td></tr> \
        <tr><td colspan="2" style="text-align:center"><div class="big-button" onclick="saveSettings(1);alert(\'Saved settings cookie has been removed\');">Remove settings cookie</div></td></tr> \
        <tr><td colspan="2" style="text-align:center"><div class="big-button" onclick="help();">Help</div></td></tr> \
        <tr><td colspan="2" style="text-align:center"><div class="big-button" onclick="configPanelClose();">Close</div></td></tr> \
      </table> \
    </td></tr> \
    <tr><td colspan="2" style="text-align:center"><div style="padding-top:5px;font-size:12px;"><a href="http://mazesmith.sourceforge.net/" target="_blank" style="text-decoration:none;color:black;">Mazesmith 0.7.0 by Robert</a></div></td></tr> \
    </table> \
  </div> \
</div> \
\
<div style="text-align:center;width:100%;"> \
  <div style="margin-left:auto;margin-right:auto;display:none;background:white;border:2px solid black;padding:10px;height:150px;width:500px;" id="saveMazeDiv"> \
    Copy the code below and paste it into a text editor:<br /> \
    <textarea rows="5" cols="50" id="saveMazeArea" onfocus="focusObj = this.id;"></textarea> \
    <br /><div class="small-button" onclick="paused=0;document.getElementById(\'saveMazeDiv\').style.display=\'none\';document.getElementById(\'main\').style.display=\'block\';configPanel=0;">Close</div> \
  </div> \
</div> \
\
<div style="text-align:center;width:100%;"> \
  <div style="margin-left:auto;margin-right:auto;display:none;background:white;border:2px solid black;padding:10px;height:190px;width:500px;" id="loadMazeDiv"> \
    Paste a saved game below, this might take a while depending on the size of the maze:<br /><br /> \
    <textarea rows="5" cols="50" id="loadMazeArea" onfocus="focusObj = this.id;"></textarea> \
    <br /><div class="small-button" onclick="loadFunc();">Load maze</div> \
    <div class="small-button" onclick="document.getElementById(\'loadMazeDiv\').style.display=\'none\';document.getElementById(conType).style.display=\'block\';">Close</div> \
  </div> \
</div> \
\
<div style="text-align:center;width:100%;"> \
  <div style="margin-left:auto;margin-right:auto;display:none;background:white;border:2px solid black;padding:10px;height:400px;width:150px;" id="customKeysDiv"> \
    <table cellpadding="0" cellspacing="0" style="border:0px solid black;width:100%;height:100%;"> \
      <tr><td colspan="2" style="text-align:center;font-size:13px;">Keys are case-sensitive.</td></tr> \
      <tr><td>Left</td><td style="text-align:right"><input type="text" id="leftKey" size="2" onfocus="this.select();focusObj = this.id;" style="text-align:center" /></td></tr> \
      <tr><td>Right</td><td style="text-align:right"><input type="text" id="rightKey" size="2" onfocus="this.select();focusObj = this.id;" style="text-align:center" /></td></tr> \
      <tr><td>Up</td><td style="text-align:right"><input type="text" id="upKey" size="2" onfocus="this.select();focusObj = this.id;" style="text-align:center" /></td></tr> \
      <tr><td>Down</td><td style="text-align:right"><input type="text" id="downKey" size="2" onfocus="this.select();focusObj = this.id;" style="text-align:center" /></td></tr> \
      <tr><td>Pause</td><td style="text-align:right"><input type="text" id="pauseKey" size="2" onfocus="this.select();focusObj = this.id;" style="text-align:center" /></td></tr> \
      <tr><td>Solve</td><td style="text-align:right"><input type="text" id="solveKey" size="2" onfocus="this.select();focusObj = this.id;" style="text-align:center" /></td></tr> \
      <tr><td>Hint</td><td style="text-align:right"><input type="text" id="hintKey" size="2" onfocus="this.select();focusObj = this.id;" style="text-align:center" /></td></tr> \
      <tr><td>Save</td><td style="text-align:right"><input type="text" id="saveKey" size="2" onfocus="this.select();focusObj = this.id;" style="text-align:center" /></td></tr> \
      <tr><td>Header</td><td style="text-align:right"><input type="text" id="headerKey" size="2" onfocus="this.select();focusObj = this.id;" style="text-align:center" /></td></tr> \
      <tr><td>Reload</td><td style="text-align:right"><input type="text" id="reloadKey" size="2" onfocus="this.select();focusObj = this.id;" style="text-align:center" /></td></tr> \
      <tr><td colspan="2" style="text-align:center"> \
        <div class="small-button" onclick="document.getElementById(\'customKeysDiv\').style.display=\'none\';document.getElementById(conType).style.display=\'block\';customKeysFunc();">OK</div> \
        <div class="small-button" onclick="document.getElementById(\'customKeysDiv\').style.display=\'none\';document.getElementById(conType).style.display=\'block\';setKeys();">Cancel</div> \
      </td></tr> \
    </table> \
  </div> \
</div> \
\
<div id="mazeDiv"></div> \
';

var echoBasic = ' \
<div style="text-align:center;width:100%;"><br /> \
  <div style="margin-left:auto;margin-right:auto;display:none;background:'+configBackground+';border:2px solid black;padding:10px;height:350px;width:150px;" id="conBasic"> \
    <table cellpadding="0" cellspacing="5" style="border:0px solid black;height:100%;width:100%"> \
      <tr><td><span class="help" onclick="alert(\'The width of the maze\')">(?)</span> Width</td><td style="text-align:right;"><input type="text" id="cols" size="2" value="20" onfocus="focusObj = this.id;" /></td></tr> \
      <tr><td><span class="help" onclick="alert(\'The height of the maze\')">(?)</span> Height</td><td style="text-align:right;"><input type="text" id="rows" size="2" value="20" onfocus="focusObj = this.id;" /></td></tr> \
      <tr><td><span class="help" onclick="alert(\'The width of the path of the maze\')">(?)</span> Path width</td><td style="text-align:right;"><input type="text" id="path" size="2" value="20" onfocus="focusObj = this.id;" /></td></tr> \
\
      <tr><td colspan="2" style="text-align:center"><br /><div class="small-button" onclick="submitFunc();" id="submit">New maze</div></td></tr> \
      <tr><td colspan="2" style="text-align:center"><div class="small-button" onclick="document.getElementById(\'loadMazeDiv\').style.display=\'block\';document.getElementById(conType).style.display = \'none\';">Load maze</div></td></tr> \
      <tr><td colspan="2" style="text-align:center"><div class="small-button" onclick="conType=\'con\';document.getElementById(\'con\').style.display=\'block\';document.getElementById(\'conBasic\').style.display = \'none\';">Advanced</div></td></tr> \
      <tr><td colspan="2" style="text-align:center"><div class="small-button" onclick="document.getElementById(conType).style.display=\'none\';document.getElementById(\'customKeysDiv\').style.display=\'block\';">Change keys</div></div></td></tr> \
      <tr><td colspan="2" style="text-align:center"><div class="small-button" onclick="saveSettings(0);alert(\'Settings have been saved\');">Save settings</div></td></tr> \
      <tr><td colspan="2" style="text-align:center"><div class="small-button" onclick="saveSettings(1);alert(\'Saved settings cookie has been removed\');">Remove settings cookie</div></td></tr> \
      <tr><td colspan="2" style="text-align:center"><div class="small-button" onclick="help();">Help</div></td></tr> \
      <tr><td colspan="2" style="text-align:center"><div class="small-button" onclick="configPanelClose();">Close</div></td></tr> \
      <tr><td colspan="2" style="text-align:center"><div style="padding-top:5px;font-size:12px;"><a href="http://mazesmith.sourceforge.net/" target="_blank" style="text-decoration:none;color:black;">Mazesmith 0.7.0 by Robert</a></div></td></tr> \
    </table> \
  </div> \
</div> \
';
