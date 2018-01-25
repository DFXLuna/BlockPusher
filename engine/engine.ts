export default class Engine{
    // Until we work out engine / site interaction, the engine will require the
    // canvas
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;

    constructor( cnvs: HTMLCanvasElement ){
        this.canvas = cnvs;
        this.context = this.canvas.getContext("2d");
        
        this.gameLoop();
    }
    private gameLoop(){
        console.log("gameLoop was entered");
    }
}