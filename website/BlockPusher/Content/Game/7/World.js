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
    Render.clear("cyan");
}

World.drawForeground = function () {
    Render.drawText("Frame time:" + Time.getDelta() * 1000 + "ms", 10, 50, "navy", "50px serif");
    let cursor = Input.getCursorPos();
    Render.drawText("===> " + cursor.x + " " + cursor.y,10,100);
}
