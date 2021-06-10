import waveDraw, {audioScope} from '../wave_draw.js';
import {audioctx, startDSP} from './audio_base.js';
import createTrack from '../create_track.js';

let rec;
let recordBuffer;
let preview;
let chunks = [];
let streamOutside;

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
        streamOutside = stream;
        const canvas = document.querySelector('.record_plot');
        const analysis = audioctx.createMediaStreamSource(stream);
        audioScope(canvas,analysis,0);

        rec = new MediaRecorder(stream);
        rec.ondataavailable = event => {
            if (event.data) {
                chunks.push(event.data);
            }
        }
        rec.onstart = () => {
            chunks = [];
            audioScope.start();
        }
        rec.onstop = event => {
            audioScope.stop();
            preview = new Blob(chunks);

            // pass the buffer to audioContext, for preview;
            preview.arrayBuffer().then(buffer => {
                audioctx.decodeAudioData(buffer)
                .then(audioBuffer => {
                    recordBuffer = audioBuffer;
                    waveDraw(audioBuffer.getChannelData(0),canvas);
                })
            });
        }
    });
}

export function stopRecStream() {
    streamOutside.getTracks().forEach( track => track.stop());
}

export function trackFromRecord() {
    let record = new File(chunks,'test.wav', {type: 'audio/wav'});
    createTrack(record);
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
