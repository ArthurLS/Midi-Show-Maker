var block_id;
var block_obj;

var nb_cues;

function init_window_block() {
	event_selected += url.searchParams.get("event_name");
	event_obj = project.list_events[event_selected];
	block_obj = {};
	document.getElementById("event_name").innerHTML = event_selected;
	if (command == "new_block") {
		block_id = create_block();
		block_obj = event_obj["cue_list"][block_id];
		update_nb_cue(3)
		nb_cues = 3;
	}
	else if (command == "edit_block"){
		block_id = url.searchParams.get("block_id");
		block_obj = event_obj["cue_list"][block_id];
		nb_cues = block_obj["options"].length;

		$("#block_name").val(block_obj.name)
	}	

	
	
	init_cues_display();
	$("#nb_cues").val(nb_cues);
}

/*
** nb_cues is ne number of cues in the block (if exist or not)
*/
function init_cues_display() {
	// Computes the head of the table
	let column_names = ["Id", "Type", "Channel", "Delay", "Param 1", "Param 2", "Music FIle"];
	let heads = "";
	for (var i = 0; i < column_names.length; i++) {
        heads += '<th scope="col">'+column_names[i]+'</th>';
    }

    let table = '<table class="table"><thead><tr style="cursor: default;">'+heads+'</tr></thead>';
    table += '<tbody id="tbody">';

    // Computes the tbody
    for (var i = 0; i < nb_cues; i++) {
    	var cue_type = block_obj["options"][i].type;
    	table += '<tr class="primary" style="cursor: default" id="tr_'+i+'">'
    	 		+ display_block_line(i, cue_type) + '</tr>';
   	}

	table += "</tbody>";
	$("#table").html(table);
	for (var i = 0; i < nb_cues; i++) {
		var cue_type =  block_obj["options"][i].type;
		display_types_line(cue_type, i)
	}
}

function update_nb_cue(nb) {
	console.log("update_nb_cue");
	if (nb != "") {
		if (nb != nb_cues) {
			nb_cues = nb;
			//if the user deletes a cue (downs the count by > 1)
			while (nb_cues < block_obj["options"].length) {
				block_obj["options"].pop();
			}
			
			//if the user adds a cue (ups the count by > 1)
			while(nb_cues > block_obj["options"].length){
				add_cue(event_obj.cue_list[block_id]["options"], create_cue("noteon", "0", "0", "", {"param1": "", "param2": ""}));
			}
		}
		init_cues_display();
	}
}

function update_cue_block_type(id) {
	var type = $('#type_list_'+id).find(":selected").val();

	var c_opt = {};

    if (type == "noteon" || type == "noteoff" || type == "cc") c_opt = {"param1": "", "param2": ""};
    
    else if(type == "programme") c_opt = {"param1": ""};
    
    else if(type == "musicFile") c_opt = {"param1": "", "param2": "", "paramText": ""};

    block_obj["options"][id]["options"] = c_opt;
    block_obj["options"][id]["type"] = type;

	$("#tr_"+id).html(display_block_line(id, type)+'</tr>');
	display_types_line(type, id);
}

function create_block() {
	console.log("Event Name: "+event_selected);

	var block_delay = $("#block_delay").val();
	var block_name = $("#block_name").val();
	//create_cue(type, channel, delay, name, options) 
	var block = create_cue("block", 0, block_delay, block_name, []);
	//returns id
	return add_cue(event_obj.cue_list, block);
}

function save_block() {

	console.log("Block saving");
	//save name
	var name = $('#block_name').val();
	update_cue_name(event_obj.cue_list, block_id, name);
	//save delay
	var delay = $('#block_delay').val();
	update_cue_delay(event_obj.cue_list, block_id, delay);
	var count = 0;
	for (var i = 0; i < nb_cues; i++) {
		count += check_values_block(i);
		if (true) {}
		up_channel(i);
		up_delay(i);
		up_options(i);
		
	}

	if (count == 0) {
		fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
		console.log("Block saved");
		init_cues_display();
	}
	else{
		$('#error-display').css('display', 'table');
		if (count == 1) $('#bad-boy').html(count+" entry is not into bounds");
		else $('#bad-boy').html(count+" entries are not into bounds");	
		setTimeout(function() {
	        $('#error-display').css('display', 'none');
	    }, 3500);
	}        
	
	
}

function check_values_block(id) {
	var count = 0;
	var type = $('#type_list_'+id).find(":selected").val();
	if($("#channel_"+id).val() < 0 || $("#channel_"+id).val() > 15 || $("#channel_"+id).val() == "") count++;
	if($("#delay_"+id).val() < 0 || $("#delay_"+id).val() > 15 || $("#delay_"+id).val() == "") count++;

	if (type == "musicFile") {
		if ($("#paramText_"+id) == "") console.log("1");
		if ($("#param2_"+id) < 0 || $("#param2_"+id).val() == "")console.log(2);
		if ($("#param1_"+id) < 0 || $("#param1_"+id).val() == "") console.log(3);
	}
	if(type == "programme" || type == "noteon" || type == "noteoff" || type == "cc" ){
		if($("#param1_"+id).val()<0 || $("#param1_"+id).val() > 127 || $("#param1_"+id).val() == "") count ++;
	}
	
	if (type == "noteon" || type == "noteoff" || type == "cc") {
		if($("#param2_"+id).val()<0 || $("#param2_"+id).val() > 127 || $("#param2_"+id).val() == "") count ++;
	}
    
    return count;
}

