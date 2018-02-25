import { Renderer } from "./renderer";

export class Engine{

    private loopFunctions: { (): void }[] = [];
    private boundGameLoop: ( timestamp: number ) => void;
    private renderer: Renderer;

    constructor( canvasName: string ){
        this.renderer = new Renderer( canvasName );
        this.boundGameLoop = this.gameLoop.bind( this );
    }

    public registerFunction( func: () => void ): void {
        this.loopFunctions.push( func );
    }

    public gameLoop( timestamp: number = 0 ): void {
        window.requestAnimationFrame( this.boundGameLoop );
        // Run user registered functions
        for( let f of this.loopFunctions ){
            f();
        }
        this.draw();
    }

    public registerImage( filename: string, friendlyName: string ): void {
        this.renderer.registerImage( filename ,friendlyName );
    }
    
    public requestDraw( friendlyName: string ){
        this.renderer.addToQueue( friendlyName );
    }
    
    private draw() : void{
        this.renderer.draw();
    }
    
}