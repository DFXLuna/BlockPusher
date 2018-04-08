World.createBlockType("a", "test.png");
World.createBlockType("b", "test2.jpg");

for (var x = 0; x < 15; x++)
    for (var y = 0; y < 15; y++)
        World.setBlockTypeAt(x, y, (x + y) % 2 == 0 ? "a" : "b");

World.update = function () {
    Render.blockScale = 200 + Math.sin(Time.getTime()) * 190;
}

World.drawBackground = function () {
    if (Input.isMouseButtonDown(1)) {
        Render.clear("black");
    } else if (Input.isMouseButtonDown(2)) {
        Render.clear("white");
    } else if (Input.wasKeyPressed("X")) {
        Render.clear("yellow");
    } else if (Input.wasKeyReleased("X")) {
        Render.clear("cyan");
    } else {
        Render.clear("pink");
    }
}

World.drawForeground = function () {
    Render.drawText("Frame time:" + Time.getDelta() * 1000 + "ms", 10, 50, "navy", "50px serif");
    let cursor = Input.getCursorPos();
    Render.drawText("===> " + cursor.x + " " + cursor.y,10,100);
}
