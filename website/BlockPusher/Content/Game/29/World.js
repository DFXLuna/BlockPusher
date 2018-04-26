World.createBlockType("wall", "wall.png");
World.createBlockType("wall_r", "wall_r.png");
World.createBlockType("wall_b", "wall_b.png");

Render.blockScale = 30;

World.r_score = 0;
World.gravityY = 20;

World.setup = function() {
    this.r_score = 0;
    for (var x=2;x<=13;x++) {
        for (var y=1;y<=5;y++) {
            this.setBlockTypeAt(x,y,"wall_b");
        }
    }
}

World.update = function () {
    Render.setCameraPos(8,8);
}

World.drawBackground = function () {
    Render.clear("purple");
}

World.drawForeground = function () {
    let score = 0;
    Render.drawText("Score: " + this.r_score, 10, 50, "black", "60px comic sans ms");
}
