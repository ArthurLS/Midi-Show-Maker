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