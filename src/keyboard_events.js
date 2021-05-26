import playSlice from './audio_core/play_slice.js';

const qwert = ['q','w','e','r','t','y','u','i','o','p'];
const asdf =  ['a','s','d','f','g','h','j','k','l','ç'];
const zxcv = ['z','x','c','v','b','n','m',',','.',';'];

export default function setKeyRow () {
    return;
}

function gridCoords (key) {
    let coords;
    if (qwert.includes(key)) {
        coords = [0,qwert.findIndex(val => val === key)];
    } else if (asdf.includes(key)) {
        coords = [1,asdf.findIndex(val => val === key)];
    } else if (zxcv.includes(key)) {
        coords = [2,zxcv.findIndex(val => val === key)];
    }
    return coords;
}

window.addEventListener('keypress', pressed => {
    pressed = pressed.key.toLowerCase();
    pressed = gridCoords(pressed);
    if (!pressed) return;
    const boxes = document.querySelectorAll('.keyrow');
    let slice;
    boxes.forEach(box => {
        if (box.selectedIndex - 1 === pressed[0]) {
            slice = box.closest('.track').querySelectorAll('.slicer')[pressed[1]];
            if (!slice) return;
            slice.style.opacity = .5;
            slice.onclick();
        }
    });
});
