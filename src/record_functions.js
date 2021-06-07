import {startRecording,
        playRecorded,
        trackFromRecord} from './audio_core/audio_inputs.js';

const rec_btn = document.querySelector('.record_button');
rec_btn.addEventListener('click',startRecording);

const play_btn = document.querySelector('.play_recorded');
play_btn.addEventListener('click',playRecorded);

const track_btn = document.querySelector('.track_from_rec');
track_btn.addEventListener('click',trackFromRecord);
