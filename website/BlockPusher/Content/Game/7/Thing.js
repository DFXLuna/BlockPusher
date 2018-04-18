
GameObject.image = "test.png";

GameObject.width = 1.9;
GameObject.height = 1.9;

GameObject.setup = function () {
    this.velX = Math.random() * 10 - 5;
    this.velY = Math.random() * 10 - 5;
}

GameObject.update = function () {
    let results = Collision.checkBounds(this.x, this.y, this.width, this.height);
    results.forEach((result) => {
        if (result != this) {
            result.velX *= .9;
            result.velY *= .9;
        }
    })
}

GameObject.render = function () {
    Render.drawImage(this.image, this.x, this.y, this.width, this.height);

    for (var i = 0; i < 4; i++) {
        let startX = this.x + .1;
        let startY = this.y + .1;

        let dx = 10 * Math.cos(i * 1.56 + .2);
        let dy = 10 * Math.sin(i*1.56+.2);
        let res = Collision.castRay(startX, startY, dx, dy, this);
        //Collision.castRay(this.x, this.y, 0, 0);

        Render.drawLine(res.hit ? "red" : "white", startX, startY, res.x, res.y, 5);
        Render.drawLine("blue", startX, startY, this.x+dx, this.y+dy, 1);
        if (res.side) {
            Render.drawText(res.side, res.x, res.y, "magenta", "15px comic sans ms");
        }
    }
}