export class Renderer{
    
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private imageCache: Map< string, HTMLImageElement >;
    private drawQueue: Array< string >;

    constructor( canvasName:string ){
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasName);

        let temp = this.canvas.getContext("2d");
        if( temp !== null ){
            this.context = temp;
        }
        else{
            throw "Could not get context from canvas";
        }

        this.imageCache = new Map();
        this.drawQueue = [];
    }
    
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

    public registerImage( filename: string, friendlyName: string ): void {
        console.log("registering " + friendlyName);
        let i =  new Image();
        i.src = filename;
        this.imageCache.set( friendlyName, i );
    }

    public addToQueue( friendlyName: string ){
        this.drawQueue.push( friendlyName );
    }

    private drawImage( friendlyName: string ): void {
        console.log( "Draw called on " + friendlyName );
        let i = this.imageCache.get( friendlyName );
        if( i !== undefined ){
            console.log( "Attempting to draw " + friendlyName );
            this.context.drawImage( i, 0, 0 );
        }
        else{
            throw "Tried to draw image that does not exist: " + friendlyName;
        }
    }

    public draw() : void{
        this.clear();
        for( let s of this.drawQueue ){
            this.drawImage( s );
        }
    }

}