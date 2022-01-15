const websocket = require("ws");

/**
 * Game constructor. Every game has two players, identified by their WebSocket.
 * @param {number} gameID every game has a unique game identifier.
 */
const game = function(gameID) {
  this.id = gameID;
  this.playerA = null;
  this.playerB = null;
  this.scores = [0, 0];
  this.board = [[0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0]]; //7x6
  this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
};

game.prototype.checkTie = function() {
    if (this.scores[0] == this.scores[1]) {
        return true;
    }
    return false;
}

game.prototype.getWinner = function() {
  if (this.scores[0] > this.scores[1]) {
        return this.playerA;
    }
    return this.playerB;
}

game.prototype.getLoser = function() {
    if (this.scores[0] > this.scores[1]) {
        return this.playerB;
    }
    return this.playerA;

}

/*
 * All valid transition states are keys of the transitionStates object.
 */
game.prototype.transitionStates = {
  "0 JOINT": 0,
  "1 JOINT": 1,
  "2 JOINT": 2,
  "A MOVE": 3,
  "B MOVE": 4,
  "A": 5, //A won
  "B": 6, //B won
  "ABORTED": 7
};

/*
 * Not all game states can be transformed into each other; the transitionMatrix object encodes the valid transitions.
 * Valid transitions have a value of 1. Invalid transitions have a value of 0.
 */
game.prototype.transitionMatrix = [
  [0, 1, 0, 0, 0, 0, 0, 0],  // 0 PLAYERS JOINED THE MATCH
  [1, 0, 1, 0, 0, 0, 0, 0],  // 1 PLAYER JOINED THE MATCH
  [0, 0, 0, 1, 0, 0, 0, 1],  // 2 PLAYERS JOINED THE MATCH
  [0, 0, 0, 0, 1, 1, 1, 1],  // PLAYER A TURN
  [0, 0, 0, 1, 0, 1, 1, 1],  // PLAYER B TURN
  [0, 0, 0, 0, 0, 0, 0, 0],  // PLAYER A WON
  [0, 0, 0, 0, 0, 0, 0, 0],  // PLAYER B WON
  [0, 0, 0, 0, 0, 0, 0, 0],  // ABORTED
];

/**
 * Determines whether the transition from state `from` to `to` is valid.
 * @param {string} from starting transition state
 * @param {string} to ending transition state
 * @returns {boolean} true if the transition is valid, false otherwise
 */
game.prototype.isValidTransition = function(from, to) {
  let i, j;
  if (!(from in game.prototype.transitionStates)) {
    return false;
  } else {
    i = game.prototype.transitionStates[from];
  }

  if (!(to in game.prototype.transitionStates)) {
    return false;
  } else {
    j = game.prototype.transitionStates[to];
  }

  return game.prototype.transitionMatrix[i][j] > 0;
};

/**
 * Determines whether the state `s` is valid.
 * @param {string} s state to check
 * @returns {boolean}
 */
game.prototype.isValidState = function(s) {
  return s in game.prototype.transitionStates;
};

/**
 * Updates the game status to `w` if the state is valid and the transition to `w` is valid.
 * @param {string} w new game status
 */
game.prototype.setStatus = function(w) {
  if (
    game.prototype.isValidState(w) &&
    game.prototype.isValidTransition(this.gameState, w)
  ) {
    this.gameState = w;
    console.log("[STATUS] %s", this.gameState);
  } else {
    return new Error(
      `Impossible status change from ${this.gameState} to ${w}`
    );
  }
};



/**
 * Checks whether the game is full.
 * @returns {boolean} returns true if the game is full (2 players), false otherwise
 */
game.prototype.hasTwoConnectedPlayers = function() {
  return this.gameState == "2 JOINT";
};

game.prototype.hasOneConnectedPlayer = function(){
    return this.gameState == "1 JOINT";
};

/**
 * Adds a player to the game. Returns an error if a player cannot be added to the current game.
 * @param {websocket} p WebSocket object of the player
 * @returns {(string|Error)} returns "A" or "B" depending on the player added; returns an error if that isn't possible
 */
 game.prototype.addPlayer = function(p){

     if(this.gameState != "0 JOINT" && this.gameState != "1 JOINT"){
         return new Error(`Invalid call to addPlayer, current state is ${this.gameState}`);
     }

     const error = this.setStatus("1 JOINT");
     if(error instanceof Error){
         this.setStatus("2 JOINT");
     }

     if(this.playerA == null){
         this.playerA = p;
         return "A";
     }else{
         this.playerB = p;
         return "B";
     }

 };

game.prototype.isFinished = function(){
    return this.gameState == "A" || this.gameState == "B" || this.gameState == "ABORTED";
};

module.exports = game;
