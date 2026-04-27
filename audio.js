const audioCavalryCharge = document.getElementById("audioCavalryCharge");
const audioBuzzer = document.getElementById("audioBuzzer");
const audioThreeBells = document.getElementById("audioThreeBells");
const audioShift = document.getElementById("audioShift");
const audioEndGame = document.getElementById("audioEndGame");
const audioSonar = document.getElementById("audioSonar");

const audioElements = {
    cavalryCharge: audioCavalryCharge,
    buzzer: audioBuzzer,
    threeBells: audioThreeBells,
    shift: audioShift,
    endGame: audioEndGame,
    sonar: audioSonar
};

let audioPreloaded = false;

function preloadAllAudio() {
    const promises = Object.values(audioElements).map(audio => {
        return new Promise((resolve, reject) => {
            if (audio.readyState >= 4) {
                resolve();
                return;
            }
            
            audio.addEventListener('canplaythrough', () => resolve(), { once: true });
            audio.addEventListener('error', (e) => {
                console.error('Audio preload failed:', audio.src, e);
                reject(new Error(`Failed to load audio: ${audio.src}`));
            }, { once: true });
            
            audio.load();
            
            setTimeout(() => {
                if (audio.readyState >= 3) {
                    resolve();
                } else {
                    reject(new Error(`Audio preload timeout: ${audio.src}`));
                }
            }, 5000);
        });
    });
    
    return Promise.all(promises).then(() => {
        audioPreloaded = true;
        console.log('All audio preloaded successfully');
    }).catch(error => {
        console.error('Audio preloading failed:', error);
        audioPreloaded = false;
        throw error;
    });
}

function isAudioReady() {
    return audioPreloaded && Object.values(audioElements).every(audio => audio.readyState >= 3);
}

function playAudioImmediate(audio) {
    if (audio.readyState >= 2) {
        audio.currentTime = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Audio playback failed:', error);
            });
        }
    } else {
        console.warn('Audio not ready, skipping playback:', audio.src);
    }
}

function matchCavalryCharge() {
    playAudioImmediate(audioCavalryCharge);
}

function matchBuzzer() {
    playAudioImmediate(audioBuzzer);
}

function matchThreeBells() {
    playAudioImmediate(audioThreeBells);
}

function matchShift() {
    playAudioImmediate(audioShift);
}

function matchSonar() {
    playAudioImmediate(audioSonar);
}

function matchEndGame() {
    playAudioImmediate(audioEndGame);
}

function killAudio() {
    document.querySelectorAll("audio").forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

window.addEventListener('DOMContentLoaded', preloadAllAudio);