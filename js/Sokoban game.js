'use strict'

var gBoard;
var playerClicked = false;
var gwinng = 0;
var gStepsCount = 0;

function initGame() {
    gwinng = 0;
    gStepsCount = 0;
    buildBoard();
    document.querySelector('header').classList.remove('winner');
}

function buildBoard() {
    var newBoard = [];

    for (var i = 0; i < 10; i++) {
        newBoard[i] = [];
        for (var j = 0; j < 10; j++) {
            var cell = {
                player: '',
                wall: '',
                floor: '',
                target: '',
                box: ''
            };
            newBoard[i][j] = cell;
        }
    }

    gBoard = newBoard;

    makeLevel1(newBoard);
    randerBoard(newBoard);
}

function checkKey(event, elCell) {
    var playerPosition = checkWherePlayer();
    var nextCell = {};

    switch (event.which) {
        case 37:
            console.log('left');
            nextCell.row = playerPosition.row
            nextCell.col = playerPosition.col - 1;
            movePlayer(nextCell, playerPosition, 'left');
            break;
        case 38:
            console.log('up');
            nextCell.row = playerPosition.row - 1;
            nextCell.col = playerPosition.col;
            movePlayer(nextCell, playerPosition, 'up');
            break;
        case 39:
            console.log('right');
            nextCell.row = playerPosition.row
            nextCell.col = playerPosition.col + 1;
            movePlayer(nextCell, playerPosition, 'right');
            break;
        case 40:
            console.log('down');
            nextCell.row = playerPosition.row + 1;
            nextCell.col = playerPosition.col;
            movePlayer(nextCell, playerPosition, 'down');
            break;
    }

}

function checkWherePlayer() {
    var coord = {};
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].player) {
                coord.row = i;
                coord.col = j;
            }
        }
    }
    return coord;
}

function movePlayer(nextCell, playerPosition, moveDirection) {
    var tampValue = gBoard[playerPosition.row][playerPosition.col];

    if (gwinng === 4) {
        console.log('win!');
        return;
    }

    if (gBoard[nextCell.row][nextCell.col].floor) {
        gBoard[playerPosition.row][playerPosition.col] = gBoard[nextCell.row][nextCell.col];
        gBoard[nextCell.row][nextCell.col] = tampValue;
        gStepsCount++;
        document.querySelector('#steps').innerHTML = gStepsCount;
    } else if (gBoard[nextCell.row][nextCell.col].box) {
        var canMove = moveBox(nextCell, moveDirection);
        if (canMove) {
            gBoard[playerPosition.row][playerPosition.col] = gBoard[nextCell.row][nextCell.col];
            gBoard[nextCell.row][nextCell.col] = tampValue;
            gStepsCount++;     
            document.querySelector('#steps').innerHTML = gStepsCount;
            }

    }
    randerBoard(gBoard);
}

function moveBox(cell, moveDirection) {
    var tampValue = gBoard[cell.row][cell.col];
    var canMove = false;

    var nextCell = {
        row: cell.row,
        col: cell.col
    }

    switch (moveDirection) {
        case 'up':
            nextCell.row -= 1;
            break;
        case 'right':
            nextCell.col += 1;
            break;
        case 'down':
            nextCell.row += 1;
            break;
        case 'left':
            nextCell.col -= 1;
            break;
    }

    if (!gBoard[nextCell.row][nextCell.col].wall && !gBoard[nextCell.row][nextCell.col].target && !gBoard[nextCell.row][nextCell.col].box && !gBoard[nextCell.row][nextCell.col].correct) {
        gBoard[cell.row][cell.col] = gBoard[nextCell.row][nextCell.col];
        gBoard[nextCell.row][nextCell.col] = tampValue;
        canMove = true;
    }

    if (gBoard[nextCell.row][nextCell.col].target) {
        gBoard[nextCell.row][nextCell.col].correct = true;
        gBoard[nextCell.row][nextCell.col].box = '';
        gBoard[nextCell.row][nextCell.col].target = '';
        gBoard[cell.row][cell.col].box = '';
        gBoard[cell.row][cell.col].floor = true;
        canMove = true;
        gwinng++;
        if (gwinng === 4) document.querySelector('header').classList.add('winner');
    }


    return canMove;
}






