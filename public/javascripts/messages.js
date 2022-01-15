// @ts-nocheck

(function (exports) {
  /*
   * Client to server: game is complete, the winner is ...
   */
  exports.T_GAME_WON_BY = "GAME-WON-BY";
  exports.O_GAME_WON_BY = {
    type: exports.T_GAME_WON_BY,
    data: null,
  };

  /*
   * Server to client: abort game (e.g. if second player exited the game)
   */
  exports.O_GAME_ABORTED = {
    type: "GAME-ABORTED",
  };
  exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);


  exports.T_BEGIN_GAME = "BEGIN-GAME";
  exports.O_BEGIN_GAME = {
    type: exports.T_BEGIN_GAME,
    data: null
  };
  /*
   * Server to client: set as player 1
   */
  exports.T_PLAYER_TYPE = "PLAYER-TYPE";
  exports.O_PLAYER_A = {
    type: exports.T_PLAYER_TYPE,
    data: "A",
  };
  exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);

  /*
   * Server to client: set as player 2
   */
  exports.O_PLAYER_B = {
    type: exports.T_PLAYER_TYPE,
    data: "B",
  };
  exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);

  /*
   *    Server informs the player it's their turn to play
   */
   exports.T_SET_A = "PLAYER-TURN-A";
    exports.O_SET_A = {
      type: exports.T_SET_A,
      data: null
    };


    /*
    *    Player B will send to message about the selected card to the server and the server can send that message to player A in turn
    */
    exports.T_SET_B = "PLAYER-TURN-B";
    exports.O_SET_B = {
      type: exports.T_SET_B,
      data: null
    };

   exports.T_SET_TURN = "PLAYER-TURN";
    exports.O_SET_TURN = {
      type: exports.T_SET_TURN
    };

    /*
    *    Server informs the player it's the opponent's turn to play
    */
    exports.T_SET_TURN_OPPONENT = "OPPONENT-TURN";
    exports.O_SET_TURN_OPPONENT = {
      type: exports.T_SET_TURN_OPPONENT
    };

  /*
   * Player 1 to server OR server to Player 2: player1 puts down piece
   */
  // exports.T_MAKE_A_MOVE = "PLAYER-MAKES-A-MOVE";
  // exports.O_MAKE_A_MOVE = {
  //   type: exports.T_MAKE_A_MOVE,
  //   data: null,
  // };
  /*
   * Player 2 to server OR server to Player 1: player2 puts down piece
   */
  // exports.T_MAKE_A_MOVE_B = "MAKE-A-MOVE-B";
  // exports.O_MAKE_A_MOVE_B = {
  //   type: exports.T_MAKE_A_MOVE_B,
  //   data: null,
  // };
  //exports.S_MAKE_A_GUESS does not exist, as data needs to be set

  /*
  *    Server informs player that they lost the game
  */
  exports.T_GAME_LOST = "GAME-LOST";
  exports.O_GAME_LOST = {
      type: exports.T_GAME_LOST,
  };
  exports.S_GAME_LOST = JSON.stringify(exports.O_GAME_LOST);

  /*
  *    Server informs player that they won the game
  */
  exports.T_GAME_WON = "GAME-WON";
  exports.O_GAME_WON = {
      type: exports.T_GAME_WON,
  };
  exports.S_GAME_WON = JSON.stringify(exports.O_GAME_WON);

  /*
  *    Server informs player that the game is tied
  */
  exports.T_GAME_TIED = "GAME-TIED";
  exports.O_GAME_TIED = {
      type: exports.T_GAME_TIED,
  };
  exports.S_GAME_TIED = JSON.stringify(exports.O_GAME_TIED);


  // /*
  //  * Server to Player A & B: game over with result won/loss
  // //  */
  // exports.T_GAME_OVER = "GAME-OVER";
  // exports.O_GAME_OVER = {
  //   type: exports.T_GAME_OVER,
  //   data: null,
  // };
})(typeof exports === "undefined" ? (this.Messages = {}) : exports);
//if exports is undefined, we are on the client; else the server
