import {getTrack} from '../audio_core/audio_base.js';
import syncTempo from '../audio_core/sync_tempo.js';

export function createGrayArea(start_x) {
    let gray_area = document.createElement('div');
    gray_area.className = 'gray_area';
    gray_area.style.left = start_x+'px';
    return gray_area;
}

export function createTrimHandler(start_position, id) {
    let handler = document.createElement('div');
    handler.className = 'trim_handler';
    handler.classList.add(id);
    handler.addEventListener('mousedown',startDrag);
    handler.style.left = start_position + 'px';
    return handler;
}

function startDrag() {
    const obj = this;
    const track = obj.closest('.track');
    const player = getTrack(track.id);
    window.onmousemove = ev => {
        ev.preventDefault();
        let new_x = ev.clientX;
        obj.style.left = Math.min(track.offsetWidth-2, new_x)+'px';
        player.trimHandler(obj);
        if(obj.previousSibling.className === 'gray_area') {
            obj.previousSibling.style.width = new_x+'px';
        } else if (obj.nextSibling.className === 'gray_area') {
            obj.nextSibling.style.left = new_x+2+'px';
            obj.nextSibling.style.width = track.offsetWidth - new_x+'px';
        }
        resizeSlices(track);
    }
    window.onmouseup = () => {
        window.onmousemove = null;
        window.onmouseup = null;
    }
}

export function getShadeArea(track) {
    let area = track.querySelectorAll('.gray_area');
    area = [...area].map(obj => obj.offsetWidth);
    area = area.reduce( (a,b) => a+b );
    return area;
}

function resizeSlices(track) {
    const slices = track.querySelectorAll('.slicer');
    let shadeArea = getShadeArea(track);
    let new_width = (track.offsetWidth - shadeArea) / slices.length;
        slices.forEach( slice => {
            slice.style.width = new_width + 'px';
            slice.style.left = slice.getAttribute('index') * new_width +
                track.querySelector('.start_point').offsetLeft + 'px';
        });
}
