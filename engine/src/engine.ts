import { Renderer } from "./renderer";
import { Input }    from "./input";

export class Engine{

    private loopFunctions: { (): void }[] = [];
    private boundGameLoop: ( timestamp: number ) => void;
    private renderer: Renderer;
    private input: Input;

    constructor( canvasName: string ){
        this.renderer = new Renderer( canvasName );
        this.boundGameLoop = this.gameLoop.bind( this );
        this.input = new Input();
    }

    public registerFunction( func: () => void ): void {
        this.loopFunctions.push( func );
    }

    public gameLoop( timestamp: number = 0 ): void {
        window.requestAnimationFrame( this.boundGameLoop );
        this.input.onFrame();
        for( let f of this.loopFunctions ){
            f();
        }
        this.draw();
    }
    // Rendering methods

    public registerImage( filename: string, friendlyName: string ): void {
        this.renderer.registerImage( filename ,friendlyName );
    }
    
    public requestDraw( friendlyName: string ){
        this.renderer.addToQueue( friendlyName );
    }
    
    private draw() : void{
        this.renderer.draw();
    }
    
    // Input Methods

    public isKeyDown( keyValue: string ): boolean {
        let ret: boolean = this.input.isKeyDown( keyValue );
        console.log( "key " + keyValue + " is " + ret );
        return ret;
    }

    public wasKeyDown( keyValue: string ): boolean {
        let ret: boolean = this.input.wasKeyDown( keyValue );
        console.log( "key " + keyValue + " was " + ret );
        return ret;
    }
}