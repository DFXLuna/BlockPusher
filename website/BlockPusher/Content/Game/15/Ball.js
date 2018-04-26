
GameObject.image = "ball.png";

GameObject.width = .5;
GameObject.height = .5;

GameObject.friction = 0;
GameObject.bounciness = 1;

GameObject.setup = function () {
    this.x = 8;
    this.y = 8;
    this.velX = 0;
    this.velY = Math.random() > .5 ? 6 : -6;
}

GameObject.onCollision = function(collision) {
    this.velX += Math.random()*10-5;
    this.velY *= 1.01;
    
    if (collision.blockType == "wall_r") {
        World.b_score++;
        this.setup();
        Audio.playSound("fail.wav");
    } else if (collision.blockType == "wall_b") {
        World.r_score++;
        this.setup();
        Audio.playSound("fail.wav");
    } else {
        Audio.playSound("bounce.wav");
    }
}