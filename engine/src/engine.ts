export class Engine{
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private loopFunctions: { (): void }[] = [];
    private boundGameLoop: ( timestamp: number ) => void;

    // Base engine functionality
    constructor( canvasName: string ){
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasName);

        let temp = this.canvas.getContext("2d");
        if( temp !== null ){
            this.context = temp;
        }
        else{
            throw "Could not get context from canvas";
        }

        this.boundGameLoop = this.gameLoop.bind( this );
    }

    public registerFunction( func: () => void ): void {
        this.loopFunctions.push( func );
    }

    public gameLoop( timestamp: number = 0 ): void {
        window.requestAnimationFrame( this.boundGameLoop );
        this.clear();
        // Run user registered functions
        for( let f of this.loopFunctions ){
            f();
        }
    }

    // Rendering functionality
    
    public clear(): void {
        this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    }

    public drawRect( x: number, y: number, width: number, length: number ): void {
        this.context.strokeRect( x, y, width, length );
    }

    public drawCircle( x: number, y: number, radius: number ): void {
        this.context.beginPath();
        this.context.arc( x, y, radius, 0, Math.PI * 2 );
        this.context.stroke();
    }
    
}