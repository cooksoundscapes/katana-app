import {audioctx} from './audio_core/audio_base.js';

export default function waveDraw(clip,canvas) {
	let width = canvas.width;
	let height = canvas.height;
	let ctx = canvas.getContext('2d');
	let x_correction = width/Math.max(1,clip.length);

    ctx.clearRect(0,0,width,height);
    ctx.beginPath();

    let grad = ctx.createLinearGradient(0,0,0,height);
        grad.addColorStop(0,'#6841C3');
        grad.addColorStop(1,'#ff6d00');
    ctx.strokeStyle = grad;
	ctx.moveTo(0,height/2);
	for (let i = 0; i < clip.length; i++) {
		ctx.lineTo(i*x_correction,
		(clip[i]*-1+1)*(height*.5));
	}
	ctx.stroke();
}

export function audioScope(canvas,source,channel) {
    const analyser = audioctx.createAnalyser();
    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    source.connect(analyser,channel);

    let ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let x_correction = width/Math.max(1,bufferLength);
    let grad = ctx.createLinearGradient(0,0,0,height);
        grad.addColorStop(0,'#6841C3');
        grad.addColorStop(1,'#ff6d00');

    let scope;
    cancelAnimationFrame(scope);
    scope = requestAnimationFrame(waveplot);

    function waveplot() {
        analyser.getByteTimeDomainData(dataArray);
        // clean canvas;
        ctx.clearRect(0,0,width,height);
        ctx.beginPath();
        // draw wave;
        ctx.lineWidth = 2;
        ctx.strokeStyle = grad;
        ctx.moveTo(0,height/2);
        for (let i = 0; i < bufferLength; i++) {
            ctx.lineTo(i*x_correction,
            (dataArray[i]/128.0)*(height*.5));
        }
        ctx.stroke();
        cancelAnimationFrame(scope);
        scope = requestAnimationFrame(waveplot);
    }
    audioScope.stop = () => {
        cancelAnimationFrame(scope);
    }

    audioScope.start = () => {
        cancelAnimationFrame(scope);
        scope = requestAnimationFrame(waveplot);
    }
}
