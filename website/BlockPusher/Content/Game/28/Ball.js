
GameObject.image = "newball.png";

GameObject.width = 1.5;
GameObject.height = 1.5;

GameObject.friction = 0;
GameObject.bounciness = .9;

GameObject.setup = function () {
    this.x = 8;
    this.y = 8;
    this.velX = 0;
    this.velY = 6;
}

GameObject.onCollision = function(collision) {
    this.velX += Math.random()*10-5;
    this.velY *= 1.001;
    
    if (collision.blockType == "wall_r") {
        World.b_score++;
        this.setup();
        World.setup();
        Audio.playSound("fail.wav");
    } else if (collision.blockType == "wall_b") {
        World.setBlockTypeAt(collision.blockX,collision.blockY,null);
        World.r_score++;
        Audio.playSound("score.wav");
        if (World.r_score>=60) {
            this.setup();
            World.setup();
        }
    } else {
        Audio.playSound("bounce.wav");
    }
}