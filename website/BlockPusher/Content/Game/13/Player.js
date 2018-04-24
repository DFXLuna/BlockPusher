
GameObject.image = "player.png";

GameObject.width = 2;
GameObject.height = 2;

GameObject.paddle = true

GameObject.update = function () {

    let mx = 0;
    let speed = 10;

    if (Input.isKeyDown("A")) {
        mx -= 1;
    } else if (Input.isKeyDown("D")) {
        mx += 1;
    }

    this.velX = mx * speed;
}