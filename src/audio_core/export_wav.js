import {OpenIDBRequest} from '../idb.js';
import {getTrack} from './audio_base.js';
import {createButton} from '../elements/basic_elements.js';

export default function exportWav() {
    let id = this.closest('.track').id;
    let track = getTrack(id);
    let req = OpenIDBRequest();
    console.log(track.startPoint+' '+track.endPoint);
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
            console.log(url);
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    }
}

function exportWindow() {
    const modal = document.createObject('div');
    const box = document.createObject('div');
    const prompt = document.createObject('p');
    modal.className = 'export_window';
    box.className = 'export_window_prompt';
    box.appendChild(prompt);
    box.appendChild(createButton('Entire Track',null,null));
    box.appendChild(createButton('Remove trimmed parts',null,null));
    modal.appendChild(box);
    document.body.appendChild(modal);
}
