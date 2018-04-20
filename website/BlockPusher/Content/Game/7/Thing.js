
GameObject.image = "8356533.png";

GameObject.width = 1;
GameObject.height = 1;

GameObject.friction = 10;
GameObject.bounciness = .5;

GameObject.setup = function () {
    this.velX = Math.random() * 10 - 5;
    this.velY = Math.random() * 10 - 5;
}

GameObject.update = function () {

    let mx = 0;
    let my = 0;

    let speed = 10;

    if (Input.isKeyDown("W") || Input.isKeyDown("ArrowUp")) {
        my -= 1;
    } else if (Input.isKeyDown("S") || Input.isKeyDown("ArrowDown")) {
        my += 1;
    }

    if (Input.isKeyDown("A") || Input.isKeyDown("ArrowLeft")) {
        mx -= 1;
    } else if (Input.isKeyDown("D") || Input.isKeyDown("ArrowRight")) {
        mx += 1;
    }

    if (mx != 0) {
        this.velX = mx * speed;
    }

    if (my != 0) {
        this.velY = my * speed;
    }
}