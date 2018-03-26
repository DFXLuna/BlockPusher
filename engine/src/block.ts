import { Renderer } from "./renderer"

export class Block {
    private blockid: number;
    private name: string;
    private imageFilename: string;
    private renderer: Renderer;
    private imageName: string;

    constructor( blockid: number, name: string, imageFilename: string, renderer: Renderer ){
        this.blockid = blockid;
        this.name = name;
        this.imageFilename = imageFilename;
        this.renderer = renderer;
        this.imageName = "$Block" + blockid + name + "$";
        this.renderer.registerImage( imageFilename, this.imageName );
    }

    public renderAt( x: number, y: number ){
        this.renderer.addToQueue( this.imageName, x, y );
    }
}