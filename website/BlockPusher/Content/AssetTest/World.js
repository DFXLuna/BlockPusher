// Test Code
World.render = function () {
    Render.clear("yellow");
    for (var i = 1; i < 10; i++)
        Render.drawCircleOutline("red",
			Math.random() * 600,
			Math.random() * 600,
			50, 5);
}
