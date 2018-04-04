import { Block } from "./block"
import { Render } from "./render"

// TODO
// Allow user strings to map into block features
// Block image prepping

// Base for World.
export class World {
    // I am really not a fan of jagged arrays but it's
    // probably fine here considering they need to be resized.
    private blockMap: number[][];
    private blockIdLookup: Array< Block > = []; // Maps block id to block type
    private blockNameLookup: {[key: string]: Block} = {};
    private sizeX: number;
    private sizeY: number;
    private currentBlockId = 1;
    
    readonly blockScale = 25; // square block size in pixels
    
    constructor( sizeX: number, sizeY: number ) {
        this.blockMap = new Array( sizeX );
        
        for( let i = 0; i < sizeX; i++ ){
            this.blockMap[i] = new Array( sizeY );
            for( let j = 0; j < sizeY; j++ ){
                this.blockMap[i].push( 0 );
            }
        }

        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }

    public update(): void {

	}

	public render(): void {
        // TODO account for camera position here or in calling function
		for ( let x = 0; x < this.sizeX; x++ ) {
            for ( let y = 0; y < this.sizeY; y++ ) {
                //if( this.world[i][j] != -1 ) {
        //             let b = this.blockMap.get( this.world[i][j] );
        //             if( b !== undefined ){
        //                 b.renderAt( this.blockSize * i, this.blockSize * j );
                //}
                // don't use any localization trash here because perf
                let scale = this.blockScale;
                Render.drawRect("cyan",x*scale,y*scale,scale,scale);
            }
        }
    }
    
    public createBlockType( name: string, imageFilename: string ): void {

        let block = this.getBlockTypeInfo(name);

        if (block != null) {
            // If the block exists, update the image.
            block.imageFilename = imageFilename;
        } else {
            // Otherwise, make a new block.
            block = new Block( this.currentBlockId++, name, imageFilename );

            this.blockIdLookup[block.blockid] = block;
            this.blockNameLookup[block.name] = block;
        }
    }
    
    public getBlockTypeInfo( name: string ): Block | null {
        return this.blockNameLookup[name];
    }

    private getBlockTypeInfoById( id: number ): Block | null {
        if( id < this.blockIdLookup.length ){
            return this.blockIdLookup[id];
        }
        return null;
    }

    public getBlockTypeAt( x: number, y: number ): string | null {
        x = Math.floor(x);
        y = Math.floor(y);

        if (x >= 0 && y >= 0 && x < this.sizeX && y < this.sizeY ) {
            let block = this.getBlockTypeInfoById( this.blockMap[x][y] );
            if (block != null)
                return block.name;
        }
        return null;
    }

    public setBlockTypeAt( x: number, y: number, blockType: string | null ) {
        x = Math.floor(x);
        y = Math.floor(y);

        let blockId: number;
        if (blockType != null) {
            let block = this.getBlockTypeInfo(blockType);
            if (block == null) {
                throw new Error("Attempt to set invalid block in World.");
            }
            blockId = block.blockid;
        } else {
            blockId = 0;
        }

        this.blockMap[x][y] = blockId;
    }
    
}
