import { World } from "./world";

export namespace Render {
    
    let canvas: HTMLCanvasElement;
    export let context: CanvasRenderingContext2D;
    let imageCache: {[path: string]: HTMLImageElement} = {};
    let imagePath = "";
    // TODO set these to sane defaults based on world scale @ startup???
    let cameraX = 4;
    let cameraY = 4;

    let cameraEnabled = false;

    let allowNormalCameraControl = false;

    export var blockScale = 25;

    export function setup(canvasName: string) {
        canvas = <HTMLCanvasElement>document.getElementById(canvasName);
        
        let temp = canvas.getContext("2d");
        if( temp !== null ){
            context = temp;
        }
        else{
            throw new Error("Could not get context from canvas");
        }
        
        // Canvas resizing
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();

        window.addEventListener("resize", resizeCanvas);
    }

    export function setCameraPos(x: number, y: number, force = false) {
        if (allowNormalCameraControl || force) {
            cameraX = x;
            cameraY = y;
        }
    }

    export function getCameraPos() {
        return {x: cameraX, y: cameraY};
    }

    export function setAllowNormalCameraControl(allow: boolean) {
        allowNormalCameraControl = allow;
    }

    export function enableCamera() {
        cameraEnabled = true;
        context.setTransform(blockScale,0,0,blockScale,
            -cameraX * blockScale + canvas.width/2, 
            -cameraY * blockScale + canvas.height/2);
    }

    export function disableCamera() {
        cameraEnabled = false;
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
        if (cameraEnabled)
            lineWidth /= blockScale;
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
        if (cameraEnabled)
            lineWidth /= blockScale;
        context.strokeStyle = style;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.arc( x, y, radius, 0, Math.PI * 2 );
        context.stroke();
    }

    export function drawLine(style: string, x1: number, y1: number, x2: number, y2: number, lineWidth = 1) {
        if (cameraEnabled)
            lineWidth /= blockScale;
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

    export function findImage( imageName: string ) {
        let img = imageCache[ imageName ];
        return img;
    }

    export function drawImage( imageName: string, x: number, y: number, width?: number, height?: number ): void {
        let img = findImage( imageName );
        if( img == undefined ) {
            return;
        }
        if (width == null) {
            width = cameraEnabled ? img.width / blockScale : img.width;
        }
        if (height == null) {
            height = cameraEnabled ? img.height / blockScale : img.height;
        }
        context.drawImage( img, x, y, width, height );
    }

    export function drawText( text: string, x: number, y: number, style = "black", font = "20px sans-serif") {
        context.fillStyle = style;
        context.font = font;
        
        if (cameraEnabled) {
            // Dealing with font sizes is too much of a pain, just disable the camera.

            disableCamera();

            context.fillText(text, (x - cameraX) * blockScale + canvas.width/2, (y - cameraY) * blockScale + canvas.height/2);

            enableCamera();
        } else {
            context.fillText(text, x, y);
        }
    }
}