export class Input {
    private pressed: Map< string, boolean >;


    constructor(){
        this.pressed = new Map();
    }
    
    public onFrame(): void {
        window.addEventListener("keydown", ( event ) => { this.onKeyDown( event ); }, false );
        window.addEventListener("keyup", ( event ) => { this.onKeyUp( event ); }, false );
    }

    public isKeyDown( keyValue: string ): boolean {
        return this.pressed.has( keyValue );
    }

    private onKeyDown( ke: KeyboardEvent ): void {
        this.pressed.set( ke.key, true );
    }
    private onKeyUp( ke: KeyboardEvent ): void {
        this.pressed.delete( ke.key );
    }
}