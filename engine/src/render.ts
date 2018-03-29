export namespace Render {
    
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let imageCache: {[path: string]: HTMLImageElement};
    let imagePath = "";
    let cameraX = 0;
    let cameraY = 0;

    export function setup(canvasName: string) {
        canvas = <HTMLCanvasElement>document.getElementById(canvasName);
        
        let temp = canvas.getContext("2d");
        if( temp !== null ){
            context = temp;
        }
        else{
            throw new Error("Could not get context from canvas");
        }

        imageCache = {};
    }

    export function setImagePath(path: string) {
        imagePath = path;
    }

    export function setCameraPos(x: number, y: number) {
        cameraX = x;
        cameraY = y;
    }

    export function setWorldRenderOffset(worldOffsetX: number, worldOffsetY: number) {
        // TODO offset correctly
        context.setTransform(1,0,0,1,-cameraX,-cameraY);
    }

    export function disableWorldRender() {
        context.setTransform(1,0,0,1,0,0);
    }
    
    export function clear(style: string): void {
        if (style == null) {
            context.clearRect( 0, 0, canvas.width, canvas.height );
        } else {
            context.fillStyle = style;
            context.fillRect( 0, 0, canvas.width, canvas.height );
        }
    }

    export function drawRect(style: string, x: number, y: number, width: number, length: number ): void {
        context.fillStyle = style;
        context.fillRect( x, y, width, length );
    }

    export function drawRectOutline(style: string, x: number, y: number, width: number, length: number, lineWidth = 1): void {
        context.strokeStyle = style;
        context.lineWidth = lineWidth;
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

    export function drawLine(style: string, x1: number, y1: number, x2: number, y2: number, lineWidth = 1) {
        context.strokeStyle = style;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.moveTo(x1,y1);
        context.lineTo(x2,y2);
        context.stroke();
    }

    export function registerImage( imageName: string, url: string ): void {
        if (url == null) {
            delete imageCache[ imageName ];
            return;
        }
        let img = new Image();
        img.src = url;
        imageCache[ imageName ] = img;
    }

    export function drawImage( imageName: string, x: number, y: number ): void {
        let img = imageCache[ imageName ];
        if( img == undefined ) {
            return;
        }
        context.drawImage( img, x, y );
    }
}