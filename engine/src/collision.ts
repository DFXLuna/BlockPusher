import { GameObject, GameObjectManager } from "./gameobject"
import { QuadTree } from "./quadtree"
import { Render } from "./render"
import { CodeManager } from "./codemanager";


interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ObjectBounds extends Bounds {
    object: GameObject;
}

namespace BoundsUtils {
    export function makeObjectBounds(obj: GameObject): ObjectBounds {
        return {
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            object: obj
        };
    }

    // Returns an array of keys that can be used to index into the grid.
    export function getBoundsCells(bounds: Bounds): string[] {
        let results = [];

        for (let x = Math.floor(bounds.x); x <= Math.floor(bounds.x + bounds.width); x++) {
            for (let y = Math.floor(bounds.y); y <= Math.floor(bounds.y + bounds.height); y++) {
                results.push(x+":"+y);
            }
        }

        return results;
    }

    export function getPointCell(x: number, y: number) {
        return Math.floor(x)+":"+Math.floor(y);
    }

    export function checkPoint(bounds: Bounds, x: number, y: number) {
        return (x > bounds.x && x < bounds.x + bounds.width
            &&  y > bounds.y && y < bounds.y + bounds.height);
    }
}

// Now uses a sparse grid instead of a broken quadtree for broadphase.
// Grid is indexed using string keys, which is really disgusting, but it works okay.

export namespace Collision {
    //let qt314: QuadTree;
    //let isSetup: boolean = false;
    //let toDelete: Array< GameObject > = [];
    let broadphaseGrid: {[key: string]: ObjectBounds[]} = {};

    export function setup( ){
        //let world = CodeManager.World; // NOTE: World size can't change. If it ever can change, we might have some issues here.
        //qt314 = new QuadTree( 0, { x: 0 , y: 0, width: world.getSizeX(), height: world.getSizeY() } );
        //isSetup = true;
    }

    export function dumpGrid() {
        console.log(broadphaseGrid);
    }

    // not optimal?
    /*export function doCollision(): void {
        //if( !isSetup ){ throw new Error("Collision not setup! ( called from collision::doCollision )"); }
        // Just make a new QT every frame that is the correct size.
        let world = CodeManager.World;
        qt314 = new QuadTree( 0, { x: 0 , y: 0, width: world.getSizeX(), height: world.getSizeY() } );
        clean();
        for( let go of GameObjectManager.getAllGameObjects() ){
            qt314.insert( go );
        }
        // Adam, Alex, God: I'm sorry
        // Matt: I'm disowning you
        let blockmap = CodeManager.World.getBlockMap();
        for( let i = 0; i < blockmap.length; i++ ){
            for( let j = 0; j < blockmap[i].length; j++ ){
                if( blockmap[i][j] != 0 ){
                    insertBlock( i , j );
                }
            }
        }
        for( let go of GameObjectManager.getAllGameObjects() ){
            for( let go2 of qt314.retrievePotentialColliders( go ) ){
                checkCollision( go, go2 );
            }    
        }
    }*/

    export function update() {
        // Reset bp
        broadphaseGrid = {};

        for ( let go of GameObjectManager.getAllGameObjects() ) {
            // Insert object into each cell it overlaps.
            let objBounds = BoundsUtils.makeObjectBounds(go);
            let cellKeys = BoundsUtils.getBoundsCells(objBounds);
            cellKeys.forEach((key)=>{
                let boundsArray = broadphaseGrid[key];
                if (boundsArray == null) {
                    boundsArray = [];
                    broadphaseGrid[key] = boundsArray;
                }
                boundsArray.push(objBounds);
            });
        }
    }

    export function debugDraw() {
        //if (qt314 != null)
        //    qt314.drawQuadTree();
    }

    // Checks for collision and calls both gameobjects callback
    function checkCollision( go1: GameObject, go2: GameObject ): void {
        let box1 = go1.getBoundingBox();
        let box2 = go2.getBoundingBox();

        if( box1.x < box2.x + box2.width  &&
            box1.x + box1.width > box2.x  &&
            box1.y < box2.y + box2.height &&
            box1.y + box1.height > box2.y ){
                go1.onCollision();
                go2.onCollision();
        }
    }

    export function checkPoint( x: number , y: number ): Array< GameObject | string > {
        let world = CodeManager.World;

        let results = [ ];
        
        // First, get the block at this position.
        let blockType = world.getBlockTypeAt(x, y);

        if (blockType != null)
            results.push(blockType);
        
        // Now get any objects in this cell.
        let cellKey = BoundsUtils.getPointCell(x, y);
        let boundsArray = broadphaseGrid[cellKey];
        if (boundsArray != null) {
            boundsArray.forEach((bounds) => {
                // Check point for each object.
                if (BoundsUtils.checkPoint(bounds, x, y)) {
                    results.push(bounds.object);
                }
            });
        }

        return results;
    }
}
/*
    function insertBlock( x: number , y: number ){
        // create a gameobject at the block's location and insert it
        let go = new GameObject( x, y );
        toDelete.push( go );
        GameObjectManager.addGameObject( go );
    }

    function clean(){
        for( let go of toDelete ){
            GameObjectManager.removeGameObject( go );
        }
        toDelete = [];
    }*/

    //function rayCast(){}
    // Maybe someday function AABBCast(){}
//}