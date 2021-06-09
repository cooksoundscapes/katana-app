import {Players} from './audio_base.js';

export default function clipStop(track,group) {
    let anim = track.id+'_anim';
    let slices = track.querySelectorAll('.slicers');
    Players[group].stop();
    cancelAnimationFrame(window[anim]);
    slices.forEach( slice => {
        slice.style.background = 'transparent';
    });
}
