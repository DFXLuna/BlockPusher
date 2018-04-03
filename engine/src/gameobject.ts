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
            g.render();
        }
    }
}

export class GameObject {
    protected xPos: number;
    protected yPos: number;

    public constructor() {
        this.xPos = 0;
        this.yPos = 0;
        GameObjectManager.addGameObject( this );
    }

    public update(): void{}
    // Possibly unneeded / wrong
    public render(): void{}
    public destroy(): void {
        GameObjectManager.removeGameObject( this );
    }
}