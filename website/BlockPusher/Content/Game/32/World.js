World.createBlockType("wall", "wall.png");
World.createBlockType("ground", "ground.png");
World.createBlockType("water", "water.png");

Render.blockScale = 30;

World.gravityY= 20;
World.r_score = 0;

World.update = function () {

}

World.drawBackground = function () {
    Render.clear("#88F");
}
