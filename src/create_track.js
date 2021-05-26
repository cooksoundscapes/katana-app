import {audioctx,
        Clips,
        Players,
        startDSP,
        reverseClip,
        setSpeed} from './audio_core/audio_base.js';
import syncTempo from './audio_core/sync_tempo.js';
import trackWatchdog from './audio_core/track_watchdog.js';
import {createSimpleLabel,
        createToggle,
        createDropdown,
        createButton,
        createNumberBox} from './elements/basic_elements.js';
import {createGrayArea,
        createTrimHandler} from './elements/create_trim_handlers.js';
import {createSlicers, setSlices} from './elements/create_slicers.js';
import {OpenIDBRequest,
        updateDb} from './idb.js';
import waveDraw from './wave_draw.js';
import setKeyRow from './keyboard_events.js';

let tracks_total = 0;

function deleteTrack() {
    const track = this.closest('.track');
    const group = track.querySelector('.set_group').value;
    cancelAnimationFrame(window[group+'_anim']);
    let request = OpenIDBRequest();
    request.onsuccess = function() {
        let db = request.result;
        let transaction = db.transaction('files','readwrite');
        let objStore = transaction.objectStore('files');
        objStore.delete(track.id)
    }
    if (Players[group]) Players[group].stop();
    delete Clips[track.id];
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
        Clips[id] = audioBuffer;
        waveDraw(Clips[id].getChannelData(0),canvas);
        },err => {
            console.log("Unable to load file.");
            loader.remove();
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
	track_menu.appendChild(createDropdown('playstyle',['OneShot','Loop','Slice']));
    track_menu.appendChild(createDropdown('syncmode',['Free','Follow','Lead'],syncTempo));
    track_menu.appendChild(createToggle('Reverse','reverse',reverseClip));
    track_menu.appendChild(createDropdown('speed',['25%','50%','100%','150%','200%'],setSpeed,'100%'));
    track_menu.appendChild(createDropdown('keyrow',['None','QWERT...','ASDF...','ZXCV...'],setKeyRow));
    track_menu.appendChild(createNumberBox('Slices:','set_slices',[1,32],setSlices,8));
    track_menu.appendChild(createNumberBox('Group:','set_group',[1,24],null,tracks_total+1));
    track_menu.appendChild(createButton('Delete','delete_track',deleteTrack));
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
    track.setAttribute('sync',1);
    track.setAttribute('rate',1);
    track.setAttribute('speed',1);
    createSlicers(track,8)
    trackWatchdog(track);
	tracks_total += 1;
}
