import {createButton, createDropdown} from './basic_elements.js';
import {startRecording,
        playRecorded,
        trackFromRecord} from '../audio_core/audio_inputs.js';

export default function createRecordBox () {
    const box = document.createElement('div');
    const canvas = document.createElement('canvas');
    box.className = 'expand-record-box';
    box.appendChild(canvas);
    canvas.className = 'record_plot';
    box.appendChild(createDropdown('audio_devices',[]));
    box.appendChild(createButton('stop_circle',['record_button','material-icons'],startRecording));
    box.appendChild(createButton('play_circle',['play_recorded','material-icons-outlined'],playRecorded));
    box.appendChild(createButton('Create Track',['track_from_rec'],trackFromRecord));
    return box;
}






