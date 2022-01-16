const socket = new WebSocket("ws://localhost:3000");

// Sets up gameState object
var gameState = function(){
    this.playerTurn = false;
    this.time = null;
    this.gameOver = false;
};

//setting up variables
boardWidth = 7;
boardHeight = 6;
board = null;

player1 = 'images/2.png';
player2 = 'images/3.png';
pieceSize = "65px";
const clickSound = new Audio("../audio/1.mp3");
piecesPlayed = 0;
player = new Image();
opponent = new Image();
playerIndex = 0;
opponentIndex = 0;

// aesthetics -> can be expressed only locally
const cells = document.querySelectorAll('td');
cells.forEach(cell => {
  cell.addEventListener('mouseover', function() {
    highlightRow(cell.cellIndex, true);
  })
  cell.addEventListener('mouseout', function() {
    highlightRow(cell.cellIndex, false);
  })
});
function highlightRow(column, boole) {
  //for each row, highligh this column
  for(i = 0; i < boardHeight; i++) {
    if(boole == true) {
      cells[column + 7*i].style.backgroundColor = "gray";
    }
    else {
      cells[column + 7*i].style.backgroundColor = "white";
    }
  }
}

function setGamePiece(playerType) {
  if(playerType == "A") {
    player.src = player1;
    opponent.src = player2;
    playerIndex = 1;
    opponentIndex = 2;
  }
  else {
    player.src = player2;
    opponent.src = player1;
    playerIndex = 2;
    opponentIndex = 1;
  }
}

// game logic

function addColumn(c) {
  var cell = 0;

  console.log(gameState.gameOver);

  if(gameState.playerTurn == true && gameState.gameOver == false) {
    var actuallyAdded = false;
    for(i = boardHeight-1; i >= 0; i--) {
      if(board[i][c] == 0) {
        board[i][c] = playerIndex;
        cell = i * boardHeight + c + i;
        actuallyAdded = true;
        piecesPlayed++;
        document.getElementById("piecesPlayed").innerHTML = piecesPlayed;
        break;
      }
    }

    if(actuallyAdded) {
      clickSound.play();
      updateBoardWithPiece(cell, "you");
      checkVictory();
      checkTie();
      setToOpponentTurn();

      socket.send(JSON.stringify({
            type: "PIECE-ADDED",
            data: cell
        }));
    }
  }
}

function updateLocalBoard(cell) {
  //based on cell get row and column
  row = parseInt(cell / 7);
  // cell = i * boardHeight + c + i;
  column = cell - row - (row*boardHeight);

  board[row][column] = opponentIndex;

  console.log("Update cell " + cell+ " ROW " + row + " | COLUMN " + column + " with index " + opponentIndex);
  // console.log(board);

}

function updateBoardWithPiece(cell, zetonType) {
  // console.log("UPDATE BOARD W PIECE " + cell);

  var zeton = document.createElement('img');
  if(zetonType == "you") {
    zeton.src = player.src;
  }
  else {
    zeton.src = opponent.src;
  }

  zeton.style.width = pieceSize;
  cells[cell].appendChild(zeton);

}

