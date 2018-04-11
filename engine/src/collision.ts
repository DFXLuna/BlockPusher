import { GameObject, GameObjectManager } from "./gameobject"
import { QuadTree } from "./quadtree"
import { Render } from "./render"
import { World } from "./world"

export namespace Collision {
    let qt314: QuadTree;
    let isSetup: boolean = false;
    let world: World;
    let toDelete: Array< GameObject >;

    export function setup( worldin: World ){
        let cameraPos = Render.getCameraPos();
        world = worldin;
        toDelete = [];
        qt314 = new QuadTree( 0, { x: cameraPos.x , y: cameraPos.y, width: world.getSizeX(), height: world.getSizeY() } );
        isSetup = true;
    }

    // not optimal?
    export function doCollision(): void {
        if( !isSetup ){ throw new Error("Collision not setup! ( called from collision::doCollision )"); }
        qt314.clear();
        clean();
        for( let go of GameObjectManager.getAllGameObjects() ){
            qt314.insert( go );
        }
        // Adam, Alex, God: I'm sorry
        let blockmap = world.getBlockMap();
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

    function checkPoint( x: number , y: number ): Array< GameObject > | null {
        if( !isSetup ){ throw new Error("Collision not setup! ( called from collision::checkPoint )"); }
        // collision always clears itself before the next check so this won't hurt anything
        let point = new GameObject( x, y, 1, 1 );
        qt314.insert( point );

        let ret = qt314.retrievePotentialColliders( point );
        if( ret.length === 1 ){
            // The only potential collider is itself
            GameObjectManager.removeGameObject( point );
            return null;
        }
        toDelete.push( point );
        return ret;   
    }

    function insertBlock( x: number , y: number ){
        // create a gameobject at the block's location and insert it
        let go = new GameObject( x, y, 1, 1 );
        toDelete.push( go );
        GameObjectManager.addGameObject( go );
    }

    function clean(){
        for( let go of toDelete ){
            GameObjectManager.removeGameObject( go );
        }
        toDelete = [];
    }

    function rayCast(){}
    // Maybe someday function AABBCast(){}
}