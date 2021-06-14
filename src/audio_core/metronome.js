import {audioctx} from './audio_base.js';

export default class Metronome {
    constructor() {
        this._tempo = 500;
        this._div = 1;
        this._ticks = 0;
        this.frames = 0;
        this.playing = false;
        this.barLength = 4;
        // audible click params;
        this.audible = false;
        this.tone = audioctx.createOscillator();
        this.tone.start();
        this.envelope = audioctx.createGain();
        this.envelope.gain.value = 0;
        this.tone.connect(this.envelope);
        this.envelope.connect(audioctx.destination);
        this.clickLevel = .2;
    }
    set tempo(v) {
        this._tempo = v;
        let speed = this._tempo * this._div;
        let maestro = document.querySelector('.play_animation');
        maestro.style.setProperty('--speed',speed*2+'ms');
        if (this.playing) {
            clearInterval(this.frames);
            this.frames = setInterval( () => this.click(), speed);
        }
    }
    set division(v) {
        this._div = v;
        let speed = this._tempo * this._div;
        let maestro = document.querySelector('.play_animation');
        maestro.style.setProperty('--speed',speed*2+'ms');
        if (this.playing) {
            clearInterval(this.frames);
            this.frames = setInterval( () => this.click(), speed);
        }
    }
    start() {
        if (this.playing) return;
        this.playing = true;
        this.click();
        this.frames = setInterval( () => this.click(), this._tempo*this._div );
    }
    stop() {
        this._ticks = 0;
        this.playing = false;
        clearInterval(this.frames);
    }
    click() {
        if (this.audible) {
            if (this._ticks === 0) this.tone.frequency.value = 1760;
            else this.tone.frequency.value = 880;
            this.envelope.gain.setValueAtTime(this.clickLevel, 0);
            this.envelope.gain.setTargetAtTime(0, .05, .05);
        }
        this._ticks = (this._ticks + 1) % this.barLength;
    }
}
