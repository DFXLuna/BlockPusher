import { Engine } from "./engine"

window.onload = () => {
    let c = <HTMLCanvasElement>document.getElementById("cnvs");
    let a: Engine = new Engine( c );
}