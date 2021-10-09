var runner, runnerAnimation;
var PLAY, END;
PLAY = 1;
END = 0;
var gameState = PLAY;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var groundImage, cloudImage;
var ground,cloudsGroup;
var runnerImg;
var invisibleGround;
var score = 0;
var reset1, resetImg;
var reset2, reset2Img;
var trex_collided;

function preload(){
   runnerAnimation = loadAnimation("1.png", "2.png");
   obstacle1 = loadImage("obstacle1.png");
   obstacle2 = loadImage("obstacle2.png");
   obstacle3 = loadImage("obstacle3.png");
   obstacle4 = loadImage("obstacle4.png");
   obstacle5 = loadImage("obstacle5.png");
   obstacle6 = loadImage("obstacle6.png");
   groundImage = loadImage("ground2.png");
   cloudImage = loadImage("cloud.png");
   runnerImg = loadAnimation("1.png");
   resetImg = loadImage("gameOver.png");
   reset2Img = loadImage("restart.png");
   trex_collided = loadAnimation("death.png");
}

function setup(){
  createCanvas(1000, 500);

  runner = createSprite(80, 463, 90, 60);
  runner.addAnimation("running", runnerAnimation);
  runner.scale = 0.15;
  //runner.debug = true;

  reset1 = createSprite(500, 250, 60, 20);
  reset1.addImage(resetImg);

  reset2 = createSprite(500, 320, 40, 40);
  reset2.addImage(reset2Img);
  reset2.scale = 0.7;


  ground = createSprite(200, 490, 100, 10);
  ground.addImage(groundImage);
  ground.velocityX = -10;

  invisibleGround = createSprite(0, 511, 10000000, 10);
  invisibleGround.visible = false;

  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  createEdgeSprites();
}

function draw(){
  background("white"); 
  if(gameState === PLAY){
    reset2.visible = false;
    reset1.visible = false;
    score += Math.round(getFrameRate()/60);
    text("Score:" + score, 50, 50);
      if(ground.x < 0){
          ground.x = ground.width/2;
      }

      if(keyDown("space") && runner.y >= 463){
         runner.addAnimation("running", runnerImg);
         runner.velocityY = -40;
      }

      if(runner.y <= 463){
        runner.addAnimation("running", runnerAnimation);
      }

      runner.velocityY = runner.velocityY + 4.7;

      runner.collide(invisibleGround);

    spawnObstacles();
    spawnClouds();

    if(obstaclesGroup.isTouching(runner)){
      gameState = END;
      runner.addAnimation("running", trex_collided);
    }

  }


  if(gameState === END){
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    ground.velocityX = 0;
    runner.velocityY = 0;
    runner.velocityX = 0;
    reset1.visible = true;
    reset2.visible = true;
  }

  if(mousePressedOver(reset2)){
    reset();
  }
  drawSprites();
}

function spawnObstacles(){
  if (frameCount % 60 === 0){
    var obstacle = createSprite(1200,475,10,40);
    obstacle.velocityX = ground.velocityX;
    obstacle.scale = 0.45
    
     //generate random obstacles
     var rand = Math.round(random(1,6));
     switch(rand) {
       case 1: obstacle.addImage(obstacle1);
               break;
       case 2: obstacle.addImage(obstacle2);
               break;
       case 3: obstacle.addImage(obstacle3);
               break;
       case 4: obstacle.addImage(obstacle4);
               break;
       case 5: obstacle.addImage(obstacle5);
               break;
       case 6: obstacle.addImage(obstacle6);
               break;
       default: break;
}

obstaclesGroup.add(obstacle);

}

}

function spawnClouds(){
  if (frameCount % 60 === 0) {
    var cloud = createSprite(1200,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = -200;
    
    //adjust the depth
    cloud.depth = runner.depth;
    runner.depth = runner.depth + 1;
    
    cloudsGroup.add(cloud);
  }
}

function reset(){
  gameState = PLAY;
  score = 0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  ground.velocityX = -10
  runner.addAnimation("running", runnerAnimation);
}