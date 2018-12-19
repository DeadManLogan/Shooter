/*var Level1 = {
preload: function() {

  //  We need this because the assets are on github pages
  //  Remove the next 2 lines if running locally
  //game.load.baseURL = 'https://deadmanlogan.github.io/Shooter/';
  //game.load.crossOrigin = 'anonymous';

  //Menu
  this.load.image('titlescreen', 'menu/Titlescreen.png');
  this.load.image('level1', 'menu/level1.png');
  this.load.image('level2', 'menu/level2.png');

  //loading sounds
  this.load.audio('theme' , 'sounds/theme/theme.ogg');
  this.load.audio('shooting' , 'sounds/shots/shooting.ogg');
  this.load.audio('gameover' , 'sounds/gameover.ogg');
  this.load.audio('explosion' , 'sounds/explosion.ogg');

  //adding enemies
  game.load.image('foe1', '/assets/enemies/enemy2.png');
  game.load.image('foe2', '/assets/enemies/enemy3.png');

  game.load.image('starfield', 'assets/starfield.png');
  game.load.image('ship', 'assets/ship.png');
  game.load.image('bullet', 'assets/bullets/bullet.png');
  game.load.spritesheet('explosion', '/assets/explode.png', 128, 128);
  game.load.bitmapFont('spacefont', '/assets/spacefont/font.png', '/assets/spacefont/font.fnt');
  game.load.image('enemyBullet', '/assets/bullets/death-ray.png');

}

create: function() {

  this.state.start('Menu');

  game.scale.pageAlignHorizontally = true;

  //adding sounds
  theme = game.add.audio('theme');
  shooting = game.add.audio('shooting');
  theme.loopFull();
  theme.play();
  gameover = game.add.audio('gameover');
  explosionsound = game.add.audio('explosion');

  //  The scrolling starfield background
  starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

  //  Our bullet group
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet');
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 1);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);

  //  The hero!
  player = game.add.sprite(0, game.height / 3, 'ship');
  player.health = 100;
  player.anchor.setTo(0.5, 0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
  player.body.drag.setTo(DRAG, DRAG);
  player.events.onKilled.add(function(){
     shipTrail.kill();
 });
   player.events.onRevived.add(function(){
     shipTrail.start(false, 5000, 10);
 });

 //  Blue enemy's bullets
blueEnemyBullets = game.add.group();
blueEnemyBullets.enableBody = true;
blueEnemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
blueEnemyBullets.createMultiple(30, 'enemyBullet');
blueEnemyBullets.callAll('crop', null, {x: 90, y: 0, width: 90, height: 70});
blueEnemyBullets.setAll('alpha', 0.9);
blueEnemyBullets.setAll('anchor.x', 0.5);
blueEnemyBullets.setAll('anchor.y', 0.5);
blueEnemyBullets.setAll('outOfBoundsKill', true);
blueEnemyBullets.setAll('checkWorldBounds', true);
blueEnemyBullets.forEach(function(enemy){
    enemy.body.setSize(20, 20);
});

  //Enemies
  foe1 = game.add.group();
  foe1.enableBody = true;
  foe1.physicsBodyType = Phaser.Physics.ARCADE;
  foe1.createMultiple(5, 'foe1');
  foe1.setAll('anchor.x', 0.5);
  foe1.setAll('anchor.y', 0.5);
  foe1.setAll('scale.x', 0.75);
  foe1.setAll('scale.y', 0.75);
  foe1.setAll('angle', 0);
  foe1.forEach(function(foe){
    addFoeEmitterTrail(foe);
    foe.body.setSize(foe.width * 3 / 4, foe.height * 3 / 4);
    foe.damageAmount = 20;
    foe.events.onKilled.add(function(){
        foe.trail.kill();
  });
});

  launchFoe1();
  game.time.events.add(1000, launchFoe1);

  //enemies 2
 foe2 = game.add.group();
 foe2.enableBody = true;
 foe2.physicsBodyType = Phaser.Physics.ARCADE;
 foe2.createMultiple(30, 'foe2');
 foe2.setAll('anchor.x', 0.5);
 foe2.setAll('anchor.y', 0.5);
 foe2.setAll('scale.x', 1.0);
 foe2.setAll('scale.y', 1.0);
 foe2.setAll('angle', 0);
 foe2.forEach(function(foe){
     foe.damageAmount = 40;
 });

// deletion game.time.events.add(1000, launchFoe2);

  //  And some controls to play the game with
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  //  Add an emitter for the ship's trail
  shipTrail = game.add.emitter(player.x - 20, player.y, 400);
  shipTrail.height = 10;
  shipTrail.makeParticles('bullet');
  shipTrail.setYSpeed(20, -20);
  shipTrail.setXSpeed(-140, -120);
  shipTrail.setRotation(50, -50);
  shipTrail.setAlpha(1, 0.01, 800);
  shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000,
      Phaser.Easing.Quintic.Out);
  shipTrail.start(false, 5000, 10);

      //  An explosion pool
 explosions = game.add.group();
 explosions.enableBody = true;
 explosions.physicsBodyType = Phaser.Physics.ARCADE;
 explosions.createMultiple(30, 'explosion');
 explosions.setAll('anchor.x', 0.5);
 explosions.setAll('anchor.y', 0.5);
 explosions.forEach( function(explosion) {
     explosion.animations.add('explosion');
});

//  Shields stat
 armor = game.add.bitmapText(game.world.width - 350, 10, 'spacefont', '' + player.health +'%', 50);
 armor.render = function () {
     armor.text = 'Shield: ' + Math.max(player.health, 0) +'%';
 };
 armor.render();

  //  Score
  scoreText = game.add.bitmapText(10, 10, 'spacefont', '', 50);
  scoreText.render = function () {
      scoreText.text = 'Score: ' + score;
 };
 scoreText.render();

 //GunLevel
 /*gunLevel = game.add.bitmapText(0,550, 'spacefont', '',30);
 gunLevel.render = function () {
   gunLevel.text = 'Weapon Level: ' + gun;
 };
 gunLevel.render();*/


 //  Game over text
 gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
 gameOver.x = gameOver.x - gameOver.textWidth / 2;
 gameOver.y = gameOver.y - gameOver.textHeight / 3;
 gameOver.visible = false;

}

