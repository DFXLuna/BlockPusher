import { Render } from "./render"
import { CodeManager } from "./codemanager";
import { Time } from "./time";
import { Collision } from "./collision";

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
        for( let g of gameObjects ) {
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
    bounciness: number;
    friction: number;

    isOnGround = false;

    public constructor( x: number, y: number) {
        this.x = x;
        this.y = y;

        // Dumb hack part 1. Stops the compiler from complaining.
        this.image = ""; delete this.image;
        this.width = 0;  delete this.width;
        this.height = 0; delete this.height;
        this.bounciness = 0; delete this.bounciness;
        this.friction = 0; delete this.friction;

        this.setup();

        GameObjectManager.addGameObject( this );
    }

    public setup() {

    }

    public remove() {
        GameObjectManager.removeGameObject(this);
    }

    public updatePhysics() {
        let world = CodeManager.World;
        let delta = Time.getDelta();
    
        this.velX += world.gravityX * delta;
        this.velY += world.gravityY * delta;
    
        let res = Collision.castBounds(this.x, this.y, this.width, this.height, this.velX * delta, this.velY * delta, this);
        let res1 = res;

        this.isOnGround = false;

        if (res.hit) {

            const MIN_BOUNCE_SPEED = 3;
            // The cast hit. Update velocity and run a second cast.
            if (res.side == Collision.Top || res.side == Collision.Bottom) {
                this.velY = Math.abs(this.velY) > MIN_BOUNCE_SPEED ? -this.velY * this.bounciness : 0;
                this.velX *= 1 - this.friction * delta;
            } else if (res.side == Collision.Left || res.side == Collision.Right) {
                this.velX = Math.abs(this.velY) > MIN_BOUNCE_SPEED ? -this.velX * this.bounciness : 0;
                this.velY *= 1 - this.friction * delta;
            }
            res = Collision.castBounds(res.x, res.y, this.width, this.height, this.velX * delta, this.velY * delta, this);

            if (res.side == Collision.Top || res1.side == Collision.Top) {
                this.isOnGround = true;
            }
        }
    
        this.x = res.x;
        this.y = res.y;

        if (res1.hit) {
            this.onCollision(res1);
        }

        if (res.hit) {
            this.onCollision(res);
        }
    }

    public update(): void {

    }

    public render(): void{
        Render.drawImage(this.image,this.x,this.y,this.width,this.height);
    }

    public getBoundingBox(): { x: number, y: number, width: number, height: number }{
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    public onCollision(res: any): void{}
    
    public destroy(): void {
        GameObjectManager.removeGameObject( this );
    }

    public drawAABB() {
        let blockSizepx = Render.blockScale;
        Render.drawRectOutline( "#FF0000", this.x, this.y, this.width, this.height );
    }
}

// Dumb hack part 2.
(<any>GameObject.prototype).image = "?";
(<any>GameObject.prototype).width = 1;
(<any>GameObject.prototype).height = 1;
(<any>GameObject.prototype).bounciness = 0;
(<any>GameObject.prototype).friction = 1;