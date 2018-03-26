import { Block } from "./block"

// TODO
// Allow user strings to map into block features
export class World {
    private world: number[][]; // Maps coordinates to block type
    private blockMap: Map< number, Block >; // Maps index to corresponding block features
    private sizeX: number;
    private sizeY: number;
    private currentBlockId: number;

    constructor( sizeX: number, sizeY: number ){
        this.world = new Array( sizeX );
        
        for( let i = 0; i < sizeX; i++ ){
            this.world[i] = new Array( sizeY );
            for( let j = 0; j < sizeY; j++ ){
                this.world[i].push( -1 );
            }
        }

        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.currentBlockId = 0;
    }

}