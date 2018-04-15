World.createBlockType("a", "test.png");
World.createBlockType("b", "test2.jpg");

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
        World.createObject("Thing", 2, 2);
        //Audio.playSound("moonspeak.wav");
    } else if (Input.wasKeyReleased("X")) {
        Render.clear("cyan");
        //Audio.playSound("zinger.wav");
    } else {
        Render.clear("pink");
    }
}

World.drawForeground = function () {
    Render.drawText("Frame time:" + Time.getDelta() * 1000 + "ms", 10, 50, "navy", "50px serif");
    let cursor = Input.getCursorPos();
    Render.drawText("===> " + cursor.x + " " + cursor.y,10,100);
}
