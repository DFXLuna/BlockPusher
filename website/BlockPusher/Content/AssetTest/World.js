World.createBlockType("a", "test.png");
World.createBlockType("b", "test2.jpg");

/*for (var x = 0; x < 15; x++)
    for (var y = 0; y < 15; y++)
        World.setBlockTypeAt(x, y, (x + y) % 2 == 0 ? "a" : "b");*/

Render.blockScale = 32

World.update = function () {
    if (Math.random() > .9) {
        let x = Math.random() * 10;
        let y = Math.random() * 10;

        let btype = Math.random() > .5 ? "a" : "b";
        this.setBlockTypeAt(x, y, btype);
    }
}

World.drawBackground = function () {
    if (Input.wasKeyPressed("X")) {
        Render.clear("yellow");
        Audio.playSound("moonspeak.wav");
    } else if (Input.wasKeyReleased("X")) {
        Render.clear("cyan");
        Audio.playSound("zinger.wav");
    } else {
        Render.clear("pink");
    }
}

World.drawForeground = function () {
    Render.drawText("Frame time:" + Time.getDelta() * 1000 + "ms", 10, 50, "navy", "50px serif");
    let cursor = Input.getCursorPos();
    Render.drawText("===> " + cursor.x + " " + cursor.y,10,100);
}
