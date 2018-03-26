import { Renderer } from "./renderer";
import { Input }    from "./input";
import { World }    from "./world";
import { Time }     from "./time";

export class Engine{

    private loopFunctions: { (): void }[] = [];
    private boundGameLoop: ( timestamp: number ) => void;
    private renderer: Renderer;
    private input: Input;
    private time: Time;
    private world: World;


    constructor( canvasName: string ){
        this.renderer = new Renderer( canvasName );
        this.boundGameLoop = this.gameLoop.bind( this );
        this.input = new Input();
        this.time = new Time();
        this.world = new World( 10, 10, this.renderer );
    }

    public gameLoop( timestamp: number = 0 ): void {
        window.requestAnimationFrame( this.boundGameLoop );
        this.time.onFrame();
        this.input.onFrame();
        this.world.onFrame();
        // console.log( "Last Frame time " + this.getLastFrameTime() );
        // console.log( "Delta time " + this.getDeltaTime() );
        for( let f of this.loopFunctions ){
            f();
        }
        this.draw();
    }

    public registerFunction( func: () => void ): void {
        this.loopFunctions.push( func );
    }

    // Rendering Functions

    public registerImage( filename: string, friendlyName: string ): void {
        this.renderer.registerImage( filename ,friendlyName );
    }
    
    public requestDraw( friendlyName: string, x: number, y: number ){
        this.renderer.addToQueue( friendlyName, x, y );
    }
    
    private draw() : void{
        this.renderer.draw();
    }
    
    // Input Functions

    public isKeyDown( keyValue: string ): boolean {
        let ret: boolean = this.input.isKeyDown( keyValue );
        // console.log( "key " + keyValue + " is " + ret );
        return ret;
    }

    public wasKeyDown( keyValue: string ): boolean {
        let ret: boolean = this.input.wasKeyDown( keyValue );
        // console.log( "key " + keyValue + " was " + ret );
        return ret;
    }

    // Time Functions
    public getLastFrameTime(): number {
        return this.time.getLastFrameTime();
    }

    public getDeltaTime(): number {
        return this.time.getDeltaTime();
    }

}