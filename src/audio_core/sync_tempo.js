import {getTrack} from './audio_base.js';

export function setBPM () {
    let new_tempo = 60000 / this.value;
    Metronome.tempo = new_tempo;
    syncTempo(this);
}

export function findTempo(length) {
    length = length * 1000;
    while (length > 800) {      // caps on 75 bpm
        length = length / 2;
    }
    length = length / Metronome.barRatio;
    return length;
}

export function syncTempo(caller) {
    const boxes = document.querySelectorAll('.syncmode');
    let track, player;
    if (caller) caller = caller.className;
    boxes.forEach( box => {
        track = box.closest('.track');
        player = getTrack(track.id);
        // if 'this' is true, it's been called by some element, not by another function!
        // Set all other lead boxes to follow;
        if (box.value === 'Lead') {
          if ((this && this.value === 'Lead' &&
            track.id != this.closest('.track').id) || caller === 'set_bpm') box.value = 'Follow';
        }

        // process ratios for all but 'free' tracks;
        if (box.value === 'Follow') {
            let ratio = findTempo(player.length) / Metronome._tempo;
            player.sync = ratio;

        } else if (box.value === 'Lead') {
            const bpm_box = document.querySelector('.set_bpm');
            let new_tempo = findTempo(player.length);
            Metronome.tempo = new_tempo;
            if (caller != 'set_bpm') bpm_box.value = 60000 / new_tempo;
            player.sync = 1;
        } else {
            player.sync = 1;
        }
    });
}
