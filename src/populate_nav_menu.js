import {createNumberBox,
        createButton,
        createSpan,
        createSlider,
        sliderRuleMarks} from './elements/basic_elements.js';
import createTable from './elements/create_table.js';
import {setBPM} from './audio_core/sync_tempo.js';
import {setMasterVol} from './audio_core/audio_base.js';
import {deleteTrack} from './create_track.js';

const menu = document.querySelector('.nav_menu');
menu.appendChild(createButton('Record Now','open_record_box',openRecording));
menu.appendChild(createNumberBox('BPM:','set_bpm',[30,600],setBPM,120));
const master_vol = createSlider('Master: ','master_volume',[0,1],0.005,setMasterVol,1);
menu.appendChild(master_vol);
menu.appendChild(createSpan('0.00dB','decibels'));
menu.appendChild(createButton('Delete All','delete_all',deleteAllTracks));

function openRecording() {
    const modal = document.querySelector('.recording');
    modal.style.display = 'block';
}

function deleteAllTracks() {
    const all = document.querySelectorAll('.track');
    all.forEach(track => deleteTrack(track))
}
