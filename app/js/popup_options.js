const fs = require('fs');
const remote = require('electron').remote;
const {dialog} = require('electron').remote

var data_file = './temp.json';
var project = JSON.parse(fs.readFileSync(data_file));

// list of types from npm 'easymidi' https://www.npmjs.com/package/easymidi
let midi_types = ["noteon", "noteoff", "cc", "programme", "clock", "start", "continue", "stop", "reset", "musicFile"];

let cue_id = null;
let event_selected = "";
let event_obj = "";

let url = new URL(window.location.href);
var command = url.searchParams.get("command");
var canBlur = true;

/*
** Initialise the popup window for a cue
** differs if it's for a new cue or old cue
*/
function init_window_cue(){
	// get the cue

	event_selected += url.searchParams.get("event_name");
	event_obj = project.list_events[event_selected];
	document.getElementById("event_name").innerHTML = event_selected;
	cue_id = url.searchParams.get("cue_id");
	console.log("Cue ID: "+cue_id);

	if (command == 'edit_cue') {
		$("#named_cue_container").attr("hidden", true);
		cue_id = Number(cue_id);
		document.getElementById("cue_id").innerHTML = ", Cue n°"+cue_id;
		// fill the page
		$("#cue_name").val(event_obj.cue_list[cue_id].name);
		$("#channel").val(event_obj.cue_list[cue_id].channel);
		$("#delay").val(event_obj.cue_list[cue_id].delay);

		display_types(event_obj.cue_list[cue_id].type);
		display_options(event_obj.cue_list[cue_id].type);
	}
	else if (command == 'new_cue'){
		$("#named_cue_container").attr("hidden", true);
		$("#channel").val(0);
		$("#delay").val(0);
		display_types('xx');
		display_options('noteon');
		$("#delete_btn").attr("disabled", true);
	}
	else if (command == 'named_cue'){
		display_named_cues();
		$("#input_container").attr("hidden", true);
		$("#name_container").attr("hidden", true);
		$("#save_all_btn").attr("disabled", true);
		$("#save_close_btn").attr("disabled", true);
		$("#delete_btn").attr("disabled", true);
	}
}

/*
** Initialise the popup window for an event
*/
function init_window_event(){
	event_selected += url.searchParams.get("event_name");

	document.getElementById("event_name_title").innerHTML = "Event: "+event_selected;
}

/*
** Close the popup window
*/
function close_window() {
	// close window
	var win = remote.getCurrentWindow();
    win.close();
}

/*
** Saves a new event and close the window
** Name can not be empty
*/
function save_event() {
	var new_event_name = $("#event_name").val()+"";

	if (new_event_name == "") {
        $('#error-display').css('display', 'table');
		$('#bad-boy').html("Please enter an event name");
	}
	else{
		edit_event_name(event_selected, new_event_name);
		add($("#bind").val(),$("#event_name").val());
		close_window();
	}
}

/*
** Saves all the options for a cue (delay, type, channel, options)
** if the cue is new, it creates and adds it to the event
*/
function save_all() {
	var type = $('#type_list').find(":selected").val();
	// if it's for a new cue, we fetch everything from the UI
	if (cue_id == 'xx') {	
		var channel = Number($("#channel").val());
		var delay = Number($("#delay").val());
		var options = {};
		var name = $('#cue_name').val();
		var cue = create_cue(type, channel, delay, name, options);
		cue_id = add_cue(event_obj.cue_list, cue);
		document.getElementById("cue_id").innerHTML = ", Cue n°"+cue_id;
	}
	// updates the cue (command == edit_cue)
	else{
		save_delay();
		save_type();
		save_channel();
		save_name();
	}
	save_options();

	fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
}


/*
** Aux function to save the cue name
*/
function save_name() {
	var name = $('#cue_name').val();
	update_cue_name(event_obj.cue_list, cue_id, name);
}

