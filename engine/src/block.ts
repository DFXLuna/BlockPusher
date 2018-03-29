import { Renderer } from "./renderer"
import { Render } from "./render";

export class Block {
    private blockid: number;
    private name: string;
    private imageFilename: string;

    constructor( blockid: number, name: string, imageFilename: string){
        this.blockid = blockid;
        this.name = name;
        this.imageFilename = imageFilename;
        // this.renderer = renderer;
        // this.imageName = "$Block" + blockid + name + "$"; [thinking emoji]
        // this.renderer.registerImage( imageFilename, this.imageName );
    }

    public renderAt( x: number, y: number ){
        Render.drawImage(this.imageFilename, x, y);
    }
}
