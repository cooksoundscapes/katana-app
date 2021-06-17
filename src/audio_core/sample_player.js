import {audioctx, Players, masterVolume} from './audio_base.js';
import {syncTempo} from './sync_tempo.js';

export default class samplePlayer {
    constructor(track,clip) {
        this.id = track.id;
        this.clip = clip;
        this.group = track.querySelector('.set_group').value;
        this.playStyle = track.querySelector('.playstyle').value;
        this.loopFrame = this.group+'_anim';
        this.reverse = false;
        this.rate = 1;
        this.startPoint = 0;
        this.length = clip.duration;
        this.endPoint = clip.duration;
        this.allSlices = track.querySelectorAll('.slicer');
        this.sliceCount = this.allSlices.length;
        this.gainNode = audioctx.createGain();
        this.gainNode.connect(masterVolume);
    }
    set sync (value) {
        this._sync = value;
        this.rate = value * (this._speed || 1);
        if (Players[this.group]) Players[this.group].playbackRate.value = this.rate;
    }
    set speed (value) {
        this._speed = value;
        this.rate = value * (this._sync || 1);
        if (Players[this.group]) Players[this.group].playbackRate.value = this.rate;
    }
    set gain(v) {
        this.gainNode.gain.value = v;
    }
    clearSlices() {
        this.allSlices.forEach(slice => slice.style.background = 'transparent');
    }
    trimHandler(bar) {
        let track = document.getElementById(this.id);
        let x = bar.offsetLeft;
        let seconds = x / track.offsetWidth;
        seconds = this.clip.duration * seconds;
        if (bar.classList.contains('start_point')) this.startPoint = seconds;
        else if (bar.classList.contains('end_point')) this.endPoint = seconds;
        this.length = this.clip.duration - (this.startPoint + (this.clip.duration - this.endPoint));
        syncTempo();
        let group = this.group;
        if (Players[group]) {
            Players[group].loopStart = this.startPoint;
            Players[group].loopEnd = this.endPoint;
        }
    }
    createSnapLoader (speed) {
        const box = document.getElementById(this.id).querySelector('.snap_to_grid').closest('.toggle_button');
        const span = box.querySelector('span');
        const loader = document.createElement('div');
        loader.innerHTML = '<svg><circle cx="8" cy="8" r="4" /></svg>'
        loader.className = 'snap_loader';
        loader.style.setProperty('--duration',speed+'s');
        box.replaceChild(loader,span);
        box.disabled = true;
    }
    deleteSnapLoader() {
        const box = document.getElementById(this.id).querySelector('.snap_to_grid').closest('.toggle_button');
        const loader = box.querySelector('.snap_loader');
        if (!loader) return;
        const span = document.createElement('span');
        span.textContent = 'Beat Snap';
        box.replaceChild(span,loader);
        box.disabled = false;
    }
    stop() {
        if (Players[this.group]) Players[this.group].stop();
        cancelAnimationFrame(this.loopFrame);
        this.clearSlices();
    }
    start(sliceObj) {
        let slice = sliceObj.getAttribute('index');
        let start;
        let length;
        let group = this.group;
        let snap = 0;
        let frame = 0;
        let offset;
        let obj = this;
        let last;
        if (this.reverse) {
            slice = Math.abs(this.sliceCount-1-slice);
            start = Math.max(0,this.clip.duration - this.endPoint);
        } else start = this.startPoint;
        slice = this.length * (slice / this.sliceCount);

        if (this.playStyle === 'Slice') {
            this.stop();
            Players[group] = audioctx.createBufferSource();
            Players[group].buffer = this.clip;
            Players[group].playbackRate.value = this.rate;
            Players[group].connect(this.gainNode);
            length = (this.length / this.sliceCount) / this.rate;
            Players[group].start(0, start + slice, length);
            sliceObj.style.setProperty('background', 'rgba(255,255,255,.5)')
            setTimeout(() => sliceObj.style.setProperty('background', 'transparent'), length*1000);
            return;
        } else {
            if (this.snapToGrid && Metronome.playing) {
                snap = ((Metronome.barLength * Metronome._tempo)/1000) - Metronome.getTime();
                snap = Math.max(0,snap);
                this.createSnapLoader(snap);
            }
            setTimeout( () => {
                this.stop();
                this.deleteSnapLoader();
                Players[group] = audioctx.createBufferSource();
                Players[group].buffer = this.clip;
                Players[group].playbackRate.value = this.rate;
                Players[group].connect(this.gainNode);
                if (this.playStyle === 'Loop') {
                    Players[group].loop = true;
                    Players[group].loopStart = this.startPoint;
                    Players[group].loopEnd = this.endPoint;
                    Players[group].start(0, start + slice);
                } else { // Oneshot;
                    length = this.length - slice;
                    Players[group].start(0, start + slice, length);
                }
                offset = audioctx.currentTime;
                this.loopFrame = requestAnimationFrame(animationLoop);
                Metronome.start();
            }, snap*1000 );
        }

        function animationLoop() {
            frame = audioctx.currentTime-offset + (slice/obj.rate);
            if (frame >= obj.length/obj.rate) {
                if (Players[group].loop) {
                    offset = audioctx.currentTime;
                    frame = 0;
                    slice = 0;
                } else {
                    obj.stop();
                    return;
                }
            }
            let position = Math.trunc(frame / (obj.length/obj.rate) * obj.sliceCount);
            if (obj.reverse) position = Math.abs(obj.sliceCount-1-position);

            if (position != last) {
                obj.allSlices[position].style.setProperty('background', 'rgba(255,255,255,0.35)');
                if (obj.allSlices[last]) obj.allSlices[last].style.setProperty('background', 'transparent');
                last = position;
            }
            cancelAnimationFrame(obj.loopFrame);
            obj.loopFrame = requestAnimationFrame(animationLoop);
        }
    }
}
