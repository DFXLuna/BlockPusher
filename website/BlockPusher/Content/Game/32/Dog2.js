
GameObject.image = "dog_l_a.png";

GameObject.width = 1.5;
GameObject.height = 2;

GameObject.bounciness = 1;

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
    if (collide.side == Collision.Left) {
        this.dir = -1;
    } else if (collide.side == Collision.Right) {
        this.dir = 1;
    }

    if (collide.object && collide.object.player && collide.side != Collision.Bottom) {
        Audio.playSound("fail.wav");
        World.reset();
    }
}

GameObject.render = function() {
    let frame = "a";
    let h = this.height*1;
    let dir = (this.velX > 0) ? "r" : "l";
    Render.drawImage("dog_"+dir+"_"+frame+".png",this.x,this.y,this.width,h);
}