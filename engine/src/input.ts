import { copymap } from "./copymap";

export class Input {
    private currPressed: Map< string, boolean >;
    private prevPressed: Map< string, boolean >;


    constructor(){
        this.currPressed = new Map();
        this.prevPressed = new Map();
        window.addEventListener("keydown", ( event ) => { this.onKeyDown( event ); }, false );
        window.addEventListener("keyup", ( event ) => { this.onKeyUp( event ); }, false );
    }
    
    public onFrame(): void {
        copymap( this.currPressed, this.prevPressed );
    }

    public isKeyDown( keyValue: string ): boolean {
        return this.currPressed.has( keyValue );
    }

    public wasKeyDown( keyValue: string ): boolean {
        return this.prevPressed.has( keyValue );
    }

    private onKeyDown( ke: KeyboardEvent ): void {
        this.currPressed.set( ke.key, true );
    }
    private onKeyUp( ke: KeyboardEvent ): void {
        this.currPressed.delete( ke.key );
    }
}