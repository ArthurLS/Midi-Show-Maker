function display_cue_list() {
	var data_file = 'app/json/project.json';
	var project = JSON.parse(fs.readFileSync(data_file));

	var event_obj = project.list_events[event_selected];

	let liste = "<ul class=\"list-group\" class='liste' id=\"list\">";
	for (let i = 0; i < event_obj.cue_list.length; i++) {
		let cue = event_obj.cue_list[i];
		liste += "<span class=\"col-md-12\" onclick=\"open_cue_options("+i+")\">"
		liste += "<li class=\"list-group-item\" id=\"nb" +i+"\">"+i+" Type: "+cue.type+" - Channel: "+cue.channel+" - Note: "+cue.options.param1
		liste += " - Delay: " + cue.delay
		liste += "</li></span>"
	}
	liste += "</ul>"
	$("#list").html(liste);
}

function toggle(a){
    let e = document.getElementById(a);
    if(e.style.display == "block")
        e.style.display = "none";
    else
        e.style.display = "block";
}

function play(i) {
	var msg_midi = event_obj.cue_list[i];
	output.send(msg_midi.type, {
		note: msg_midi.options.note,
		velocity: msg_midi.options.note,
		channel: msg_midi.channel
	});
}