function up_channel(id) {
	var c_channel = $('#channel_'+id).val();
	update_cue_channel(block_obj["options"], id, c_channel);
	console.log(block_obj["options"]);
}
function up_delay(id) {
	var c_delay = $('#delay_'+id).val();
	update_cue_delay(block_obj["options"], id, c_delay);
	init_cues_display();
	console.log(block_obj["options"]);
}
function up_options(id) {
	var type = $('#type_list_'+id).find(":selected").val();
	var c_param1 = $('#param1_'+id).val();
	var c_param2 = $('#param2_'+id).val();
	var c_text = $('#paramText_'+id).val();
 

    update_cue_options(block_obj["options"], id, type, c_param1, c_param2, c_text);
    console.log(block_obj["options"]);
}
 

/*
** Display the html for the cue type selector
*/
function display_types_line(type, id) {
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

	$("#type_list_"+id).html(str);
}


function display_block_line(id, type) {
	var res = "";
	var cue_obj = block_obj["options"][id];


    var line = '<td>'+id+'</td>'
			+'<td>'+'<select class="base_input" id="type_list_'+id+'" onchange="update_cue_block_type(\''+id+'\')"></select>'+'</td>'
	        +'<td>'+'<input type="number" id="channel_'+id+'" onchange="up_channel('+id+')" class="base_input" value="'+cue_obj["channel"]+'">'+'</td>'
	        +'<td>'+'<input type="number" id="delay_'+id+'" onchange="up_delay('+id+')" class="base_input" value="'+cue_obj["delay"]+'">'+'</td>';

    if (type == "noteon" || type == "noteoff" || type == "cc"){
       	line +='<td>'+'<input type="number" id="param1_'+id+'" class="base_input" onchange="up_options('+id+')" placeholder="Note pitch" value="'+cue_obj["options"]["param1"]+'">'+'</td>'
        	+'<td>'+'<input type="number" id="param2_'+id+'" class="base_input" onchange="up_options('+id+')" placeholder="Note velocity" value="'+cue_obj["options"]["param2"]+'">'+'</td>'
        	+'<td>'+'<input type="number" id="paramText_'+id+'" class="base_input" placeholder="          X" disabled>'+'</td>';
    }
    else if(type == "programme"){
       	line +='<td>'+'<input type="number" id="param1_'+id+'" class="base_input" onchange="up_options('+id+')" placeholder="Prog value" value="'+cue_obj["options"]["param1"]+'">'+'</td>'
        	+'<td>'+'<input type="number" id="param2_'+id+'" class="base_input" placeholder="          X" disabled>'+'</td>'
        	+'<td>'+'<input type="number" id="paramText_'+id+'" class="base_input" placeholder="          X" disabled>'+'</td>';
    }
    else if(type == "musicFile"){
       	line +='<td>'+'<input type="number" id="param1_'+id+'" onchange="up_options('+id+')" class="base_input" placeholder="Arrêt" value="'+cue_obj["options"]["param1"]+'">'+'</td>'
        	+'<td>'+'<input type="number" id="param2_'+id+'" onchange="up_options('+id+')" class="base_input" placeholder="Décalage" value="'+cue_obj["options"]["param2"]+'">'+'</td>'
        	+'<td>'+'<input type="text" onclick="getFileLocation_block(\''+id+'\')" placeholder="Music File" id="paramText_'+id+'" value="'+cue_obj["options"]["paramText"]+'" class="base_input">'+'</td>';
    }
    else{
       	line +='<td>'+'<input type="number" id="param1_'+id+'" class="base_input" placeholder="No Options" disabled>'+'</td>'
        	+'<td>'+'<input type="number" id="param2_'+id+'" class="base_input" placeholder="No Options" disabled>'+'</td>'
        	+'<td>'+'<input type="number" id="paramText_'+id+'" class="base_input" placeholder="No Options" disabled>'+'</td>';
    }

    return line; 
}


function getFileLocation_block(id) {
	canBlur = false; // If we don't disable the blur, the popup will be gone
	dialog.showOpenDialog({ filters: [{ name: 'Musics', extensions: ['mp3', 'wav'] }]}, function (fileNames) {
			if (fileNames === undefined) return;
			var fileName = fileNames[0];
			console.log("fileNames "+fileName);
			$("#paramText_"+id).val(fileName);
			if ($("#param1_"+id).val() == "") {
				$("#param1_"+id).val(0);
				block_obj["options"][id]["options"].param1 = 0;
			} 
			if ($("#param2_"+id).val() == "") {
				$("#param2_"+id).val(0);
				block_obj["options"][id]["options"].param2 = 0; 
			}
			
			
			block_obj["options"][id]["options"].paramText = fileName;
	});
	setTimeout(function(){ canBlur = false }, 50);
}

