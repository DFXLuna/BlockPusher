// Test Code
/*World.render = function () {
    Render.clear("yellow");
    for (var i = 1; i < 10; i++)
        Render.drawCircleOutline("red",
			Math.random() * 600,
			Math.random() * 600,
			50, 5);
}*/

World.createBlockType("a", "test.png");
World.createBlockType("b", "test2.jpg");

World.setBlockTypeAt(1, 1, "a");
World.setBlockTypeAt(2, 1, "a");
World.setBlockTypeAt(2, 2, "a");

World.setBlockTypeAt(3, 3, "b");
World.setBlockTypeAt(4, 4, "b");
World.setBlockTypeAt(4, 5, "b");