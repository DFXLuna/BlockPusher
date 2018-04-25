export namespace Time {
    let startTime = Date.now();
    let lastUpdate = 0;
    let deltaTime = 0;

    export function setup() {
        startTime = Date.now();
        lastUpdate = 0;
        deltaTime = 0;
    }

    export function update(): void {
        let now = Date.now() - startTime;
        deltaTime = now - lastUpdate;
        lastUpdate = now;
    }

    export function getTime(): number {
        return lastUpdate / 1000;
    }

    export function getDelta(): number {
        return deltaTime / 1000;
    }
}