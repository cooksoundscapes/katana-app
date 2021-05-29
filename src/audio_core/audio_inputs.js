import waveDraw from '../wave_draw.js';

export function getInputSources() {
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
}

export function startRecording() {
    const chunks = [];
    const canvas = document.getElementById('record_plot');
    //const OLHAI = navigator.mediaDevices.getSupportedConstraints();
    //console.log(OLHAI);
    let audio_setup = {
        audio: true,
        autoGainControl: false,
        echoCancellation: false,
        noiseSuppression: false,
    };
    navigator.mediaDevices.getUserMedia(audio_setup)
    .then(function(stream) {
        const rec_setup = {mimeType: 'audio/webm'};
        const rec = new MediaRecorder(stream,rec_setup);
        rec.addEventListener('dataavaliable', function(event) {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        });
        console.log('recording...');
        rec.start();
        setTimeout(() => {
            rec.stop();
            const recorded = new Blob(chunks);
            console.log(recorded);
            console.log('done recording.');
        },3000);

    })
    .catch(function(error) {
        console.log(error);
    });
}

