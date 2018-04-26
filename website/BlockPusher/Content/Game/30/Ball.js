
GameObject.image = "ball.png";

GameObject.width = .5;
GameObject.height = .5;

GameObject.friction = 0;
GameObject.bounciness = 1;

GameObject.setup = function () {
    this.velX = 0;
    this.velY = 6;
}

GameObject.onCollision = function(collision) {
    this.velX += Math.random()*10-5;
    this.velY *= 1.001;
    
    if (collision.blockType == "wall_r") {
        World.reset();
        Audio.playSound("fail.wav");
    } else if (collision.blockType == "wall_b") {
        World.setBlockTypeAt(collision.blockX,collision.blockY,null);
        World.r_score++;
        Audio.playSound("score.wav");
        if (World.r_score>=60) {
            World.reset();
        }
    } else {
        Audio.playSound("bounce.wav");
    }
}