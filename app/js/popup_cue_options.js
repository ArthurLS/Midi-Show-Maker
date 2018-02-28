const fs = require('fs');
const remote = require('electron').remote;

var data_file = 'app/json/project.json';
var project = JSON.parse(fs.readFileSync(data_file));

var event_selected = "mario";
var event_obj = project.list_events[event_selected];

// list of types from npm 'easymidi' https://www.npmjs.com/package/easymidi
let midi_types = ["noteon", "noteoff", "cc", "programme", "clock", "start", "continue", "stop", "reset"];

let cue_id = null;

function init_window(){
	// get the cue

	let url = new URL(window.location.href);
	let c = url.searchParams.get("id");

	cue_id = c;
	document.getElementById("cue_id").innerHTML = cue_id;

	// fill the page
	$("#channel").val(event_obj.cue_list[Number(cue_id)].channel);
	$("#delay").val(event_obj.cue_list[Number(cue_id)].delay);

	display_types(event_obj.cue_list[cue_id].type);
	display_options(event_obj.cue_list[cue_id].type);
}

function close_window() {
	// close window
	var win = remote.getCurrentWindow();
    win.close();
}

function save_all() {
	save_type();
	save_channel();
	save_delay();

	save_options();

	fs.writeFileSync("app/json/project.json", JSON.stringify(project, null, 2));
}

function save_type() {
	var type = $('#type_list').find(":selected").val();
	update_cue_type(event_obj.cue_list, cue_id, type);
}

function save_channel() {
	console.log("Channel saved: "+Number($("#channel").val())+ " of cue n°"+cue_id);
	update_cue_channel(event_obj.cue_list, cue_id, Number($("#channel").val()));
}

function save_delay() {
	console.log("Delay saved: "+Number($("#delay").val())+ " of cue n°"+cue_id);
	var new_id = update_cue_delay(event_obj.cue_list, cue_id, Number($("#delay").val()));
	if (cue_id != new_id) {
		console.log("NEW POSITION = "+new_id);
		cue_id = new_id;
		localStorage.setItem("cue_selected", cue_id);
		document.getElementById("cue_id").innerHTML = cue_id;
	}
}

function save_options() {
	var type = $('#type_list').find(":selected").val();
	var param1 = Number($("#param1").val());
	var param2 = Number($("#param2").val());
	update_cue_options(event_obj.cue_list, cue_id, type, param1, param2);
}

function display_types(type) {
	let str = "";
	for (let i = 0; i < midi_types.length; i++) {
		if (midi_types[i] != type)
			str += "<option value=\""+midi_types[i]+"\">"+midi_types[i]+"</option>";
		else
			str += "<option value=\""+type+"\" selected>"+type+"</option>";
	}
	$("#type_list").html(str);
}

function display_options(type) {
	let cue_options = event_obj.cue_list[Number(cue_id)].options;

	let str = "<div class=\"col-md-12\"> <h2>Options</h2> </div>";

	if (type == "noteon" || type == "noteoff") {
		str += "<div class=\"col-md-4\"><h3>Note [0-127]</h3>"
			+"<input type=\"number\" id=\"param1\" value=\""+cue_options.param1+"\"></div>";

		str += "<div class=\"col-md-4\"><h3>Velocity [0-127]</h3>"
			+"<input type=\"number\" id=\"param2\" value=\""+cue_options.param2+"\"></div>";
	}
	else if(type == "cc"){
		str += "<div class=\"col-md-4\"><h3>Controller [0-127]</h3>"
			+"<input type=\"number\" id=\"param1\" value=\""+cue_options.param1+"\"></div>";

		str += "<div class=\"col-md-4\"><h3>Value [0-127]</h3>"
			+"<input type=\"number\" id=\"param2\" value=\""+cue_options.param2+"\"></div>";
	}
	else if(type == "programme"){
		str += "<div class=\"col-md-4\"><h3>Number [0-127]</h3>"
			+"<input type=\"number\" id=\"param1\" value=\""+cue_options.param1+"\"></div>";
	}
	else{
		str = "<div class=\"col-md-12\"> <h3>No Options for this type</h3> </div>";
	}
	$("#options_list").html(str);
}

$("#type_list").change(function(){
	var selected_type = $('#type_list').find(":selected").val();
	display_options(selected_type);
});


$(window).blur(function(){
  console.log("blur activated");
  	// close window
	var win = remote.getCurrentWindow();
    win.close();
});
