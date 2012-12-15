
function init_bandit() {
    var mainScene;

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
        this.element = this.createElement(),
                animation = canvas.Animation.new({
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
                        kick: {
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
                        }
                    }
                });

        register_keys();

        animation.add(this.element);
        animation.play("idle", "loop");
        
        this.element.xspeed = 0;
        this.element.yspeed = 0;
        this.element.defaultspeed = 2;
        this.element.scaleX = 2;
        this.element.scaleY = 2;

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

        stage.append(this.element);
        stage.append(h);
        stage.append(this.health);
        stage.append(el);
      },
      render: function(stage) {
        this.element.defaultspeed = 2;
        this.element.x += this.element.xspeed;
        this.element.y += this.element.yspeed;
        reduce_health(0.5);
        stage.refresh();
      }
    });

    function set_health(percent) {
      mainScene.health.scaleX=percent;
      if (percent==0) {
        animation.stop();
        animation.play('die', 10);
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

    function register_keys() {
      function anim_idle() {
        animation.stop();
        animation.play("idle", "loop");
      }
      function anim_walk() {
        animation.stop();
        animation.play("walk");
      }
      
      canvas.Input.keyDown(Input.Up, function() {
          mainScene.element.yspeed = -mainScene.element.defaultspeed;
          anim_walk();
        });
        canvas.Input.keyUp(Input.Up, function() {
          mainScene.element.yspeed = 0;
          anim_idle();
        });

        canvas.Input.keyDown(Input.Bottom, function() {
          mainScene.element.yspeed = mainScene.element.defaultspeed;
          anim_walk();
        });
        canvas.Input.keyUp(Input.Bottom, function() {
          mainScene.element.yspeed = 0;
          anim_idle();
        });

        canvas.Input.keyDown(Input.Left, function() {
          mainScene.element.xspeed = -mainScene.element.defaultspeed;
          anim_walk();
        });
        canvas.Input.keyUp(Input.Left, function() {
          mainScene.element.xspeed = 0;
          anim_idle();
        });

        canvas.Input.keyDown(Input.Right, function() {
          mainScene.element.xspeed = mainScene.element.defaultspeed;
          anim_walk();
        });
        canvas.Input.keyUp(Input.Right, function() {
          mainScene.element.xspeed = 0;
          anim_idle();
        });

        canvas.Input.keyDown(Input.Space, function() {
          animation.stop();
          animation.play("kick");
        });
        canvas.Input.keyUp(Input.Space, function() {
          anim_idle();
        });
    }

    function playBackgroundMusic(soundfile) {
        var audio = document.createElement('audio');
        audio.setAttribute('controls', 'controls');
        audio.src = soundfile;
        audio.play();
    }
    playBackgroundMusic('music/fight.ogg');
}

