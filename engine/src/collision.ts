import { GameObject, GameObjectManager } from "./gameobject"
import { QuadTree } from "./quadtree"
import { Render } from "./render"
import { CodeManager } from "./codemanager";

// This controls whether we check a ray's start position.
// If this is disabled, a cast will ignore any object it
// starts inside of. We are leaving it disabled for now.
const ENABLE_CAST_START_CHECK = false;

// Fudge factor used to combat rounding errors and other weirdness.
const BOUNDS_CAST_FUDGE_FACTOR = .001;

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
        
        if (ENABLE_CAST_START_CHECK && checkPoint(bounds, x, y)) {
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

    export function checkBoundsCast(bounds: Bounds, x: number, y: number, width: number, height: number, dx: number, dy: number): CastResult | null {
        
        if (ENABLE_CAST_START_CHECK && checkBounds(bounds,{x,y,width,height})) {
            return {
                hit: true,
                x: x,
                y: y,
                distance: 0
            };
        }

        let baseX = x;
        let baseY = y;

        let BOUNDS_CAST_FUDGE_FACTOR = 0;

        x = dx>0 ? x + width - BOUNDS_CAST_FUDGE_FACTOR : x + BOUNDS_CAST_FUDGE_FACTOR;
        y = dy>0 ? y + height - BOUNDS_CAST_FUDGE_FACTOR : y + BOUNDS_CAST_FUDGE_FACTOR;

        // Min/Max of bounds on each axis
        let xMin = bounds.x;
        let xMax = bounds.x + bounds.width;

        let yMin = bounds.y;
        let yMax = bounds.y + bounds.height;

        if (dx > 0 && x < xMin && x + dx > xMin) {
            // check left edge
            let hitYMin = baseY + dy / dx * (xMin - x - BOUNDS_CAST_FUDGE_FACTOR);
            let hitYMax = hitYMin + height;
            if (hitYMax > yMin && hitYMin < yMax) {
                return {
                    hit: true,
                    x: (xMin - width),
                    y: hitYMin,
                    distance: Math.sqrt(Math.pow((xMin - width) - baseX,2) + Math.pow(hitYMin - baseY,2)),
                    side: Collision.Left
                };
            }
        } else if (dx < 0 && x > xMax && x + dx < xMax) {
            // check right edge
            let hitYMin = baseY - dy / dx * (x - xMax - BOUNDS_CAST_FUDGE_FACTOR);
            let hitYMax = hitYMin + height;
            if (hitYMax > yMin && hitYMin < yMax) {
                return {
                    hit: true,
                    x: xMax,
                    y: hitYMin,
                    distance: Math.sqrt(Math.pow(xMax - baseX,2) + Math.pow(hitYMin - baseY,2)),
                    side: Collision.Right
                };
            }
        }

        if (dy > 0 && y < yMin && y + dy > yMin) {
            // check top edge
            let hitXMin = baseX + dx / dy * (yMin - y);
            let hitXMax = hitXMin + width;
            if (hitXMax > xMin && hitXMin < xMax) {
                return {
                    hit: true,
                    x: hitXMin,
                    y: (yMin - height),
                    distance: Math.sqrt(Math.pow((yMin - height) - baseY,2) + Math.pow(hitXMin - baseX,2)),
                    side: Collision.Top
                };
            }
        } else if (dy < 0 && y > yMax && y + dy < yMax) {
            // check bottom edge
            let hitXMin = baseX - dx / dy * (y - yMax);
            let hitXMax = hitXMin + width;
            if (hitXMax > xMin && hitXMin < xMax) {
                return {
                    hit: true,
                    x: hitXMin,
                    y: yMax,
                    distance: Math.sqrt(Math.pow(yMax - baseY,2) + Math.pow(hitXMin - baseX,2)),
                    side: Collision.Bottom
                };
            }
            /*let hitX = x - dx / dy * (y - (yMax));
            if (hitX > xMin && hitX < xMax) {
                return {
                    hit: true,
                    x: hitX,
                    y: yMax,
                    distance: Math.sqrt(Math.pow(yMax - y,2) + Math.pow(hitX - x,2)),
                    side: Collision.Bottom
                };
            }*/
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
        
        // Don't want NaNs.
        if (tMaxX != tMaxX)
            tMaxX = Infinity;
        if (tMaxY != tMaxY)
            tMaxY = Infinity;

        let tDeltaX = Math.abs(1 / dx);
        let tDeltaY = Math.abs(1 / dy);

        let currentX = Math.floor(x);
        let currentY = Math.floor(y);

        let lastSide: string;

        function check(): CastResult | null {
            // check block
            if (ENABLE_CAST_START_CHECK || lastSide !=null) {
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

    export function castBounds( x: number, y: number, width: number, height: number, dx: number, dy: number, ignoreObject?: GameObject ): CastResult {
        
        // Modification of the previous ray casting algorithm.
        let world = CodeManager.World;

        let baseX = x;
        let baseY = y;

        x = dx>0 ? x + width - BOUNDS_CAST_FUDGE_FACTOR : x + BOUNDS_CAST_FUDGE_FACTOR;
        y = dy>0 ? y + height - BOUNDS_CAST_FUDGE_FACTOR : y + BOUNDS_CAST_FUDGE_FACTOR;

        //width -= BOUNDS_CAST_FUDGE_FACTOR*2;
        //height -= BOUNDS_CAST_FUDGE_FACTOR*2;

        let stepX = Math.sign(dx);
        let stepY = Math.sign(dy);

        let t = 0;
        let fullDistance = Math.sqrt(dx*dx + dy*dy);

        // Modulo operator in js does not behave like I want it to.
        let xRemainder = x - Math.floor(x);
        let YRemainder = y - Math.floor(y);

        let tMaxX = ( dx > 0 ? (1 - xRemainder) : xRemainder ) / Math.abs( dx );
        let tMaxY = ( dy > 0 ? (1 - YRemainder) : YRemainder ) / Math.abs( dy );

        // Don't want NaNs.
        if (tMaxX != tMaxX)
            tMaxX = Infinity;
        if (tMaxY != tMaxY)
            tMaxY = Infinity;

        let tDeltaX = Math.abs(1 / dx);
        let tDeltaY = Math.abs(1 / dy);

        let currentX = Math.floor(x);
        let currentY = Math.floor(y);

        let lastSide: string;

        // Checks an individual grid space.
        function checkInner(x: number, y: number): CastResult | null {
            // check block
            if (ENABLE_CAST_START_CHECK || lastSide !=null) {
                let block = world.getBlockTypeAt(x , y);
                if (block != null) {
                    let adjusted_t: number;
                    if (lastSide == Left || lastSide == Right) {
                        adjusted_t = t - tDeltaX*BOUNDS_CAST_FUDGE_FACTOR;
                    } else {
                        adjusted_t = t - tDeltaY*BOUNDS_CAST_FUDGE_FACTOR;
                    }

                    if (!isFinite(adjusted_t)) {
                        // This should hopefully not happen anymore.
                        adjusted_t = 0;
                    } else if (adjusted_t < 0) {
                        adjusted_t = 0;
                    }

                    let res = {
                        hit: true,
                        x: baseX+dx * adjusted_t,
                        y: baseY+dy * adjusted_t,
                        distance: t * fullDistance,
                        side: lastSide,

                        blockType: block,
                        blockX: x,
                        blockY: y,
                    };
                    return res;
                }
            }

            // Now get any objects in this cell.
            let cellKey = BoundsUtils.getPointCell(x, y);
            let boundsArray = broadphaseGrid[cellKey];
            if (boundsArray != null) {
                let results = boundsArray.map((bounds) => {
                    // Check ray for each object.
                    
                    // Skip ignoreObject
                    if (bounds.object == ignoreObject)
                        return null;

                    let farT = Math.min(tMaxX,tMaxY);

                    //let m = t + .1;
                    //if (Math.random()<.1)
                    //console.log(t,m);

                    let res = BoundsUtils.checkBoundsCast(bounds, baseX, baseY, width, height, dx*farT, dy*farT);
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

        // Checks a span of blocks based on the trace state.
        function check(): CastResult | null {
            

            if (lastSide == Left || lastSide == Right) {
                // Check a vertical span
                let yt = y+dy*t;
                let y1, y2;
                if (dy > 0) {
                    y1 = Math.floor(yt - height + BOUNDS_CAST_FUDGE_FACTOR*2);
                    y2 = currentY;
                } else {
                    y1 = currentY;
                    y2 = Math.floor(yt + height - BOUNDS_CAST_FUDGE_FACTOR*2);
                }
                for (let yi = y1; yi <= y2; yi++) {
                    let res = checkInner(currentX, yi);
                    if (res != null)
                        return res;
                }
            } else if (lastSide == Top || lastSide == Bottom) {
                // Check a horizontal span
                let xt = x+dx*t;
                let x1, x2;
                if (dx > 0) {
                    x1 = Math.floor(xt - width + BOUNDS_CAST_FUDGE_FACTOR*2);
                    x2 = currentX;
                } else {
                    x1 = currentX;
                    x2 = Math.floor(xt + width - BOUNDS_CAST_FUDGE_FACTOR*2);
                }
                for (let xi = x1; xi <= x2; xi++) {
                    let res = checkInner(xi, currentY);
                    if (res != null)
                        return res;
                }
            } else {
                // Check entire region.
                let xt = x+dx*t;
                let yt = y+dy*t;
                let x1, x2;
                if (dx > 0) {
                    x1 = Math.floor(xt - width + BOUNDS_CAST_FUDGE_FACTOR*2);
                    x2 = currentX;
                } else {
                    x1 = currentX;
                    x2 = Math.floor(xt + width - BOUNDS_CAST_FUDGE_FACTOR*2);
                }
                let y1, y2;
                if (dy > 0) {
                    y1 = Math.floor(yt - height + BOUNDS_CAST_FUDGE_FACTOR*2);
                    y2 = currentY;
                } else {
                    y1 = currentY;
                    y2 = Math.floor(yt + height - BOUNDS_CAST_FUDGE_FACTOR*2);
                }
                for (let xi = x1; xi <= x2; xi++) {
                    for (let yi = y1; yi <= y2; yi++) {
                        let res = checkInner(xi, yi);
                        if (res != null) {
                            return res;
                        }
                    }
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
            x: baseX+dx,
            y: baseY+dy,
            distance: fullDistance,
        }
    }
}
