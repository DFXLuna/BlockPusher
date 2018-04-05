// Modified from
// https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374
import { GameObject } from "./gameobject";

export class QuadTree {
    private max = 10; // may change
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
       this.children[2] = new QuadTree( this.level + 1, { x: x + subWidth, y: y + subHeight, width: subWidth, height: subHeight } );
       this.children[3] = new QuadTree( this.level + 1, { x: x + subWidth, y: y + subHeight, width: subWidth, height: subHeight } );
    }

    private getIndex(): number { return -1; }
    public insert( go: GameObject ){}
    public retrievePotentialColliders( returnObjects: Array< GameObject >, go: GameObject ): Array< GameObject >{ 
        return new Array<GameObject>(); }
}