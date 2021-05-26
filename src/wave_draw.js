export default function waveDraw(clip,canvas) {
	let width = canvas.width;
	let height = canvas.height;
	let ctx = canvas.getContext('2d');
	let x_correction = width/Math.max(1,clip.length);
    ctx.strokeStyle = 'white';
	ctx.moveTo(0,height/2);
	for (let i = 0; i < clip.length; i++) {
		ctx.lineTo(i*x_correction,
		(clip[i]*-1+1)*(height*.5));
	}
	ctx.stroke();
}
