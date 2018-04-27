
GameObject.image = "player.png";

GameObject.width = 1;
GameObject.height = 1;

GameObject.player = true;

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

    if (this.isOnGround && Input.wasKeyPressed("W")) {
        this.velY = -10;
    }
}