
GameObject.image = "paddle_b.png";

GameObject.width = 4;
GameObject.height = .8;

GameObject.update = function () {

    let mx = 0;
    let speed = 15;

    if (Input.isKeyDown("ArrowLeft")) {
        mx -= 1;
    } else if (Input.isKeyDown("ArrowRight")) {
        mx += 1;
    }

    this.velX = mx * speed;
}