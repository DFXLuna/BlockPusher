import { Render } from "./render";
import { Input }    from "./input";
import { World as WorldBase }    from "./world";
import { Time }     from "./time";
import { AudioComponent as Audio } from "./audio";

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

    Time.update();

    if (isPlaying) { 
        // Only call when game is running
        World.update();
    } else {
        World.updateEdit();
    }

    let showGrid = !isPlaying;

    World.drawBackground();
    Render.setWorldRenderOffset(0,0);
    World.render(showGrid);
    Render.disableWorldRender();
    // TODO render objects with offsets
    World.drawForeground();

    // Input must update here so between-frame inputs
    // can be collected.
    Input.update();
}
doFrame();

// Sends our object list to the editor.
// Call on any update to a file, or after a reload.
function updateEditorObjectList() {

    let list = {
        blocks: World.getBlockTypes(),
        objects: {}
    };

    window.parent.postMessage({type: "setObjectList", list: list},"*");
}

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

        function isAudioFile(fileName: string) {
            return fileName.match(/\.(wav|mp3)$/i) !== null;
        }

        if (msg.file=="World.js") {
            if (msg.url == null) {
                // The world file was deleted.
                // We block doing this in the editor, so this shouldn't happen.
                return;
            }
            
            let res = await fetch(msg.url);
            let code = await res.text();

            let f = new Function("World","Render","Audio","Time","Input",code);
            f(WorldClass,Render,Audio,Time,Input);
        } else if (isImageFile(msg.file)) {
            Render.registerImage(msg.file,msg.url);
        } else if (isAudioFile(msg.file)) {
            Audio.registerSound(msg.file, msg.url);
        } else {
            console.log("Unhandled file: ",msg.file);
        }

        updateEditorObjectList();
    } else if (msg.type == "setMode") {
        isPlaying = msg.play;
        // TODO reset logic:
        // save level if currently in edit mode
        // reload all classes from saved code
        // reload saved level
        Render.setAllowNormalCameraControl(isPlaying);
    } else if (msg.type == "selectObject") {
        World.setEditorObject(msg.obj_type, msg.name);
    } else {
        console.log("Unhandled message: ",msg);
    }
});

// Send a message to the parent window when the engine is ready.
window.parent.postMessage({type: "engineReady"},"*");