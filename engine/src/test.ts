import { Engine } from "./engine";


window.onload = () => {
    let c = <HTMLCanvasElement>document.getElementById("cnvs");
    let a: Engine = new Engine( c );
    a.registerFunction( () => {
        console.log("Register function has been called!");
    }
    );
    a.gameLoop();
}

