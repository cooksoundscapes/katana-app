import {audioctx, Players, masterVolume} from './audio_base.js';

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
    }
    clearSlices() {
        this.allSlices.forEach(slice => slice.style.background = 'transparent');
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

    trimHandler(bar) {
        let track = document.getElementById(this.id);
        let x = bar.offsetLeft;
        let seconds = x / track.offsetWidth;
        seconds = this.clip.duration * seconds;
        if (bar.classList.contains('start_point')) this.startPoint = seconds;
        else if (bar.classList.contains('end_point')) this.endPoint = seconds;
        this.length = this.clip.duration - (this.startPoint + (this.clip.duration - this.endPoint));
        let group = this.group;
        if (Players[group]) {
            Players[group].loopStart = this.startPoint;
            Players[group].loopEnd = this.endPoint;
        }
    }

    stop() {
        if (Players[this.group]) Players[this.group].stop();
        cancelAnimationFrame(this.loopFrame);
        this.clearSlices();
    }
    start(sliceObj) {
        let slice = sliceObj.getAttribute('index');
        let start;
        if (this.reverse) {
            slice = Math.abs(this.sliceCount-1-slice);
            start = Math.max(0,this.clip.duration - this.endPoint);
        } else start = this.startPoint;
        slice = this.length * (slice / this.sliceCount);
        let group = this.group;
        if (Players[group]) Players[group].stop();
        Players[group] = audioctx.createBufferSource();
        Players[group].buffer = this.clip;
        Players[group].playbackRate.value = this.rate;
        Players[group].connect(masterVolume);
        this.clearSlices();
        cancelAnimationFrame(this.loopFrame);

        if (this.playStyle === 'Loop') {
            Players[group].loop = true;
            Players[group].loopStart = this.startPoint;
            Players[group].loopEnd = this.endPoint;
            Players[group].start(0, start + slice);
        } else if (this.playStyle === 'Slice') {
            let length = this.length / this.sliceCount;
            Players[group].start(0, start + slice, length);
            sliceObj.style.setProperty('background', 'rgba(255,255,255,.5)')
            setTimeout(() => sliceObj.style.setProperty('background', 'transparent'), length*1000);
            return
        } else Players[group].start(0,start + slice, this.length - slice); //OneShot;
        let last;
        let frame = 0;
        let offset = audioctx.currentTime;
        let obj = this;
        this.loopFrame = requestAnimationFrame(animationLoop);

        function animationLoop() {
            frame = audioctx.currentTime-offset + (slice/obj.rate);
            if (frame >= obj.length/obj.rate) {
                if (Players[group].loop) {
                    offset = audioctx.currentTime;
                    frame = 0;
                    slice = 0;
                } else {
                    Players[group].stop();
                    cancelAnimationFrame(obj.loopFrame);
                    obj.clearSlices();
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