update:function() {

  //  Scroll the background
  starfield.tilePosition.x -= 2;

  //  Reset the player, then check for movement keys
  player.body.acceleration.y = 0;
  player.body.acceleration.x = 0;

  if (cursors.up.isDown) {
    player.body.acceleration.y = -ACCLERATION;
  } else if (cursors.down.isDown) {
    player.body.acceleration.y = ACCLERATION;
  } else if (cursors.left.isDown) {
    player.body.acceleration.x = -ACCLERATION;
  } else if (cursors.right.isDown) {
    player.body.acceleration.x = ACCLERATION;
  }

  //  Stop at screen edges
  if (player.x > game.width - 30) {
    player.x = game.width - 30;
    player.body.acceleration.x = 0;
  }
  if (player.x < 30) {
    player.x = 30;
    player.body.acceleration.x = 0;
  }
  if (player.y > game.height - 15) {
    player.y = game.height - 15;
    player.body.acceleration.y = 0;
  }
  if (player.y < 15) {
    player.y = 15;
    player.body.acceleration.y = 0;
  }

  //  Fire bullet
  if (player.alive && (fireButton.isDown || game.input.activePointer.isDown)) {
    fireBullet();
  }

  //  Keep the shipTrail lined up with the ship
  shipTrail.y = player.y;
  shipTrail.x = player.x - 20;

      //  Check collisions
  game.physics.arcade.overlap(player, foe1, shipCollide, null, this);
  game.physics.arcade.overlap(foe1, bullets, hitFoe, null, this);

  //foes 2
  game.physics.arcade.overlap(player, foe2, shipCollide, null, this);
  game.physics.arcade.overlap(bullets, foe2, hitFoe, null, this);

  game.physics.arcade.overlap(blueEnemyBullets, player, enemyHitsPlayer, null, this);

  //  Game over?
 if (! player.alive && gameOver.visible === false) {
     gameOver.visible = true;
     gameOver.alpha = 0;
     var fadeInGameOver = game.add.tween(gameOver);
     fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
     fadeInGameOver.onComplete.add(setResetHandlers);
     fadeInGameOver.start();
     theme.stop();
     gameover.play();
     function setResetHandlers() {
         //  The "click to restart" handler
         tapRestart = game.input.onTap.addOnce(_restart,this);
         spaceRestart = fireButton.onDown.addOnce(_restart,this);
         function _restart() {
           tapRestart.detach();
           spaceRestart.detach();
           restart();
         }
     }
 }

}

function render() {


      // for (var i = 0; i < greenEnemies.length; i++)// {
            //     game.debug.body(greenEnemies.children[i]);
     // }
     // game.debug.body(player);
}
}
