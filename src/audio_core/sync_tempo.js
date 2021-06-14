import {getTrack} from './audio_base.js';

let master_tempo = 500; // in milliseconds;

export function setBPM () {
    let new_tempo = 60000 / this.value;
    master_tempo = new_tempo;
    syncTempo(this);
    Metronome.tempo = new_tempo;
}

export function findTempo(length) {
    length = length * 1000;
    while (length > 800) {      // caps on 75 bpm
        length = length / 2;    // works for binary rythms
    }
    return length;
}

export default function syncTempo(caller) {
    const boxes = document.querySelectorAll('.syncmode');
    let track, player;

    caller = caller.className;
    boxes.forEach( box => {
        track = box.closest('.track');
        player = getTrack(track.id);
        // Set all other lead boxes to follow;
        if (box.value === 'Lead') {
          if ((this && this.value === 'Lead' &&
            track.id != this.closest('.track').id) ||
            caller === 'set_bpm') {box.value = 'Follow';}
        }

        // process ratios for all but 'free' tracks;
        if (box.value === 'Follow') {
            let ratio = findTempo(player.length) / master_tempo;
            player.sync = ratio;

        } else if (box.value === 'Lead') {
            master_tempo = findTempo(player.length);
            const bpm_box = document.querySelector('.set_bpm');
            Metronome.tempo = master_tempo;
            if (this) bpm_box.value = 60000 / master_tempo;
            player.sync = 1;
        } else {
            player.sync = 1;
        }
    });
}
