const Grid = {
    0: null,
    1: ['q','w','e','r','t','y','u','i','o','p'],
    2: ['a','s','d','f','g','h','j','k','l','ç'],
    3: ['z','x','c','v','b','n','m',',','.',';']
};

export default function setKeyRow() {
    const track = this.closest('.track');
    const slices = track.querySelectorAll('.slicer');
    const selectedRow = this.selectedIndex;
    let sliceIndex;
    slices.forEach(slice => {
        if (!Grid[selectedRow]) {
            slice.textContent = null;
        } else {
            sliceIndex = slice.getAttribute('index');
            slice.textContent = Grid[selectedRow][sliceIndex];
        }
    });
}

function gridCoords (key) {
    let coords;
    if (Grid[1].includes(key)) {
        coords = [0,Grid[1].findIndex(val => val === key)];
    } else if (Grid[2].includes(key)) {
        coords = [1,Grid[2].findIndex(val => val === key)];
    } else if (Grid[3].includes(key)) {
        coords = [2,Grid[3].findIndex(val => val === key)];
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
            slice.style.setProperty('background', 'rgba(255,255,255,.7)');
            setTimeout( () => slice.style.setProperty('background', 'transparent'), 100);
            slice.onclick();
        }
    });
});
