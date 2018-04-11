import { Block } from "./block";
import { Render } from "./render";
import { Input } from "./input";
import { Time } from "./time";
import { CodeManager } from "./codemanager";

// TODO
// Allow user strings to map into block features
// Block image prepping

// Base for World.
export class World {
    // I am really not a fan of jagged arrays but it's
    // probably fine here considering they need to be resized.
    private blockMap: number[][] = [];
    private blockIdLookup: Array< Block > = []; // Maps block id to block type
    private blockNameLookup: {[key: string]: Block} = {};
    private sizeX = 0;
    private sizeY = 0;
    private currentBlockId = 1;

    private editObjectType: string | null = null;
    private editObjectName: string | null = null;

    gravityX = 0;
    gravityY = 0;

    public resize( sizeX: number, sizeY: number ) {
        // WARNING: Currently does not preserve block data.

        this.blockMap = [];
        
        for( let i = 0; i < sizeX; i++ ){
            this.blockMap[i] = new Array();
            for( let j = 0; j < sizeY; j++ ){
                this.blockMap[i].push( 0 );
            }
        }

        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }

    public update(): void {
        // Nothing much happens here, user code is free to do stuff though.
    }
    
    public updateEdit() {
        // CAMERA MOVEMENT
        const EDIT_CAMERA_SPEED = 500;

        let cameraMoveX = 0;
        let cameraMoveY = 0;

        if (Input.isKeyDown("W") || Input.isKeyDown("ArrowUp")) {
            cameraMoveY -= 1;
        } else if (Input.isKeyDown("S") || Input.isKeyDown("ArrowDown")) {
            cameraMoveY += 1;
        }

        if (Input.isKeyDown("A") || Input.isKeyDown("ArrowLeft")) {
            cameraMoveX -= 1;
        } else if (Input.isKeyDown("D") || Input.isKeyDown("ArrowRight")) {
            cameraMoveX += 1;
        }

        if (cameraMoveY != 0 || cameraMoveX != 0) {
            let cameraPos = Render.getCameraPos();
            cameraPos.x += cameraMoveX * Time.getDelta() * EDIT_CAMERA_SPEED / Render.blockScale;
            cameraPos.y += cameraMoveY * Time.getDelta() * EDIT_CAMERA_SPEED / Render.blockScale;
            Render.setCameraPos(cameraPos.x,cameraPos.y,true);
        }

        let cursor = Input.getCursorPos();

        if (Input.isMouseButtonDown(1)) {
            if (this.editObjectName != null) {
                if (this.editObjectType == "block") {
                    this.setBlockTypeAt(cursor.x,cursor.y,this.editObjectName);
                }
            }
        }
        else if (Input.isMouseButtonDown(2)) {
            this.setBlockTypeAt(cursor.x,cursor.y,null);
        }
    }

    public setEditorPlacementObject(type: string, name:string) {
        this.editObjectType = type;
        this.editObjectName = name;
    }

	public render(drawGrid: boolean): void {
        // TODO account for camera position here or in calling function
        let scale = Render.blockScale;

        // Draw the actual world.
        for ( let x = 0; x < this.sizeX; x++ ) {
            for ( let y = 0; y < this.sizeY; y++ ) {
                let blockId = this.blockMap[x][y];
                if ( blockId != 0 ) {
                    let block = this.getBlockTypeInfoById(blockId);
                    if (block != null) {
                        let img = Render.findImage(block.imageFilename);
                        if (img != null) {
                            Render.context.drawImage(img,x*scale,y*scale,scale,scale);
                        }
                    }
                }
            }
        }

        if (drawGrid) {
            // Draw a grid, useful for editing
            let height = this.sizeY*scale;
            let width = this.sizeX*scale;

            Render.context.strokeStyle = "#222";
            Render.context.lineWidth = 1;
            Render.context.beginPath();
            
            // Vertical grid lines
            for ( let x = 0; x < this.sizeX+1; x++ ) {
                Render.context.moveTo(x*scale,0);
                Render.context.lineTo(x*scale,height);
            }

            // Horizontal grid lines
            for ( let y = 0; y < this.sizeY+1; y++ ) {
                Render.context.moveTo(0,y*scale);
                Render.context.lineTo(width,y*scale);
            }

            Render.context.stroke();
        }
    }

    
    public drawBackground() {
        Render.clear("grey");
    }

    public drawForeground() {

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

        if (x >= 0 && y >= 0 && x < this.sizeX && y < this.sizeY ) {
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

    public getBlockTypes() {
        let types: {[key: string]: string} = {};

        this.blockIdLookup.forEach((info,i)=>{
            types[info.name] = info.imageFilename;
        });
        return types;
    }

    public save() {
        let save_obj: any = {};
        save_obj.width = this.sizeX;
        save_obj.height = this.sizeY;
        save_obj.blockTypes = this.blockIdLookup.map((info)=> info.name);
        save_obj.blockMap = this.blockMap;
        return save_obj;
    }

    public load(save_obj: any) {
        // Set world size.
        this.resize( save_obj.width, save_obj.height);

        // Make sure all block types used by the save exist.
        save_obj.blockTypes.forEach((name: string)=>{
            if (this.blockNameLookup[name] == null) {
                this.createBlockType(name,"?");
            }
        });

        // Place all blocks.
        for( let x = 0; x < this.sizeX; x++ ){
            for( let y = 0; y < this.sizeY; y++ ){
                let blockName: string = save_obj.blockTypes[ save_obj.blockMap[x][y] ];
                this.setBlockTypeAt(x,y,blockName);
            }
        }
    }

    public createObject(className: string, x: number, y: number) {

        let objClass = CodeManager.getGameObjectClass(className);

        let obj = new objClass(x,y);
    }
    
    public getBlockMap(){
        return this.blockMap;
    }

    public getSizeX(): number {
        return this.sizeX;
    }

    public getSizeY(): number {
        return this.sizeY;
    }
}
