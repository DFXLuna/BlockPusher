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
    // Bind arguments to a function before giving it to the gameloop
    // let boundRect = a.drawRect.bind( a, 0, 0, 100, 100 );
    // a.registerFunction( boundRect );

    // let boundCirc = a.drawCircle.bind( a, 100, 100, 100 );
    // a.registerFunction( boundCirc );
    
    // Register an image with the engine
    // Right now every image in the cache gets rendered at 0,0
    a.registerImage( "./test.png", "test" );
    a.registerImage( "./test2.jpg", "test2" );

    // Start the game loop
    a.gameLoop();
}