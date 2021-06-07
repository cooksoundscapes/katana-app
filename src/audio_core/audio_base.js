let audioctx;
let masterVolume;
const Clips = {};
const Players = {};

import {tracks_total} from '../create_track.js';
import waveDraw from '../wave_draw.js';

export function debug() {
    console.log(Clips);
    console.log(Players);
    console.log(tracks_total);
}

export function startDSP() {
	audioctx = new (window.AudioContext ||
				    window.webkitAudioContext);
    masterVolume = audioctx.createGain(1);
    masterVolume.connect(audioctx.destination);
}

export function setMasterVol() {
    if (!audioctx) startDSP();
    let real_value = this.value ** 2;
    masterVolume.gain.value = real_value;
    real_value = ratioTodB(real_value);
    real_value = isFinite(real_value) ? real_value.toFixed(2):
    '-<span class="material-icons-outlined">all_inclusive</span>';
    const decibels = document.querySelector('.decibels');
    decibels.innerHTML = real_value+'dB';
}

export function reverseClip() {
	let track = this.closest('.track').id;
    for (let i = 0; i < Clips[track].numberOfChannels; i++) {
        Clips[track].getChannelData(i).reverse();
    }
}

export function setSpeed() {
    const track = this.closest('.track');
    let value = this.value;
    value = parseFloat(value.replace('%','')) / 100;
    track.setAttribute('speed',value);
}

export function ratioTodB(ratio) {
    return 20 * Math.log10(ratio);
}

export {audioctx, Clips, Players, masterVolume};
