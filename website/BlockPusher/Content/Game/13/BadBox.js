
GameObject.image = "bad.png";

GameObject.width = 1;
GameObject.height = 1;

GameObject.friction = 0;
GameObject.bounciness = 1;

GameObject.setup = function () {
    this.velX = Math.random() * 14 - 7;
    this.velY = -4;
}

GameObject.onCollision = function(collision) {
    if (collision.object && collision.object.paddle) {
        this.remove();
        World.r_score--;
        Audio.playSound("fail.wav");
    } else if (collision.blockType == "ground") {
        this.remove();
        Audio.playSound("bounce.wav");
    } else {
        Audio.playSound("bounce.wav");
    }
}