import { copymap } from "./copymap";

export namespace Input {
    let currPressed: Map< string, boolean > = new Map();
    let prevPressed: Map< string, boolean > = new Map();

    export function update(): void {
        copymap( currPressed, prevPressed );
    }
    
    export function isKeyDown( keyValue: string ): boolean {
        return currPressed.has( keyValue.toLowerCase() );
    }
    
    export function wasKeyDown( keyValue: string ): boolean {
        return prevPressed.has( keyValue.toLowerCase() );
    }
    
    function onKeyDown( ke: KeyboardEvent ): void {
        currPressed.set( ke.key.toLowerCase(), true );
    }
    
    function onKeyUp( ke: KeyboardEvent ): void {
        currPressed.delete( ke.key.toLowerCase() );
    }

    // Add event listeners
    window.addEventListener("keydown", ( event ) => { onKeyDown( event ); }, false );
    window.addEventListener("keyup", ( event ) => { onKeyUp( event ); }, false );
}