function checkVictory() {
  //check who won -> go through board and compare values: 1 | 2 for the two players
  // for(p = 1; p <=2; p++) {
    for (i = 0; i <=5; i++) {
      for (j = 0; j <=3; j++) {
        //check to see if the gameboard item is set to the player we are checking, if so, lets check the next 3 for a match
        //if (board[j][i] == i) {
          if ((board[i][j] == playerIndex) && (board[i][j+1] == playerIndex) && (board[i][j+2] == playerIndex) && (board[i][j+3] == playerIndex)) {
            //endGame(i);//a match has been made, so run EndGame with the player that had the win
            //return true; //stop checking for a win - the game is over.
            console.log("WON - horizontal: player ");
            // if(p == 1) return this.playerA;
            // else return this.playerB;
            socket.send(JSON.stringify({
                  type: "GAME-OVER",
                  data: playerIndex
              }));
          }
        //}
      }
    }
  // }
  // for(p = 1; p <=2; p++) {
    for (i = 0; i < 3; i++) {
      for (j = 0; j <=6; j++) {
        //if (board[j][i] == i) {
          if ((board[i][j] == playerIndex) && (board[i+1][j] == playerIndex) && (board[i+2][j] == playerIndex) && (board[i+3][j] == playerIndex)) {
            //endGame(i); //a match has been made - run endGame for the player who had the match.
            //return true; //stop checking for a win - the game is over.
            console.log("WON - vertical: player ");
            // if(p == 1) return this.playerA;
            // else return this.playerB;
            socket.send(JSON.stringify({
                  type: "GAME-OVER",
                  data: playerIndex
              }));
          }
        //}
      }
    }
  // }
  // for(p = 1; p <=2; p++) {
    for (i = 0; i <3; i++) {
      for (j = 0; j <=3; j++) {
        //if (gameboard[j][i] == i) {
          if ((board[i][j] == playerIndex) && (board[i+1][j+1] == playerIndex) && (board[i+2][j+2] == playerIndex) && (board[i+3][j+3] == playerIndex)) {
            //endGame(i);
            //return true;
            console.log("WON - diagnoal top bottom: player ");
            // if(p == 1) return this.playerA;
            // else return this.playerB;
            socket.send(JSON.stringify({
                  type: "GAME-OVER",
                  data: playerIndex
              }));
          }
        //}
      }
    }
  // }
  //
  // for(p = 1; p <=2; p++) {
    for (i = 0; i <3; i++) {
      for (j = 3; j <=6; j++) {
        //if (gameboard[j][i] == i) {
          if ((board[i][j] == playerIndex) && (board[i+1][j-1] == playerIndex) && (board[i+2][j-2] == playerIndex) && (board[i+3][j-3] == playerIndex)) {
            //endGame(i);
            //return true;
            console.log("WON - diagnoal bottom top: player ");
            // if(p == 1) return this.playerA;
            // else return this.playerB;
            socket.send(JSON.stringify({
                  type: "GAME-OVER",
                  data: playerIndex
              }));
          }
        //}
      }
    }
  }
// }


function checkTie() {
  if(playerIndex == 2 && !gameState.gameOver && piecesPlayed == 21) {
    //it's a tie
    socket.send(JSON.stringify({
          type: "GAME-OVER",
          data: 0
      }));
  }
}


/*
    Starts the timer
*/
function startTime() {
        setInterval(function() {
            if (gameState.gameOver) {
                return;
            }
            gameState.time++;
            updateTime();
        }, 1000);
}

/*
    Updates the time values in the HTML code
*/
function updateTime() {
    let minutes = (gameState.time / 60) < 10 ? ("0" + Math.floor(gameState.time / 60).toString()) : Math.floor(gameState.time / 60).toString();
    let seconds = (gameState.time % 60) < 10 ? ("0" + (gameState.time % 60).toString()) : (gameState.time % 60).toString();
    // console.log(gameState.time % 60);
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;
}

function beginGame(serverBoard) {
    board = serverBoard;
    document.getElementById("gameOver").innerHTML = "Game is in progress...";
    initialiseGameState();
    startTime();
}

function initialiseGameState() {
    // gameState.board = board;
    gameState.time = 0;
    gameState.gameOver = false;
}

function setToPlayerTurn() {
    gameState.playerTurn = true;
    document.getElementById("current_turn").innerHTML = "your";
}

/*
    Sets player turn to false and changes appropriate HTML code
*/
function setToOpponentTurn() {
    console.log("set to opponent turn!");
    gameState.playerTurn = false;
    document.getElementById("current_turn").innerHTML = "opponent's";
}


function endGame(message) {
    gameState.playerTurn = false;
    document.getElementById("gameOver").innerHTML = message;
    gameState.gameOver = true;
    console.log("game is over bb");
    console.log(playerTurn);
}


socket.onmessage = function(event) {
    let msg = JSON.parse(event.data);

    if (msg.type == "BEGIN-GAME") {
        beginGame(msg.data);
    }
    else if (msg.type == "PLAYER-TURN") {
        setToPlayerTurn();
    }
    else if (msg.type == "OPPONENT-TURN") {
        setToOpponentTurn();
    }else if(msg.type == "PIECE-ADDED"){
        let data = msg.data;
        updateBoardWithPiece(data);
        updateLocalBoard(data);
        setToPlayerTurn();
    }
    else if(msg.type == "PLAYER-TYPE") {
      setGamePiece(msg.data);
    }
    else if (msg.type == "GAME-LOST") {
        endGame("The game has ended <br> You lost :(");
    }
    else if (msg.type == "GAME-WON") {
        endGame("The game has ended <br> You won!");
    }
    else if (msg.type == "GAME-TIED") {
        endGame("The game has ended <br> It's a tie!");
    }
}
