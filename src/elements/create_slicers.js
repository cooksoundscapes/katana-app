import PlaySlice from '../audio_core/play_slice.js';

export function createSlicers(track,divisions) {
    let list;
    if (list = track.querySelectorAll('.slicer')) {
        list.forEach( slice => {slice.remove();} );
    }
    let slicer;
    const shade_area = parseInt(track.getAttribute('shade_area')) || 0;
    const start_x = track.querySelector('.start_point').offsetLeft;
    const width = (track.offsetWidth - shade_area) / divisions;
    for (let i = 0; i < divisions; i++) {
        slicer = document.createElement('button');
        slicer.className = 'slicer';
        slicer.style.width = width+'px';
        slicer.style.left = (i * width)+start_x+'px';
        slicer.setAttribute('index',i);
        slicer.onclick = PlaySlice;
        track.appendChild(slicer);
    }
}

export function setSlices () {
    const track = this.closest('.track');
    const value = this.value;
    createSlicers(track,value);
}
