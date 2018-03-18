export namespace Render {
    
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let imageCache: {[key: string]: HTMLImageElement};

    export function setup(canvasName: string) {
        canvas = <HTMLCanvasElement>document.getElementById(canvasName);
        
        let temp = canvas.getContext("2d");
        if( temp !== null ){
            context = temp;
        }
        else{
            throw "Could not get context from canvas";
        }

        imageCache = {};
    }
    
    export function clear(): void {
        // TODO fillstyle instead?
        context.clearRect( 0, 0, canvas.width, canvas.height );
    }

    export function drawRect(style: string, x: number, y: number, width: number, length: number ): void {
        context.strokeRect( x, y, width, length );
    }

    export function drawCircle(style: string, x: number, y: number, radius: number ): void {
        context.fillStyle = style;
        context.beginPath();
        context.arc( x, y, radius, 0, Math.PI * 2 );
        context.fill();
    }

    export function drawCircleOutline(style: string, x: number, y: number, radius: number, lineWidth = 1): void {
        context.strokeStyle = style;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.arc( x, y, radius, 0, Math.PI * 2 );
        context.stroke();
    }

    /*public registerImage( filename: string, friendlyName: string ): void {
        console.log("registering " + friendlyName);
        let i =  new Image();
        i.src = filename;
        this.imageCache.set( friendlyName, i );
    }*/

    /*public addToQueue( friendlyName: string ){
        this.drawQueue.push( friendlyName );
    }*/

    export function drawImage( friendlyName: string ): void {
        //console.log( "Draw called on " + friendlyName );
        let img = imageCache[ friendlyName ];
        if( img !== undefined ){
            //console.log( "Attempting to draw " + friendlyName );
            context.drawImage( img, 0, 0 );
        }
        else{
            // TODO cache the image.
            throw "Tried to draw image that does not exist: " + friendlyName;
        }
    }
}