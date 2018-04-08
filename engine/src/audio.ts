

export namespace AudioComponent {
    
    let audioCache: {[path: string]: HTMLAudioElement} = {};

    export function playSound( soundName: string ) {
        let sound = audioCache[ soundName ];
        if( sound == undefined ) {
            return;
        }
        sound.play();
    }

    export function stopAll() {
        for (let key in audioCache) {
            audioCache[key].pause()
            audioCache[key].currentTime = 0;
        }
    }

    export function registerSound( soundName: string, url: string ): void {
        if (url == null) {
            delete audioCache[ soundName ];
            return;
        }
        let sound = new Audio(url);
        sound.src = url;
        audioCache[ soundName ] = sound;
    }
}