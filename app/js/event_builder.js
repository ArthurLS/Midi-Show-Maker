
/*
* Returns an empty event
params:
	int id -> identifier of the event
	string name -> name of the event
	object options -> TBD 
*/
function create_event(id, name, options) {
	var event = {
		"id": id,
		"name": name,
		"cue_list": [],
		"options": {}
	}
	return event;
}

function add_event(event_obj) {
	project = JSON.parse(fs.readFileSync(data_file));
	if (!project.list_events.hasOwnProperty(event_obj.name)) {
		project.list_events[event_obj.name] = event_obj;
		fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
	}
	else{
		var i = 0;
		for(key in project.list_events){
			var ret1 = key.replace(' ('+(i)+')','');
			if(ret1 == event_obj.name) i++;
		}
		event_obj.name += " ("+i+")";
		project.list_events[event_obj.name] = event_obj;
		fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
	}	
}

/*
**  Delete an event from the project and saves the project
*/
function delete_event(event_name) {
    for(key in project.list_events){
        if (key == event_name) {
            delete project.list_events[event_name];
        }
    }
    // save project
    fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
}

function edit_event_name(event_name, new_name) {
	console.log("edit_event_name");
	project = JSON.parse(fs.readFileSync(data_file));
	var new_event = project.list_events[event_name];
	delete_event(event_name);
	new_event.name = new_name;
	add_event(new_event)
}

/*
* Creates and returns a cue
params:
	string type -> type of the message
	int channel -> 0 - 16 channel (where to broadcast)
	object delay -> delay from start (ms)
	object options -> depends on the type
*/
function create_cue(type, channel, delay, options) {
	var cue = {
		"type": type,
		"channel": channel,
		"delay": delay,
		"options": options
	}
	return cue;
}
function add_cue(parent_cue_list, cue) {
	parent_cue_list.push(cue);

	sort_list_by_delay(parent_cue_list);

	return find_cue(parent_cue_list, cue);
}

/*
	CUE DELAY
*/
function update_cue_delay(parent_cue_list, cue_index, new_delay) {
	parent_cue_list[cue_index].delay = new_delay;

	var save_cue = parent_cue_list[cue_index];

	sort_list_by_delay(parent_cue_list);

	return find_cue(parent_cue_list, save_cue);
}
function sort_list_by_delay(cue_list) {
	cue_list.sort(function(a, b){return a.delay - b.delay});
}
function find_cue(parent_cue_list, cue) {
	var index = 0;
	for (let i = 0; i < parent_cue_list.length; i++) {
		if(parent_cue_list[i] == cue)
			return i;
	}
}

/*
	CUE TYPE
*/
function update_cue_type(parent_cue_list, cue_index, new_type) {
	parent_cue_list[cue_index].type = new_type;
}

/*
	CUE CHANNEL
*/
function update_cue_channel(parent_cue_list, cue_index, new_channel) {
	parent_cue_list[cue_index].channel = new_channel;
}

/*
	CUE NOTE_(ON/OFF) OPTIONS
*/
function update_cue_options(parent_cue_list, cue_index, type, param1, param2) {
	var options_res = {};
	if (type == "noteon" || type == "noteoff" || type == "cc") {
		options_res["param1"] = param1;
		options_res["param2"] = param2;
	}
	else if(type == "programme"){
		options_res["param1"] = param1;
	}

	parent_cue_list[cue_index].options = options_res;
}


/*
	ADD - DELETE - MOVE CUE
*/

function delete_cue_with_index(cue_list, index) {
	console.log("hey " + index);
	cue_list.splice(index, 1);
}
function delete_cue_with_object(cue_list, cue) {
	sort_list_by_delay(parent_cue_list);
    for (let i = 0; i < cue_list.length; i++) {
        if (msg_midi == cue) {
        	cue_list.splice(i, 1);
        	break;
        }
    }
}
function move_cue(parent_cue_list, old_index, new_index) {
	// arr.splice(old_index, 1)[0] -> removes the cue from the list and give us the cue in return
	console.log("move_cue");
	parent_cue_list.splice(new_index, 0, parent_cue_list.splice(old_index, 1)[0]);
}


