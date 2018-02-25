export class Engine{
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private loopFunctions: { (): void }[] = [];
    private boundGameLoop: ( timestamp: number ) => void;
    private imageCache: Map<string, HTMLImageElement>;

    // FOR TESTING ONLY
    public getContext(): CanvasRenderingContext2D{
        return this.context;
    }

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
        this.imageCache = new Map();
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
        this.draw();
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

    // This might need to change to allow image preloading
    public registerImage( filename: string, friendlyname: string ): HTMLImageElement {
        let i =  new Image();
        i.src = filename;
        this.imageCache.set( friendlyname, i );
        return i;
    }

    public drawImage( friendlyname: string ): void {
        let i = this.imageCache.get( friendlyname );
        if( i !== undefined ){
            this.context.drawImage( i, 0, 0 );
        }
        else{
            throw "Tried to draw image that does not exist: " + friendlyname;
        }
    }

    // For use in the gameloop. Draws all images in queue
    // Right now it just draws the entire cache
    private draw() : void{
        for( let key of this.imageCache.keys() ){
            this.drawImage( key );
        }
    }
    
}