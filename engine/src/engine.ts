export class Engine{
    // Until we work out engine / site interaction, the engine will require the
    // canvas
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private loopFunctions: { (): void }[] = []; 

    constructor( cnvs: HTMLCanvasElement ){
        this.canvas = cnvs;
        this.context = this.canvas.getContext("2d");
    }

    public registerFunction( func: () => void ): void {
        console.log( "Function received" );
        this.loopFunctions.push( func );
    }

    public gameLoop(): void {
        requestAnimationFrame( this.gameLoop );
        for( let f of this.loopFunctions ){
            console.log( "Calling function" );
            f();
        }
    }
}