/*
** Aux function to save the cue type
*/
function save_type() {
	var type = $('#type_list').find(":selected").val();
	update_cue_type(event_obj.cue_list, cue_id, type);
}

/*
** Aux function to save the cue channel
*/
function save_channel() {
	update_cue_channel(event_obj.cue_list, cue_id, Number($("#channel").val()));
}

/*
** Aux function to save the cue delay
*/
function save_delay() {
	var new_id = update_cue_delay(event_obj.cue_list, cue_id, Number($("#delay").val()));
	if (cue_id != new_id) {
		cue_id = new_id;
		document.getElementById("cue_id").innerHTML = cue_id;
	}
}

/*
** Aux function to save the cue options
*/
function save_options() {
	var type = $('#type_list').find(":selected").val();
	if (type == "musicFile") {
		var param1 = Number($("#decalage").val());
		var param2 = Number($("#arret").val());
		var paramText = $("#paramText").val();
	}
	else {
		var param1 = Number($("#param1").val());
		var param2 = Number($("#param2").val());
	}

	update_cue_options(event_obj.cue_list, cue_id, type, param1, param2, paramText);
}

/*
** Deletes a cue and closes a window
*/
function delete_cue() {
	if (cue_id != 'xx') {
		delete_cue_with_index(event_obj.cue_list, cue_id);
		fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
	}
	var win = remote.getCurrentWindow();
    win.close();
}

/*
** Display the html for the cue type selector
*/
function display_types(type) {
	let str = "";
	for (let i = 0; i < midi_types.length; i++) {
		if (midi_types[i] != type){
			if (type == 'xx' && midi_types[i] == 'noteon')
				str += "<option value=\"noteon\" selected>noteon</option>";
			else
				str += "<option value=\""+midi_types[i]+"\">"+midi_types[i]+"</option>";
		}
		else
			str += "<option value=\""+type+"\" selected>"+type+"</option>";
	}

	$("#type_list").html(str);
}

/*
** displays the options according to the cue type
*/
function display_options(type) {
	let cue_options = {param1: 0, param2: 0, paramText: ""};

	if (cue_id != 'xx') {
		cue_options = event_obj.cue_list[Number(cue_id)].options;
	}

	let str = "<div class=\"col-md-12\"> <h2>Options</h2> </div>";

	if (type == "noteon" || type == "noteoff") {
		str += "<div class=\"col-md-4\"><h3>Note [0-127]</h3>"
			+"<input type=\"number\" class=\"form-control\" id=\"param1\" value=\""+cue_options.param1+"\"></div>";

		str += "<div class=\"col-md-4\"><h3>Velocity [0-127]</h3>"
			+"<input type=\"number\" id=\"param2\" class=\"form-control\" value=\""+cue_options.param2+"\"></div>";
	}
	else if(type == "cc"){
		str += "<div class=\"col-md-4\"><h3>Controller [0-127]</h3>"
			+"<input type=\"number\" id=\"param1\" class=\"form-control\" value=\""+cue_options.param1+"\"></div>";

		str += "<div class=\"col-md-4\"><h3>Value [0-127]</h3>"
			+"<input type=\"number\" id=\"param2\" class=\"form-control\" value=\""+cue_options.param2+"\"></div>";
	}
	else if(type == "programme"){
		str += "<div class=\"col-md-4\"><h3>Number [0-127]</h3>"
			+"<input type=\"number\" id=\"param1\" class=\"form-control\" value=\""+cue_options.param1+"\"></div>";
	}
	else if(type == "musicFile") {
		str += "<div class=\"col-md-4\"><h3>File location</h3>"
			+"<input type=\"text\" onclick=\"getFileLocation()\" class=\"form-control\" id=\"paramText\" value=\""+cue_options.paramText+"\"></div>";

		str += "<div class=\"col-md-4\"><h3>Décalage</h3>"
			+"<input type=\"number\" class=\"form-control\" id=\"decalage\" value=\""+cue_options.param1+"\"></div>";

		str += "<div class=\"col-md-4\"><h3>Arrêt</h3>"
			+"<input type=\"number\" id=\"arret\" class=\"form-control\" value=\""+cue_options.param2+"\"></div>";
	}
	else{
		str = "<div class=\"col-md-12\"> <h3>No Options for this type</h3> </div>";
	}
	$("#options_list").html(str);
}

