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

interface CastResult {
    // Did the cast hit?
    hit: boolean;
    // Coords of the end of the ray
    x: number;
    y: number;
    // The length of the ray.
    distance: number;
    // Hit side. If set, will be one of the constants defined in the Collision module.
    // Not set if no hit or if the ray started inside an object.
    side?: string;

    // Block type string, set if the cast hit a block.
    blockType?: string;
    // Coords of the block that was hit, set if the cast hits a block.
    blockX?: number;
    blockY?: number;

    // The object that was hit, set if the cast hits an object.
    object?: GameObject;
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

    export function checkBounds(bounds1: Bounds, bounds2: Bounds) {
        return (bounds1.x < bounds2.x + bounds2.width && bounds1.x + bounds1.width > bounds2.x
            &&  bounds1.y < bounds2.y + bounds2.height && bounds1.y + bounds1.height > bounds2.y);
    }

    export function getPointCell(x: number, y: number) {
        return Math.floor(x)+":"+Math.floor(y);
    }

    export function checkPoint(bounds: Bounds, x: number, y: number) {
        return (x > bounds.x && x < bounds.x + bounds.width
            &&  y > bounds.y && y < bounds.y + bounds.height);
    }

    export function checkRay(bounds: Bounds, x: number, y: number, dx: number, dy: number): CastResult | null {
        
        if (checkPoint(bounds, x, y)) {
            return {
                hit: true,
                x: x,
                y: y,
                distance: 0
            };
        }

        // Min/Max of bounds on each axis
        let xMin = bounds.x;
        let xMax = bounds.x + bounds.width;

        let yMin = bounds.y;
        let yMax = bounds.y + bounds.height;

        if (dx > 0 && x < xMin && x + dx > xMin) {
            // check left edge
            let hitY = y + dy / dx * (xMin - x);
            if (hitY > yMin && hitY < yMax) {
                return {
                    hit: true,
                    x: xMin,
                    y: hitY,
                    distance: Math.sqrt(Math.pow(xMin - x,2) + Math.pow(hitY - y,2)),
                    side: Collision.Left
                };
            }
        } else if (dx < 0 && x > xMax && x + dx < xMax) {
            // check right edge
            let hitY = y - dy / dx * (x - (xMax));
            if (hitY > yMin && hitY < yMax) {
                return {
                    hit: true,
                    x: xMax,
                    y: hitY,
                    distance: Math.sqrt(Math.pow(xMax - x,2) + Math.pow(hitY - y,2)),
                    side: Collision.Right
                };
            }
        }

        if (dy > 0 && y < yMin && y + dy > yMin) {
            // check top edge
            let hitX = x + dx / dy * (yMin - y);
            if (hitX > xMin && hitX < xMax) {
                return {
                    hit: true,
                    x: hitX,
                    y: yMin,
                    distance: Math.sqrt(Math.pow(yMin - y,2) + Math.pow(hitX - x,2)),
                    side: Collision.Top
                };
            }
        } else if (dy < 0 && y > yMax && y + dy < yMax) {
            // check bottom edge
            let hitX = x - dx / dy * (y - (yMax));
            if (hitX > xMin && hitX < xMax) {
                return {
                    hit: true,
                    x: hitX,
                    y: yMax,
                    distance: Math.sqrt(Math.pow(yMax - y,2) + Math.pow(hitX - x,2)),
                    side: Collision.Bottom
                };
            }
        }

        return null;
    }
}

// Now uses a sparse grid instead of a broken quadtree for broadphase.
// Grid is indexed using string keys, which is really disgusting, but it works okay.

export namespace Collision {
    let broadphaseGrid: {[key: string]: ObjectBounds[]} = {};

    // Constants for collision hit sides
    export let Top = "Top";
    export let Bottom = "Bottom";
    export let Left = "Left";
    export let Right = "Right";

    export function setup( ){
        // This doesn't really do anything anymore.
    }

