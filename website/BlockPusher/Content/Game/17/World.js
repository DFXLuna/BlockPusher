World.createBlockType("wall", "wall.png");
World.createBlockType("ground", "ground.png");

Render.blockScale = 30;

World.gravityY= 15;
World.r_score = 0;

World.update = function () {
    Render.setCameraPos(8,8);
    if (Math.random()<.03) {
        World.createObject(Math.random()>.5?"GoodBox":"BadBox",
            2+Math.random()*11,0);
    }
}

World.drawBackground = function () {
    Render.clear("skyblue");
}

World.drawForeground = function () {
    Render.drawText("Score: " + this.r_score, 10, 50, "green", "30px sans-serif");
}
