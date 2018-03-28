function open_popup(command, id) {
	console.log("open_popup: command -> "+command+" :/ id -> "+id);
	let win_TR = new BrowserWindow({frame: false, width: 1200, height: 800, modal: true, show: false});
	var modalPath;
	if(command == "new_event" || command == "edit_event"){

		modalPath = path.join('file://', __dirname, 'sections/event_options.html?command='+command+'&event_name='+id);
	}
	else{
		modalPath = path.join('file://', __dirname, 'sections/cue_options.html?command='+command+'&event_name='+event_selected+'&cue_id='+id);
	}
	var nb_event = Object.keys(project.list_events).length;
	win_TR.loadURL(modalPath);


	win_TR.on('closed', () => {
		// Allows to select the new_event selected (if there was one in the popup)
		// We can also do that with if(id == "new_event")
		project = JSON.parse(fs.readFileSync(data_file));
		if (nb_event != Object.keys(project.list_events).length) {
			event_selected = Object.keys(project.list_events)[Object.keys(project.list_events).length - 1];
		}
	    win_TR = null;
	    refresh_UI();
	})

	win_TR.on('ready-to-show', () => {
			win_TR.show()
	})
}

function open_popup_little(command, id) {
    console.log("open_popup: command -> "+command+" :/ id -> "+id);
    let win_TR = new BrowserWindow({frame: false, width: 400, height: 300, modal: true, show: false});
    var modalPath;
    if(command == "new_event" || command == "edit_event"){

        modalPath = path.join('file://', __dirname, 'sections/event_options.html?command='+command+'&event_name='+id);
    }
    else{
        modalPath = path.join('file://', __dirname, 'sections/cue_options.html?command='+command+'&event_name='+event_selected+'&cue_id='+id);
    }
    var nb_event = Object.keys(project.list_events).length;
    win_TR.loadURL(modalPath);


    win_TR.on('closed', () => {
        // Allows to select the new_event selected (if there was one in the popup)
        // We can also do that with if(id == "new_event")
        project = JSON.parse(fs.readFileSync(data_file));
        if (nb_event != Object.keys(project.list_events).length) {
            event_selected = Object.keys(project.list_events)[Object.keys(project.list_events).length - 1];
        }
        win_TR = null;
        refresh_UI();
    })

    win_TR.on('ready-to-show', () => {
        win_TR.show()
    })
}

