import { Block } from "./block"
import { Render } from "./render"

// TODO
// Allow user strings to map into block features
// Block image prepping

// Base for World.
export class World {
    private world: number[][]; // Maps coordinates to block type
    private blockMap: Array< Block >; // Maps block id to block type
    private sizeX: number;
    private sizeY: number;
    private currentBlockId: number;
    private blockSize = 25; // square block size in pixels
    
    constructor( sizeX: number, sizeY: number ) {
        this.world = new Array( sizeX );
        
        for( let i = 0; i < sizeX; i++ ){
            this.world[i] = new Array( sizeY );
            for( let j = 0; j < sizeY; j++ ){
                this.world[i].push( -1 );
            }
        }

        this.blockMap = new Array< Block >();
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.currentBlockId = 0;
        this.blockSize = 25;
    }

    public update(): void {

	}

	public render(): void {
		// for( let i = 0; i < this.sizeX; i++ ){
        //     for( let j = 0; j < this.sizeY; j++ ){
        //         if( this.world[i][j] != -1 ){
        //             let b = this.blockMap.get( this.world[i][j] );
        //             if( b !== undefined ){
        //                 b.renderAt( this.blockSize * i, this.blockSize * j );
        //             }
        //         }
        //     }
        // }
    }
    
    public createBlockType( name: string, imageFilename: string ): void {
        this.blockMap[this.currentBlockId] = new Block( this.currentBlockId, name, imageFilename );
        this.currentBlockId++;
    }

    public getBlockType( id: number ): Block | null {
        if( id >= this.blockMap.length ){
            return this.blockMap[id];
        }
        return null;
    }
}
