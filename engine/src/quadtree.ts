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
        this.children = new Array< QuadTree>( 4 );
    }

    public clear(): void {}
    private split(): void {}
    private getIndex(): number {}
    public insert( go: GameObject ){}
    public retrievePotentialColliders( returnObjects: Array< GameObject >, go: GameObject ): Array< GameObject >{}
}