/*
** Listener to change the options according to the cue type
*/
$("#type_list").change(function(){
	var selected_type = $('#type_list').find(":selected").val();
	display_options(selected_type);
});

/*
** Closes the window when the user clicks outside the popup window
*/
$(window).blur(function(){
	if (canBlur)
    	close_window();
});

// Keybord Shortcuts
$(document).keydown(function(e) {
	switch(e.which) {
		case 13:  
			if(command == "edit_event") save_event();
			else check_values(1);
		break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});


/* Popup alert (info)*/
function popup (message) {
    dialog.showMessageBox({
        message: message,
        buttons: ["OK"],
        title: "Popup",
        type: "info"
    });
};

/**
 * If choice = 1 close and save
 * if choice = 2 save only
 * */
function check_values(choice) {
	if($("#channel").val()<0 || $("#channel").val()>15 || $("#param1").val()<0 || $("#param1").val()>127 || $("#param2").val()<0 || $("#param2").val()>127){
        $('#error-display').css('display', 'table');
		$('#bad-boy').html("One or more entry are not into bounds");
	}
	else if (choice==1){
        save_all();
        close_window();
	}
}

function getFileLocation() {
	canBlur = false; // If we don't disable the blur, the popup will be gone
	dialog.showOpenDialog({ filters: [{ name: 'Musics', extensions: ['mp3', 'wav'] }]}, function (fileNames) {
			if (fileNames === undefined) return;
			var fileName = fileNames[0];
			$("#paramText").val(fileName);
	});
	setTimeout(function(){ canBlur = true }, 50);
}

function display_named_cues() {
	let column_names = ["From Event", "Name", "Type", "Channel", "Delay", "Note"];
    let heads = "";
    for (var i = 0; i < column_names.length; i++) {
        heads += "<th scope=\"col\">"+column_names[i]+"</th>";
    }
    let table = "<table class=\"table\"><thead><tr style=\"cursor: default;\">"+heads+"</tr></thead>";
    table += "<tbody>";
    for (var event_name in project.list_events) {
    	event_obj = project.list_events[event_name];
    
        for (let i = 0; i < event_obj.cue_list.length; i++) {
            let cue = event_obj.cue_list[i];
            if (cue.name != "") {
        		table += "<tr class=\"primary\" onclick=\"choose_cue(\'"+event_name+"\',"+i+")\" id=\""+event_name+i+"\">";
	            table += "<td>"+event_name+"</td>"
	            		+"<td>"+cue.name+"</td>"
	            		+"<td>"+cue.type+"</td>"
	                    +"<td>"+cue.channel+"</td>"
	                    +"<td>"+cue.delay+"</td>";
	                    // handles options
	                    if (cue.options.param1 != undefined) {
	                        table += "<td>"+cue.options.param1+"</td>"
	                    }
	                    else table += "<td></td>"
            }
        }
        table += "</tbody>"
        $("#table").html(table);
    }
}
  
function choose_cue(event_name, cue_index) {
	var chosen_cue = project.list_events[event_name]["cue_list"][cue_index];
	console.log("Event From: "+event_name);
	console.log("event To:" + event_selected);
	console.log(chosen_cue);
	// we just create a new copy of it
	var new_cue_id = add_cue(project.list_events[event_selected].cue_list, create_cue(chosen_cue.type, chosen_cue.channel, chosen_cue.delay, chosen_cue.name, chosen_cue.options));	

	fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
	close_window();
}
