function degueux(textToSend) {
	console.log("bla");
	localStorage.setItem("value_to_send", textToSend);
}

function open_cue_options(id) {
	localStorage.setItem("cue_selected", id)

	let win_TR = new BrowserWindow({frame: false, width: 1200, height: 800, modal: true});
	const modalPath = path.join('file://', __dirname, 'sections/cue_options.html');
	win_TR.on('close', function () { win_TR = null });
	win_TR.loadURL(modalPath);

	
	win_TR.show()
	
	win_TR.on('closed', () => {
	    win_TR = null;
	    display_cue_list();
	})
}



