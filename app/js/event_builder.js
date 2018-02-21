/*
* Creates and adds the cue at a specific index 
params:
	parent_cue_list -> list where the cue is added
	int index -> index in the list
	string type -> type of the message
	int channel -> 0 - 16 channel (where to broadcast)
	object delay -> TBD
		{
			"from": cue (0 or index in the event)
			"time": delay time to from
		}
	object options -> depends on the type
*/
function create_cue(parent_cue_list, index, type, channel, delay, options) {
	var cue = {
		"type": type,
		"channel": channel,
		"delay": delay,
		"options": options
	}
	parent_cue_list.splice(index, 0, cue);
}


function update_cue_delay(parent_cue_list, index_cue, new_delay) {
	console.log("update_cue_delay");
	var old_delay = parent_cue_list[index_cue].delay;
	parent_cue_list[index_cue].delay = new_delay;

	sort_list_by_delay(parent_cue_list);
}

function sort_list_by_delay(cue_list) {
	console.log("sort_list_by_delay");
	cue_list.sort(function(a, b){return a.delay - b.delay});
}

function remove_cue_with_index(cue_list, index) {
	console.log("remove_cue_with_index");
	cue_list.splice(index, 1);
}

function remove_cue_with_object(cue_list, cue) {
	console.log("remove_cue_with_object");
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

function add_cue(parent_cue_list, cue) {
	console.log("add_cue");
	parent_cue_list.push(cue);

	sort_list_by_delay(parent_cue_list);
}


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

