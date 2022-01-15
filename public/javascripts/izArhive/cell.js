// setting up variables
boardWidth = 7;
boardHeight = 6;
board = Array.from(Array(boardHeight), () => new Array(boardWidth));
for(i = 0; i < boardHeight; i++) {
  for(j = 0; j < boardWidth; j++) {
    board[i][j] = 0;
  }
}

player1 = new Image();
player1.src = 'images/1.png';
player1.style.width = "50px";
player2 = new Image();
player2.src = 'images/2.png';
player2.style.width = "50px";

// game logic
const cells = document.querySelectorAll('td');
cells.forEach(cell => {
  cell.addEventListener('click', function() {
    show(cell);
  })
  cell.addEventListener('mouseover', function() {
    highlightRow(cell.cellIndex, true);
  })
  cell.addEventListener('mouseout', function() {
    highlightRow(cell.cellIndex, false);
  })
});

function show(cell) {
  r = cell.closest('tr').rowIndex;
  c = cell.cellIndex;
  for(i = boardHeight-1; i >= 0; i--) {
    if(board[i][c] == 0) {
      board[i][c] = 1;
      var zeton = document.createElement('img');
      zeton.src = player1.src;
      zeton.style.width = player1.style.width;
      cells[i * boardHeight + c + i].appendChild(zeton);
      break;
    }
  }
}

function highlightRow(column, boole) {
  for(i = 0; i < boardHeight; i++) {
    if(boole == true) {
      cells[column + 7*i].style.backgroundColor = "gray";
    }
    else {
      cells[column + 7*i].style.backgroundColor = "white";
    }
  }
}
