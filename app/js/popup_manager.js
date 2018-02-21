function degueux(textToSend) {
	console.log("bla");
	localStorage.setItem("value_to_send", textToSend);
}

function open_win_TR() {
	let win_TR = new BrowserWindow({ frame: false, width: 800, height: 600, modal: true });
	const modalPath = path.join('file://', __dirname, 'sections/cue_options.html');
	win_TR.on('close', function () { win_TR = null });
	win_TR.loadURL(modalPath);
	win_TR.show();
}