function getCellCoord(strCellId) {
    var coord = {};
    coord.i = +strCellId.substring(5, strCellId.lastIndexOf('-'));
    coord.j = +strCellId.substring(strCellId.lastIndexOf('-') + 1);
    // console.log('coord', coord);
    return coord;
}

function getSelector(coord) {
    return '#cell-' + coord.row + '-' + coord.col
}

function makeLevel1(board) {
    board[6][4].player = true;
    board = makeLevel1Walls(board);
    board = makeLevel1Boxs(board);
    board = makeLevel1Targets(board);
    board = makeLevel1Floor(board);
}


function makeLevel1Walls(board) {
    for (var i = 0; i < board.length; i++) {
        board[i][0].wall = true;
    }

    for (i = 0; i < 4; i++) {
        board[i][1].wall = true;
    }

    for (var j = 0; j < board[0].length; j++) {
        board[0][j].wall = true;
    }

    for (var j = 0; j < board[0].length; j++) {
        board[9][j].wall = true;
    }

    for (i = 0; i < board.length; i++) {
        board[i][9].wall = true;
    }

    for (i = 5; i < board.length; i++) {
        board[i][8].wall = true;
    }

    for (i = 0; i < 4; i++) {
        board[i][3].wall = true;
    }

    for (j = 2; j < 5; j++) {
        board[8][j].wall = true;
    }

    board[0][8].wall = true;
    board[1][8].wall = true;
    board[0][2].wall = true;
    board[0][5].wall = true;
    board[3][4].wall = true;
    board[6][2].wall = true;
    board[6][3].wall = true;
    board[7][3].wall = true;
    board[3][6].wall = true;


    return board;
}

function makeLevel1Boxs(board) {
    board[5][3].box = true;
    board[6][5].box = true;
    board[7][5].box = true;
    board[2][6].box = true;

    return board;
}

function makeLevel1Targets(board) {
    board[8][1].target = true;
    board[1][2].target = true;
    board[4][6].target = true;
    board[5][6].target = true;

    return board;
}

function makeLevel1Floor(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].player && !board[i][j].box && !board[i][j].wall && !board[i][j].target) {
                board[i][j].floor = true;
            }
        }
    }
    return board;
}

function randerBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var tdId = 'cell-' + i + '-' + j;

            if (cell.player) {
                strHtml += '<td id="' + tdId + '" onclick="" ' +
                    'class="bordCells"> <img src="img/floor.png" class="boardimgs" /> <img class="boardimgs" src="img/player.png" /> </td>';
            }
            if (cell.target) {
                strHtml += '<td id="' + tdId + '"  onclick="" ' +
                    'class="bordCells"> <img  src="img/floor.png" class="boardimgs" /> <img class="boardimgs" src="img/target.png" /> </td>';
            }
            if (cell.wall) {
                strHtml += '<td id="' + tdId + '"  onclick="" ' +
                    'class="bordCells"> <img class="boardimgs" src="img/floor.png" /> <img class="boardimgs" src="img/wall.png" /> </td>';
            }
            if (cell.box) {
                strHtml += '<td id="' + tdId + '"  onclick="" ' +
                    'class="bordCells"> <img class="boardimgs" src="img/floor.png" /> <img class="boardimgs" src="img/box.png" /> </td>';
            }
            if (cell.floor) {
                strHtml += '<td id="' + tdId + '"  onclick="" ' +
                    'class="bordCells"> <img class="boardimgs" src="img/floor.png" /> </td>';
            }
            if (cell.correct) {
                strHtml += '<td id="' + tdId + '"  onclick="" ' +
                    'class="bordCells"><img class="boardimgs" src="img/floor.png" /> <img class="boardimgs" src="img/box.png" /> </td>';
            }
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.sokobanBoard');
    elMat.innerHTML = strHtml;
    document.querySelector('#steps').innerHTML = gStepsCount;    
}