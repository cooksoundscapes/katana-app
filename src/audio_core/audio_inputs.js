import waveDraw, {audioScope} from '../wave_draw.js';
import {audioctx, startDSP} from './audio_base.js';

let rec;
let recorded;
let recordBuffer;

function stereoToMono(source) {
    // Seems like a linux related problem:
    // The phases of the L and R channel of the microphone are inverted!!
    // So, when the MediaStream object, by default, joins them on mono,
    // it gets no signal whatsoever.

    const splitter = audioctx.createChannelSplitter();
    const monoStreamObject = new MediaStreamAudioDestinationNode(audioctx);
    monoStream = monoStreamObject.stream;
    source.connect(splitter);
    splitter.connect(monoStreamObject);
    return monoStream;
}

export function startRecStream() {
    if (!audioctx) startDSP();

    (function getInputSources() {
        navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const selector = document.querySelector('.audio_devices');
            let option;
            devices.forEach(device => {
                if (device.kind == 'audioinput') {
                    option = document.createElement('option');
                    option.textContent = device.label;
                    option.value = device.deviceId;
                    selector.appendChild(option);
                }
            });
        });
    })();

    let audio_setup = {
        audio: {
            autoGainControl: false,
            echoCancellation: false,
            noiseSuppression: false,
            channelCount: 2
        },
        video: false
    }
    navigator.mediaDevices.getUserMedia(audio_setup)
    .then(function(stream) {
        const canvas = document.getElementById('record_plot');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const analysis = audioctx.createMediaStreamSource(stream);
        audioScope(canvas,analysis,0);

        rec = new MediaRecorder(stream);
        let chunks = [];
        rec.ondataavailable = event => {
            if (event.data) {
                chunks.push(event.data);
            }
        }
        rec.onstart = () => {
            audioScope.start();
        }
        rec.onstop = event => {
            audioScope.stop();
            recorded = new Blob(chunks,{type: 'audio/wav'});
            // pass the buffer to audioContext, for preview;
            const newBuff = recorded.arrayBuffer().then(buffer => {
                audioctx.decodeAudioData(buffer)
                .then(audioBuffer => {
                    recordBuffer = audioBuffer;
                    waveDraw(audioBuffer.getChannelData(0),canvas);
                })
                .finally( () => {
                    chunks = [];
                });
            });
        }
    });
}

export function trackFromRecord() {
    const audioFile = new File(recorded, 'test.wav');
    console.log(audioFile);
}

export function startRecording() {
    let state = rec.state;
    if (state === 'inactive') rec.start();
    else if (state === 'recording') rec.stop();
    this.setAttribute('state', rec.state);
}

export function playRecorded() {
    const player = audioctx.createBufferSource();
    player.buffer = recordBuffer;
    player.connect(audioctx.destination);
    player.start();
    this.disabled = true;
    let length = recordBuffer ? recordBuffer.duration*1000 : 10;
    setTimeout( () => this.disabled = false, length);
}
