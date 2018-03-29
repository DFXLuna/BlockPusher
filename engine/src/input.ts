import { copymap } from "./copymap";

export namespace Input {
    let currPressed: Map< string, boolean > = new Map();
    let prevPressed: Map< string, boolean > = new Map();

    export function update(): void {
        copymap( currPressed, prevPressed );
    }
    
    export function isKeyDown( keyValue: string ): boolean {
        return currPressed.has( keyValue );
    }
    
    export function wasKeyDown( keyValue: string ): boolean {
        return prevPressed.has( keyValue );
    }
    
    function onKeyDown( ke: KeyboardEvent ): void {
        currPressed.set( ke.key, true );
    }
    
    function onKeyUp( ke: KeyboardEvent ): void {
        currPressed.delete( ke.key );
    }

    // Add event listeners
    window.addEventListener("keydown", ( event ) => { onKeyDown( event ); }, false );
    window.addEventListener("keyup", ( event ) => { onKeyUp( event ); }, false );
}