export class Engine{
    // Until we work out engine / site interaction, the engine will require the
    // canvas
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private loopFunctions: { (): void }[] = [];
    private boundGameLoop: ( timestamp: number ) => void;

    constructor( canvasName: string ){
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasName);
        this.context = this.canvas.getContext("2d");
        this.boundGameLoop = this.gameLoop.bind( this );
    }

    public registerFunction( func: () => void ): void {
        this.loopFunctions.push( func );
    }

    public gameLoop( timestamp: number = 0 ): void {
        window.requestAnimationFrame( this.boundGameLoop );
        // Clear canvas
        if( this.context !== null ){
            this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
        }
        // Run user registered functions
        for( let f of this.loopFunctions ){
            f();
        }
    }
    
    // ONLY FOR PROTOTYPING
    public tryGetContext(): CanvasRenderingContext2D | null {
        return this.context;
    }
}