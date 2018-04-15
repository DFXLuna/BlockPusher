GameObject.image = "test.png";

GameObject.width = 1.6;
GameObject.height = 1.6;

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

/*GameObject.render = function () {
    Render.drawRect("yellow",0,0,10,10);
}*/