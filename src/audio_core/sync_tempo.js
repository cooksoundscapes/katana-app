import {Clips} from './audio_base.js';

let master_tempo = 500; // in milliseconds;

export function setBPM () {
    let new_tempo = 60000 / this.value;
    master_tempo = new_tempo;
    syncTempo(this);
}

export function centsToRatio(input) {
    return 2 ** (input/1200);
}

export function findTempo(track) {
    let length = (parseFloat(track.getAttribute('real_length')) ||
                 Clips[track.id].duration) * 1000;
    while (length > 800) {      // caps on 75 bpm
        length = length / 2;    // works for binary rythms
    }
    return length;
}

export default function syncTempo(caller) {
    const boxes = document.querySelectorAll('.syncmode');
    let track;
    caller = caller.className;
    boxes.forEach( box => {
        track = box.closest('.track');
        if (box.value === 'Lead') {
          if ((this && this.value === 'Lead' &&
            track.id != this.closest('.track').id) ||
            caller === 'set_bpm') {box.value = 'Follow';}
        }

        if (box.value === 'Follow') {
            let rate = findTempo(track) / master_tempo;
            track.setAttribute('sync',rate);
        } else if (box.value === 'Lead') {
            master_tempo = findTempo(track);
            const bpm_box = document.querySelector('.set_bpm');
            if (this) {bpm_box.value = 60000 / master_tempo;}
            track.setAttribute('sync',1);
        } else {
            track.setAttribute('sync',1);
        }
    });
}
