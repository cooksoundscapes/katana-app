import {getShadeArea} from './create_trim_handlers.js';
import {getTrack} from '../audio_core/audio_base.js';

export default function createSlicers(track,divisions) {
    let list;
    if (list = track.querySelectorAll('.slicer')) {
        list.forEach( slice => {slice.remove();} );
    }
    let slicer;
    let shadeArea = getShadeArea(track);
    const start_x = track.querySelector('.start_point').offsetLeft;
    const width = (track.offsetWidth - shadeArea) / divisions;
    for (let i = 0; i < divisions; i++) {
        slicer = document.createElement('button');
        slicer.className = 'slicer';
        slicer.style.width = width+'px';
        slicer.style.left = (i * width)+start_x+'px';
        slicer.setAttribute('index',i);
        slicer.onclick = playSlice;
        track.appendChild(slicer);
    }
    const grid_select = track.querySelector('.keyrow');
    grid_select.onchange();
}

function playSlice() {
    const id = this.closest('.track').id;
    const player = getTrack(id);
    player.start(this);
}
