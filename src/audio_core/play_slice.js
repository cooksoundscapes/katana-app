import {audioctx, Clips, Players, masterVolume} from './audio_base.js';

export default function PlaySlice() {
    const slice = this;
    const track = slice.closest('.track');
	const id = track.id;
    const group = track.querySelector('.set_group').value;
    const play_style = track.querySelector('.playstyle').value;
    const anim = group+'_anim';
    let reverse = track.querySelector('.reverse').checked;
    let start_slice = slice.getAttribute('index');
    let all_slices;
    let slice_count;
    let length;
    let rate;
    let start_point;
    let end_point;
    let frame;
    let position;
    let last_pos;
    let offset = audioctx.currentTime;
    const debug = document.querySelector('.debug');
    updateParams();
    playStart();

    function updateParams() {
        reverse = track.querySelector('.reverse').checked;
        all_slices = track.querySelectorAll('.slicer');
        slice_count = all_slices.length;
        rate = track.getAttribute('rate');
        length = parseFloat(track.getAttribute('real_length') || Clips[id].duration);
        start_point = parseFloat(track.querySelector('.start_point').getAttribute('position'));
        end_point = parseFloat(track.querySelector('.end_point').getAttribute('position')) || Clips[id].duration;
        if (Players[group]) {
            Players[group].playbackRate.value = rate;
            Players[group].loopStart = start_point;
            Players[group].loopEnd = end_point;
        }
        frame = audioctx.currentTime-offset + start_slice;
    }

    function playStart() {
        if (reverse) {
            start_slice = Math.abs(slice_count-1-start_slice);
            start_point = Math.max(0,Clips[id].duration - end_point);
        }
        start_slice = length * (start_slice / slice_count);
        if (Players[group]) {Players[group].stop();}
        Players[group] = audioctx.createBufferSource();
        Players[group].buffer = Clips[id];
        Players[group].playbackRate.value = rate;
        Players[group].connect(masterVolume);

        all_slices.forEach( slice => {
            slice.style.background = 'transparent';
        });
        cancelAnimationFrame(window[anim]);

        if (play_style === 'Loop') {
            Players[group].loop = true;
            Players[group].start(0,start_point + start_slice);

        } else if (play_style === 'Slice') {
            length = length / slice_count;
            Players[group].start(0,start_point + start_slice, length);
            slice.style.setProperty('background', 'rgba(255,255,255,.5)')
            setTimeout(() => slice.style.setProperty('background', 'transparent'), length*1000);
            return;

        } else { //OneShot
            Players[group].start(0,start_point + start_slice, length - start_slice);
        }
        window[anim] = requestAnimationFrame(animationLoop);
    }

    function animationLoop() {
        updateParams();
		if (frame >= length/rate) {
			if (play_style === 'Loop') {
    			offset = audioctx.currentTime;
                frame = 0;
                start_slice = 0;
    		} else {
                Players[group].stop();
                cancelAnimationFrame(window[anim]);
                all_slices[position].style.setProperty('background', 'transparent');
                return;
            }
		}
		position = Math.trunc(frame / (length/rate) * slice_count);
        if (reverse) position = Math.abs(slice_count-1-position);

        if (position != last_pos) {
            all_slices[position].style.setProperty('background', 'rgba(255,255,255,0.35)');
            if (all_slices[last_pos]) all_slices[last_pos].style.setProperty('background', 'transparent');
            last_pos = position;
        }
		cancelAnimationFrame(window[anim]);
		window[anim] = requestAnimationFrame(animationLoop);
	}
}
