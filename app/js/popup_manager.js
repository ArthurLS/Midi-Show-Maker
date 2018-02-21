
function initii() {
	console.log("here");
	console.log(document.getElementById("field").value);
	localStorage.setItem("value_to_send", document.getElementById("field").value);
}

function degueux(textToSend) {
	console.log("bla");
	localStorage.setItem("value_to_send", textToSend);
}

function open_options_win() {
	const modalPath = path.join('file://', __dirname, 'sections/cue_options.html');
	let win = new BrowserWindow({ frame: false, width: 800, height: 600 });
	win.on('close', function () { win = null });
	win.loadURL(modalPath);
	win.show();
}


function init_options_win(){
	document.getElementById("result").innerHTML = localStorage.getItem("value_to_send");
}