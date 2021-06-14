import {createNumberBox,
        createButton,
        createToggle,
        createSpan} from './basic_elements.js';
import {setBPM} from '../audio_core/sync_tempo.js';
import {Tracks} from '../audio_core/audio_base.js';


export default function createMetronomeBox() {
    const box = document.createElement('div');
    box.className = 'metronome_box';
    box.appendChild(createButton('Stop',['stop_all_button'],() => {
        Metronome.stop();
        Tracks.forEach(player => player.stop());
        play_animation.setAttribute('playing',false);
    }));
    box.appendChild(createButton('Play',['global_play_button'],() => {
        Metronome.start();
        play_animation.setAttribute('playing',true);
    }));
    box.appendChild(createToggle('Click','click_audit',() => Metronome.audible = event.target.checked));
    const play_animation = document.createElement('div');
    play_animation.className = 'play_animation';
    play_animation.setAttribute('playing',false);
    box.appendChild(play_animation);
    const measure_box = document.createElement('div');
    measure_box.className = 'measure_box';
    measure_box.appendChild(createNumberBox(null,'set_bar_length',[2,32],setBar,4));
    measure_box.appendChild(createSpan('/'));
    measure_box.appendChild(createNumberBox(null,'set_beat_value',[2,32],powerOfTwo,4));
    box.appendChild(measure_box);
    box.appendChild(createNumberBox('BPM:','set_bpm',[30,600],setBPM,120));
    return box;
}

function powerOfTwo() {
    let a = parseInt(this.value);
    while (Math.log2(a) % 1 != 0) {
        a += 1;
    }
    this.value = a;
    Metronome.division = 4/a;
}

function setBar() {
    let v = parseInt(this.value);
    Metronome.barLength = v;
}
