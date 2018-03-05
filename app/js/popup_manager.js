const ipc = require('electron').ipcRenderer;

ipc.on('initialize_inputs', (event, args) => {
	$('#field').val(args);
})

function open_cue_options(id) {

	let win_TR = new BrowserWindow({frame: false, width: 1200, height: 800, modal: true, show: false});
	const modalPath = path.join('file://', __dirname, 'sections/cue_options.html?id='+id+'&event='+event_selected);
	win_TR.on('close', function () { win_TR = null });
	win_TR.loadURL(modalPath);

	win_TR.on('closed', () => {
	console.log("closing window");
	    win_TR = null;
	    setTimeout(function() {
	    	display_cue_list();
	    }, 50);
	})

	win_TR.on('ready-to-show', () => {
			win_TR.show()
	})
}
