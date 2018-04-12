import { Render } from "./render"

export namespace GameObjectManager {
    let gameObjects: Set< GameObject > = new Set< GameObject >();

    export function addGameObject( go: GameObject ): void {
        gameObjects.add( go );
    }

    export function removeGameObject( go: GameObject ): void {
        gameObjects.delete( go );
    }
    // These might be better as 'getGameObjects' and letting otherstuff
    // mess with it.
    export function updateGameObjects(): void {
        for( let g of gameObjects ){
            g.update();
        }
    }

    export function renderGameObjects(): void {
        for( let g of gameObjects ){
            Render.setWorldRenderOffset(g.x, g.y);
            g.render();
        }
    }

    export function getAllGameObjects(): Set< GameObject > {
        return gameObjects;
    }

    export function drawAllAABB( canvasName: string ){
        for( let g of gameObjects ){
            g.drawAABB( canvasName );
        }
    }

}

export class GameObject {
    x: number;
    y: number;
    velX = 0;
    velY = 0;
    width = 1; // Set these from image?
    height = 1;
    image = "?";

    public constructor( x: number, y: number) {
        this.x = x;
        this.y = y;

        this.setup();

        GameObjectManager.addGameObject( this );
    }

    public setup() {

    }

    public updatePhysics() {
        this.x += this.velX;
        this.y += this.velY;
    }

    public update(): void {
        this.updatePhysics();
    }

    // Possibly unneeded / wrong
    public render(): void{

    }

    public getBoundingBox(): { x: number, y: number, width: number, height: number }{
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    public onCollision(): void{}
    
    public destroy(): void {
        GameObjectManager.removeGameObject( this );
    }

    public drawAABB( canvasName: string ){
        let blockSizepx = Render.blockScale;
        Render.drawRectOutline( "#FF0000", this.x * blockSizepx, 
                                            this.y * blockSizepx, 
                                            this.width * blockSizepx,
                                            this.height * blockSizepx );
    }
}