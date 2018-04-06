import { Render } from "./render";
import { Input }    from "./input";
import { World as WorldBase }    from "./world";
import { Time }     from "./time";

const CANVAS_NAME = "game-canvas";

let isPlaying = false;

// WorldBase = (ctor of) engine-defined base class
// WorldClass = editor-defined class
// World = actual instance visible to GameObjects & world's own methods
let WorldClass = new WorldBase(30,30);
let World = <WorldBase>Object.create(WorldClass);

// COMPONENT SETUP
Render.setup(CANVAS_NAME);

// GAME 'LOOP'
function doFrame( time = 0 ) {
    window.requestAnimationFrame(doFrame);

    { // Only call when game is running
        Time.update();
        Input.update();
        World.update();
    }

    let showGrid = !isPlaying;

    World.drawBackground();
    Render.setWorldRenderOffset(0,0);
    World.render(showGrid);
    Render.disableWorldRender();
    // TODO render objects with offsets
    World.drawForeground();
}
doFrame();

// For clearing prototypes.
function clearObject(obj: object) {
    for (var k in obj) {
        if ((<any>obj).hasOwnProperty(k))
            delete (<any>obj)[k];
    }
}

// CALLS FROM THE PARENT CONTEXT
window.addEventListener("message", async function (event: MessageEvent) {
    if (event.origin != location.origin)
        return;

    let msg = event.data;

    if (msg.type == "setFile") {
        // Less trashy than the implementations in the engine.
        // TODO move this to some util library?
        function isImageFile(fileName: string) {
            return fileName.match(/\.(png|gif|jpe?g)$/i) !== null;
        }

        if (msg.file=="World.js") {
            if (msg.url == null) {
                // The world file was deleted.
                // We block doing this in the editor, so this shouldn't happen.
                return;
            }
            
            let res = await fetch(msg.url);
            let code = await res.text();

            let f = new Function("World","Render","Time","Input",code);
            f(WorldClass,Render,Time,Input);
        } else if (isImageFile(msg.file)) {
            Render.registerImage(msg.file,msg.url);
        } else {
            console.log("Unhandled file: ",msg.file);
        }
    } else if (msg.type == "setMode") {
        isPlaying = msg.play;
    } else {
        console.log("Unhandled message: ",msg);
    }
});

// Send a message to the parent window when the engine is ready.
window.parent.postMessage("engineReady","*");