import { GameObject } from "./gameobject"
export namespace Collision {

    // Checks for collision and calls both gameobjects callback
    function narrowCollision( go1: GameObject, go2: GameObject ): void {
        // x, y, width, height
        let box1 = go1.getBoundingBox();
        let box2 = go2.getBoundingBox();

        if( box1.x < box2.x + box2.width &&
            box1.x + box1.width < box2.x &&
            box1.y < box2.y + box2.height &&
            box1.y + box1.height < box2.y ){
                go1.onCollision();
                go2.onCollision();
        }
    }

    function checkPoint( x: number , y: number ){}
    function rayCast(){}
    function AABBCast(){}
}