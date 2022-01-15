const express = require("express");
const http = require("http");
const websocket = require("ws");

const indexRouter = require("./routes/index");
const messages = require("./public/javascripts/messages");

const gameStatus = require("./statTracker");
const Game = require("./game");
// const game = require("./game");

if(process.argv.length < 3) {
  console.log("Error: expected a port as argument (eg. 'node app.js 3000').");
  process.exit(1);
}
const port = process.argv[2];
const app = express();

app.use(express.static(__dirname + "/public"));

app.get("/play", indexRouter);
app.get("/", indexRouter);

// http.createServer(app).listen(port);
const server = http.createServer(app);
const wss = new websocket.Server({ server });

const websockets = {}; //property: websocket, value: game
/*
 * regularly clean up the websockets object
 */
setInterval(function() {
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        delete websockets[i];
      }
    }
  }
}, 50000);


let serverBoard = Array.from(Array(6), () => new Array(7));
for(i = 0; i < 6; i++) {
  for(j = 0; j < 7; j++) {
    serverBoard[i][j] = 0;
  }
}

let currentGame = new Game(gameStatus.gamesInitialized++);
let connectionID = 0; //each websocket receives a unique ID

wss.on("connection", function connection(ws) {
  /*
   * two-player game: every two players are added to the same game
   */
  const con = ws;
  con["id"] = connectionID++;
  let playerType = currentGame.addPlayer(con);
  websockets[con["id"]] = currentGame;

  console.log(
    `Player ${con["id"]} placed in game ${currentGame.id} as ${playerType}`
  );

  /*
   * inform the client about its assigned player type
   */
  con.send(playerType == "A" ? messages.S_PLAYER_A : messages.S_PLAYER_B);

  if(playerType == "B") {
    // console.log("game is gonna start now");
    messages.O_BEGIN_GAME.data = serverBoard;
    let beginMessage = JSON.stringify(messages.O_BEGIN_GAME);

    // console.log(currentGame.playerA);
    currentGame.playerA.send(beginMessage);
    currentGame.playerB.send(beginMessage);
    currentGame.playerA.send(JSON.stringify(messages.O_SET_TURN));
    currentGame.playerB.send(JSON.stringify(messages.O_SET_TURN_OPPONENT));
  }

  if (currentGame.hasTwoConnectedPlayers()) {
    currentGame = new Game(gameStatus.gamesInitialized++);

  }

  con.on("message", function incoming(message) {
    let oMsg = JSON.parse(message);

    const gameObj = websockets[con["id"]];
    const isPlayerA = gameObj.playerA == con ? true : false;

    if(isPlayerA){
      if(oMsg.type == messages.T_SET_A){
          gameObj.playerB.send(message);
          gameObj.setStatus("A MOVE");
      }

      if (oMsg.type == "PIECE-ADDED") {
          gameObj.playerB.send(JSON.stringify(oMsg));
      }

  }else{

      if(oMsg.type == messages.T_SET_B){
          gameObj.playerA.send(message);
          gameObj.setStatus("B MOVE");
      }

      if (oMsg.type == "PIECE-ADDED") {
          gameObj.playerA.send(JSON.stringify(oMsg));
      }

  }

    //check who won?
    if (oMsg.type == "GAME-OVER") {
      console.log("Game is over :(");
      if(oMsg.data == 1) {
        gameObj.playerA.send(messages.S_GAME_WON);
        gameObj.playerB.send(messages.S_GAME_LOST);
        gameObj.setStatus("A");
      }
      else if(oMsg.data == 2) {
        gameObj.playerB.send(messages.S_GAME_WON);
        gameObj.playerA.send(messages.S_GAME_LOST);
        gameObj.setStatus("B");
      }
      else if(oMsg.data == 0) {
        gameObj.playerA.send(messages.S_GAME_TIED);
        gameObj.playerB.send(messages.S_GAME_TIED);
      }

      gameStatus.gamesCompleted++;
  }

  });

  con.on("close", function(code) {
    /*
     * code 1001 means almost always closing initiated by the client;
     * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     */
    console.log(`${con["id"]} disconnected ...`);

    if (code == "1001") {
      /*
       * if possible, abort the game; if not, the game is already completed
       */
      const gameObj = websockets[con["id"]];

      if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
        gameObj.setStatus("ABORTED");
        gameStatus.gamesAborted++;

        /*
         * determine whose connection remains open;
         * close it
         */
        try {
          gameObj.playerA.close();
          gameObj.playerA = null;
        } catch (e) {
          console.log("Player A closing: " + e);
        }

        try {
          gameObj.playerB.close();
          gameObj.playerB = null;
        } catch (e) {
          console.log("Player B closing: " + e);
        }
      }
    }
  });
});

server.listen(port);
