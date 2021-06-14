import {createNumberBox,
        createButton,
        createSpan,
        createSlider,
        createToggle,
        sliderRuleMarks} from './elements/basic_elements.js';
import createRecordBox from './elements/record_box.js';
import createMetronomeBox from './elements/metronome_box.js';
import {setMasterVol} from './audio_core/audio_base.js';
import {deleteTrack} from './create_track.js';
import {stopRecStream,
        startRecStream} from './audio_core/audio_inputs.js';

const menu = document.querySelector('.nav_menu');
menu.appendChild(createButton('Record Now',['open_record_box'],openRecording));
menu.appendChild(createButton('Delete All',['delete_all'],deleteAllTracks));
const master_vol = createSlider('Master: ','master_volume',[0,1],0.005,setMasterVol,1);
master_vol.appendChild(createSpan('0.00dB','decibels'));
menu.appendChild(master_vol);
menu.appendChild(createMetronomeBox());
menu.appendChild(createRecordBox());

function openRecording() {
    const expandCollapse = document.querySelector('.expand-record-box');
    const canvas = expandCollapse.querySelector('canvas');
    if (expandCollapse.offsetHeight < 50) {
        expandCollapse.style.height = '140px';
        setTimeout( () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            startRecStream();
        }, 500);
    } else {
        expandCollapse.style.height = 0;
        stopRecStream();
    }
}

function deleteAllTracks() {
    if (confirm('Are you sure?')) {
        const all = document.querySelectorAll('.track');
        all.forEach(track => deleteTrack(track));
    }
}
