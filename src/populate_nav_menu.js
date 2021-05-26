import {createNumberBox,
        createSpan,
        createSlider} from './elements/basic_elements.js';
import createTable from './elements/create_table.js';
import {setBPM} from './audio_core/sync_tempo.js';
import {setMasterVol} from './audio_core/audio_base.js';

const menu = document.querySelector('.nav_menu');
menu.appendChild(createNumberBox('BPM:','set_bpm',[30,600],setBPM,120));
menu.appendChild(createSlider('Master: ','master_volume',[0,1],0.005,setMasterVol,1));
menu.appendChild(createSpan('0.00dB','decibels'));
menu.appendChild(createSpan('IDB test','idbtest'));
