import { Render } from "./render";

export class Block {
    blockid: number;
    name: string;
    imageFilename: string;

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
