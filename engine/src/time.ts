export class Time{
    private lastUpdate: number;
    private deltaTime: number;

    constructor(){
        this.lastUpdate = Date.now();
        this.deltaTime = 0;
    }

    public onFrame(): void {
        let curr = Date.now();
        this.deltaTime = curr - this.lastUpdate;
        this.lastUpdate = curr;
    }

    public getLastFrameTime(): number {
        return this.lastUpdate;
    }

    public getDeltaTime(): number {
        return this.deltaTime;
    }

}