
GameObject.image = "cat_r_1.png";

GameObject.width = 1;
GameObject.height = 1;

GameObject.player = true;

GameObject.setup = function() {
    this.anim_phase = 0;
}

GameObject.update = function () {

    Render.setCameraPos(this.x,this.y);

    let mx = 0;
    let speed = 10;

    if (Input.isKeyDown("A")) {
        mx -= 1;
    } else if (Input.isKeyDown("D")) {
        mx += 1;
    }

    if (mx != 0 && Math.abs(this.velX) < speed) {
        this.velX += mx;
    } else {
        this.velX *= .9;
    }

    if (mx != 0) {
        this.anim_phase = (this.anim_phase + Time.getDelta()*3) % 1;
    }

    if (this.isOnGround && Input.wasKeyPressed("W")) {
        this.velY = -10;
        Audio.playSound("jump.wav");
    }
}

GameObject.onCollision = function(collide) {
    if (collide.blockType=="water") {
        World.reset();
        Audio.playSound("fail.wav");
    }

    if (collide.object) {
        if (collide.object.enemy) {
            if (collide.side == Collision.Top) {
                Audio.playSound("score.wav");
                collide.object.remove();
            } else {
                Audio.playSound("fail.wav");
                World.reset();
            }
        }
        if (collide.object.goal) {
            Audio.playSound("winner.wav");
            World.reset();
        }
    }
}

GameObject.render = function() {
    let frame = this.anim_phase>.5 ? 1 : 2;
    let h = this.height;
    if (!this.isOnGround) {
        frame = "a";
        h *= 1.5;
    }
    let dir = (this.velX >= 0) ? "r" : "l";
    Render.drawImage("cat_"+dir+"_"+frame+".png",this.x,this.y,this.width,h);
}