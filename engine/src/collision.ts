import { GameObject, GameObjectManager } from "./gameobject"
import { QuadTree } from "./quadtree"
import { Render } from "./render"

export namespace Collision {
    let qt314: QuadTree;
    let isSetup: boolean = false;

    export function setup( worldHeight: number, worldWidth: number ){
        let cameraPos = Render.getCameraPos();
        qt314 = new QuadTree( 0, { x: cameraPos.x , y: cameraPos.y, width: worldWidth, height: worldHeight } );
        isSetup = true;
    }

    // not optimal?
    export function doCollision(): void {
        if( !isSetup ){ throw new Error("Collision not setup! ( called from collision::doCollision )"); }
        // Game object collision
        qt314.clear()
        for( let go of GameObjectManager.getAllGameObjects() ){
            qt314.insert( go );
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
        // This might cause errors
        // GameObjectManager.removeGameObject( point ); 
        return ret;   
    }

    function rayCast(){}
    // Maybe someday function AABBCast(){}
}