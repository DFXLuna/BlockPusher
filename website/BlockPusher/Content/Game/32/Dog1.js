
GameObject.image = "dog_l_1.png";

GameObject.width = 1.5;
GameObject.height = 1.5;

GameObject.enemy = true

GameObject.setup = function() {
    this.anim_phase = 0;
    this.dir = Math.random() > .5 ? 1 : -1;
}

GameObject.update = function() {

    this.anim_phase = (this.anim_phase + Time.getDelta()*3) % 1;

    this.velX = this.dir * 2;
}

GameObject.onCollision = function(collide) {
    if (World.getBlockTypeAt(this.x+.5,this.y+1.6) == null) {
        this.dir *= -1;
    }

    if (collide.side == Collision.Left) {
        this.dir = -1;
    } else if (collide.side == Collision.Right) {
        this.dir = 1;
    }

    if (collide.object && collide.object.player) {
        Audio.playSound("fail.wav");
        World.reset();
    }
}

GameObject.render = function() {
    let frame = this.anim_phase>.5 ? 1 : 2;
    let h = this.height;
    /*if (!this.isOnGround) {
        frame = "a";
        h *= 1.5;
    }*/
    let dir = (this.velX > 0) ? "r" : "l";
    Render.drawImage("dog_"+dir+"_"+frame+".png",this.x,this.y,this.width,h);
}