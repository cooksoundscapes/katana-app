import {OpenIDBRequest} from '../idb.js';
import {audioctx, getTrack} from './audio_base.js';
import {createButton} from '../elements/basic_elements.js';
import waveDraw from '../wave_draw.js';

const toWav = require('audiobuffer-to-wav');

export default function exportWindow() {
    const id = this.closest('.track').id;
    const modal = document.createElement('div');
    const head = document.createElement('p');
    const box = document.createElement('div');
    modal.className = 'export_modal';
    box.className = 'export_window';
    head.textContent = 'Export options for '+id;
    box.appendChild(head);
    box.appendChild(createButton('Entire Track',null,exportWav));
    box.appendChild(createButton('Remove trimmed parts',null,renderWav));
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 60;
    box.appendChild(canvas);
    modal.appendChild(box);
    document.body.appendChild(modal);

    window.onclick = event => {
        if (event.target == modal) {
            modal.remove();
            window.onclick = null;
        }
    }
    function renderWav() {
        const player = getTrack(id);
        let newSize = parseInt(player.length * audioctx.sampleRate); //in samples!;
        let offline = new OfflineAudioContext(1,newSize,audioctx.sampleRate);
        let source = offline.createBufferSource();
        source.buffer = player.clip;
        source.connect(offline.destination);
        source.start(0,player.startPoint);
        offline.startRendering().then( buf => {
            waveDraw(buf.getChannelData(0),canvas);
            let wav = toWav(buf);
            let bin = new Blob([new DataView(wav)], {type: 'audio/wav'});
            let a = document.createElement('a');
            let url = URL.createObjectURL(bin);
            a.href = url;
            a.download = 'test';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }
    function exportWav() {
        let track = getTrack(id);
        let req = OpenIDBRequest();
        req.onsuccess = () => {
            let db = req.result;
            let transaction = db.transaction('files','readonly');
            let objStore = transaction.objectStore('files');
            let find = objStore.get(id);
            find.onsuccess = () => {
                let name = find.result.name;
                let bin = new Blob([find.result], {type: 'audio/wav'});
                let a = document.createElement('a');
                let url = URL.createObjectURL(bin);
                a.href = url;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
        }
    }
}
