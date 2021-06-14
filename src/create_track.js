import {audioctx,
        Tracks,
        getTrack,
        startDSP,
        reverseClip,
        groupChange} from './audio_core/audio_base.js';
import syncTempo from './audio_core/sync_tempo.js';
import samplePlayer from './audio_core/sample_player.js';
import {createSimpleLabel,
        createToggle,
        createDropdown,
        createButton,
        createNumberBox} from './elements/basic_elements.js';
import {createGrayArea,
        createTrimHandler} from './elements/create_trim_handlers.js';
import createSlicers from './elements/create_slicers.js';
import {OpenIDBRequest,
        updateDb} from './idb.js';
import waveDraw from './wave_draw.js';
import setKeyRow from './keyboard_events.js';
import exportWav from './audio_core/export_wav.js';

let tracks_total = 0;

export function deleteTrack(caller) {
    let track;
    if (caller instanceof Event) track = event.target.closest('.track');
    else track = caller;

    let player = getTrack(track.id);
    if(player) player.stop();

    let request = OpenIDBRequest();
    request.onsuccess = function() {
        let db = request.result;
        let transaction = db.transaction('files','readwrite');
        let objStore = transaction.objectStore('files');
        objStore.delete(track.id);
    }
    let index = Tracks.indexOf(player);
    Tracks.splice(index,1);
    track.remove();
    tracks_total -= 1;
}

export default function createTrack(file) {
    if (!audioctx) startDSP();
    const id = 'track_#' + tracks_total;
    const track = document.createElement('div');
    const loader = document.createElement('div');
    const track_menu = document.createElement('div');
    const filename = document.createElement('blockquote');
    const sliders_frame = document.createElement('div');
    const canvas = document.createElement('canvas');
    updateDb(file,id);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = function() {
        let arrayBuffer = reader.result;
        audioctx.decodeAudioData(arrayBuffer).then(audioBuffer => {
        waveDraw(audioBuffer.getChannelData(0),canvas);
        let player = new samplePlayer(track,audioBuffer);
        Tracks.push(player);

        },err => {
            alert("Unable to load file.");
            console.log(err);
            deleteTrack(track);

        }).finally( () => {
            loader.remove();
        });
    }
    track.id = id;
	track.className = 'track';
    loader.className = 'loader';
    track.appendChild(loader);
    filename.className = 'filename';
    filename.textContent = file.name;
    track_menu.appendChild(filename);
	track_menu.appendChild(createDropdown('playstyle',['OneShot','Loop','Slice'],setPlayStyle));
    track_menu.appendChild(createDropdown('syncmode',['Free','Follow','Lead'],syncTempo));
    track_menu.appendChild(createToggle('Beat Snap','snap_to_grid',null));
    track_menu.appendChild(createToggle('Reverse','reverse',reverseClip));
    track_menu.appendChild(createDropdown('speed',['25%','50%','100%','150%','200%'],setSpeed,'100%'));
    track_menu.appendChild(createDropdown('keyrow',['None','QWERT...','ASDF...','ZXCV...'],setKeyRow));
    track_menu.appendChild(createNumberBox('Slices:','set_slices',[1,32],setSlices,8));
    track_menu.appendChild(createNumberBox('Group:','set_group',[1,24],groupChange,tracks_total+1));
    track_menu.appendChild(createButton('Export',['export_wav'],exportWav));
    track_menu.appendChild(createButton('Delete',['delete_track'],deleteTrack));
    track_menu.className = 'track_menu';
    track.appendChild(track_menu);
    sliders_frame.className = 'trim_frame';
    track.appendChild(sliders_frame);
    // End of command bar;
	document.body.appendChild(track);
    //those actions needs track appended on body;
    track.appendChild(createGrayArea(0));
    track.appendChild(createTrimHandler(0,'start_point'));
    track.appendChild(createTrimHandler(track.offsetWidth -2,'end_point'));
    track.appendChild(createGrayArea(track.offsetWidth));
    canvas.width = parseFloat(track.offsetWidth);
    canvas.height = parseFloat(track.offsetHeight) - 30;
    track.appendChild(canvas);
    createSlicers(track,8)
	tracks_total += 1;
}

function setPlayStyle() {
    let state = event.target.value;
    let id = event.target.closest('.track').id;
    let player = getTrack(id);
    player.playStyle = state;
}

function setSpeed() {
    let value = event.target.value;
    const track = event.target.closest('.track');
    const player = getTrack(track.id);
    value = parseFloat(value.replace('%','')) / 100;
    player.speed = value;
}

function setSlices () {
    const track = this.closest('.track');
    const value = this.value;
    createSlicers(track,value);
    const player = getTrack(track.id);
    player.allSlices = track.querySelectorAll('.slicer');
    player.sliceCount = this.value;
}
