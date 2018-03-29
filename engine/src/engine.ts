import { Render } from "./render";
import { Input }    from "./input";
import { World as WorldClass }    from "./world";
import { Time }     from "./time";

const CANVAS_NAME = "game-canvas";

// With the world, user code is allowed to directly add stuff
// to the instance of the class. This is fine because
// there is just one instance.
let World = new WorldClass(10,10);

// COMPONENT SETUP
Render.setup(CANVAS_NAME);

// GAME 'LOOP'
function doFrame( time = 0 ) {
    window.requestAnimationFrame(doFrame);

    { // Only call when game is running
        Time.update();
        World.update();
    }
    
    World.render();
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

            let f = new Function("World","Render","Time",code);
            f(World,Render,Time);
        } else if (isImageFile(msg.file)) {
            Render.registerImage(msg.file,msg.url);
        } else {
            console.log("Unhandled file: ",msg.file);
        }
    } else {
        console.log("Unhandled message: ",msg);
    }
});

// Send a message to the parent window when the engine is ready.
window.parent.postMessage("engineReady","*");