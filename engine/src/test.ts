import { Engine } from "./engine";


window.onload = () => {
    // The engine will grab the canvas from the html by name and create its
    // context
    let a: Engine = new Engine( "cnvs" );

    // // Register a test function that will be called once every game loop
    // a.registerFunction( () => {
    //     console.log("Function1");
    // }
    // );

    // // Functions are called in the order they are registered
    // a.registerFunction( () => {
    //     console.log("Function2");
    // }
    // );

    // Draw a red triangle to screen
    a.registerFunction( () => {
        // tryGetContext is only for prototyping
        let ctx = a.tryGetContext();
        if( ctx !== null ){
            ctx.beginPath()
            ctx.moveTo( 0, 0 )
            ctx.lineTo( 99, 0 )
            ctx.lineTo( 101, 99 )
            ctx.lineTo( 0, 0 )
            ctx.strokeStyle = 'red'
            ctx.stroke()
        }

    }
    );

    // Start the game loop
    a.gameLoop();
}

