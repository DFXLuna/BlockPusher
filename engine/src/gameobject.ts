import { Render } from "./render"
import { CodeManager } from "./codemanager";
import { Time } from "./time";

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
            g.updatePhysics();
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

    export function saveObjects() {
        let save_obj: any = [];

        for( let g of gameObjects ){
            let classname = CodeManager.getGameObjectClassName(g);
            save_obj.push([classname, g.x, g.y]);
        }

        return save_obj;
    }

    export function loadObjects(save_obj: [any]) {
        gameObjects.clear();
        
        if (save_obj == null) {
            return;
        }

        save_obj.forEach(record => {
            let classname = record[0];
            let x = record[1];
            let y = record[2];            

            let objClass = CodeManager.createObjectClassIfNotExist(classname).objectClass;
            new objClass(x,y);
        });
    }

    export function drawAllAABB() {
        for( let g of gameObjects ) {
            Render.setWorldRenderOffset(g.x, g.y);
            g.drawAABB();
        }
    }

}

export class GameObject {
    x: number;
    y: number;
    velX = 0;
    velY = 0;

    // Defaults for these are set below using a dumb hack.
    image: string;
    width: number;
    height: number;

    public constructor( x: number, y: number) {
        this.x = x;
        this.y = y;

        // Dumb hack part 1. Stops the compiler from complaining.
        this.image = ""; delete this.image;
        this.width = 0;  delete this.width;
        this.height = 0; delete this.height;

        this.setup();

        GameObjectManager.addGameObject( this );
    }

    public setup() {

    }

    public remove() {
        GameObjectManager.removeGameObject(this);
    }

    public updatePhysics() {
        this.x += this.velX * Time.getDelta();
        this.y += this.velY * Time.getDelta();
    }

    public update(): void {

    }

    public render(): void{
        Render.drawImage(this.image,0,0);
    }

    public getBoundingBox(): { x: number, y: number, width: number, height: number }{
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    public onCollision(): void{}
    
    public destroy(): void {
        GameObjectManager.removeGameObject( this );
    }

    public drawAABB() {
        let blockSizepx = Render.blockScale;
        Render.drawRectOutline( "#FF0000", 0, 0, 
            this.width * blockSizepx,
            this.height * blockSizepx );
    }
}

// Dumb hack part 2.
(<any>GameObject.prototype).image = "?";
(<any>GameObject.prototype).width = 1;
(<any>GameObject.prototype).height = 1;