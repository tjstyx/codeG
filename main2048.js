var board = new Array();
var score = 0;
//记录是否发生过变化
var haschange = new Array();

//触控位置
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;


$(document).ready(function () {
    prepareForMobile();
    newgame();
});

function prepareForMobile() {

    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.08 * cellSideLength);

}

function newgame() {
    //初始化    
    init();
    //生成随机 
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $('#grid-cell-' + i + '-' + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));

        }
    }
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        haschange[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            haschange[i][j] = false;
        }
    }

    updateBoardView();

    //分数清零
    score = 0;
    updateScore(score);
}
/**
 * 刷新
 */
function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
            } else {
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            haschange[i][j] = false;
        }
    }
    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.4 * cellSideLength + 'px');

}
/**
 * 获取随机数字
 */
function generateOneNumber() {
    if (nospace(board))
        return false;

    //随机位置

    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));

    var times = 0;
    while (times < 50) {
        if (board[randx][randy] == 0) {
            break;
        }
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        times++;
    }
    if (times == 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    //随机数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //显示数字

    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}
/**
 * 获取按下的按键
 */
$(document).keydown(function (event) {
    //event.preventDefault(); //防止方向键让滚动条移动
    switch (event.keyCode) {
        case 37: //left
            event.preventDefault();
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 38: //up
            event.preventDefault();
            if (moveUP()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 39: //right
            event.preventDefault();
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 40: //down
            event.preventDefault();
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        default:
            break;
    }
});

//触控
document.addEventListener('touchstart', function (event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});
//防止浏览器页面滑动
document.getElementById('grid-container').addEventListener('touchmove', function (event) {
    event.preventDefault();
});

document.addEventListener('touchend', function (event) {
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    if (Math.abs(deltax) < 0.2 * documentWidth && Math.abs(deltay) < 0.2 * documentWidth)
        return;

    //x方向
    if (Math.abs(deltax) >= Math.abs(deltay)) {
        if (deltax > 0) {
            //move right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        } else {
            //move left
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
    } else {
        //y方向（y向下为正）
        if (deltay > 0) {
            //move down
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        } else {
            //move up
            if (moveUP()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
    }
});

/**
 * 判断游戏是否结束
 */
function isgameover() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert("gameover!");
}
/**
 * 左移
 */
function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }
    //moveleft
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else {
                        if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !haschange[i][k]) {
                            //move
                            showMoveAnimation(i, j, i, k);
                            //add叠加
                            board[i][k] *= 2;
                            board[i][j] = 0;


                            //add score
                            score += board[i][k];
                            //记录已经发生变化
                            haschange[i][k] = true;

                            //前台更新
                            updateScore(score);


                            continue;
                        }
                    }
                }
            }
        }
    }

    setTimeout('updateBoardView()', 200);
    return true;

}

function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }

    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else {
                        if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !haschange[i][k]) {
                            //move
                            showMoveAnimation(i, j, i, k);
                            //add叠加
                            board[i][k] *= 2;
                            board[i][j] = 0;

                            //add score
                            score += board[i][k];

                            //记录发生变化
                            haschange[i][k] = true;
                            //前台更新
                            updateScore(score);
                            continue;
                        }
                    }
                }
            }
        }
    }

    setTimeout('updateBoardView()', 200);
    return true;

}

function moveUP() {
    if (!canMoveUp(board)) {
        return false;
    }

    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !haschange[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add叠加
                        board[k][j] *= 2;
                        board[i][j] = 0;

                        //add score
                        score += board[k][j];

                        haschange[k][j] = true;
                        //前台更新
                        updateScore(score);
                        continue;
                    }

                }
            }
        }
    }

    setTimeout('updateBoardView()', 200);
    return true;

}

function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }

    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else {
                        if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !haschange[k][j]) {
                            //move
                            showMoveAnimation(i, j, k, j);
                            //add叠加
                            board[k][j] *= 2;
                            board[i][j] = 0;

                            //add score
                            score += board[k][j];

                            haschange[k][j] = true;
                            //前台更新
                            updateScore(score);
                            continue;
                        }
                    }
                }
            }
        }
    }

    setTimeout('updateBoardView()', 200);
    return true;

}