"use strict";

import createTrack from './create_track.js';
import './populate_nav_menu.js';
import './idb.js';
import './style/style.scss';
import './style/nav_menu.scss';
import './style/track.scss';
import './style/record_window.scss';

let fileloader = document.querySelector('.fileloader');
fileloader.addEventListener('change',files => {
    let file_list = files.target.files;
	file_list = [...file_list];
	file_list.forEach(createTrack);
});

window.addEventListener("dragover",function(event) {
	event.preventDefault();
},false);

window.addEventListener("drop",function(event) {
	event.preventDefault();
	let file_list = event.dataTransfer.files;
	file_list = [...file_list];
	file_list.forEach(createTrack);
},false);

