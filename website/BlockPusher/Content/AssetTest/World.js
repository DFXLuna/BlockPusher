World.createBlockType("a", "test.png");
World.createBlockType("b", "test2.jpg");

for (var x = 0; x < 15; x++)
    for (var y = 0; y < 15; y++)
        World.setBlockTypeAt(x, y, (x + y) % 2 == 0 ? "a" : "b");

World.drawBackground = function () {
    Render.clear("pink");
}

World.drawForeground = function () {
    Render.drawText("Rewrite it in Rust!",400,100);
}
