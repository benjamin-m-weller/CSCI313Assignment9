
 /*------+
  | GAME |
  +------*/

  const GAME = { stopped:0,running:1 };
  var gameState;

  function game_init() {
      gameState = GAME.stopped;
      createjs.Ticker.setPaused(true);
  }

  function game_onTick(e) {
    switch ( gameState ) {
      case GAME.stopped:
        break;
      case GAME.running:
        moth.update();
        if ( moth.hits(light) ){ moth.dies(); };
        moth.render();
        stage.update();
        break;
    }
  }

  function game_onStart() {
    switch ( gameState ) {
      case GAME.stopped:
        createjs.Ticker.setPaused(false);
        gameState = GAME.running;
        break;
      case GAME.running:
        break;
    }
  }

  function game_onStop() {
    switch ( gameState ) {
      case GAME.stopped:
        break;
      case GAME.running:
        createjs.Ticker.setPaused(true);
        gameState = GAME.stopped;
        break;
    }
  }