
GameObject.image = "paddle_r.png";

GameObject.width = 3;
GameObject.height = .8;

GameObject.update = function () {

    let mx = 0;
    let speed = 15;

    if (Input.isKeyDown("A")) {
        mx -= 1;
    } else if (Input.isKeyDown("D")) {
        mx += 1;
    }

    this.velX = mx * speed;
    this.velY = -World.gravityY*Time.getDelta()
}