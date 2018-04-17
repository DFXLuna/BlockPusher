
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
    Render.drawImage(this.image, 0, 0);

    for (var i = 0; i < 4; i++) {
        let dx = 10 * Math.cos(i*1.56+.2);
        let dy = 10 * Math.sin(i*1.56+.2);
        let res = Collision.castRay(this.x+.1, this.y+.1, dx, dy);
        //Collision.castRay(this.x, this.y, 0, 0);

        Render.drawLine(res.hit ? "red" : "white", 0, 0, (res.x - this.x) * Render.blockScale, (res.y - this.y) * Render.blockScale, 5);
        Render.drawLine("blue", 0, 0, dx * Render.blockScale, dy * Render.blockScale, 1);
        if (res.side) {
            Render.drawText(res.side, (res.x - this.x) * Render.blockScale, (res.y - this.y) * Render.blockScale, "magenta", "15px comic sans ms");
        }
    }
}