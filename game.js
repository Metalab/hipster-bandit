function init_bandit() {

    var canvas = CE.defines("game").
      extend(Animation).
      extend(Input).
      ready(function() {
        canvas.Scene.call("MainScene");
        mainScene = canvas.Scene.get('MainScene');
    });

    canvas.Scene.new({
      name: "MainScene",
      materials: {
        images: {
          player: "sprites/cat_sprite.png",
          progress_filled: "textures/progressbar_filled.png",
          progress_empty: "textures/progressbar_empty.png"
        }
      },
      ready: function(stage) {
          this.players = [];

          var that = this;
          function addPlayer(index) {
              var player = that.createElement();
              player.animation = canvas.Animation.new({
                  images: "player",
                  animations: {
                    idle: {
                      frames: [0, 3],
                      size: {
                        width: 64,
                        height: 64
                      },
                      frequence: 5
                    },
                  punch: {
                      frames: [5*16, 5*16+6],
                  size: {
                      width: 64,
                  height: 64
                  },
                  frequence: 3
                  },
                  walk: {
                      frames: [16, 16+5],
                      size: {
                          width: 64,
                          height: 64
                      },
                      frequence: 5
                  },
                  die: {
                      frames: [4*16, 4*16+6],
                      size: {
                          width: 64,
                          height: 64
                      },
                      frequence: 15
                  },
                  dead: {
                      frames: [4*16+6, 4*16+6],
                      size: {
                          width: 64,
                          height: 64
                      },
                      frequence: 1
                  }
                  }
              });

              if (index === 0) {
                  register_keys(player);
              }

              player.animation.add(player);
              player.animation.play("idle", "loop");
              player.xspeed = 0;
              player.yspeed = 0;
              player.defaultspeed = 2;
              player.scaleX = 2;
              player.scaleY = 2;
              console.log(player);
              player.scale(-3,-3);
              stage.append(player);

              return player;
          }

          this.players.push(addPlayer(0));

          // would add remote players like this:
          this.players.push(addPlayer(1));

        var el = this.createElement();
        el.fillStyle = "black";
        el.font = "20px Arial";
        el.textBaseline = "top";
        el.fillText("Health:", 0, 0);

        var h = this.createElement();
        h.drawImage('progress_empty');
        h.scaleX=100;
        h.scaleY=0.5;
        h.x = 80;

        var health = this.createElement();
        health.drawImage('progress_filled');
        health.x = 80;
        health.scaleY=0.5;

        this.health = health;
        set_health(100);

        stage.append(h);
        stage.append(this.health);
        stage.append(el);
      },
      render: function(stage) {
        var i;
        for (i=0; i<this.players.length; i++) {
            var player = this.players[i];
            player.defaultspeed = 2;
            player.x += player.xspeed;
            player.y += player.yspeed;
        }
        reduce_health(0.5);
        stage.refresh();
      }
    });

    function set_health(percent) {
      mainScene.health.scaleX=percent;
      if (percent==0) {
        mainScene.players[0].animation.stop();
        mainScene.players[0].animation.play('die');
        setTimeout(20);
        mainScene.players[0].animation.play('dead');
      }
    }

    function reduce_health(percent) {
      if (mainScene.health.scaleX <= percent) {
        set_health(0);
      }
      else {
        mainScene.health.scaleX -= percent;
      }
    }

    function register_keys(player) {
      function anim_idle() {
        player.animation.stop();
        player.animation.play("idle", "loop");
      }
      function anim_walk() {
        player.animation.stop();
        player.animation.play("walk");
      }

      canvas.Input.keyDown(Input.Up, function() {
          player.yspeed = -player.defaultspeed;
          anim_walk();
        });
        canvas.Input.keyUp(Input.Up, function() {
          player.yspeed = 0;
          anim_idle();
        });

        canvas.Input.keyDown(Input.Bottom, function() {
          player.yspeed = player.defaultspeed;
          anim_walk();
        });
        canvas.Input.keyUp(Input.Bottom, function() {
          player.yspeed = 0;
          anim_idle();
        });

        canvas.Input.keyDown(Input.Left, function() {
          player.xspeed = -player.defaultspeed;
          anim_walk();
        });
        canvas.Input.keyUp(Input.Left, function() {
          player.xspeed = 0;
          anim_idle();
        });

        canvas.Input.keyDown(Input.Right, function() {
          player.xspeed = player.defaultspeed;
          anim_walk();
        });
        canvas.Input.keyUp(Input.Right, function() {
          player.xspeed = 0;
          anim_idle();
        });

        canvas.Input.keyDown(Input.Space, function() {
          player.animation.stop();
          player.animation.play("punch");
          playSound("sounds/punch.ogg");
          set_health(100);
        });
        canvas.Input.keyUp(Input.Space, function() {
          anim_idle();
        });
    }

    function playBackgroundMusic(soundfile) {
        var audio = document.createElement('audio');
        audio.setAttribute('controls', 'controls');
        audio.setAttribute('loop', 'true');
        audio.src = soundfile;
        audio.play();
    }

    function playSound(soundfile) {
        var audio = document.createElement('audio');
        audio.setAttribute('controls', 'controls');
        audio.src = soundfile;
        audio.play();
    }
    
    playBackgroundMusic('music/fight.ogg');
}

