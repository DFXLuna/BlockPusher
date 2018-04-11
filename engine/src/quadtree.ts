// Modified from
// https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374
import { GameObject } from "./gameobject";
import { Render } from "./render"

export class QuadTree {
    private readonly maxObjects = 10;
    private readonly maxLevel = 5
    private level: number;
    private gameObjects: Array< GameObject >;
    private bounds: { x: number, y: number, width: number, height: number };
    private children: Array< QuadTree >;

    constructor( level: number, bounds: { x: number, y: number, width: number, height: number } ){
        this.level = level;
        this.bounds = bounds;
        this.gameObjects = new Array< GameObject >();
        this.children = new Array< QuadTree >( 4 );
    }

    public clear(): void {
        this.gameObjects = [];

        for( let i = 0; i < this.children.length; i++ ){
            if( this.children[i] != null ){
                this.children[i].clear(); // might be unnecessary
            }
        }
        this.children = new Array< QuadTree >( 4 );
    }

    private split(): void {
       let subWidth = this.bounds.width / 2;
       let subHeight = this.bounds.height / 2;
       let x = this.bounds.x;
       let y = this.bounds.y;

       this.children[0] = new QuadTree( this.level + 1, { x: x + subWidth, y: y, width: subWidth, height: subHeight } );
       this.children[1] = new QuadTree( this.level + 1, { x: x, y: y, width: subWidth, height: subHeight } );
       this.children[2] = new QuadTree( this.level + 1, { x: x, y: y + subHeight, width: subWidth, height: subHeight } );
       this.children[3] = new QuadTree( this.level + 1, { x: x + subWidth, y: y + subHeight, width: subWidth, height: subHeight } );
    }

    private getIndex( go: GameObject ): number {
        let goBounds = go.getBoundingBox();

        let index = -1;
        let vertMidpoint = this.bounds.x + this.bounds.width / 2;
        let horzMidpoint = this.bounds.y + this.bounds.height / 2;

        let topQuad = goBounds.y < horzMidpoint && goBounds.y + goBounds.height < horzMidpoint;
        let botQuad = goBounds.y > horzMidpoint;

        if( goBounds.x < vertMidpoint && goBounds.x + goBounds.width < vertMidpoint ){
            if( topQuad ){
                index = 1;
            }
            else if( botQuad ){
                index = 2;
            }
        }
        else if( goBounds.x > vertMidpoint ){
            if( topQuad ){
                index = 0;
            }
            else if( botQuad ){
                index = 3;
            } 
        }
        return index;
    }


    public insert( go: GameObject ){
        if( this.children[0] != null ){
            let index = this.getIndex( go );

            if( index !== -1 ){
                this.children[index].insert( go );
                return;
            }
        }

        this.gameObjects.push( go );

        if( this.gameObjects.length > this.maxObjects && this.level < this.maxLevel ){
            if( this.children[0] == null ){
                this.split();
            }

            let i = 0;
            while( i < this.gameObjects.length ){
                let index = this.getIndex( this.gameObjects[i] );
                if( index !== -1  ){
                    this.children[index].insert( this.gameObjects[i] )
                    this.gameObjects.splice( i, 1 );
                }
                else{
                    i++;
                }
            }
        }
    }

    public retrievePotentialColliders( go: GameObject ): Array< GameObject > { 
        let index = this.getIndex( go );
        let returnObjects = new Array< GameObject >();
        if( index !== -1 && this.children[0] != null ){
            returnObjects = returnObjects.concat( this.children[index].retrievePotentialColliders( go ) );
        }

        returnObjects = returnObjects.concat( this.gameObjects );
        return returnObjects;
    }

    public drawQuadTree( canvasName: string ){
        let blockSizepx = Render.blockScale;
        let bounds = this.bounds;
        Render.drawRectOutline( "#00000", bounds.x * blockSizepx, 
                                           bounds.y * blockSizepx, 
                                           bounds.width * blockSizepx,
                                           bounds.height * blockSizepx );
        if( this.children[0] != null ){
            for( let c of this.children ){
                c.drawQuadTree( canvasName );
            }
        }
    }
}