import {Clips} from '../audio_core/audio_base.js';
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
    handler.setAttribute('position',0); // might be problematic for end points; fix?
    handler.addEventListener('mousedown',startDrag);
    handler.style.left = start_position + 'px';
    return handler;
}

function startDrag() {
    const obj = this;
    const track = obj.closest('.track');
    window.onmousemove = onMove;
    // for now, 'this' will be referenced as obj

    function onMove(ev) {
        ev.preventDefault();
        obj.style.left = Math.min(track.offsetWidth-2, ev.clientX)+'px';

        // At this point, it shouldn't be here.
        let position = positionToSeconds(track, ev.clientX);
        obj.setAttribute('position',position); // in seconds
        resizeAssets(ev.clientX);
    }

    function resizeAssets(new_x) {
        const slices = track.querySelectorAll('.slicer');
        const gray_areas = track.querySelectorAll('.gray_area');
        let gray_total = 0;

        //update shade areas
        if(obj.previousSibling.className === 'gray_area') {
            obj.previousSibling.style.width = new_x+'px';
        } else if (obj.nextSibling.className === 'gray_area') {
            obj.nextSibling.style.left = new_x+2+'px';
            obj.nextSibling.style.width = track.offsetWidth - new_x+'px';
        }
        // sum all shade area
        gray_areas.forEach(area => {gray_total += area.offsetWidth;});
        let real_length = track.offsetWidth - gray_total;
        real_length = positionToSeconds(track, real_length);
        track.setAttribute('shade_area',gray_total);
        track.setAttribute('real_length', real_length);  // in seconds
        syncTempo(obj);

        // resize / move all slices
        let new_width = (track.offsetWidth - gray_total) / slices.length;
        slices.forEach( slice => {
            slice.style.width = new_width + 'px';
            slice.style.left = slice.getAttribute('index') * new_width +
                track.querySelector('.start_point').offsetLeft + 'px';
        });
    }
    window.onmouseup = () => {
        window.onmousemove = null;
        window.onmouseup = null;
    }
}

function positionToSeconds (track,position) {
    let seconds = position / track.offsetWidth;
    seconds = Clips[track.id].duration * seconds;
    return seconds;
}