    export function dumpGrid() {
        console.log(broadphaseGrid);
    }

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

    // Checks for GameObjects ONLY.
    export function checkPoint( x: number , y: number ) {

        let results = new Array< GameObject >();
        
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

    // Checks for GameObjects ONLY.
    export function checkBounds( x: number, y: number, width: number, height: number) {

        let bounds1: Bounds = {x,y,width,height};

        // This set prevents us from adding any
        // object more than once.
        let resultObjects = new Set<GameObject>();

        // Now get any objects in bounds1's cells.
        BoundsUtils.getBoundsCells(bounds1).forEach((cellKey)=>{
            let boundsArray = broadphaseGrid[cellKey];
            if (boundsArray != null) {
                boundsArray.forEach((bounds2) => {
                    // Check bounds for each object.
                    if (BoundsUtils.checkBounds(bounds1, bounds2)) {
                        resultObjects.add(bounds2.object);
                    }
                });
            }
        });

        let results = Array.from(resultObjects);
        return results;
    }

    export function castRay( x: number, y: number, dx: number, dy: number, ignoreObject?: GameObject ): CastResult {
        // Implementation of http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.42.3443&rep=rep1&type=pdf 
        let world = CodeManager.World;

        let stepX = Math.sign(dx);
        let stepY = Math.sign(dy);

        let t = 0;
        let fullDistance = Math.sqrt(dx*dx + dy*dy);

        // Modulo operator in js does not behave like I want it to.
        let xRemainder = x - Math.floor(x);
        let YRemainder = y - Math.floor(y);

        let tMaxX = ( dx > 0 ? (1 - xRemainder) : xRemainder ) / Math.abs( dx );
        let tMaxY = ( dy > 0 ? (1 - YRemainder) : YRemainder ) / Math.abs( dy );

        let tDeltaX = Math.abs(1 / dx);
        let tDeltaY = Math.abs(1 / dy);

        let currentX = Math.floor(x);
        let currentY = Math.floor(y);

        let lastSide: string;

        function check(): CastResult | null {
            // check block
            let block = world.getBlockTypeAt(currentX , currentY);
            if (block != null) {
                return {
                    hit: true,
                    x: x+dx * t,
                    y: y+dy * t,
                    distance: t * fullDistance,
                    side: lastSide,

                    blockType: block,
                    blockX: currentX,
                    blockY: currentY,
                };
            }

            // Now get any objects in this cell.
            let cellKey = BoundsUtils.getPointCell(currentX, currentY);
            let boundsArray = broadphaseGrid[cellKey];
            if (boundsArray != null) {
                let results = boundsArray.map((bounds) => {
                    // Check ray for each object.
                    
                    // Skip ignoreObject
                    if (bounds.object == ignoreObject)
                        return null;
                    
                    let res = BoundsUtils.checkRay(bounds, x, y, dx, dy);
                    if (res != null)
                        res.object = bounds.object;
                    return res;
                }).filter(x => x!=null);
                // Filter and sort by distance.
                if (results.length > 0) {
                    results.sort((a,b)=>(<CastResult>a).distance-(<CastResult>b).distance);
                    return results[0];
                }
            }

            return null;
        }

        let res = check();
        if (res)
            return res;

        let failsafe = 0;
        while (tMaxX < 1 || tMaxY < 1) {
            
            if (tMaxX < tMaxY) {
                t = tMaxX;
                tMaxX += tDeltaX;
                currentX += stepX;
                lastSide = dx > 0 ? Left : Right;
            } else {
                t = tMaxY;
                tMaxY += tDeltaY;
                currentY += stepY;
                lastSide = dy > 0 ? Top : Bottom;
            }
            
            let res = check();
            if (res) {
                return res;
            }
            
            if (failsafe++ > 1000) {
                throw new Error("Raycast ran for too long.");
            }
        }

        return {
            hit: false,
            x: x+dx,
            y: y+dy,
            distance: fullDistance,
        }
    }
}
