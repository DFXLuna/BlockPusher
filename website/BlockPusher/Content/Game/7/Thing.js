
GameObject.setup = function () {
    this.velX = Math.random() - .5;
    this.velY = Math.random() - .5;
}

GameObject.render = function () {
    Render.drawRect("yellow",0,0,10,10);
}
