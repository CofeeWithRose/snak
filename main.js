(function(){
  GE.start(["Render","Animation","PlayerController","HitBorder","Rigidbody"],function(){

   var player=new GameObject();
   player.name="player";
   var r=player.addCompment(new Render());
   r.setSize({w:50,h:50});
   var anima1=player.addCompment(new Animation());
    anima1.setAnimation("run",4,"image/player1");
    anima1.setAnimation("stand",1,"image/player1");
    anima1.setSpeed(6);
   player.addCompment(new PlayerController());
   player.addCompment(new Rigidbody());
   
 var x=0;
 var y=10;
  var stage=new GameObject();
  stage.name="stage";
  stage.addCompment(new Rigidbody());
     
   //localStorage._GE = Util.stringify(player2);
   //document.write(Util.stringify(player2));
  // GE.instantGameObject(player);
  for (var i = 200; i >= 0; i--) {

    if (x>25*50) {y+=50;x=0};
    var player2=new GameObject();
    player2.name="player2";
    var r=player2.addCompment(new Render());
    r.setSize({w:50,h:50});
    var anima2=player2.addCompment(new Animation());
    anima2.setAnimation("run",7,"image/player2");
    anima2.setAnimation("stand",1,"image/player2");
    anima2.setSpeed(5);
    player2.addCompment(new PlayerController());
    player2.getCompment("Transform").position.x=x;
    player2.getCompment("Transform").position.y=y;
    player2.addCompment(new HitBorder());
    stage.setChild(player2);
     x+=45;
  }

GE.instantGameObject(stage);
  



});
})();



