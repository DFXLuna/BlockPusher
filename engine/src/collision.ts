import { GameObject } from "./gameobject"
export namespace Collision {

    // Checks for collision and calls both gameobjects callback
    function narrowCollision( go1: GameObject, go2: GameObject ): void {
        // x, y, width, height
        let box1 = go1.getBoundingBox();
        let box2 = go2.getBoundingBox();

        if( box1[0] < box2[0] + box2[2] &&
            box1[0] + box1[2] < box2[0] &&
            box1[1] < box2[1] + box2[3] &&
            box1[1] + box1[3] < box2[1] ){
                go1.onCollision();
                go2.onCollision();
        }
    }

    function checkPoint( x: number , y: number ){}
    function rayCast(){}
    function AABBCast(){}
}