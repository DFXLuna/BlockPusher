import { Render } from "./render";
import { WorldBase } from "./world";

const CANVAS_NAME = "game-canvas";

let World = Object.create(WorldBase);

// COMPONENT SETUP
Render.setup(CANVAS_NAME);

// USER-DEFINABLE TICK FUNCTION [CODE EVAL TEST]
//let tickFunction : Function = () => {}

// GAME 'LOOP'
function doFrame( time = 0 ) {
    window.requestAnimationFrame(doFrame);

    World.update(); // <- only call when world is running    
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
function onMessage(event: MessageEvent) {
    if (event.origin != location.origin)
        return;

    let msg = event.data;

    if (msg.type == "runCode") {
        if (msg.file="World.js") {
            // when restarting the game we want to straight-up clear all prototypes and reload their code.
            // otherwise just run the user code over
            let f = new Function("World","Render",msg.code);
            f(World,Render);
        }
    }
}

addEventListener("message", onMessage, false);

// CONTENT PATH
function setContentPath(path: string) {
    Render.setImagePath(path);
}

setContentPath("/Content/asset_test/");

/*export class Engine{

    //private loopFunctions: { (): void }[] = [];
    private boundGameLoop: ( timestamp: number ) => void;
    //private renderer: Renderer;
    private contentPath: string;

    constructor( canvasName: string ){
        Render.setup(canvasName);
        this.boundGameLoop = this.gameLoop.bind( this );
    }
    /*
    public registerFunction( func: () => void ): void {
        this.loopFunctions.push( func );
    }
    *
    public gameLoop( timestamp: number = 0 ): void {
        window.requestAnimationFrame( this.boundGameLoop );

        //World.update();
        //World.draw();
    }
    /*
    public registerImage( filename: string, friendlyName: string ): void {
        this.renderer.registerImage( filename ,friendlyName );
    }
    *
    public setContentPath( path: string ) {
        this.contentPath = path;
    }
    /*
    public requestDraw( friendlyName: string ){
        this.renderer.addToQueue( friendlyName );
    }
    *
    private draw() : void{
        
    }
    
}*/

