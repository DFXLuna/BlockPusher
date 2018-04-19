
GameObject.image = "test.png";

GameObject.width = 1;
GameObject.height = 1;

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

    let res = Collision.castBounds(this.x, this.y, this.width, this.height, mx * speed * Time.getDelta(), my * speed * Time.getDelta(), this);
    //console.log(res.x, res.y);
    this.x = res.x;
    this.y = res.y;
}

GameObject.updatePhysics = function () {
    // bunt
}

GameObject.render = function () {
    Render.drawImage(this.image, this.x, this.y, this.width, this.height);

    for (var i = 0; i < 1; i++) {
        let startX = this.x;
        let startY = this.y;

        let dx = 10 * -1;
        let dy = 10 * -1;
        let res = Collision.castBounds(startX, startY, 1, 1, dx, dy, this);
        //Collision.castRay(this.x, this.y, 0, 0);

        Render.drawLine(res.hit ? "red" : "white", startX, startY, res.x, res.y, 5);
        Render.drawLine("blue", startX, startY, this.x+dx, this.y+dy, 1);
        if (res.side) {
            Render.drawText(res.side, res.x, res.y, "magenta", "15px comic sans ms");
        }
    }
}