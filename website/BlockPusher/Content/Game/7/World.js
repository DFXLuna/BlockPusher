World.createBlockType("a", "test.png");
World.createBlockType("b", "test2.jpg");

Render.blockScale = 32;

World.gravityY = 30;

World.update = function () {

}

World.drawBackground = function () {
    Render.clear("cyan");
}

World.drawForeground = function () {
    Render.drawText("Frame time:" + Time.getDelta() * 1000 + "ms", 10, 50, "navy", "50px serif");
    let cursor = Input.getCursorPos();
    Render.drawText("===> " + cursor.x + " " + cursor.y,10,100);
}
