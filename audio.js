// Web Audio API audio system with preloaded buffers for zero-latency playback
// Falls back to HTML <audio> elements if Web Audio API is unavailable

let audioCtx = null;
const audioBuffers = {};
const activeSources = [];
let audioReady = false;
let audioInitAttempted = false;

const AUDIO_FILES = {
    cavalryCharge: './audio/CavalryCharge.wav',
    buzzer: './audio/Buzzer.wav',
    threeBells: './audio/ThreeBells.wav',
    shift: './audio/Shift.wav',
    endGame: './audio/EndGame.wav',
    sonar: './audio/Sonar.wav'
};

const AUDIO_ELEMENT_IDS = {
    cavalryCharge: 'audioCavalryCharge',
    buzzer: 'audioBuzzer',
    threeBells: 'audioThreeBells',
    shift: 'audioShift',
    endGame: 'audioEndGame',
    sonar: 'audioSonar'
};

async function initAudio() {
    if (audioInitAttempted) return;
    audioInitAttempted = true;

    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        const loadPromises = Object.entries(AUDIO_FILES).map(async ([key, url]) => {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                audioBuffers[key] = await audioCtx.decodeAudioData(arrayBuffer);
            } catch (err) {
                console.error(`Failed to load audio: ${key}`, err);
            }
        });

        await Promise.all(loadPromises);

        const loadedCount = Object.keys(audioBuffers).length;
        if (loadedCount > 0) {
            audioReady = true;
            if (loadedCount < Object.keys(AUDIO_FILES).length) {
                console.warn(`Only ${loadedCount}/${Object.keys(AUDIO_FILES).length} audio files loaded via Web Audio API`);
            }
        }
    } catch (err) {
        console.warn('Web Audio API unavailable, using HTML audio fallback', err);
    }
}

function resumeAudioContext() {
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playAudio(key) {
    // Primary: Web Audio API (zero-latency, works in background tabs)
    if (audioReady && audioCtx && audioBuffers[key]) {
        resumeAudioContext();
        try {
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffers[key];
            source.connect(audioCtx.destination);
            source.start(0);
            activeSources.push(source);
            source.onended = () => {
                const idx = activeSources.indexOf(source);
                if (idx > -1) activeSources.splice(idx, 1);
            };
            return;
        } catch (err) {
            console.error(`Web Audio play failed for ${key}, falling back`, err);
        }
    }

    // Fallback: HTML <audio> element
    const el = document.getElementById(AUDIO_ELEMENT_IDS[key]);
    if (el) {
        el.currentTime = 0;
        el.play().catch(err => console.error(`HTML audio play failed for ${key}`, err));
    }
}

function matchCavalryCharge() { playAudio('cavalryCharge'); }
function matchBuzzer() { playAudio('buzzer'); }
function matchThreeBells() { playAudio('threeBells'); }
function matchShift() { playAudio('shift'); }
function matchSonar() { playAudio('sonar'); }
function matchEndGame() { playAudio('endGame'); }

function killAudio() {
    // Stop all Web Audio source nodes
    activeSources.forEach(source => {
        try { source.stop(0); } catch(e) {}
    });
    activeSources.length = 0;

    // Stop all HTML audio elements
    document.querySelectorAll("audio").forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

// Start preloading audio immediately (defer script runs after DOM parse)
initAudio();