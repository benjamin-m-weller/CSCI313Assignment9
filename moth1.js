
 /*------+
  | MOTH |
  +------*/

(function(){

  // SET_MOVE_BOUNDS

  var xL,xR,yC,yF; // movement bounds (used by Moth update)

  Moth_setMoveBounds = function(left,right,ceiling,floor){ 
    xL=left; xR=right; yC=ceiling; yF=floor; 
  };

  // NEW MOTH

  const MW = 10, MH = 10; // width and height
  const MC = "#000000";   // color

  function Moth(){
    var g = new createjs.Graphics();
    g.beginFill(MC).drawRect(0,0,MW,MH);
    this.Shape_constructor(g);
    this.x = 0;
    this.y = 0;
  }

  var p = createjs.extend(Moth,createjs.Shape);

  // private properties

  p.speed = 0;
  p.dX = p.dY = 0; // direction
  p.vX = p.vY = 0; // velocity
  p.nX = p.nY = 0; // next position
  p.alive = true;

  // public methods

  p.setPosition = function(x,y){ this.x = x; this.y = y; };

  p.setVelocity = function(speed,dX,dY){
    this.setSpeed(speed);
    this.setDirection(dX,dY);
    this.updateVelocity();
  };

  p.update = function(){
    var nX,nY;
    if (this.alive) { 
      this.turnRandom();
      //
      nX = this.x + this.vX;
      if ( nX    < xL ) { nX = xL; this.reverseDirX() }
      if ( nX+MW > xR ) { nX = xR-MW; this.reverseDirX() }
      this.nX = nX;
      //
      nY = this.y + this.vY;
      if ( nY    < yC ) { nY = yC; this.reverseDirY() }
      if ( nY+MH > yF ) { nY = yF-MH; this.reverseDirY() }
      this.nY = nY;
    } else {
      nY = this.y + this.vY;
      if ( nY+MH > yF ) { 
        nY = yF-MH; this.setVelocity(0,0,0); 
      }
      this.nY = nY;
    }
  };

  p.render = function(){ this.x = this.nX; this.y = this.nY; };

  p.collider = function(){
    return {
      xL:this.nX, xR:this.nX + MW,
      yT:this.nY, yB:this.nY + MH
    };
  };

  p.hits = function(o){
    if (this.alive) {
      var c = o.collider();
      var hitX = this.nX <= c.xR && this.nX+MW >= c.xL;
      var hitY = this.nY <= c.yB && this.nY+MH >= c.yT;
      return hitX && hitY;
    } else {
      return false;
    }
  };

  p.dies = function(){
    this.setVelocity(10,0,1);
    this.alive = false; 
  };

  // private methods

  p.setSpeed = function(speed){ this.speed = speed; };

  // Assumption: dX = -1,0,1 and dY = -1,0,1.
  p.setDirection = function(dX,dY){ this.dX = dX; this.dY = dY; };

  p.updateVelocity = function(){
    this.vX = 0;
    if ( this.dX < 0 ) { this.vX = -this.speed; }
    if ( this.dX > 0 ) { this.vX = this.speed; }
    this.vY = 0;
    if ( this.dY < 0 ) { this.vY = -this.speed; }
    if ( this.dY > 0 ) { this.vY = this.speed; }
  };

  p.turnLeft = function(){
    var new_dX = this.dY; this.dY = -this.dX; this.dX = new_dX;
  };

  p.turnRight = function(){
    var new_dX = -this.dY; this.dY = this.dX; this.dX = new_dX;
  };

  var norm = function(d){
    d = d > 1 ? 1 : d; 
	d = d < -1 ? -1 : d; 
	return d;
  };

  p.turnLeft45 = function(){
    var new_dX = norm(this.dY+this.dX);
    this.dY = norm(this.dY-this.dX);
    this.dX = new_dX;
  };

  p.turnRight45 = function(){
    var new_dX = norm(this.dX-this.dY);
    this.dY = norm(this.dX+this.dY);
    this.dX = new_dX;
  };

  p.turnRandom = function(){
    const N = 5; // number of turn cases
    var turn = Math.floor(N*Math.random());
    switch(turn) {
      case 0: this.turnLeft(); break;
      case 1: this.turnLeft45(); break;
      case 2: break;
      case 3: this.turnRight45(); break;
      case 4: this.turnRight(); break;
      default: // straight
    };
    this.updateVelocity();
  };

  p.reverseDirX = function(){
    this.dX = -this.dX; this.vX = -this.vX;
  };

  p.reverseDirY = function(){
    this.dY = -this.dY; this.vY = -this.vY;
  };

  window.Moth = createjs.promote(Moth,"Shape");

}());

