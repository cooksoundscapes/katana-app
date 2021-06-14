let audioctx;
let masterVolume;
const Players = {};
const Tracks = [];

import waveDraw from '../wave_draw.js';

export function debug() {
    console.log(Players);
    console.log(Tracks);
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
    // from here, the dB conversion for viewing;
    real_value = ratioTodB(real_value);
    real_value = isFinite(real_value) ? real_value.toFixed(2) :
    '-<span class="material-icons-outlined">all_inclusive</span>';
    const decibels = document.querySelector('.decibels');
    decibels.innerHTML = real_value+'dB';
}

export function getTrack(id) {
    return Tracks.find(trk => trk.id === id);
}

export function ratioTodB(ratio) {
    return 20 * Math.log10(ratio);
}

export function reverseClip() {
	let id = this.closest('.track').id;
    const player = getTrack(id);
    player.reverse = this.checked;
    for (let i = 0; i < player.clip.numberOfChannels; i++) {
        player.clip.getChannelData(i).reverse();
    }
}

export function groupChange() {
    const track = this.closest('.track');
    const player = getTrack(track.id);
    let last = this.getAttribute('previous');
    if (last != this.value) {
        if (Players[last]) {
            let slices = track.querySelectorAll('.slicer');
            let groups = document.querySelectorAll('.set_group');
            let isusing = [...groups].some(a => parseInt(a.value) == last);
            if (!isusing) {
                player.stop();
                console.log('stopping');
            }
        }
        player.group = this.value;
        this.setAttribute('previous', this.value);
    }
}

export {audioctx, Players, Tracks, masterVolume};
